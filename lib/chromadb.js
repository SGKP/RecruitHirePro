// ChromaDB Client Configuration
import { ChromaClient } from 'chromadb';

let chromaClient = null;

/**
 * Get or create ChromaDB client instance (Singleton)
 */
export async function getChromaClient() {
  if (!chromaClient) {
    chromaClient = new ChromaClient({
      path: process.env.CHROMA_URL || 'http://localhost:8001'
    });
  }
  return chromaClient;
}

/**
 * Initialize or get the candidates collection
 */
export async function getCandidatesCollection() {
  const client = await getChromaClient();
  
  try {
    // Try to get existing collection
    const collection = await client.getOrCreateCollection({
      name: 'candidates',
      metadata: { 
        description: 'Student candidates with skills, education, and cultural fitness data'
      }
    });
    
    return collection;
  } catch (error) {
    console.error('Error getting collection:', error);
    throw error;
  }
}

/**
 * Add or update a candidate in ChromaDB
 */
export async function addCandidateToChroma(student) {
  try {
    const collection = await getCandidatesCollection();
    
    // Create comprehensive text representation for embedding
    const candidateText = createCandidateEmbeddingText(student);
    
    // Metadata for filtering
    const metadata = {
      student_id: student._id.toString(),
      name: student.user_id?.name || 'Unknown',
      email: student.user_id?.email || '',
      gpa: parseFloat(student.resume_parsed_data?.education?.gpa || 0),
      graduation_year: parseInt(student.resume_parsed_data?.education?.graduation_year || 0),
      university: student.resume_parsed_data?.education?.university || '',
      degree: student.resume_parsed_data?.education?.degree || '',
      github_repos: student.github_data?.repos_count || 0,
      location: student.location || '',
      has_cultural_fitness: !!(student.cultural_fitness && student.cultural_fitness.length > 0)
    };
    
    // Add to collection (upsert)
    await collection.upsert({
      ids: [student._id.toString()],
      documents: [candidateText],
      metadatas: [metadata]
    });
    
    return true;
  } catch (error) {
    console.error('Error adding candidate to Chroma:', error);
    return false;
  }
}

/**
 * Search candidates using semantic similarity
 */
export async function searchCandidatesInChroma({
  queryText,
  jobDescription = '',
  requiredSkills = [],
  nResults = 50,
  filters = {}
}) {
  try {
    const collection = await getCandidatesCollection();
    
    // Build comprehensive query text
    let searchQuery = queryText || '';
    
    if (jobDescription) {
      searchQuery += ` ${jobDescription}`;
    }
    
    if (requiredSkills.length > 0) {
      searchQuery += ` Skills required: ${requiredSkills.join(', ')}`;
    }
    
    // Build metadata filters
    const whereClause = buildWhereClause(filters);
    
    // Perform semantic search
    const results = await collection.query({
      queryTexts: [searchQuery],
      nResults: nResults,
      where: whereClause.length > 0 ? { $and: whereClause } : undefined
    });
    
    return {
      ids: results.ids[0] || [],
      distances: results.distances[0] || [],
      metadatas: results.metadatas[0] || [],
      documents: results.documents[0] || []
    };
  } catch (error) {
    console.error('Error searching in Chroma:', error);
    return { ids: [], distances: [], metadatas: [], documents: [] };
  }
}

/**
 * Sync all students to ChromaDB
 */
export async function syncAllCandidatesToChroma(students) {
  try {
    const collection = await getCandidatesCollection();
    
    const ids = [];
    const documents = [];
    const metadatas = [];
    
    for (const student of students) {
      ids.push(student._id.toString());
      documents.push(createCandidateEmbeddingText(student));
      metadatas.push({
        student_id: student._id.toString(),
        name: student.user_id?.name || 'Unknown',
        email: student.user_id?.email || '',
        gpa: parseFloat(student.resume_parsed_data?.education?.gpa || 0),
        graduation_year: parseInt(student.resume_parsed_data?.education?.graduation_year || 0),
        university: student.resume_parsed_data?.education?.university || '',
        degree: student.resume_parsed_data?.education?.degree || '',
        github_repos: student.github_data?.repos_count || 0,
        location: student.location || '',
        has_cultural_fitness: !!(student.cultural_fitness && student.cultural_fitness.length > 0)
      });
    }
    
    if (ids.length > 0) {
      await collection.upsert({
        ids,
        documents,
        metadatas
      });
    }
    
    return { success: true, count: ids.length };
  } catch (error) {
    console.error('Error syncing candidates to Chroma:', error);
    return { success: false, count: 0, error: error.message };
  }
}

/**
 * Delete a candidate from ChromaDB
 */
export async function deleteCandidateFromChroma(studentId) {
  try {
    const collection = await getCandidatesCollection();
    await collection.delete({
      ids: [studentId.toString()]
    });
    return true;
  } catch (error) {
    console.error('Error deleting candidate from Chroma:', error);
    return false;
  }
}

/**
 * Get collection statistics
 */
export async function getChromaStats() {
  try {
    const collection = await getCandidatesCollection();
    const count = await collection.count();
    return {
      total_candidates: count,
      collection_name: 'candidates'
    };
  } catch (error) {
    console.error('Error getting Chroma stats:', error);
    return { total_candidates: 0, error: error.message };
  }
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Create comprehensive text for embedding generation
 */
function createCandidateEmbeddingText(student) {
  const parts = [];
  
  // Name and basic info
  if (student.user_id?.name) {
    parts.push(`Name: ${student.user_id.name}`);
  }
  
  // Education
  const education = student.resume_parsed_data?.education || {};
  if (education.degree) {
    parts.push(`Degree: ${education.degree}`);
  }
  if (education.university) {
    parts.push(`University: ${education.university}`);
  }
  if (education.gpa) {
    parts.push(`GPA: ${education.gpa}`);
  }
  
  // Skills (most important for matching)
  const skills = student.resume_parsed_data?.skills || [];
  if (skills.length > 0) {
    parts.push(`Skills: ${skills.join(', ')}`);
  }
  
  // Work experience
  const experience = student.resume_parsed_data?.experience || [];
  if (experience.length > 0) {
    const expTexts = experience.map(exp => 
      `${exp.title || ''} at ${exp.company || ''}: ${exp.description || ''}`
    ).filter(t => t.trim());
    if (expTexts.length > 0) {
      parts.push(`Experience: ${expTexts.join('. ')}`);
    }
  }
  
  // Projects
  const projects = student.resume_parsed_data?.projects || [];
  if (projects.length > 0) {
    const projectTexts = projects.map(proj => 
      `${proj.name || ''}: ${proj.description || ''}`
    ).filter(t => t.trim());
    if (projectTexts.length > 0) {
      parts.push(`Projects: ${projectTexts.join('. ')}`);
    }
  }
  
  // Achievements
  if (student.achievements && student.achievements.length > 0) {
    parts.push(`Achievements: ${student.achievements.join(', ')}`);
  }
  
  // Interests
  if (student.interests && student.interests.length > 0) {
    const interestsList = Array.isArray(student.interests) 
      ? student.interests 
      : [student.interests];
    parts.push(`Interests: ${interestsList.join(', ')}`);
  }
  
  // Location
  if (student.location) {
    parts.push(`Location: ${student.location}`);
  }
  
  // Cultural fitness (summarized)
  if (student.cultural_fitness && student.cultural_fitness.length > 0) {
    const culturalTraits = student.cultural_fitness
      .map(cf => `${cf.question}: ${cf.answer}`)
      .join('. ');
    parts.push(`Cultural Traits: ${culturalTraits}`);
  }
  
  // GitHub activity
  if (student.github_data?.repos_count) {
    parts.push(`GitHub Repositories: ${student.github_data.repos_count}`);
  }
  
  return parts.join(' | ');
}

/**
 * Build ChromaDB where clause from filters
 */
function buildWhereClause(filters) {
  const conditions = [];
  
  if (filters.min_gpa) {
    conditions.push({ gpa: { $gte: parseFloat(filters.min_gpa) } });
  }
  
  if (filters.max_gpa) {
    conditions.push({ gpa: { $lte: parseFloat(filters.max_gpa) } });
  }
  
  if (filters.graduation_year) {
    conditions.push({ graduation_year: { $eq: parseInt(filters.graduation_year) } });
  }
  
  if (filters.university) {
    conditions.push({ university: { $eq: filters.university } });
  }
  
  if (filters.degree) {
    conditions.push({ degree: { $eq: filters.degree } });
  }
  
  if (filters.min_github_repos) {
    conditions.push({ github_repos: { $gte: parseInt(filters.min_github_repos) } });
  }
  
  if (filters.location) {
    conditions.push({ location: { $eq: filters.location } });
  }
  
  if (filters.has_cultural_fitness !== undefined) {
    conditions.push({ has_cultural_fitness: { $eq: filters.has_cultural_fitness } });
  }
  
  return conditions;
}

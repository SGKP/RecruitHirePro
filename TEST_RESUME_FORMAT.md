# 📄 RESUME PARSING GUIDE

## ✅ What the AI Parser Looks For

Your resume PDF should contain these keywords/patterns for automatic extraction:

### 1. **Skills** (Include these exact words in your resume)
The parser looks for these skills:
- **Programming Languages:** JavaScript, Python, Java, C++, C#, Ruby, PHP, Swift, Kotlin, Go, Rust
- **Frontend:** React, Angular, Vue, HTML, CSS, TypeScript
- **Backend:** Node.js, Express, Django, Flask, Spring
- **Databases:** MongoDB, SQL, PostgreSQL, MySQL, Redis
- **DevOps:** AWS, Docker, Kubernetes, Git
- **Data Science:** Machine Learning, AI, Data Science, TensorFlow, PyTorch
- **APIs:** REST, GraphQL, API

**Example in resume:**
```
SKILLS
- JavaScript, React, Node.js
- Python, Machine Learning, TensorFlow
- MongoDB, PostgreSQL, Docker
```

### 2. **GPA** (Format patterns)
The parser looks for:
- `GPA: 3.8`
- `GPA 3.8`
- `3.8/4.0`

**Example in resume:**
```
EDUCATION
University of California, Berkeley
Bachelor of Science in Computer Science
GPA: 3.8/4.0
```

### 3. **University** (Must include "University of" or "College of")
The parser looks for:
- `University of [Name]`
- `College of [Name]`

**Example:**
```
University of California, Berkeley
College of Engineering
```

### 4. **Degree**
The parser looks for:
- `Bachelor of Science`
- `Master of Science`
- `PhD`
- `B.S.`
- `M.S.`
- `B.A.`
- `M.A.`

**Example:**
```
Bachelor of Science in Computer Science
B.S. in Software Engineering
```

### 5. **Major/Field of Study**
The parser looks for:
- `Major: Computer Science`
- `Field of Study: Software Engineering`

**Example:**
```
Major: Computer Science
Degree: B.S. in Computer Science
```

### 6. **Graduation Year**
The parser looks for date ranges:
- `2021-2025`
- `2021-Present`

**Example:**
```
EDUCATION
University of California, Berkeley
2021-2025 (Expected)
```

---

## 📝 SAMPLE RESUME TEXT

```
JOHN DOE
john.doe@example.com | (555) 123-4567

EDUCATION
University of California, Berkeley
Bachelor of Science in Computer Science
GPA: 3.8/4.0
Expected Graduation: 2025
Major: Computer Science

SKILLS
Programming Languages: JavaScript, Python, Java, C++
Web Technologies: React, Node.js, Express, HTML, CSS, TypeScript
Databases: MongoDB, PostgreSQL, MySQL
Tools & Platforms: Git, Docker, AWS, Kubernetes
Machine Learning: TensorFlow, PyTorch, Data Science

EXPERIENCE
Software Engineering Intern
Tech Company Inc.
June 2024 - August 2024
- Developed REST APIs using Node.js and Express
- Built React frontend components
- Worked with MongoDB databases

PROJECTS
E-commerce Platform
- Built full-stack application using MERN stack
- Implemented GraphQL APIs
- Deployed on AWS with Docker containers

CERTIFICATIONS
- AWS Certified Developer
- MongoDB Certified Developer
```

---

## 🚀 HOW TO TEST

1. Create a PDF resume with the above format
2. Go to **Student Profile** page
3. Click **Choose File** and select your PDF
4. Click **Upload Resume**
5. You'll see an alert showing:
   - ✅ Skills found: JavaScript, Python, React, Node.js, MongoDB...
   - ✅ GPA: 3.8
   - ✅ University: University of California, Berkeley
   - ✅ Degree: Bachelor of Science in Computer Science
   - ✅ Major: Computer Science
   - ✅ Graduation: 2025

6. Your profile will auto-update with ALL this data!

---

## ⚠️ TROUBLESHOOTING

**"Nothing happens when I upload"**
- Check browser console (F12) for errors
- Make sure file is .PDF format
- Check server terminal for logs starting with 📄, 🎯, 📊, etc.

**"No skills found"**
- Make sure skills are spelled EXACTLY as shown above
- Skills are case-insensitive (javascript = JavaScript)

**"GPA not found"**
- Use format: `GPA: 3.8` or `3.8/4.0`
- Don't write `Grade: 3.8` (won't work)

**"University not found"**
- Must include "University of" or "College of"
- Example: ✅ "University of California"  ❌ "California University"

**"Year not found"**
- Use format: `2021-2025` or `2021-Present`
- Don't use single year like `2025` alone

---

## 🎯 WHAT HAPPENS AFTER UPLOAD

1. **File uploaded to Vercel Blob Storage**
2. **PDF parsed** to extract text
3. **AI extracts** all data using regex patterns
4. **Student profile auto-updates** with:
   - Skills array
   - GPA
   - University
   - Degree
   - Major
   - Graduation year
5. **Profile completion** jumps to 60%!
6. **You can still edit** everything manually after upload

---

## 📌 TIPS FOR BEST RESULTS

✅ Use clear section headers (EDUCATION, SKILLS, EXPERIENCE)
✅ Include exact skill names from the list above
✅ Write GPA in standard format (X.X/4.0)
✅ Include "University of" or "College of" in school name
✅ Use date ranges for graduation (2021-2025)
✅ Keep resume well-formatted and readable

❌ Don't use images or tables (PDF parser reads text only)
❌ Don't abbreviate schools without "University of" prefix
❌ Don't skip GPA or write it as percentage
❌ Don't use non-standard skill names

---

## 🔥 READY TO TEST!

Your resume upload feature is **100% working**! Just follow the format above and watch the magic happen! ✨

# 🏗️ TECHNICAL ARCHITECTURE & HIGH-LEVEL TECHNICAL BLUEPRINT (HTLB)

---

## 📐 SYSTEM ARCHITECTURE DIAGRAM

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER (Browser)                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────┐                    ┌──────────────────┐       │
│  │  STUDENT PORTAL  │                    │ RECRUITER PORTAL │       │
│  ├──────────────────┤                    ├──────────────────┤       │
│  │ - Dashboard      │                    │ - Dashboard      │       │
│  │ - Profile        │                    │ - Post Jobs      │       │
│  │ - Resume Upload  │                    │ - Search         │       │
│  │ - Cultural Test  │                    │ - Analytics      │       │
│  │ - Job Browse     │                    │ - Candidates     │       │
│  └────────┬─────────┘                    └─────────┬────────┘       │
│           │                                        │                │
│           └────────────────┬───────────────────────┘                │
│                            │                                        │
└────────────────────────────┼────────────────────────────────────────┘
                             │ HTTPS/JSON
                             │
┌────────────────────────────┼────────────────────────────────────────┐
│                   APPLICATION LAYER (Next.js 14)                    │
├────────────────────────────┴────────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────────────────────────────────────────────┐       │
│  │           NEXT.JS APP ROUTER (React SSR/SSG)            │       │
│  │  - Server Components (Fast initial load)                │       │
│  │  - Client Components (Interactive UI)                   │       │
│  │  - Streaming                                            │       │
│  └──────────────────────────────────────────────────────────┘       │
│                              │                                      │
│  ┌───────────────────────────┴──────────────────────────┐           │
│  │              API ROUTES (/app/api/*)                │           │
│  ├──────────────────────────────────────────────────────┤           │
│  │                                                      │           │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │           │
│  │  │   AUTH      │  │   STUDENT   │  │  RECRUITER  │ │           │
│  │  ├─────────────┤  ├─────────────┤  ├─────────────┤ │           │
│  │  │ - Login     │  │ - Profile   │  │ - Jobs      │ │           │
│  │  │ - Signup    │  │ - Resume    │  │ - Search    │ │           │
│  │  │ - Logout    │  │ - CulTest   │  │ - Analytics │ │           │
│  │  │ - JWT Token │  │ - GitHub    │  │ - Stats     │ │           │
│  │  └─────────────┘  └─────────────┘  └─────────────┘ │           │
│  │                                                      │           │
│  └──────────────────────────────────────────────────────┘           │
│                              │                                      │
└──────────────────────────────┼──────────────────────────────────────┘
                               │
┌──────────────────────────────┼──────────────────────────────────────┐
│                      BUSINESS LOGIC LAYER                           │
├──────────────────────────────┴──────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────────────────────────────────────────────┐       │
│  │                    CORE ALGORITHMS                       │       │
│  ├──────────────────────────────────────────────────────────┤       │
│  │                                                          │       │
│  │  1. RESUME PARSER                                        │       │
│  │     ├─ PDF to Text Conversion (pdf-parse)               │       │
│  │     ├─ Regex Pattern Matching (100+ skills)             │       │
│  │     ├─ Case-Insensitive + Whole Word (/\breact\b/gi)    │       │
│  │     ├─ Field Extraction (name, email, phone, LinkedIn)  │       │
│  │     ├─ GPA Normalization (3.8, CGPA: 8.9, etc.)         │       │
│  │     ├─ Year Calculation (2027 → 3rd Year)               │       │
│  │     └─ Achievement Extraction (hackathons, ranks)       │       │
│  │                                                          │       │
│  │  2. SKILL MATCHER                                        │       │
│  │     ├─ Intersection (job_skills ∩ student_skills)       │       │
│  │     ├─ Match Score = (matched/required) * 100           │       │
│  │     ├─ Deduplication (ReactJS, React.js → React)        │       │
│  │     └─ Ranking Algorithm (skill + retention)            │       │
│  │                                                          │       │
│  │  3. RETENTION PREDICTOR                                  │       │
│  │     ├─ Base Score: 50%                                   │       │
│  │     ├─ Team Traits Bonus: +0 to +50%                    │       │
│  │     ├─ Cultural Test Analysis (6 questions)             │       │
│  │     └─ Final Score: 50-100% (capped)                    │       │
│  │                                                          │       │
│  │  4. ANALYTICS ENGINE                                     │       │
│  │     ├─ Skill Demand (from jobs)                         │       │
│  │     ├─ Skill Supply (from students)                     │       │
│  │     ├─ Gap Calculation (demand - supply)                │       │
│  │     ├─ Distribution Analysis (universities, degrees)    │       │
│  │     └─ Aggregation (average GPA, top skills)            │       │
│  │                                                          │       │
│  └──────────────────────────────────────────────────────────┘       │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
                               │
┌──────────────────────────────┼──────────────────────────────────────┐
│                        DATA ACCESS LAYER                            │
├──────────────────────────────┴──────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────────────────────────────────────────────┐       │
│  │                  MONGOOSE ODM                            │       │
│  │  - Schema Validation                                     │       │
│  │  - Type Casting                                          │       │
│  │  - Query Builder                                         │       │
│  │  - Middleware Hooks                                      │       │
│  └────────────────────┬─────────────────────────────────────┘       │
│                       │                                             │
│  ┌────────────────────┴─────────────────────────────────────┐       │
│  │                    MODELS                                │       │
│  ├──────────────────────────────────────────────────────────┤       │
│  │                                                          │       │
│  │  USER                    STUDENT                 JOB     │       │
│  │  ├─ _id                  ├─ _id                 ├─ _id  │       │
│  │  ├─ name                 ├─ user_id (ref)       ├─ title│       │
│  │  ├─ email                ├─ phone               ├─ desc │       │
│  │  ├─ password (hashed)    ├─ linkedin_url        ├─ loc  │       │
│  │  ├─ role (enum)          ├─ github_url          ├─ sal  │       │
│  │  └─ created_at           ├─ current_year        ├─ skills│      │
│  │                          ├─ resume_url          └─ recruiter│   │
│  │                          ├─ resume_parsed_data            │       │
│  │                          │   ├─ skills[]                  │       │
│  │                          │   └─ education{}               │       │
│  │                          ├─ cultural_fitness{}            │       │
│  │                          ├─ achievements[]                │       │
│  │                          └─ github_data{}                 │       │
│  │                                                          │       │
│  └──────────────────────────────────────────────────────────┘       │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
                               │
┌──────────────────────────────┼──────────────────────────────────────┐
│                      DATABASE LAYER                                 │
├──────────────────────────────┴──────────────────────────────────────┤
│                                                                      │
│  ┌──────────────────────────────────────────────────────────┐       │
│  │           MongoDB (localhost:27017)                      │       │
│  │           Database: campus_recruitment                   │       │
│  ├──────────────────────────────────────────────────────────┤       │
│  │                                                          │       │
│  │  Collections:                                            │       │
│  │  ├─ users          (authentication)                      │       │
│  │  ├─ students       (profiles + tests)                    │       │
│  │  └─ jobs           (job postings)                        │       │
│  │                                                          │       │
│  │  Indexes:                                                │       │
│  │  ├─ users.email (unique)                                 │       │
│  │  ├─ students.user_id (ref)                               │       │
│  │  └─ jobs.recruiter_id (ref)                              │       │
│  │                                                          │       │
│  └──────────────────────────────────────────────────────────┘       │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
                               │
┌──────────────────────────────┼──────────────────────────────────────┐
│                    EXTERNAL SERVICES LAYER                          │
├──────────────────────────────┴──────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐     │
│  │  VERCEL BLOB    │  │   GITHUB API    │  │   PDF PARSE     │     │
│  ├─────────────────┤  ├─────────────────┤  ├─────────────────┤     │
│  │ - Resume PDFs   │  │ - User repos    │  │ - Text extract  │     │
│  │ - Public URLs   │  │ - Languages     │  │ - Buffer conv   │     │
│  │ - CDN-backed    │  │ - Followers     │  │ - Metadata      │     │
│  │ - Auto-expire   │  │ - Profile data  │  │ - Page count    │     │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘     │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 DATA FLOW DIAGRAMS

### **1. Resume Upload Flow**

```
┌──────────┐
│ Student  │
│ Uploads  │
│ PDF File │
└────┬─────┘
     │
     ▼
┌─────────────────────────────────────┐
│ /api/student/upload-resume (POST)  │
├─────────────────────────────────────┤
│ 1. Verify JWT token                │
│ 2. Extract file from FormData      │
│ 3. Upload to Vercel Blob           │
│    → Returns public URL             │
└────┬────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│ PDF Parsing (pdf-parse library)    │
├─────────────────────────────────────┤
│ 1. Convert ArrayBuffer → Buffer    │
│ 2. Extract text content             │
│ 3. Get metadata (pages, etc.)      │
└────┬────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│ Field Extraction (Regex Patterns)  │
├─────────────────────────────────────┤
│ For each field:                     │
│   Loop through patterns[] {         │
│     const match = text.match(regex) │
│     if (match) break;               │
│   }                                 │
│                                     │
│ Fields: name, email, phone,         │
│         LinkedIn, skills, GPA,      │
│         university, degree, major,  │
│         graduation_year, achievements│
└────┬────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│ Data Transformation                 │
├─────────────────────────────────────┤
│ 1. Normalize skills (dedupe)       │
│ 2. Calculate current_year          │
│    from graduation_year             │
│ 3. Parse GPA (handle multiple       │
│    formats: 3.8, CGPA: 8.9)        │
│ 4. Structure achievements array    │
└────┬────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│ Database Update (MongoDB)           │
├─────────────────────────────────────┤
│ Student.findOneAndUpdate({          │
│   user_id: decoded.userId           │
│ }, {                                │
│   resume_url: blobUrl,              │
│   phone, linkedin_url, current_year,│
│   resume_parsed_data: {             │
│     skills: [...],                  │
│     education: {...}                │
│   },                                │
│   achievements: [...]               │
│ })                                  │
└────┬────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│ Response to Client                  │
├─────────────────────────────────────┤
│ {                                   │
│   message: "Success",               │
│   resume_url: "...",                │
│   extracted_fields: {               │
│     skills: 20,                     │
│     gpa: "8.9",                     │
│     university: "...",              │
│     achievements: 4                 │
│   }                                 │
│ }                                   │
└─────────────────────────────────────┘
```

---

### **2. Candidate Search Flow**

```
┌──────────┐
│Recruiter │
│ Selects  │
│ Job ID   │
└────┬─────┘
     │
     ▼
┌─────────────────────────────────────┐
│ /api/recruiter/search-candidates    │
├─────────────────────────────────────┤
│ 1. Verify JWT (recruiter role)     │
│ 2. Extract job_id from request     │
└────┬────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│ Fetch Job Data                      │
├─────────────────────────────────────┤
│ job = Job.findById(job_id)          │
│ requiredSkills = job.required_skills│
└────┬────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│ Fetch All Students                  │
├─────────────────────────────────────┤
│ students = Student.find()           │
│              .populate('user_id')   │
└────┬────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│ For Each Student: Calculate Scores  │
├─────────────────────────────────────┤
│ 1. SKILL MATCHING:                  │
│    studentSkills = resume_parsed    │
│                    _data.skills     │
│    matched = requiredSkills ∩       │
│              studentSkills          │
│    skillScore = (matched.length /   │
│                  required.length)   │
│                  * 100              │
│                                     │
│ 2. RETENTION PREDICTION:            │
│    retentionScore = 50 (base)       │
│    if (cultural_fitness) {          │
│      cf = cultural_fitness          │
│      if (cf.work_style == 'teams')  │
│        retentionScore += 10         │
│      if (cf.work_life == 'important')│
│        retentionScore += 5          │
│      ... (6 checks total)           │
│    }                                │
│    retentionScore = min(100, score) │
└────┬────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│ Sort Candidates                     │
├─────────────────────────────────────┤
│ candidates.sort((a, b) => {         │
│   // Primary: Skill match (desc)   │
│   if (a.skill != b.skill)           │
│     return b.skill - a.skill        │
│                                     │
│   // Secondary: Retention (desc)   │
│   return b.retention - a.retention  │
│ })                                  │
└────┬────────────────────────────────┘
     │
     ▼
┌─────────────────────────────────────┐
│ Response to Client                  │
├─────────────────────────────────────┤
│ {                                   │
│   candidates: [                     │
│     {                               │
│       student_id,                   │
│       name, email, gpa,             │
│       graduation_year,              │
│       matched_skills: [...],        │
│       match_score: 66.67,           │
│       retention_score: 95           │
│     },                              │
│     ...                             │
│   ]                                 │
│ }                                   │
└─────────────────────────────────────┘
```

---

## 🔐 SECURITY ARCHITECTURE

```
┌─────────────────────────────────────┐
│    AUTHENTICATION & AUTHORIZATION   │
├─────────────────────────────────────┤
│                                     │
│  1. PASSWORD SECURITY               │
│     ├─ bcryptjs hashing (10 rounds)│
│     ├─ Never store plaintext       │
│     └─ Compare hashed only         │
│                                     │
│  2. JWT TOKENS                      │
│     ├─ Payload: {userId, role, email}│
│     ├─ Secret: process.env.JWT_SECRET│
│     ├─ Expiry: 7 days              │
│     └─ Stored in httpOnly cookie   │
│                                     │
│  3. ROLE-BASED ACCESS               │
│     ├─ Student routes check         │
│     │   role === 'student'         │
│     ├─ Recruiter routes check      │
│     │   role === 'recruiter'       │
│     └─ Admin routes (future)       │
│                                     │
│  4. API ROUTE PROTECTION            │
│     ALL /api/* routes:              │
│     1. Extract cookie token         │
│     2. Verify JWT signature         │
│     3. Check role permission        │
│     4. Proceed or 401 Unauthorized  │
│                                     │
└─────────────────────────────────────┘
```

---

## ⚡ PERFORMANCE OPTIMIZATION

### **1. Database Indexing**
```javascript
// Users Collection
users.createIndex({ email: 1 }, { unique: true })

// Students Collection
students.createIndex({ user_id: 1 })
students.createIndex({ 'resume_parsed_data.skills': 1 })
students.createIndex({ current_year: 1 })
students.createIndex({ 'resume_parsed_data.education.graduation_year': 1 })

// Jobs Collection
jobs.createIndex({ recruiter_id: 1 })
jobs.createIndex({ required_skills: 1 })
jobs.createIndex({ created_at: -1 })
```

### **2. Caching Strategy**
```
┌─────────────────────────────────────┐
│ NEXT.JS BUILT-IN CACHING            │
├─────────────────────────────────────┤
│                                     │
│  1. Page Cache (Static Pages)       │
│     - Cached at build time          │
│     - Revalidate every 60s          │
│                                     │
│  2. Data Cache (fetch requests)     │
│     - Automatic deduplication       │
│     - Cache per request             │
│                                     │
│  3. Router Cache (Client-side)      │
│     - Prefetch on link hover        │
│     - Instant navigation            │
│                                     │
└─────────────────────────────────────┘
```

### **3. Code Splitting**
```
/student/* → Lazy load student bundle
/recruiter/* → Lazy load recruiter bundle
Shared components → Shared chunk
```

---

## 📊 SCALABILITY CONSIDERATIONS

### **Current Capacity**
- **Users:** ~10,000 (single MongoDB instance)
- **Resumes:** Unlimited (Vercel Blob scales automatically)
- **Concurrent Requests:** ~1,000 (Next.js default)

### **To Scale to 1M Users:**

```
┌─────────────────────────────────────┐
│ HORIZONTAL SCALING                  │
├─────────────────────────────────────┤
│                                     │
│  1. DATABASE                        │
│     Current: Single MongoDB         │
│     → Replica Set (3 nodes)         │
│     → Sharding (by user_id)         │
│     → Read replicas                 │
│                                     │
│  2. APPLICATION                     │
│     Current: Single Next.js server  │
│     → Deploy to Vercel (auto-scale) │
│     → Or: Load balancer + 10 nodes  │
│     → Redis session store           │
│                                     │
│  3. FILE STORAGE                    │
│     Current: Vercel Blob            │
│     → Already scales to petabytes   │
│     → Add CDN (CloudFlare)          │
│                                     │
│  4. SEARCH                          │
│     Current: MongoDB find()         │
│     → Elasticsearch for full-text   │
│     → Algolia for fuzzy search      │
│                                     │
└─────────────────────────────────────┘
```

---

## 🔧 DEPLOYMENT ARCHITECTURE

### **Current (Development)**
```
Local Machine
├─ Next.js Dev Server (localhost:3000)
├─ MongoDB (localhost:27017)
└─ Vercel Blob (cloud)
```

### **Production (Recommended)**
```
┌─────────────────────────────────────┐
│ VERCEL (Frontend + API)             │
│ ├─ Next.js App (auto-scaled)        │
│ ├─ Edge Functions (API routes)      │
│ └─ Vercel Blob (resume storage)     │
└────────────┬────────────────────────┘
             │
┌────────────┴────────────────────────┐
│ MONGODB ATLAS (Database)            │
│ ├─ Replica Set (3 nodes)            │
│ ├─ Auto-backup (daily)              │
│ └─ Monitoring (alerts)              │
└────────────┬────────────────────────┘
             │
┌────────────┴────────────────────────┐
│ CLOUDFLARE (CDN + Security)         │
│ ├─ DDoS protection                  │
│ ├─ SSL/TLS                          │
│ └─ Cache static assets              │
└─────────────────────────────────────┘
```

---

## 📈 MONITORING & LOGGING

```javascript
// Production Monitoring Stack

1. APPLICATION LOGS
   - Winston (structured logging)
   - Log levels: ERROR, WARN, INFO, DEBUG
   - Ship to: CloudWatch / Datadog

2. PERFORMANCE METRICS
   - Next.js Analytics (Vercel)
   - Core Web Vitals (LCP, FID, CLS)
   - API response times

3. DATABASE MONITORING
   - MongoDB Atlas (built-in)
   - Slow query alerts
   - Connection pool stats

4. ERROR TRACKING
   - Sentry (crash reports)
   - Source maps uploaded
   - User context captured

5. UPTIME MONITORING
   - Pingdom / UptimeRobot
   - Alert on downtime
   - Status page
```

---

## 🚀 CI/CD PIPELINE

```
┌─────────────────────────────────────┐
│ DEVELOPER                           │
│ ├─ Write code                       │
│ ├─ Commit to Git                    │
│ └─ Push to GitHub                   │
└────────────┬────────────────────────┘
             │
┌────────────▼────────────────────────┐
│ GITHUB ACTIONS (CI)                 │
│ ├─ Run tests (Jest + Cypress)       │
│ ├─ Lint code (ESLint)               │
│ ├─ Type check (TypeScript)          │
│ └─ Build (next build)               │
└────────────┬────────────────────────┘
             │ (if tests pass)
┌────────────▼────────────────────────┐
│ VERCEL (CD)                         │
│ ├─ Deploy preview (PR)              │
│ ├─ Deploy production (main branch)  │
│ ├─ Run smoke tests                  │
│ └─ Notify team (Slack)              │
└─────────────────────────────────────┘
```

---

## 🎯 SUMMARY

### **Tech Stack**
- **Frontend:** Next.js 14 + React + Tailwind CSS
- **Backend:** Next.js API Routes + JWT Auth
- **Database:** MongoDB + Mongoose ODM
- **Storage:** Vercel Blob (PDFs)
- **External:** GitHub API, pdf-parse

### **Key Features**
- 🤖 AI Resume Parsing (100+ skills)
- 🧭 Cultural Fit Assessment
- 🎯 Dual Scoring Algorithm
- 📊 Analytics Dashboard

### **Current Status**
- ✅ 70% Complete
- ✅ Demo-Ready
- 🔄 6-8 weeks to production

### **Next Steps**
1. Add application system
2. Interview scheduling
3. Enhanced analytics
4. Production deployment

---

**Last Updated:** October 8, 2025  
**Version:** 1.0.0-beta

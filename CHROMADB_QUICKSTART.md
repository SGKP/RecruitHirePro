# 🚀 Quick Start: ChromaDB Integration

## What is ChromaDB?

ChromaDB adds **AI-powered semantic search** to RecruitPro, allowing recruiters to find candidates based on **meaning and context**, not just exact keyword matches.

### Traditional vs Semantic Search

**Traditional Search:**
- Search: "React developer"
- Finds: Only candidates with exact "React" skill

**Semantic Search:**
- Search: "Frontend specialist who loves building user interfaces"
- Finds: Candidates with React, Vue, Angular, UI/UX experience, who express passion for frontend work

---

## 🎯 Installation (Windows)

### Step 1: Run the Setup Script

Open PowerShell in the project folder and run:

```powershell
.\start-chromadb.ps1
```

This script will:
1. Check if Python is installed
2. Install ChromaDB if needed
3. Start ChromaDB server on `http://localhost:8000`

### Step 2: Keep ChromaDB Running

Leave this PowerShell window open. ChromaDB server must be running for semantic search to work.

You should see:
```
Running Chroma on http://localhost:8000
```

### Step 3: Sync Candidates (One-Time Setup)

Open a **new** PowerShell window and run:

```powershell
npm run dev
```

Then visit the sync endpoint or use curl:

```powershell
# Option A: Browser
# Login as recruiter, then visit:
http://localhost:3000/api/chroma/sync

# Option B: PowerShell (after login)
Invoke-WebRequest -Uri "http://localhost:3000/api/chroma/sync" -Method POST -UseBasicParsing
```

---

## 🎨 How to Use

### 1. Traditional Search (Default)

1. Go to **Search Candidates** page
2. Select a job
3. Set filters (GPA, graduation year, etc.)
4. Click **Search**

Results based on **exact skill matching**.

### 2. Semantic Search (AI-Powered)

1. Go to **Search Candidates** page
2. Click the **"✨ AI Semantic"** toggle button (top right)
3. Enter natural language query:
   - *"Looking for a passionate full-stack developer with React and startup experience"*
   - *"Need a data scientist who loves machine learning and has Python expertise"*
   - *"Want a team player with strong communication skills and Node.js background"*
4. Select a job (optional - enhances results)
5. Add filters (optional)
6. Click **Search**

Results based on **semantic similarity + skill matching**.

---

## 📊 Understanding the Results

### Match Scores (Semantic Search)

When using semantic search, you'll see additional scores:

- **Match Score** (0-100%): Combined score
  - 50% from skill matching
  - 50% from semantic similarity

- **Skill Match** (0-100%): Traditional skill overlap

- **Semantic Score** (0-100%): AI-based contextual match

- **Retention Score** (0-100%): AI-predicted retention likelihood

### Example Results:

```
Candidate: Jane Doe
Match Score: 92%
├─ Skill Match: 95% (has React, Node.js, MongoDB)
├─ Semantic: 89% (experience with startups, passionate about frontend)
└─ Retention: 85% (team player, values growth)
```

---

## 🔧 Troubleshooting

### ChromaDB Not Running

**Error:** `ECONNREFUSED localhost:8000`

**Fix:**
```powershell
.\start-chromadb.ps1
```

### Python Not Installed

**Error:** `python : The term 'python' is not recognized`

**Fix:**
1. Download Python: https://www.python.org/downloads/
2. Install and check "Add Python to PATH"
3. Restart PowerShell
4. Run `.\start-chromadb.ps1` again

### No Candidates in Semantic Search

**Fix:**
1. Make sure ChromaDB server is running
2. Sync candidates: `POST /api/chroma/sync`
3. Try again

### Sync Fails

**Check:**
1. ChromaDB running (`http://localhost:8000`)
2. MongoDB running
3. Logged in as recruiter
4. Students exist in database

---

## 🎯 Best Practices

### For Best Search Results:

1. **Be Descriptive:** "React developer with 3+ years experience in e-commerce"
2. **Include Context:** "Team player who values work-life balance"
3. **Mention Traits:** "Passionate about learning new technologies"
4. **Combine with Filters:** Use GPA, graduation year for precision

### What Semantic Search Understands:

- **Synonyms:** "JavaScript" matches "JS", "ECMAScript"
- **Related Skills:** "React" finds "Vue", "Angular" candidates
- **Soft Skills:** "Team player" matches cultural fitness responses
- **Experience:** "Startup" matches company types in work history
- **Passion:** "Loves coding" matches project descriptions, achievements

---

## 📈 Performance Tips

- **First Search:** May take 2-3 seconds (loading embeddings)
- **Subsequent Searches:** ~200-300ms (cached)
- **Sync:** Run weekly or after new student signups
- **Optimal Results:** 10-20 candidates per search

---

## 🔄 Daily Workflow

### Morning:
```powershell
# Terminal 1: Start ChromaDB
.\start-chromadb.ps1

# Terminal 2: Start Next.js
npm run dev
```

### Evening:
- Ctrl+C in both terminals to stop servers

### Weekly:
- Re-sync candidates if many new signups:
  ```powershell
  POST /api/chroma/sync
  ```

---

## 🆘 Need Help?

### Check Server Status:

**ChromaDB:**
```powershell
Invoke-WebRequest -Uri "http://localhost:8000/api/v1/heartbeat" -UseBasicParsing
```

**Next.js:**
```powershell
Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing
```

### View Logs:

Check PowerShell windows for error messages.

### Reset ChromaDB:

If something goes wrong, delete and re-sync:

```powershell
# Stop ChromaDB server (Ctrl+C)

# Delete collection (in new PowerShell)
chroma reset

# Restart ChromaDB
.\start-chromadb.ps1

# Re-sync candidates
POST /api/chroma/sync
```

---

## ✅ Verification Checklist

- [ ] Python installed and in PATH
- [ ] ChromaDB installed (`pip show chromadb`)
- [ ] ChromaDB server running (`http://localhost:8000`)
- [ ] Candidates synced to ChromaDB
- [ ] Semantic search toggle visible in UI
- [ ] Test search returns results

---

## 🎉 You're Ready!

**Next Steps:**
1. Start ChromaDB: `.\start-chromadb.ps1`
2. Start Next.js: `npm run dev`
3. Login as recruiter
4. Go to Search Candidates
5. Toggle on "✨ AI Semantic"
6. Try a natural language query!

**Example Queries to Try:**
- *"Full stack developer passionate about clean code"*
- *"Data scientist with Python and ML experience"*
- *"Frontend engineer who loves React and has design sense"*
- *"Backend developer comfortable with microservices"*

Happy recruiting with AI! 🚀

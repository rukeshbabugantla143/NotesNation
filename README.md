
# NotesNation 📚🇮🇳

**NotesNation** is a centralized, high-performance platform for Indian students to share and discover verified study materials. Managed by *Learn New Things*, it is specifically tailored for the academic ecosystems of Andhra Pradesh and Telangana.

## 🌟 Project Vision
To eliminate the "scattered notes" problem by providing a single, moderated source of truth for Engineering, Degree, Medical, and Intermediate students.

## 🚀 Migration & Fresh Setup

To push this code to your repository (**NotesNation**), follow these exact steps in the **Bash terminal** window:

### 1. Reset Local Git
If you have an existing `.git` folder, remove it to start with a clean history:
```bash
rm -rf .git
git init
```

### 2. Commit the Code
```bash
git add .
git commit -m "Initial commit: NotesNation Platform v1.0"
```

### 3. Link and Push to NotesNation
```bash
git remote add origin https://github.com/rukeshbabugantla143/NotesNation.git
git branch -M main
git push -u origin main --force
```

## 🛠️ Key Features

- **Multi-Stream Library**: Organized by State (AP/TS), Stream (B.Tech, Diploma, etc.), and University Regulation (R22, C23).
- **NationAI Lab**: Integrated Gemini 3 Flash for AI-powered syllabus analysis and concept explanation.
- **Education News Radar**: Real-time alerts grounded in official university data.
- **Student Dashboard**: Tracking contributions, reward points, and bookmarks.
- **Admin Terminal**: Full audit logs, moderation queue, and user management.

## 📦 Local Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Setup**:
   Create a `.env` file with your Firebase and Gemini credentials:
   ```env
   VITE_FIREBASE_API_KEY=...
   API_KEY=your_gemini_api_key
   ```

3. **Start Development**:
   ```bash
   npm run dev
   ```

## 🛡️ License
Copyright © 2026 **Learn New Things**. All rights reserved.
Developed and Maintained by Rukesh Babu Gantla.

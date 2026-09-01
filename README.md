# COP Connect — The Church of Pentecost

A web & mobile collaboration and project monitoring network for **The Church of Pentecost (COP)** worldwide. Designed to connect **Areas &rarr; Districts &rarr; Local Assemblies** to share real-time updates on church building construction, evangelism outreaches, mission houses, and community initiatives.

---

## 🏛️ Organizational Architecture & Verification Hierarchy

COP Connect implements a **2-Tier Trust Chain Verification System**:

```
[1. National Super Admin] (General Head Office IT & Administration)
         │
         │  (Tier 1 Verification: Checks & Verifies Area Heads)
         ▼
[2. Area Head Account] (Apostle / Area Pastor) ── Declares their Area on sign-up
         │
         │  (Tier 2 Confirmation: Area Head confirms Pastors in their jurisdiction)
         ▼
[3. District Pastor Account] (District Minister)
         │
         ▼  (Once verified by Area Head)
[4. District Project Uploads & National Feed Publishing]
```

---

## 🚀 Features

- **Executive "Share What God is Doing" Composer**: Quick project creation with photo uploads from mobile camera / PC.
- **National Leadership Activity Feed**: Multi-filterable by Area, District, Category, and Status.
- **2-Tier Verified Registration**:
  - Area Heads register and declare their Area &rarr; Super Admin verifies with 1 click.
  - Pastors register and select their Area &rarr; Area Head verifies their appointment.
- **Full Project Management**: Edit titles, descriptions, stage notes, and photo galleries; post status progression (*Planned &rarr; Ongoing &rarr; Completed*).
- **Interactive Encouragements & Discussions**: Ministers can send praises, likes, and comments on sister district projects.
- **Brand Compliance**: Built with official Church of Pentecost colors (*Deep Blue, Pentecost Gold, Red Fire, White*) and official vector emblem.

---

## 💻 Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS
- **Icons**: Lucide React
- **Client-Side Optimization**: HTML5 Canvas Image Compression
- **State Management**: Reactive React Context + LocalStorage persistence

---

## 🛠️ Getting Started Locally

```bash
# Clone the repository
git clone https://github.com/nkansahisaac436-dotcom/cop_connect.git

# Navigate to project directory
cd cop_connect

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 📄 License
Internal proprietary software for The Church of Pentecost.

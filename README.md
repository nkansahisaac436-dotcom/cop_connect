# COP Connect — The Church of Pentecost

**COP Connect** is an internal, verified-membership web and mobile platform for **The Church of Pentecost (COP)** that reflects its organizational hierarchy (**National Super Admin → Areas (Area Heads) → Districts (Pastors) → Local Assemblies**) to enable seamless collaboration, verification trust chains, project monitoring, and nationwide/international inspiration.

---

## 🏛️ Church Organizational Hierarchy & Trust Chain

```
[National Super Admin] (General Head Office IT & Administration)
       │
       │  Verifies & Approves
       ▼
[Area Head Account] (Apostle / Area Pastor) ── Manages Area & 5 to 30 Districts
       │
       │  Approves
       ▼
[Pastor / District Account]
       - Registers, selects their Area from searchable list
       - Enters / requests District
       - Status = "Pending" until Area Head approves
       - Once approved → Full posting & management rights
```

---

## 🚀 Key Features

1. **Hierarchy Verification Workflows:**
   - **Super Admin Command Center:** Global KPIs, Area Head Verification Queue, Master Area/District Manager, System Audit Trail.
   - **Area Head Dashboard:** Summary across all constituent Districts, Pending Pastor Approval Queue with 1-click Approve/Reject, and Area-wide updates.
   - **Pastor Dashboard:** District-specific summary, My Projects portfolio, Upload New Project, and Milestone tracking.
   - **Pending Approval Screen:** Real-time feedback for applicants showing their exact position in the hierarchy trust chain.
2. **National & Global Activity Feed:**
   - Real-time project cards with stage-by-stage construction photos, funding progress bars, and Area/District badges.
   - Searchable and filterable by Area, Category (*Church Building, Outreach/Evangelism, Community Project, Mission House, Conference/Event*), and Status (*Planned, Ongoing, Completed*).
3. **Project Details & Interactive Encouragements:**
   - High-resolution photo gallery viewer.
   - Full scope narratives and milestone checklist with interactive status updates.
   - Encouragement reactions ("Amen! 🙏", "Glory to God! ✨", "Inspiring 👏", "Keep Shining 🌟") with celebratory micro-animations and comment threads.
4. **Client-Side Image Optimization:**
   - Automatically resizes and compresses camera uploads on the client side before submission to keep the feed ultra-fast across mobile and low-bandwidth regions.
5. **Interactive Persona Switcher:**
   - Built-in floating switcher to seamlessly test all roles (*Super Admin, Area Head, Approved Pastor, Pending Applicant, or Live Signup*).
6. **Multi-Language Support:**
   - English & French toggle for COP's international presence across West Africa, Europe, and the Americas.

---

## 🎨 Official Brand Identity Compliance

- **Ultramarine Deep Blue** (`#0B2545` / `#133E87`): Primary (peace of heaven, law, order, compassion).
- **Pentecost Gold / Yellow** (`#F59E0B` / `#D97706`): Secondary / Accent (glorious golden church).
- **Flame Red** (`#DC2626`): Accent (blood of Christ & Holy Ghost fire).
- **White** (`#FFFFFF`): Backgrounds (righteousness).
- **Official Emblem:** Fixed, unaltered high-resolution vector emblem prominently positioned on headers and login screens.

---

## 💻 Tech Stack & Getting Started

- **Frontend:** React (TypeScript), Tailwind CSS, Lucide React, Canvas Confetti, Date-fns.
- **Data & Auth Layer:** Modular architecture supporting Firebase (Auth, Firestore, Storage) with a reactive zero-config client database fallback.

### Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

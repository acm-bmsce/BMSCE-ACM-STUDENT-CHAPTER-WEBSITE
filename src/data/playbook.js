// Placement Playbook: CSE Edition. Condensed from the chapter's placement guide.
// Each section: { id, label, title, intro, blocks: [{ heading, items?, text?, note? }] }

export const PLAYBOOK_INTRO =
  "Written for Computer Science & allied branches (CSE, IT, CS-AI, CS-DS, SE). Not a checklist, but a mentor standing beside you, showing exactly what to practise, when and why. Curated from the real placement journeys of our seniors and alumni.";

export const PLAYBOOK = [
  {
    id: "overview",
    label: "Overview",
    title: "Types of placements",
    intro:
      "You're learning algorithms, systems and code, but placements test how well you convert that knowledge into clear, repeatable performance.",
    blocks: [
      { heading: "On-campus", text: "Companies visit campus and hire through the college process. Convenient, high-volume and time-bound. Treat it like a sprint where first impressions and resume clarity matter most." },
      { heading: "Off-campus", text: "You apply directly via portals, referrals or job platforms. Continuous and competitive; persistence, portfolio and referrals win." },
      { heading: "Pool placements", text: "Multiple colleges in a single drive. The scale of on-campus with off-campus competition, so your performance must be polished and repeatable." },
      {
        heading: "7 pillars of placement success",
        items: [
          "Aptitude: think fast, reason clearly, handle numbers without fear",
          "Coding ability: structured problem-solving, not just syntax",
          "CS fundamentals: the foundation every CS engineer carries",
          "Projects & resume: proof that you can build",
          "The placement process: understand each round",
          "On- & off-campus strategies",
          "Tracking your progress",
        ],
      },
    ],
  },
  {
    id: "aptitude",
    label: "Aptitude",
    title: "Mental warm-up before the coding marathon",
    intro:
      "Aptitude is the first filter at TCS, Infosys, Wipro, Capgemini, Accenture, and in the initial rounds at Amazon, Wells Fargo and JP Morgan. It isn't about being 'math smart', it's about being sharp under pressure.",
    blocks: [
      { heading: "Quantitative aptitude", items: ["Number systems, LCM & HCF, divisibility", "Percentages, ratios, averages", "Profit & loss, simple & compound interest", "Time & work, time-speed-distance", "Mixtures & alligations", "Permutation, combination & probability", "Algebra, progressions (AP/GP), mensuration"] },
      { heading: "Logical reasoning & DI", items: ["Puzzles & seating arrangements", "Patterns, series & analogies", "Blood relations & directions", "Data interpretation: graphs, pie charts, caselets", "Coding–decoding, syllogisms, odd one out"] },
      { heading: "Verbal ability", items: ["Reading comprehension", "Sentence correction & para jumbles", "Vocabulary & fill in the blanks"] },
      { heading: "Resources", items: ["Books: RS Aggarwal or Arun Sharma", "Practice: Indiabix, PrepInsta", "YouTube: Aptitude Baba"] },
    ],
    note: "Practise 20–30 minutes daily and read 15 minutes a day (articles, blogs, tech news). Topics become reflexes rather than calculations.",
  },
  {
    id: "coding",
    label: "Coding & DSA",
    title: "Problem-solving that companies actually test",
    intro:
      "Companies don't hire you for syntax. They hire you for your ability to break down a problem and convert it into clean, optimal code.",
    blocks: [
      { heading: "Choosing a language", items: ["Python: AI/ML, data, automation. Great for interviews", "Java: backend (Spring Boot), Android, enterprise. Excellent for DSA + dev", "C++: systems, competitive programming, HFT. Fastest execution"] },
      { heading: "Three layers of coding ability", items: ["Problem understanding: inputs, outputs, constraints; restate it in your own words", "Approach building: patterns, edge cases, time vs space trade-offs", "Clean implementation: readable, modular, tested on edge cases"] },
      { heading: "DSA roadmap", items: ["Basics → complexity → arrays → strings", "Two pointers → sliding window → recursion", "Linked lists → stacks → queues → hashing", "Trees → BST → heaps → graphs (DFS/BFS)", "DP basics → greedy → backtracking → bit manipulation", "Sorting & searching"] },
      { heading: "Practice", items: ["Striver's A–Z DSA sheet (must do)", "LeetCode, NeetCode.io, GeeksForGeeks", "CodeChef contests, HackerRank for beginners", "YouTube: Striver, Kunal Kushwaha, Harkirat Singh"] },
    ],
    note: "Your DSA language and development stack don't have to be the same. Choose the one you're most comfortable with for DSA.",
  },
  {
    id: "sql",
    label: "SQL",
    title: "Crucial for backend & data roles",
    intro: "SQL is tested in almost every technical interview for developer roles.",
    blocks: [
      { heading: "Core concepts", items: ["SELECT, WHERE, ORDER BY, GROUP BY, HAVING", "LIKE, IN, BETWEEN, IS NULL", "INNER / LEFT / RIGHT / FULL OUTER joins", "Subqueries & aggregate functions", "UNION, INTERSECT, EXCEPT"] },
      { heading: "Advanced", items: ["Window functions: ROW_NUMBER, RANK, DENSE_RANK, NTILE", "CTEs with the WITH clause", "Indexes: clustered vs non-clustered", "Normalization: 1NF → BCNF", "Transactions & ACID, triggers, views"] },
      { heading: "Practice", items: ["HackerRank SQL", "LeetCode Database problems", "GeeksforGeeks SQL"] },
    ],
    note: "Practise 3 queries a day and revisit old ones after 15 days for retention.",
  },
  {
    id: "fundamentals",
    label: "CS Fundamentals",
    title: "The backbone of every technical interview",
    intro: "Read theory lightly but with strong understanding in the foundation phase, then re-read in the strengthening phase.",
    blocks: [
      { heading: "Computer networks", items: ["OSI model & protocols per layer", "TCP vs UDP", "IP addressing, subnetting, CIDR", "HTTP/HTTPS, status codes, cookies, SSL"] },
      { heading: "Operating systems", items: ["Processes & threads", "Deadlocks & Banker's algorithm", "CPU scheduling algorithms", "Paging, segmentation, virtual memory", "Semaphores & synchronization"] },
      { heading: "DBMS", items: ["Joins, normalization, ER modelling", "Transactions & ACID", "Keys & indexing, query optimisation"] },
      { heading: "OOPs", items: ["Encapsulation, abstraction, inheritance, polymorphism", "Classes, constructors, access modifiers", "Interfaces, abstract classes, exceptions"] },
    ],
    note: "Question practice: InterviewBit, PrepInsta, GeeksforGeeks. Explore system design, cloud and distributed systems next.",
  },
  {
    id: "projects",
    label: "Projects",
    title: "What makes you stand out",
    intro: "A strong project can drive three-quarters of your interview discussion. Everyone learns theory; projects are unique to you.",
    blocks: [
      { heading: "Principles", items: ["Quality over quantity: 2 major + 1 mini is enough", "Be able to explain architecture, choices, challenges and scope", "Clean GitHub: frequent commits, a proper README, documentation"] },
      { heading: "What to build", items: ["Web development (must-have)", "AI/ML-based project (must-have)", "Data visualisation dashboard (recommended)", "Mobile app (recommended)", "Open-source contributions (highly recommended)", "DevOps/cloud, IoT or game dev (optional)"] },
      { heading: "Interview prep", items: ["A 2-minute project story: problem → why → stack → features → results", "Architecture & data flow", "Tech-stack deep dive: why this, not that", "Connect features to DSA: how would you optimise search?"] },
    ],
  },
  {
    id: "resume",
    label: "Resume",
    title: "Your first impression",
    intro: "Keep it one page, clear and structured. A clean resume with strong projects wins interviews.",
    blocks: [
      { heading: "Key tips", items: ["Use existing templates to save time", "Tailor it to the role", "Keep it ATS-friendly: aim for a 60–70%+ score", "Standard section titles, no images or fancy designs"] },
      { heading: "Sections", items: ["Header: name, email, LinkedIn, GitHub/portfolio", "Skills: languages, frameworks, tools, databases", "Projects: 2–4 strongest, with stack and links", "Experience: company, role, action-verb descriptions", "Achievements & certifications with measurable impact"] },
      { heading: "Tools", items: ["Templates: Canva, FlowCV, Overleaf (LaTeX)", "ATS checks: jobscan.co, enhancv.com, novoresume.com"] },
    ],
  },
  {
    id: "process",
    label: "Process",
    title: "The complete placement journey",
    intro: "Understanding each round helps you prepare effectively. Usually only one of managerial / best-fit / HR rounds is held.",
    blocks: [
      {
        heading: "Rounds",
        items: [
          "Pre-placement talk: note the skills they emphasise",
          "Online assessment: quant, LR, verbal, basic CS (60–90 min)",
          "Coding test: 1–3 problems on an online IDE",
          "Group discussion: clarity, reasoning, teamwork",
          "Technical interviews: DSA, OOP, DBMS, OS, CN, projects",
          "Managerial round: ownership, decisions, pressure",
          "HR / behavioural: culture fit, goals, honesty",
          "Offer & onboarding",
        ],
      },
      { heading: "STAR method", items: ["Situation: the context in one line", "Task: your responsibility", "Action: what you specifically did", "Result: a measurable, positive outcome"] },
    ],
    note: "Prepare 2–3 STAR stories for questions like \"Tell me about a challenge you faced\".",
  },
  {
    id: "strategy",
    label: "Strategy",
    title: "On-campus & off-campus roadmaps",
    intro: "A phased approach to maximise your preparation efficiency.",
    blocks: [
      { heading: "Phase 1 · Foundation (4–6 weeks)", items: ["Basic DSA, 2 easy problems + 3 SQL queries a day", "Light reading of OS, DBMS, CN, OOPs", "30 minutes of aptitude daily", "Start one major project: 1 hr on weekdays, 3–4 hrs on weekends"] },
      { heading: "Phase 2 · Strengthening (8 weeks)", items: ["Re-read theory subjects", "Medium–hard DSA with multiple approaches", "A second mini-project for diversity", "A coding contest every 10 days"] },
      { heading: "Phase 3 · Revision & interviews (3–4 weeks)", items: ["Timed full-length mock tests", "Mock technical interviews", "HR, managerial and best-fit prep with STAR answers"] },
      { heading: "Off-campus", items: ["Optimise LinkedIn and keep a LeetCode/GFG streak", "Apply daily via LinkedIn, Naukri, Wellfound, Internshala", "Referrals give roughly 10× the chances; aim for 5–10 a week", "Open-source PRs and weekly LinkedIn updates", "Track every application in a spreadsheet"] },
    ],
  },
  {
    id: "mindset",
    label: "Mindset",
    title: "A marathon, not a sprint",
    intro: "Technical skills matter, but your mindset during placements can make or break your success.",
    blocks: [
      {
        heading: "Eight habits",
        items: [
          "Be consistent: an hour a day beats five hours once a week",
          "Treat rejections as feedback, not failure",
          "Keep a learning mindset",
          "Trust the process, even when others get placed first",
          "Own your projects end-to-end",
          "Stay positive and professional",
          "Be organised",
          "Maintain discipline in prep and in interviews",
        ],
      },
    ],
    note: "Your day will come. Keep improving, and don't lose focus.",
  },
  {
    id: "tracking",
    label: "Tracking",
    title: "What gets measured gets improved",
    intro: "Systematic tracking helps you find weak areas and measure progress.",
    blocks: [
      { heading: "Weekly mock tests", items: ["Log time taken, accuracy and weak areas"] },
      { heading: "Project tracker", items: ["Modules → tasks → deadlines → status"] },
      { heading: "Mistake journal", items: ["DSA approaches & missed edge cases", "SQL logic errors", "Aptitude slips", "Interview answers to improve"] },
      { heading: "Monthly review", items: ["What improved", "What slowed down", "What needs focus next month"] },
    ],
    note: "Spend 30 minutes every month reflecting. It prevents burnout and keeps you on track.",
  },
];

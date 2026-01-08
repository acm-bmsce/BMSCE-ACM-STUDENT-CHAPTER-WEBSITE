import { useState } from "react"
import {
  FileText, ExternalLink, Globe, ChevronRight, Target, BookOpen, Sparkles,
  Award, Zap, Brain, Book, Briefcase, TrendingUp, Code, Cpu, Database, Calendar,
  CheckCircle, AlertCircle, Users, BarChart, Cloud, Smartphone, Cog,
  Gamepad2, Network, GitBranch, Filter, Clock, Star,
  Trophy, Search, Download, Settings, Layout,
  Monitor, Terminal, Type, Calculator, User, ChevronLeft, ChevronRight as ChevronRightIcon,
  Building, MapPin, DownloadCloud, Lightbulb, Home, Target as TargetIcon,
  Calendar as CalendarIcon, Clock as ClockIcon2, Award as AwardIcon2,
  BookOpen as BookOpenIcon, FileText as FileTextIcon, Code as CodeIcon,
  Database as DatabaseIcon2, Cpu as CpuIcon2, Brain as BrainIcon,
  Briefcase as BriefcaseIcon, TrendingUp as TrendingUpIcon,
  BarChart as BarChartIcon, Cloud as CloudIcon, Smartphone as SmartphoneIcon,
  Gamepad2 as Gamepad2Icon, Network as NetworkIcon, GitBranch as GitBranchIcon
} from 'lucide-react';
import { useRef, useEffect } from "react";
import AnimatedTitle from "./AnimatedTitle";

export function PlacementGuideSection() {
  const [activeSection, setActiveSection] = useState("overview")
  const [expandedProjects, setExpandedProjects] = useState([])
  const scrollRef = useRef(null)
  const sectionRefs = useRef({})
  const navScrollRef = useRef(null)

  const handleProjectClick = (projectId) => {
    setExpandedProjects(prev =>
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    )
  }

  const handleNavClick = (sectionId) => {
    setActiveSection(sectionId);
    const container = scrollRef.current;
    const section = sectionRefs.current[sectionId];

    if (container && section) {
      container.scrollTo({
        left: section.offsetLeft,
        behavior: 'smooth'
      });
    }
  };

  const handlePrevClick = () => {
    const currentIndex = navigationItems.findIndex(item => item.id === activeSection)
    if (currentIndex > 0) {
      const prevSection = navigationItems[currentIndex - 1].id
      handleNavClick(prevSection)
    }
  }

  const handleNextClick = () => {
    const currentIndex = navigationItems.findIndex(item => item.id === activeSection)
    if (currentIndex < navigationItems.length - 1) {
      const nextSection = navigationItems[currentIndex + 1].id
      handleNavClick(nextSection)
    }
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        handlePrevClick()
      } else if (e.key === 'ArrowRight') {
        handleNextClick()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeSection])

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.dataset.section
            setActiveSection(sectionId)

            const navButton = document.querySelector(`[data-nav="${sectionId}"]`)
            if (navButton && navScrollRef.current) {
              const navContainer = navScrollRef.current
              const buttonLeft = navButton.offsetLeft
              const buttonWidth = navButton.offsetWidth
              const containerWidth = navContainer.offsetWidth

              navContainer.scrollTo({
                left: buttonLeft - (containerWidth / 2) + (buttonWidth / 2),
                behavior: 'smooth'
              })
            }
          }
        })
      },
      {
        root: container,
        threshold: 0.6,
      }
    )

    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const sections = {
    overview: {
      title: "Overview",
      icon: BookOpen,
      content: {
        subtitle: "Placement Playbook — CSE Edition",
        description: "This guide is written for Computer Science & allied branches (CSE, IT, CS-AI, CS-DS, SE). If you're from the CSE cluster, this is your playbook — not a checklist, but a mentor standing beside you, showing exactly what to practise, when, and why.",
        highlights: [
          {
            title: "On-Campus Placements",
            description: "Companies visit your campus and hire through the college's placement process. It's convenient, high-volume, and often time-bound — treat it like a sprint where first impressions and resume clarity matter most.",
            icon: Building
          },
          {
            title: "Off-Campus Placements",
            description: "You apply directly to company portals, referrals, or job platforms. It's continuous, competitive, and lets you target product firms; here, persistence, portfolio, and referrals win.",
            icon: Globe
          },
          {
            title: "Pool Placements",
            description: "Multiple colleges participate in a single recruitment drive (often organised by a company or agency). It mixes the scale of on-campus with off-campus competition — your performance must be polished and repeatable.",
            icon: Users
          },
          
        ],
        pillars: [
          "Aptitude Skills - your ability to think fast, reason clearly, and handle numbers without fear",
          "Coding Ability - not just syntax, but structured problem-solving that helps you in the long run",
          "CS Fundamentals - the foundation every cs engineer must carry confidently",
          "Projects & Resume Quality - proof that you can build, not just read",
          "General Placement Process Overview - understanding each round thoroughly",
          "On & Off-Campus Placements Strategies - targeted approaches for different placement types",
          "How to track your progress - systematic measurement and improvement"
        ],
        whyMatters: "Why this matters for the CSE cluster? You're learning algorithms, systems, and code — but placements test how well you convert that knowledge into clear, repeatable performance. For CSE students, placements are the bridge between academic projects and real engineering impact. This guide turns that bridge into a highway."
      },
    },
    aptitude: {
      title: "Aptitude Skills",
      icon: Brain,
      content: {
        subtitle: "Mental Warm-up Before The Coding Marathon",
        description: "Aptitude is the first filter for most companies, especially TCS, Infosys, Wipro, Capgemini, Accenture, and even several product-based companies such as Amazon, Wells Fargo, and JP Morgan in their initial rounds. Aptitude isn't about being 'math smart.' It's about being sharp under pressure. It's your mental warm-up before the coding marathon.",
        topics: [
          {
            category: "Quantitative Aptitude — Building Numerical Confidence",
            icon: Calculator,
            items: [
              "Number Systems",
              "LCM & HCF",
              "Divisibility Rules",
              "Percentages",
              "Ratios & Proportions",
              "Averages",
              "Profit & Loss",
              "Simple Interest & Compound Interest",
              "Time & Work",
              "Time, Speed & Distance",
              "Mixtures & Alligations",
              "Permutation & Combination",
              "Probability",
              "Algebra (Linear & Quadratic Equations)",
              "Progressions (AP/GP)",
              "Mensuration (2D & 3D)"
            ],
            practiceTip: "When you practise consistently for even 20–30 minutes a day, these topics start becoming reflexes rather than calculations."
          },
          {
            category: "Logical Reasoning & Data Interpretation — Sharpening Your Analytical Edge",
            icon: Filter,
            items: [
              "Puzzles",
              "Seating Arrangements",
              "Patterns & Series",
              "Blood Relations",
              "Directions",
              "Graph/Data Interpretation (bar or line graphs, pie charts, missing / logical DI, Caselets)",
              "Table-Based Questions",
              "Coding–Decoding",
              "Analogies",
              "Odd One Out",
              "Syllogisms"
            ],
            practiceTip: "Companies love LRDI because it mirrors how engineers think in real life. A good LRDI score tells the company that you don't freeze when information looks messy — you organise it."
          },
          {
            category: "Verbal Ability — Your Silent Scorer",
            icon: Type,
            items: [
              "Reading Comprehension",
              "Sentence Correction",
              "Para Jumbles",
              "Vocabulary (Synonyms/Antonyms)",
              "Fill in the Blanks"
            ],
            practiceTip: "Never underestimate verbal skills. A strong verbal score shows clarity of thought — something every engineering team values. Even reading 15 minutes a day — articles, blogs, tech news — drastically improves this section."
          },
        ],
        dailyPractice: "Practice 20-30 minutes daily - these topics become reflexes",
        readingTip: "Read 15 minutes daily (articles, blogs, tech news) for verbal improvement",
        resources: [
          { name: "Books", value: "RS Aggarwal or Arun Sharma", icon: BookOpen },
          { name: "Practice Platforms", value: "Indiabix, PrepInsta", icon: Monitor },
          { name: "YouTube Mentors", value: "Aptitude Baba", icon: Users },
        ],
      },
    },
    coding: {
      title: "Coding & DSA",
      icon: Code,
      content: {
        subtitle: "Problem-Solving That Companies Actually Test",
        description: "Most students believe coding = just writing syntax. But companies don't hire you for syntax — they hire you for your ability to think logically, break down a problem, and convert it into clean, optimal code.",
        languages: [
          {
            name: "Python",
            badge: "Smart All-Rounder",
            use: "AI + Data + Fast Prototyping",
            details: [
              "AI / ML / Deep Learning (TensorFlow, PyTorch)",
              "Data Science & Analytics",
              "Automation & Scripting",
              "Cybersecurity tools & pentesting",
              "Backend development (limited, but Django/FastAPI exist)",
              "Product prototyping",
              "Interview coding rounds (very easy & fast to code)"
            ],
            placement: {
              friendly: "Amazing for coding interviews",
              bestFor: "AI/ML jobs, quick learning",
              notFor: "Most large enterprise backend systems"
            }
          },
          {
            name: "Java",
            badge: "Most Practical Choice",
            use: "Dev + Backend + Enterprise",
            details: [
              "Backend Development (Spring Boot dominates the industry)",
              "Android App Development",
              "Enterprise-level applications",
              "Microservices architecture",
              "Big Data (Hadoop, Kafka, Spark ecosystem)"
            ],
            placement: {
              friendly: "Excellent for both DSA + Development",
              bestFor: "Most service & product companies prefer Java",
              advantage: "Easier to get dev internships with Java"
            }
          },
          {
            name: "C++",
            badge: "Performance King",
            use: "Systems + CP + High-speed Apps",
            details: [
              "Operating Systems",
              "Compilers",
              "Game Development (Unreal Engine)",
              "High-frequency trading (HFT) systems",
              "Embedded systems",
              "Competitive programming",
              "CPUs, GPUs, and robotics software"
            ],
            placement: {
              friendly: "Excellent for DSA, Fast execution",
              bestFor: "Competitive programming",
              notFor: "Web/backend application development"
            }
          }
        ],
        finalNote: "Your DSA language and development tech stack don't have to be the same. Choose the language you're most comfortable with for DSA, and later pick tech stacks based on what you want to build.",
        dsaLayers: [
          {
            name: "1. Problem Understanding",
            icon: Search,
            points: [
              "What is the input? What is the output?",
              "What exact transformation needs to happen?",
              "Are there constraints?",
              "Can the naive solution pass all test cases?"
            ],
            tip: "Always restate the problem in your own words. It improves clarity and thinking speed."
          },
          {
            name: "2. Approach Building (The Real Skill)",
            icon: Cog,
            points: [
              "Patterns (two pointers, sliding window, hashing, DP, recursion)",
              "Edge cases analysis",
              "Trade-off between time vs space",
              "How to simplify a problem before optimizing"
            ],
            tip: "The difference between an average coder and a top performer is this step. Great coders don't jump to code — they first decide how to solve it."
          },
          {
            name: "3. Clean Code Implementation",
            icon: CheckCircle,
            points: [
              "Readable and modular code",
              "Modular (functions > long code)",
              "Works on edge cases",
              "Thorough testing"
            ],
            tip: "Remember: Clean code passes tests. Messy code fails silently. This is exactly what interviewers observe on screen."
          }
        ],
        roadmap: [
          "Variables, Loops, Functions",
          "Time & Space Complexity",
          "Arrays",
          "Strings",
          "Two Pointers",
          "Sliding Window",
          "Recursion",
          "Linked List",
          "Stacks",
          "Queues",
          "Hashing",
          "Trees",
          "Binary Trees",
          "Binary Search Trees",
          "Heaps",
          "Graphs (DFS, BFS)",
          "Dynamic Programming (only basics for most companies)",
          "Greedy Algorithms",
          "Backtracking",
          "Bit Manipulation",
          "Sorting & Searching"
        ],
        practicePlatforms: [
          { name: "Strivers DSA A-Z sheet", tag: "Must Do", icon: Trophy },
          { name: "LeetCode", tag: "Provides lot of problems", icon: Code },
          { name: "NeetCode.io", tag: "Structured roadmap", icon: Layout },
          { name: "GeeksForGeeks", tag: "Concept understanding", icon: FileText },
          { name: "CodeChef", tag: "Contests", icon: Users },
          { name: "HackerRank", tag: "Beginners", icon: Star }
        ],
        youtube: [
          { name: "Take U Forward", focus: "DSA" },
          { name: "Kunal Kushwaha", focus: "DSA + Dev" },
          { name: "Harkirat Singh", focus: "Web Dev + DSA" }
        ],
        importantNote: "Coding ability is tested in three layers: Problem Understanding, Approach Building, and Clean Code Implementation. Your coding ability is what separates you from other candidates."
      },
    },
    sql: {
      title: "SQL & Databases",
      icon: Database,
      content: {
        subtitle: "Database Skills Every Developer Needs",
        description: "SQL is equally important to DSA for most backend and data-related roles. Mastering SQL and database concepts shows you understand data persistence, management, and can work with real-world data systems.",
        importance: "SQL is crucial for backend roles and data-related positions. It's tested in almost every technical interview for developer roles. Strong SQL skills demonstrate your ability to work with databases, write efficient queries, and understand data relationships.",
        coreConcepts: [
          {
            category: "1. Core Concepts to Master",
            icon: Database,
            items: [
              "Basic Queries: SELECT, FROM, WHERE, ORDER BY, GROUP BY, HAVING",
              "Filtering: LIKE, IN, BETWEEN, IS NULL",
              "Joins: INNER JOIN – common records, LEFT JOIN – all left table + matched right table, RIGHT JOIN – all right table + matched left table, FULL OUTER JOIN – all records",
              "Subqueries: Nested queries for filtering or aggregation",
              "Aggregate Functions: COUNT, SUM, AVG, MIN, MAX",
              "Set Operations: UNION, UNION ALL, INTERSECT, EXCEPT",
              "Sorting & Limiting: ORDER BY, LIMIT/TOP",
              "Grouping Data: GROUP BY, HAVING for condition on groups"
            ]
          },
          {
            category: "2. Advanced SQL Concepts",
            icon: Settings,
            items: [
              "Window Functions: ROW_NUMBER, RANK, DENSE_RANK, NTILE",
              "CTEs (Common Table Expressions): WITH clause for cleaner queries",
              "Indexes: Primary, Unique, Composite, Clustered vs Non-clustered",
              "Normalization: 1NF, 2NF, 3NF, BCNF",
              "Transactions & ACID Properties: BEGIN, COMMIT, ROLLBACK",
              "Triggers & Stored Procedures: Automation of DB operations",
              "Views: Virtual tables for easier querying"
            ]
          },
          {
            category: "3. Query Optimization Concepts",
            icon: Zap,
            items: [
              "Understanding execution plans",
              "Index optimization strategies",
              "Query rewriting for performance",
              "Understanding database caching",
              "Partitioning strategies"
            ]
          }
        ],
        practiceRoutine: "Practice 3 SQL queries/day with revisiting old ones after 15 days for retention",
        practicePlatforms: [
          { name: "HackerRank SQL Section", tag: "Practice", url: "#", icon: Terminal },
          { name: "LeetCode Database Problems", tag: "Advanced", url: "#", icon: Code },
          { name: "GeeksforGeeks SQL", tag: "Concepts", url: "#", icon: FileText }
        ],
        tip: "SQL is equally important as DSA for most backend roles. Companies test SQL to ensure you can work with databases efficiently."
      }
    },
    fundamentals: {
      title: "CS Fundamentals",
      icon: Cpu,
      content: {
        subtitle: "The Backbone of Every Technical Interview",
        description: "CS Fundamentals are the backbone of every technical interview. Strong theory alone isn't enough — the ultimate goal is to be able to answer real interview questions confidently.",
        subjects: [
          {
            name: "Computer Networks (CN)",
            icon: Network,
            topics: [
              "OSI Model: 7 layers, functions, protocols at each layer",
              "TCP vs UDP: Reliability vs speed with use-case examples",
              "IP Addressing & Subnetting: Basic IPv4, CIDR notation",
              "HTTP/HTTPS & Web Basics: Requests, responses, status codes, cookies, SSL"
            ],
            resource: "https://www.geeksforgeeks.org/computer-networks/computer-network-tutorials/"
          },
          {
            name: "Operating Systems (OS)",
            icon: Settings,
            topics: [
              "Processes & Threads",
              "Deadlocks: Conditions, prevention, avoidance, detection. Banker's Algorithm",
              "Scheduling Algorithms: FCFS, SJF, Priority, Round Robin (know preemptive/non-preemptive)",
              "Memory Management: Paging, segmentation, virtual memory, cache",
              "Semaphores & Synchronization: Mutex locks, critical section problems"
            ],
            resource: "https://www.geeksforgeeks.org/operating-systems/operating-systems/"
          },
          {
            name: "DBMS",
            icon: Database,
            topics: [
              "SQL Queries: SELECT, UPDATE, DELETE, aggregate functions",
              "Joins: INNER, LEFT, RIGHT, FULL",
              "Normalization, ER Diagram, Relational modelling",
              "Transactions & ACID properties: Atomicity, Consistency, Isolation, Durability",
              "Indexing & Keys: Primary, Foreign, Composite, Unique",
              "Techniques to optimize queries speed"
            ],
            resource: "https://www.geeksforgeeks.org/dbms/dbms/"
          },
          {
            name: "Object-Oriented Programming (OOPs)",
            icon: Cog,
            topics: [
              "Master every topic that falls under 4 pillars of OOPs",
              "Encapsulation, Abstraction, Inheritance, Polymorphism",
              "Classes, Objects, Constructors, Destructors",
              "Access Modifiers, Static members",
              "Interfaces, Abstract classes",
              "Exception Handling"
            ]
          },
          {
            name: "Other Subjects to Explore",
            icon: BookOpen,
            topics: [
              "Cloud Computing Fundamentals",
              "System Design (Low level & High Level System Design)",
              "Microservices Architecture",
              "Distributed Systems basics"
            ]
          }
        ],
        interviewPractice: [
          {
            platform: "InterviewBit",
            description: "Excellent subject-wise questions, from easy to hard. Can refer their cheatsheets also, they are very useful.",
            url: "https://www.interviewbit.com/technical-interview-questions/#mcqs"
          },
          {
            platform: "PrepInsta",
            description: "Technical interview questions preparation with structured approach",
            url: "https://prepinsta.com/interview-preparation/technical-interview-questions"
          },
          {
            platform: "GeeksforGeeks",
            description: "Comprehensive tutorials and practice problems for all CS subjects",
            url: "https://www.geeksforgeeks.org"
          }
        ],
        studyTip: "Read theory subjects lightly but with strong understanding in foundation phase, then re-read in strengthening phase for better clarity."
      },
    },
    projects: {
      title: "Projects",
      icon: Briefcase,
      content: {
        subtitle: "What Makes You Stand Out",
        description: "Projects are what make you stand out. Everyone can learn theory and solve DSA problems, but projects are unique per individual. In fact, a strong project can contribute 3/4 of your interview discussions in some companies. Choosing the right projects is critical.",
        principles: [
          {
            title: "Quality over Quantity",
            description: "2–3 strong projects (max 2 major + 1 mini enough) are better than 5 weak ones"
          },
          {
            title: "Be Able to Explain Everything",
            description: "You should know architecture, tech choices, challenges, and future scope for every project"
          },
          {
            title: "GitHub Best Practices",
            description: "Clean repos with frequent commits, proper README, and documentation for interview revision"
          }
        ],
        allProjects: [
          {
            id: "web-dev",
            title: "Web Development Project",
            subtitle: "Must-Have for every company",
            icon: Globe,
            priority: "must-have",
            techStack: {
              backend: ["Node.js + Express", "Spring Boot (Java)", "Python (FastAPI, Django, Flask)"],
              frontend: ["React.js (highly preferred)", "Angular", "Vue.js"],
              database: ["MongoDB (NoSQL)", "PostgreSQL (SQL)", "MySQL", "Redis", "Neo4j"],
              deployment: ["AWS", "Heroku", "Vercel", "Netlify", "Docker"]
            },
            keySkills: [
              "Learn APIs, database integration, authentication, and deployment",
              "Use a NoSQL database alongside SQL — shows understanding of both relational and non-relational paradigms",
              "RESTful API development",
              "State management",
              "Responsive design"
            ],
            examples: [
              "E-commerce platform with payment integration",
              "Social media application with real-time features",
              "Blog/CMS with admin dashboard",
              "Task management application"
            ],
            whyImportant: "Every company expects web development knowledge. Shows full-stack capabilities and understanding of modern web architecture."
          },
          {
            id: "ai-ml",
            title: "AI/ML-Based Project",
            subtitle: "Must-Have because AI is the trend",
            icon: Brain,
            priority: "must-have",
            techStack: {
              languages: ["Python"],
              frameworks: ["TensorFlow", "PyTorch", "Scikit-learn", "Keras"],
              tools: ["Jupyter Notebooks", "Google Colab", "MLflow"],
              deployment: ["Flask/FastAPI for API", "Streamlit for UI", "Docker"]
            },
            keySkills: [
              "Data preprocessing & cleaning",
              "Model training & evaluation",
              "Hyperparameter tuning",
              "Model deployment",
              "API development for ML models"
            ],
            examples: [
              "Recommendation system for your web app",
              "Chatbot using NLP (BERT, GPT models)",
              "Image classification / object detection app",
              "Sentiment analysis tool",
              "Predictive analytics dashboard"
            ],
            whyImportant: "Demonstrates cutting-edge skills. Shows ability to apply theoretical ML concepts practically. Can be integrated with web projects."
          },
          {
            id: "data-viz",
            title: "Data Visualization / Dashboard",
            subtitle: "Mini project showing analytical skills",
            icon: BarChart,
            priority: "recommended",
            techStack: {
              python: ["Matplotlib", "Seaborn", "Plotly", "Dash"],
              biTools: ["Tableau", "Power BI", "Looker Studio"],
              javascript: ["D3.js", "Chart.js", "Recharts"],
              backend: ["Flask/Django for custom dashboards"]
            },
            keySkills: [
              "Data analysis & interpretation",
              "Statistical visualization",
              "Dashboard design",
              "Interactive charts creation",
              "Data storytelling"
            ],
            examples: [
              "COVID-19 tracker dashboard",
              "Financial analytics dashboard",
              "Sales performance visualization",
              "Real-time IoT data monitoring"
            ],
            whyImportant: "Shows ability to analyze, interpret, and present data visually. Great for finance, healthcare, and analytics roles."
          },
          {
            id: "devops",
            title: "DevOps / Cloud-Integrated Project",
            subtitle: "Learn basic DevOps skills",
            icon: Cloud,
            priority: "optional",
            techStack: {
              ciCd: ["Git", "Jenkins", "GitHub Actions", "GitLab CI"],
              containerization: ["Docker", "Podman"],
              orchestration: ["Kubernetes", "Docker Swarm"],
              cloud: ["AWS (most used)", "Google Cloud Platform (GCP)", "Microsoft Azure"],
              monitoring: ["Prometheus", "Grafana", "ELK Stack"]
            },
            keySkills: [
              "Containerization concepts",
              "CI/CD pipeline creation",
              "Cloud deployment",
              "Infrastructure as Code (Terraform)",
              "Monitoring & logging"
            ],
            examples: [
              "Dockerized microservices application",
              "CI/CD pipeline for web app",
              "Kubernetes cluster setup",
              "Cloud migration project"
            ],
            whyImportant: "Shows understanding of modern deployment practices. Important for DevOps/SRE roles. Give least preference unless your aim is a devops role, learn basic devops skills like git, docker instead of doing a project."
          },
          {
            id: "mobile",
            title: "Mobile App Project",
            subtitle: "Full-stack mobile development",
            icon: Smartphone,
            priority: "recommended",
            techStack: {
              native: ["Kotlin (Android)", "Swift (iOS)"],
              crossPlatform: ["Flutter (Dart)", "React Native", "Xamarin"],
              backend: ["Node.js", "Django", "Firebase", "Supabase"],
              stateManagement: ["Provider", "Bloc", "Redux"]
            },
            keySkills: [
              "Mobile UI/UX design",
              "API integration",
              "Local storage management",
              "Push notifications",
              "App store deployment"
            ],
            examples: [
              "Health/fitness tracker",
              "Campus information app",
              "Ride/driver booking app",
              "E-commerce mobile app"
            ],
            whyImportant: "Demonstrates full-stack mobile development skills. Shows understanding of mobile-specific challenges and user experience."
          },
          {
            id: "open-source",
            title: "Open-Source Contribution",
            subtitle: "Not exactly a project you start",
            icon: GitBranch,
            priority: "highly-recommended",
            techStack: {
              tools: ["Git", "GitHub/GitLab", "Pull Requests", "Issues"],
              areas: ["Bug fixes", "Feature additions", "Documentation", "Testing"]
            },
            keySkills: [
              "Collaborative development",
              "Code review process",
              "Version control best practices",
              "Open-source contribution workflow",
              "Community engagement"
            ],
            examples: [
              "Contribute to popular frameworks (React, Vue, Django)",
              "Fix bugs in open-source tools",
              "Add features to utility libraries",
              "Improve documentation"
            ],
            whyImportant: "Shows teamwork, coding standards, and familiarity with collaboration workflows. Great for resume and networking."
          },
          {
            id: "iot",
            title: "IoT / Hardware-Integrated Project",
            subtitle: "Rare and memorable in interviews",
            icon: Cpu,
            priority: "optional",
            techStack: {
              hardware: ["Raspberry Pi", "Arduino", "ESP32"],
              programming: ["Python", "C++", "MicroPython"],
              cloud: ["AWS IoT", "Google Cloud IoT", "Azure IoT"],
              protocols: ["MQTT", "HTTP", "Bluetooth", "WiFi"]
            },
            keySkills: [
              "Hardware-software integration",
              "Sensor data processing",
              "Real-time communication",
              "Cloud integration for IoT",
              "Power management"
            ],
            examples: [
              "Smart home automation system",
              "IoT health monitor",
              "Environmental monitoring station",
              "Industrial IoT prototype"
            ],
            whyImportant: "Combines hardware, software, and cloud integration. Shows multidisciplinary skills. Stands out in interviews."
          },
          {
            id: "game-dev",
            title: "Game Development",
            subtitle: "Shows creative thinking and logic",
            icon: Gamepad2,
            priority: "optional",
            techStack: {
              engines: ["Unity (C#)", "Unreal Engine (C++)", "Godot"],
              frameworks: ["Pygame (Python)", "Phaser.js (JavaScript)"],
              languages: ["C#", "C++", "JavaScript", "Python"]
            },
            keySkills: [
              "Game physics implementation",
              "Graphics rendering",
              "Game logic programming",
              "User interface design",
              "Performance optimization"
            ],
            examples: [
              "2D/3D puzzle or adventure game",
              "Interactive educational game",
              "Physics simulation",
              "Multiplayer game prototype"
            ],
            whyImportant: "Shows creative thinking, full-stack logic, and UI/UX skills. Demonstrates complex system design capabilities."
          }
        ],
        extraTips: [
          "Maintain a clean GitHub repo with frequent commits, proper README, and comments",
          "Prepare to justify all tech choices — interviewers care about reasoning, not just coding",
          "Document architecture, challenges, and learnings for each project to revise during interviews",
          "Remember 2-3 good projects are enough to ace in interviews"
        ],
        interviewPreparation: [
          {
            aspect: "Project Story (2-minute Explanation)",
            description: "Be able to explain in a smooth and structured format: Problem → Why you built it → Tech stack → Features → Results"
          },
          {
            aspect: "Architecture & Workflow (High-Level Design)",
            description: "Be ready to explain: System architecture (frontend → backend → database → API → cloud), How data flows, Database schema, Why you chose particular architecture"
          },
          {
            aspect: "Tech Stack Deep Dive",
            description: "For every technology you used, know: Why you used it instead of alternatives, Basic working, Most important features relevant to your project, Limitations / challenges you faced"
          },
          {
            aspect: "Feature-by-Feature Explanation",
            description: "For each major feature: What the feature does, How you implemented it, Logic behind it, Complexity (if applicable), Challenges + how you solved them"
          },
          {
            aspect: "DSA + Project Connection (Very Important)",
            description: "Interviewers often link project to DSA: How did you optimize the search feature? What data structure suits XYZ feature? How will you improve time complexity?"
          }
        ]
      },
    },
    resume: {
      title: "Resume Preparation",
      icon: FileText,
      content: {
        subtitle: "Your First Impression",
        description: "Your resume is your first impression. Keep it 1 page, clear, and structured.",
        keyTips: [
          "Use existing templates to save time and look professional",
          "Tailor it to the role you're applying for",
          "Make it ATS friendly, try to maintain ats score of 60-70 percent & above",
          "Clean, structured resume with strong projects wins interviews"
        ],
        atsExplanation: {
          title: "What is an ATS Score?",
          points: [
            "ATS (Applicant Tracking System) score shows how well your resume matches a job description — based on keywords, skills, experience, and formatting",
            "Companies use ATS software to filter resumes automatically before a human recruiter sees them",
            "A higher ATS score means your resume is more relevant and optimized, so it's more likely to pass the automated screening",
            "The score depends on keyword matching, clean formatting, no fancy designs/images, and using standard section titles (Education, Skills, Work Experience, Projects)",
            "Examples websites to check Ats score: jobscan.co, enhancv.com, novoresume.com"
          ],
          checkWebsites: ["jobscan.co", "enhancv.com", "novoresume.com"]
        },
        templatePlatforms: [
          { name: "Canva", description: "Modern, clean templates", icon: Layout },
          { name: "FlowCV", description: "Professional, recruiter-friendly", icon: FileText },
          { name: "Overleaf (LaTeX)", description: "Great for technical resumes", icon: Type }
        ],
        sections: [
          {
            name: "Header",
            content: "Name + contact(gmail) + LinkedIn + GitHub/Portfolio link",
            icon: User
          },
          {
            name: "Skills",
            content: "Languages, frameworks, tools, databases (categorized)",
            icon: Award
          },
          {
            name: "Projects",
            content: "2–4 strongest with title, tech stack, git repo link, deployed link if any",
            icon: Briefcase
          },
          {
            name: "Internships / Experience",
            content: "Company Name, Role, short description on work done (use action verbs)",
            icon: Calendar
          },
          {
            name: "Achievements / Certifications",
            content: "Keep relevant to role, show measurable impact",
            icon: Trophy
          }
        ],
        mentorTip: "Don't overcomplicate—use templates and focus on content. Your projects and their clear explanation matter most. Clean, structured resume with strong projects wins interviews."
      }
    },
    process: {
      title: "Placement Process",
      icon: Target,
      content: {
        subtitle: "Complete Placement Journey Overview",
        description: "Understanding each round helps you prepare effectively. Use the STAR method (Situation, Task, Action, Result) for behavioral rounds. Company application process will be followed by ppt session/test usually. Only 1 among managerial/best fit/hr round will be done usually.",
        rounds: [
          {
            name: "Pre-Placement Talk / Company Info Session",
            purpose: "Explain company, role, package, selection flow, expectations",
            format: "Online/offline presentations may include eligibility check or test link instructions",
            preparation: "Listen carefully, note what skills they emphasize, tailor your resume + answers accordingly",
            variation: "Some companies conduct detailed presentations; others keep it very short. Sometimes optional"
          },
          {
            name: "Aptitude / Written / Online Assessment Test",
            purpose: "Tests Quant, Logical Reasoning, Verbal Ability, and basic CS, used to filter large applicant pools",
            format: "MCQs in Quant, LR, English, and basic CS. Time-bound (60-90 min)",
            preparation: "Practise aptitude, take timed snacks, improve speed + accuracy",
            variation: "Some companies merge aptitude with coding difficulty varies heavily"
          },
          {
            name: "Coding / Technical Test (if separate)",
            purpose: "Evaluates coding skills, logic building, and problem-solving ability",
            format: "1–3 coding questions, debugging tasks, or pseudo-code. Online IDE",
            preparation: "Practise DSA (array, strings, DP basics), write clean code, do timed contacts",
            variation: "Some skip this for non-door roles. For SDE roles, this is often the most important filter"
          },
          {
            name: "Group Discussion / Communication Round",
            purpose: "Tests communication, clarity, reasoning, teamwork, and leadership",
            format: "Group speaks on a topic/case; may include listening/reating/writing English tasks",
            preparation: "Practise GD topics, structure points clearly, speak confidently",
            variation: "Only in some service-based, consulting, analytics companies. Tech MNCs rarely conduct GD"
          },
          {
            name: "Technical Interview Round(s)",
            purpose: "Tests DSA, OOP, DBMS, OS, CN, system logic, and project knowledge",
            format: "Coding on IDE/whiteboard, core CS questions, project deep-dive, scenarios. 1–3 rounds depending on role",
            preparation: "Review core subjects, understand projects end-to-end, practise coding + explaining thought process",
            variation: "Number of rounds varies some have 1 deep round, others have 2–3 shorter rounds. Difficulty depends on role"
          },
          {
            name: "Managerial / Techno-Managerial Round",
            purpose: "Tests how you work: real-world thinking, ownership, decision-making, prioritization, pressure handling, and deeper project understanding in tough situations",
            format: "Stress questions, scenario questions, project drilling, puzzles, teamwork situations",
            preparation: "Stay calm, justify decisions logically, be honest if unsure",
            variation: "May be before/after technical. Some skip it; bigger companies almost always include it"
          },
          {
            name: "HR / Behavioural Interview",
            purpose: "Tests who you are: personality, culture fit, communication, stability, honesty, long-term goals, and alignment with company values",
            format: "Strengths/weaknesses, goals, why this company, teamwork stories, salary expectations, relocation, etc",
            preparation: "Prepare HR answers, research company, maintain positive attitude & body language",
            variation: "Some combine HR + Management; others have a dedicated long HR round. Startups may keep this very short"
          },
          {
            name: "Best Fit / Culture Fit / Team Fit Round",
            purpose: "Tests if you match the team's working style, company values, attitude, maturity, and long-term compatibility. Ensures you are the 'right match' for the team & culture",
            format: "Informal discussion with manager/lead; questions on teamwork, conflicts, motivation, working style, values",
            preparation: "Be honest, show positivity, give teamwork examples, show willingness to learn and collaborate",
            variation: "Some merge this with HR or Managerial; product companies/startups often keep it as a separate final round"
          },
          {
            name: "Offer + Onboarding",
            purpose: "Final confirmation of role, package, and joining. Includes document verification and pre-joining formalities",
            format: "Offer letter, document submission, orientation/training instructions",
            preparation: "Submit documents on time, clarify doubts politely, stay responsive",
            variation: "Some send offer immediately; others after weeks. Training period varies"
          }
        ],
        starMethod: {
          description: "Use this during HR, Best-Fit, and Managerial rounds:",
          components: [
            "S – Situation: Describe the context in 1 line",
            "T – Task: State your responsibility or goal in 1 line",
            "A – Action: Explain what you specifically did in 1–2 lines",
            "R – Result: End with measurable, positive outcome in 1 line"
          ]
        }
      }
    },
    strategy: {
      title: "Placement Strategy",
      icon: TrendingUp,
      content: {
        subtitle: "On-Campus & Off-Campus Roadmaps",
        description: "Different placement types require different strategies. Here's a phased approach to maximize your preparation efficiency.",
        phases: [
          {
            name: "Phase 1 — Foundation Phase (4-6 Weeks)",
            goal: "Build strong fundamentals + consistent routine",
            dailyPlan: [
              "Start basic DSA → focus on understanding concepts deeply",
              "Practice 2 easy DSA problems/day & 3 SQL queries/day (quality > quantity & understand each topic properly before moving on)",
              "Theory subjects reading → OS, DBMS, CN, OOPS (light reading, strong understanding)",
              "Aptitude → 30 mins every day (consistency matters)"
            ],
            projectWork: {
              description: "Start one project (major —preferably because you wouldn't have much time to focus on projects in depth few months before your placements)",
              weekdays: "1 hr/day",
              weekends: "3–4 hrs only on the project → rest of the weekend must be break time",
              structure: "Define project objectives and create weekly deadlines. Maintain documentation for every feature you build"
            },
            outcome: "Solid fundamentals + your first structured project ready",
            note: "Understanding skills matter more than speed in this phase — your clarity reflects your thinking ability during interviews"
          },
          {
            name: "Phase 2 — Strengthening Phase (8 Weeks)",
            goal: "Level up your problem-solving + reinforce theory + add a second project",
            dailyPlan: [
              "Re-read theory subjects once again (OS, DBMS, CN, OOPs)",
              "Continue 30 mins aptitude daily",
              "Start medium-hard DSA problems with multiple approaches",
              "Practice SQL queries + revisit old ones after 15 days",
              "Start another mini-project for diversity",
              "Participate in coding contests every 10 days"
            ],
            dsaFocus: "Solve each problem in multiple approaches (BruteForce, Optimized). Redo the easy problems from phase 1 if necessary. Multiple approaches for same question are the toughest part of DSA in interviews",
            projectNote: "This shows diversity + confidence during interviews",
            outcome: "Improved confidence, intermediate DSA skills, two projects, stronger conceptual clarity"
          },
          {
            name: "Phase 3 — Revision + Interview Phase (3-4 Weeks)",
            goal: "Transition from preparation → interview-ready candidate",
            activities: [
              "Solve full-length mock tests with time limits",
              "Focus on accuracy + managing pressure",
              "Revise theory and interview questions from InterviewBit, PrepInsta, LeetCode Explore",
              "Attend technical mock interviews",
              "Prepare for HR round, Managerial round, Best Fit round",
              "STAR format answers"
            ],
            projectOptions: [
              "Build one more project and revise all 3 later in the final week of this phase, or",
              "Use the existing project documentation to prepare strong for interviews"
            ],
            recommendation: "However, having another project is highly recommended to ensure that you stand out among all candidates",
            outcome: "You become fully interview-ready with clarity, speed, confidence, and strong project based knowledge"
          }
        ],
        offCampusStrategy: {
          title: "Off-Campus Strategy — Roadmap to Get Interviews Faster",
          goal: "Build credibility → Increase visibility → Unlock interview calls → Crack offers",
          steps: [
            {
              category: "1: Build Your Online Visibility",
              steps: [
                {
                  step: "1️⃣ Optimize Your LinkedIn Profile",
                  details: [
                    "Use a clear headline: 'Software Developer | Java | React | AWS | DSA'",
                    "Add 2–3 strong projects (with GitHub links)",
                    "Stay active — recruiters check profile activity, consistency, and credibility"
                  ]
                },
                {
                  step: "2️⃣ Strengthen Your LeetCode / GFG Profile",
                  details: [
                    "Your coding activity acts as a public skill tracker",
                    "Try maintaining a 20-40 day streak to improve profile visibility",
                    "Add your LeetCode/GFG link to LinkedIn + Resume"
                  ]
                },
                {
                  step: "3️⃣ Build or Update Your Portfolio Website",
                  details: [
                    "Show your projects, tech stack, achievements, certifications",
                    "Helps recruiters evaluate you in 30 seconds"
                  ]
                }
              ]
            },
            {
              category: "2: Apply Smart, Not Hard",
              steps: [
                {
                  step: "4️⃣ Apply Through All Key Portals (Daily)",
                  details: [
                    "LinkedIn Jobs",
                    "Naukri",
                    "Indeed",
                    "AngelList (Wellfound)",
                    "Company Careers Pages",
                    "Internshala (for internship + PPO chances)"
                  ],
                  note: "Apply using a clean ATS resume + short message"
                },
                {
                  step: "5️⃣ Use Referral Power (10× Higher Chances)",
                  details: [
                    "Networking > cold applying",
                    "Send a 3-line referral request: Who you are + What role you're applying for + Resume + portfolio link",
                    "Aim for 5–10 referrals per week"
                  ]
                }
              ]
            },
            {
              category: "3: Stand Out With Work (Parallel Activity)",
              steps: [
                {
                  step: "6️⃣ Open-Source Contributions",
                  details: [
                    "Even 2–3 PRs in beginner repositories make your profile stronger",
                    "Shows initiative, learning ability, and teamwork"
                  ]
                },
                {
                  step: "7️⃣ Build 1–2 Good Personal Projects",
                  details: [
                    "AI, Web Dev, Cloud, or Full-Stack projects",
                    "Preferably with backend + database + deployment",
                    "These projects get interviewers interested instantly"
                  ]
                }
              ]
            },
            {
              category: "4: Track + Improve (Continuous)",
              steps: [
                {
                  step: "8️⃣ Post Weekly LinkedIn Updates",
                  details: [
                    "Post about: A project feature you added, A concept you learned, A coding milestone, An open-source contribution",
                    "Consistency = visibility"
                  ]
                },
                {
                  step: "9️⃣ Track All Applications (very important)",
                  details: [
                    "Use a spreadsheet or tools like Huntr",
                    "Track: Job link, Company name, Date applied, Status, Follow-up date",
                    "Prevents missing opportunities"
                  ]
                },
                {
                  step: "🔟 Prepare for ATS",
                  details: [
                    "Use correct keywords",
                    "Add project achievements",
                    "Match resume with job description",
                    "Use clean formatting (no images/fancy designs)"
                  ]
                }
              ]
            }
          ]
        },
        }
    },
    mindset: {
      title: "Mindset & Attitude",
      icon: Brain,
      content: {
        subtitle: "Ultra-Short Guide to Success Mindset",
        description: "Technical skills are important, but your mindset during placements can make or break your success. Placement success is a marathon, not a sprint.",
        keyPoints: [
          {
            point: "1. Be Consistent",
            description: "Show up daily — even 1 hour a day beats studying 4-5 hours once a week"
          },
          {
            point: "2. Handle Rejections Maturely",
            description: "Treat every rejection as feedback, not failure"
          },
          {
            point: "3. Have a Learning Mindset",
            description: "Be curious, open to new concepts, and willing to say 'I can learn this'"
          },
          {
            point: "4. Trust the Process",
            description: "Believe in your preparation process, stay confident even when others get placed before you. Your day will come, keep improving, and don't lose focus"
          },
          {
            point: "5. Show Ownership",
            description: "Understand your projects end-to-end and take responsibility for decisions"
          },
          {
            point: "6. Stay Positive & Professional",
            description: "Confident but not arrogant; respectful tone; honest answers"
          },
          {
            point: "7. Be Organised",
            description: "Track your prep, maintain notes, follow a schedule, track job applications"
          },
          {
            point: "8. Maintain Discipline",
            description: "During preparation AND interviews — it's not just about answering questions; how you think, how you structure answers, and how you drive the interview with clarity and confidence matters the most"
          }
        ],
        finalNote: "Your day will come, keep improving, and don't lose focus. Placement success is a marathon, not a sprint."
      }
    },
    tracking: {
      title: "Progress Tracking",
      icon: BarChart,
      content: {
        subtitle: "How to Track Your Preparation Effectively",
        description: "What gets measured gets improved. Systematic tracking helps identify weak areas and measure progress.",
        trackingMethods: [
          {
            method: "Weekly Mock Tests & Score Logging",
            description: "Weekly tracking shows whether you are improving or plateauing",
            metrics: [
              "Time taken – measure efficiency",
              "Accuracy – identify precision in solving problems",
              "Weak areas – note concepts or topics needing improvement"
            ]
          },
          {
            method: "Project Progress Guide",
            description: "The project tracker depends on your type of project and its domain—customize it to suit your needs",
            structure: [
              "Module – divide your project into major components",
              "Tasks – list actionable items under each module",
              "Deadlines – assign realistic timelines",
              "Status – track progress from To Do → In Progress → Done"
            ],
            example: "Break each project into manageable steps"
          },
          {
            method: "Mistake Journal",
            description: "Revisiting your mistakes every weekend prevents repetition and improves accuracy",
            categories: [
              "DSA mistakes – wrong approaches or overlooked edge cases",
              "SQL logic errors – query or syntax issues",
              "Aptitude mistakes – incorrect problem-solving steps",
              "Interview rough answers – points you could have explained better"
            ]
          },
          {
            method: "Monthly Review",
            description: "This practice resets your preparation direction and helps prevent burnout",
            reflectionPoints: [
              "What improved – identify your strengths and progress",
              "What slowed down – pinpoint areas where growth is lagging",
              "What needs focus next month – set clear priorities"
            ],
            tip: "Spend 30 minutes every month to reflect on: What improved, What slowed down, What needs focus next month"
          }
        ],
        downloadResources: [
          {
            name: "3-Phase Progress Tracker Sheets",
            description: "Download and modify according to your requirements",
            icon: Download
          },
          {
            name: "Project Tracker Template",
            description: "Customizable Excel/Google Sheets template",
            icon: FileText
          },
          {
            name: "Interview Preparation Checklist",
            description: "Comprehensive checklist for each placement round",
            icon: CheckCircle
          }
        ],
        mentorTip: "Spend 30 minutes every month to reflect on progress. This small investment prevents burnout and keeps you on track toward your goals."
      }
    }
  }

  const navigationItems = [
    { id: "overview", label: "Overview", icon: BookOpen },
    { id: "aptitude", label: "Aptitude", icon: Book },
    { id: "coding", label: "Coding & DSA", icon: Code },
    { id: "sql", label: "SQL", icon: Database },
    { id: "fundamentals", label: "CS Fundamentals", icon: Cpu },
    { id: "projects", label: "Projects", icon: Briefcase },
    { id: "resume", label: "Resume", icon: FileText },
    { id: "process", label: "Process", icon: Target },
    { id: "strategy", label: "Strategy", icon: TrendingUp },
    { id: "mindset", label: "Mindset", icon: Brain },
    { id: "tracking", label: "Tracking", icon: BarChart },
  ]

  const renderContent = () => {
    const section = sections[activeSection]
    const Icon = section.icon

    switch (activeSection) {
      case "overview":
        return (
          <div className="space-y-10">
            {/* Compact Header */}
            <div className="text-center">
              <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-gradient-to-r from-blue-900/20 to-cyan-900/20 rounded-full border border-blue-500/30">
                <Icon className="w-10 h-10 md:w-8 md:h-8 text-blue-400 flex-shrink-0" />
                <h3 className="text-xl md:text-2xl font-bold text-white bebas-neue tracking-wider">{section.content.subtitle}</h3>
              </div>
              <p className="text-white/70 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
                {section.content.description}
              </p>
            </div>

            {/* Types of Placements - NEW SECTION */}
            <div className="bg-gradient-to-br from-blue-900/10 to-cyan-900/10 border border-blue-500/30 rounded-xl p-6">
              <h4 className="text-xl font-bold text-blue-400 mb-6 text-center bebas-neue tracking-wide">
                Types of Placements
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {section.content.highlights.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-gradient-to-br from-white/5 to-transparent rounded-xl p-5 border border-white/10 hover:border-blue-400/30 transition-all duration-300"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600/20 to-cyan-600/20 flex items-center justify-center">
                        <item.icon className="w-6 h-6 text-blue-400" />
                      </div>
                      <h5 className="text-lg font-bold text-white">{item.title}</h5>
                    </div>
                    <p className="text-white/70 text-sm">{item.description}</p>
                  </div>
                ))}
              </div>
              
              {/* Why it Matters Section */}
              <div className="mt-8 p-5 bg-gradient-to-r from-blue-900/20 to-cyan-900/20 rounded-lg border border-blue-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <Target className="w-6 h-6 text-cyan-400" />
                  <h5 className="text-lg font-bold text-cyan-400">Why This Matters for CSE Cluster</h5>
                </div>
                <p className="text-white/80 leading-relaxed">
                  {section.content.whyMatters}
                </p>
              </div>
            </div>

            {/* Pillars Section */}
            <div className="bg-gradient-to-br from-blue-900/10 to-cyan-900/10 border border-blue-500/30 rounded-xl p-6">
              <h4 className="text-xl font-bold text-blue-400 mb-6 text-center bebas-neue tracking-wide">
                7 Pillars of Placement Success
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column: Items 1-4 */}
                <div className="space-y-4">
                  {section.content.pillars.slice(0, 4).map((pillar, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/10 relative"
                    >
                      <div className="absolute -left-3 top-4 w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center z-10">
                        <span className="text-white font-bold text-xs">{idx + 1}</span>
                      </div>
                      <div className="ml-6 w-full">
                        <span className="text-white/80">{pillar}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right Column: Items 5-7 */}
                <div className="space-y-4">
                  {section.content.pillars.slice(4, 7).map((pillar, idx) => (
                    <div
                      key={idx + 4}
                      className="flex items-start gap-3 p-4 bg-white/5 rounded-lg border border-white/10 relative"
                    >
                      <div className="absolute -left-3 top-4 w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center z-10">
                        <span className="text-white font-bold text-xs">{idx + 5}</span>
                      </div>
                      <div className="ml-6 w-full">
                        <span className="text-white/80">{pillar}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-center pt-8 border-t border-white/10">
              <p className="text-white/60 mb-4">Select a section to begin exploring</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {navigationItems.slice(1).map((item) => {
                  const NavIcon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white/80 hover:text-white transition-all"
                    >
                      <NavIcon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )

      case "aptitude":
        return (
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-4">
              <Icon className="w-12 h-12 md:w-8 md:h-8 text-blue-400 flex-shrink-0" />
              <h3 className="text-2xl md:text-3xl font-bold text-white bebas-neue tracking-wider">
                {section.content.subtitle}
              </h3>
            </div>
            <p className="text-white/70 text-lg leading-relaxed">
              {section.content.description}
            </p>

            {/* Daily Practice Tips */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-cyan-400" />
                  <h4 className="text-lg font-bold text-white">Daily Practice</h4>
                </div>
                <p className="text-white/70 text-sm">
                  {section.content.dailyPractice}
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-5 h-5 text-cyan-400" />
                  <h4 className="text-lg font-bold text-white">Reading Tip</h4>
                </div>
                <p className="text-white/70 text-sm">
                  {section.content.readingTip}
                </p>
              </div>
            </div>

            {/* Topics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {section.content.topics.map((topic, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-xl p-5"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <topic.icon className="w-6 h-6 text-cyan-400" />
                    <h4 className="text-xl font-bold text-cyan-400 bebas-neue tracking-wide">
                      {topic.category.split("—")[0]}
                    </h4>
                  </div>
                  <p className="text-white/70 text-sm mb-3 italic">
                    {topic.category.split("—")[1]}
                  </p>
                  <ul className="space-y-2 mb-3">
                    {topic.items.map((item, itemIdx) => (
                      <li
                        key={itemIdx}
                        className="text-white/80 text-sm flex items-start gap-2"
                      >
                        <ChevronRight className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="text-xs text-white/50 italic border-t border-white/10 pt-2">
                    {topic.practiceTip}
                  </div>
                </div>
              ))}
            </div>

            {/* Resources */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h4 className="text-xl font-bold text-white mb-4 bebas-neue tracking-wide">
                Recommended Resources
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {section.content.resources.map((resource, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-blue-500/5 rounded-lg border border-blue-500/20"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <resource.icon className="w-4 h-4 text-blue-400" />
                      <h5 className="text-blue-400 font-semibold">
                        {resource.name}
                      </h5>
                    </div>
                    <p className="text-white/70 text-sm">{resource.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "coding":
        return (
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-4">
              <Icon className="w-12 h-12 md:w-8 md:h-8 text-blue-400 flex-shrink-0" />
              <h3 className="text-2xl md:text-3xl font-bold text-white bebas-neue tracking-wider">
                {section.content.subtitle}
              </h3>
            </div>
            <p className="text-white/70 text-lg leading-relaxed">
              {section.content.description}
            </p>

            {/* Language Selection */}
            <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-xl p-6">
              <h4 className="text-xl font-bold text-blue-400 mb-6 bebas-neue tracking-wide">
                Choosing Your Coding Language: What Each One Is Actually Used For?
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {section.content.languages.map((lang, idx) => (
                  <div
                    key={idx}
                    className="p-5 bg-gradient-to-br from-blue-900/20 to-cyan-900/20 rounded-lg border border-blue-500/20 hover:border-blue-400/40 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h5 className="text-white font-bold text-xl">
                        {lang.name}
                      </h5>
                      <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full">
                        {lang.badge}
                      </span>
                    </div>
                    <p className="text-white/70 text-sm mb-4">{lang.use}</p>
                    
                    <div className="mb-4">
                      <h6 className="text-blue-300 text-sm font-semibold mb-2">Where {lang.name} is used:</h6>
                      <ul className="space-y-1">
                        {lang.details.slice(0, 4).map((detail, i) => (
                          <li
                            key={i}
                            className="text-white/60 text-xs flex items-start gap-1"
                          >
                            <ChevronRight className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="border-t border-white/10 pt-3">
                      <h6 className="text-blue-300 text-sm font-semibold mb-1">Placement-friendly?</h6>
                      <div className="space-y-1">
                        <div className="text-white/70 text-xs">✓ {lang.placement.friendly}</div>
                        {lang.placement.bestFor && (
                          <div className="text-white/70 text-xs">✓ Best for: {lang.placement.bestFor}</div>
                        )}
                        {lang.placement.advantage && (
                          <div className="text-white/70 text-xs">✓ {lang.placement.advantage}</div>
                        )}
                        {lang.placement.notFor && (
                          <div className="text-white/70 text-xs">✗ {lang.placement.notFor}</div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-blue-400" />
                  <h5 className="text-white font-semibold">Final Note on Choosing Your Language</h5>
                </div>
                <p className="text-white/80 text-sm">
                  {section.content.finalNote}
                </p>
              </div>
            </div>

            {/* DSA Layers */}
            <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-xl p-6">
              <h4 className="text-xl font-bold text-blue-400 mb-6 bebas-neue tracking-wide">
                Your coding ability is tested in three layers:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {section.content.dsaLayers.map((layer, idx) => (
                  <div key={idx} className="p-5 bg-white/5 rounded-lg border border-blue-500/20">
                    <div className="flex items-center gap-3 mb-4">
                      <layer.icon className="w-6 h-6 text-blue-400" />
                      <h5 className="text-white font-semibold text-lg">{layer.name}</h5>
                    </div>
                    <ul className="space-y-2 mb-4">
                      {layer.points.map((point, pointIdx) => (
                        <li
                          key={pointIdx}
                          className="text-white/70 text-sm flex items-start gap-2"
                        >
                          <ChevronRight className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                          {point}
                        </li>
                      ))}
                    </ul>
                    <div className="text-xs text-white/50 italic border-t border-white/10 pt-3">
                      {layer.tip}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DSA Roadmap - ORIGINAL TIMELINE DESIGN */}
            <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-xl p-6">
              <h4 className="text-xl font-bold text-blue-400 mb-6 bebas-neue tracking-wide">
                DSA Roadmap (A-Z)
              </h4>

              <div className="relative pl-8 border-l-2 border-blue-500/30">
                {section.content.roadmap.map((topic, idx) => (
                  <div key={idx} className="relative mb-6 last:mb-0">
                    {/* Circle positioned exactly on the line */}
                    <div className="absolute -left-[43px] top-1/2 transform -translate-y-1/2 w-5 h-5 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 border-2 border-blue-900 z-10"></div>

                    <div className="p-3 bg-white/5 rounded-lg border border-blue-500/20 ml-4">
                      <div className="flex items-center gap-3">
                        <div>
                          <h5 className="text-white font-medium">{topic}</h5>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-white/50 text-xs"></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Practice Platforms & YouTube */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h4 className="text-xl font-bold text-white mb-4 bebas-neue tracking-wide">
                  Practice Platforms
                </h4>
                <div className="space-y-3">
                  {section.content.practicePlatforms.map((platform, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-gradient-to-br from-blue-900/20 to-cyan-900/20 rounded-lg hover:bg-blue-900/30 transition-all duration-300"
                    >
                      <div className="flex items-center gap-3">
                        <platform.icon className="w-5 h-5 text-blue-400" />
                        <div>
                          <span className="text-white font-semibold">
                            {platform.name}
                          </span>
                          <p className="text-white/60 text-xs mt-1"></p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h4 className="text-xl font-bold text-white mb-4 bebas-neue tracking-wide">
                  YouTube Channels
                </h4>
                <div className="space-y-3">
                  {section.content.youtube.map((channel, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-gradient-to-br from-blue-900/20 to-cyan-900/20 rounded-lg hover:bg-blue-900/30 transition-all duration-300"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-white font-semibold">
                          {channel.name}
                        </span>
                        <span className="text-xs px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded">
                          Free
                        </span>
                      </div>
                      <span className="text-white/70 text-sm">
                        Focus: {channel.focus}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case "sql":
        return (
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-4">
              <Icon className="w-12 h-12 md:w-8 md:h-8 text-blue-400 flex-shrink-0" />
              <h3 className="text-2xl md:text-3xl font-bold text-white bebas-neue tracking-wider">
                {section.content.subtitle}
              </h3>
            </div>
            
            {/* SQL Importance Banner */}
            <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border-l-4 border-blue-500 rounded-r-lg p-5">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="text-lg font-bold text-blue-300 mb-2">
                    SQL is equally important to DSA
                  </h4>
                  <p className="text-white/80 text-sm leading-relaxed">
                    {section.content.importance}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-white/70 text-lg leading-relaxed">
              {section.content.description}
            </p>

            {/* Practice Routine */}
            <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="w-5 h-5 text-blue-400" />
                <h5 className="text-lg font-bold text-white">Practice Routine</h5>
              </div>
              <p className="text-white/70">
                {section.content.practiceRoutine}
              </p>
            </div>

            {/* Core Concepts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {section.content.coreConcepts.map((concept, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-xl p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <concept.icon className="w-6 h-6 text-blue-400" />
                    <h4 className="text-xl font-bold text-blue-400 bebas-neue tracking-wide">
                      {concept.category.split(".")[0]}
                    </h4>
                  </div>
                  <p className="text-white/70 text-sm mb-3 italic">
                    {concept.category.split(".")[1]}
                  </p>
                  <ul className="space-y-2">
                    {concept.items.map((item, itemIdx) => (
                      <li
                        key={itemIdx}
                        className="text-white/80 text-sm flex items-start gap-2"
                      >
                        <ChevronRight className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Practice Platforms */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h4 className="text-xl font-bold text-white mb-4 bebas-neue tracking-wide">
                Practice Platforms
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {section.content.practicePlatforms.map((platform, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-gradient-to-br from-blue-900/20 to-cyan-900/20 rounded-lg border border-blue-500/20"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <platform.icon className="w-4 h-4 text-blue-400" />
                      <h5 className="text-blue-400 font-semibold">
                        {platform.name}
                      </h5>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white/70 text-sm">{platform.tag}</span>
                      <ExternalLink className="w-3 h-3 text-white/40" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Final Tip */}
            <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-xl p-5">
              <div className="flex items-center gap-3">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                <p className="text-white/80">
                  <span className="font-semibold text-blue-300">Tip:</span> {section.content.tip}
                </p>
              </div>
            </div>
          </div>
        );

      case "fundamentals":
        return (
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-4">
              <Icon className="w-12 h-12 md:w-8 md:h-8 text-blue-400 flex-shrink-0" />
              <h3 className="text-2xl md:text-3xl font-bold text-white bebas-neue tracking-wider">
                {section.content.subtitle}
              </h3>
            </div>
            <p className="text-white/70 text-lg leading-relaxed">
              {section.content.description}
            </p>

            {/* Study Tip */}
            <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border-l-4 border-blue-500 rounded-r-lg p-5">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-6 h-6 text-yellow-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-white/80">
                    <span className="font-semibold text-blue-300">Study Strategy:</span> {section.content.studyTip}
                  </p>
                </div>
              </div>
            </div>

            {/* Subjects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.content.subjects.map((subject, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-xl p-6"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <subject.icon className="w-6 h-6 text-blue-400" />
                    <h4 className="text-xl font-bold text-blue-400 bebas-neue tracking-wide">
                      {subject.name}
                    </h4>
                  </div>
                  <ul className="space-y-2 mb-4">
                    {subject.topics.map((topic, topicIdx) => (
                      <li
                        key={topicIdx}
                        className="flex items-start gap-2 text-white/70 text-sm"
                      >
                        <ChevronRight className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                  {subject.resource && (
                    <a
                      href={subject.resource}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-400 text-sm hover:text-blue-300"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Resource Link
                    </a>
                  )}
                </div>
              ))}
            </div>

            {/* Interview Practice */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h4 className="text-xl font-bold text-white mb-4 bebas-neue tracking-wide">
                Interview Question Practice
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {section.content.interviewPractice.map((practice, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-gradient-to-br from-blue-900/20 to-cyan-900/20 rounded-lg border border-blue-500/20"
                  >
                    <h5 className="text-white font-semibold mb-2">
                      {practice.platform}
                    </h5>
                    <p className="text-white/70 text-sm mb-3">
                      {practice.description}
                    </p>
                    <a
                      href={practice.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-blue-400 text-sm hover:text-blue-300"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Visit Platform
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "projects":
        return (
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-4">
              <Icon className="w-12 h-12 md:w-8 md:h-8 text-blue-400 flex-shrink-0" />
              <h3 className="text-2xl md:text-3xl font-bold text-white bebas-neue tracking-wider">
                {section.content.subtitle}
              </h3>
            </div>
            <p className="text-white/70 text-lg leading-relaxed">
              {section.content.description}
            </p>

            {/* Principles */}
            <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-xl p-6">
              <h4 className="text-xl font-bold text-blue-400 mb-4 bebas-neue tracking-wide">
                Key Principles
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {section.content.principles.map((principle, idx) => (
                  <div key={idx} className="p-4 bg-white/5 rounded-lg">
                    <div className="text-blue-400 font-bold text-lg mb-2">
                      {idx + 1}
                    </div>
                    <h5 className="text-white font-semibold mb-1">
                      {principle.title}
                    </h5>
                    <p className="text-white/70 text-sm">
                      {principle.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* All Projects Grid */}
            <div>
              <h4 className="text-2xl font-bold text-white mb-6 bebas-neue tracking-wide">
                Project Recommendations
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {section.content.allProjects.map((project) => (
                  <div
                    key={project.id}
                    className={`bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-xl overflow-hidden hover:border-blue-400/50 transition-all cursor-pointer ${expandedProjects.includes(project.id)
                        ? "border-blue-400/50"
                        : ""
                      }`}
                    onClick={() => handleProjectClick(project.id)}
                  >
                    {/* Project Header */}
                    <div className="p-5 border-b border-white/10">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <project.icon className="w-6 h-6 text-blue-400" />
                          <div>
                            <h5 className="text-white font-bold text-lg">
                              {project.title}
                            </h5>
                            <p className="text-white/60 text-sm">
                              {project.subtitle}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`text-xs px-3 py-1 rounded-full ${project.priority === "must-have"
                              ? "bg-red-500/20 text-red-400"
                              : project.priority === "recommended"
                                ? "bg-green-500/20 text-green-400"
                                : project.priority === "highly-recommended"
                                  ? "bg-blue-500/20 text-blue-400"
                                  : "bg-yellow-500/20 text-yellow-400"
                            }`}
                        >
                          {project.priority}
                        </span>
                      </div>
                      <p className="text-white/70 text-sm">
                        {project.whyImportant}
                      </p>
                    </div>

                    {/* Tech Stack Preview */}
                    <div className="p-4">
                      <h6 className="text-blue-400 font-semibold mb-2 text-sm">
                        Tech Stack:
                      </h6>
                      <div className="flex flex-wrap gap-2">
                        {Object.values(project.techStack)
                          .flat()
                          .slice(0, 5)
                          .map((tech, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-white/5 text-white/70 text-xs rounded"
                            >
                              {tech}
                            </span>
                          ))}
                        {Object.values(project.techStack).flat().length > 5 && (
                          <span className="px-2 py-1 bg-white/5 text-white/50 text-xs rounded">
                            +
                            {Object.values(project.techStack).flat().length - 5}{" "}
                            more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Expanded View Popup */}
                    {expandedProjects.includes(project.id) && (
                      <div className="p-5 border-t border-white/10 bg-black/50 animate-fadeIn">
                        <div className="space-y-4">
                          {/* Tech Stack Details */}
                          <div>
                            <h6 className="text-blue-400 font-semibold mb-2">
                              Full Tech Stack:
                            </h6>
                            <div className="space-y-2">
                              {Object.entries(project.techStack).map(
                                ([category, items]) => (
                                  <div key={category}>
                                    <p className="text-white/60 text-xs uppercase mb-1">
                                      {category}:
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                      {items.map((item, idx) => (
                                        <span
                                          key={idx}
                                          className="px-2 py-1 bg-blue-500/10 text-white/80 text-xs rounded"
                                        >
                                          {item}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          </div>

                          {/* Key Skills */}
                          <div>
                            <h6 className="text-blue-400 font-semibold mb-2">
                              Key Skills Demonstrated:
                            </h6>
                            <ul className="space-y-1">
                              {project.keySkills.map((skill, idx) => (
                                <li
                                  key={idx}
                                  className="text-white/70 text-sm flex items-start gap-2"
                                >
                                  <ChevronRight className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                                  {skill}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Examples */}
                          <div>
                            <h6 className="text-blue-400 font-semibold mb-2">
                              Example Ideas:
                            </h6>
                            <ul className="space-y-1">
                              {project.examples.map((example, idx) => (
                                <li
                                  key={idx}
                                  className="text-white/70 text-sm flex items-start gap-2"
                                >
                                  <ChevronRight className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                                  {example}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Expand/Collapse Button */}
                    <div className="p-3 border-t border-white/10 text-center">
                      <button className="text-blue-400 text-sm hover:text-blue-300 flex items-center justify-center gap-1 w-full">
                        {expandedProjects.includes(project.id)
                          ? "Show Less"
                          : "Click for Details"}
                        <ChevronRight
                          className={`w-4 h-4 transition-transform ${expandedProjects.includes(project.id) ? "rotate-90" : ""}`}
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Extra Tips */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h4 className="text-xl font-bold text-white mb-4 bebas-neue tracking-wide">
                Extra Tips
              </h4>
              <div className="space-y-2">
                {section.content.extraTips.map((tip, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 text-white/70"
                  >
                    <ChevronRight className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interview Preparation */}
            <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-xl p-6">
              <h4 className="text-xl font-bold text-blue-400 mb-4 bebas-neue tracking-wide">
                Interview Preparation
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {section.content.interviewPreparation.map((prep, idx) => (
                  <div key={idx} className="p-4 bg-white/5 rounded-lg">
                    <h5 className="text-white font-semibold mb-2">
                      {prep.aspect}
                    </h5>
                    <p className="text-white/70 text-sm">{prep.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "resume":
        return (
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-4">
              <Icon className="w-12 h-12 md:w-8 md:h-8 text-blue-400 flex-shrink-0" />
              <h3 className="text-2xl md:text-3xl font-bold text-white bebas-neue tracking-wider">
                {section.content.subtitle}
              </h3>
            </div>
            <p className="text-white/70 text-lg leading-relaxed">
              {section.content.description}
            </p>

            {/* Key Tips */}
            <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-xl p-6">
              <h4 className="text-xl font-bold text-blue-400 mb-4 bebas-neue tracking-wide">
                Key Tips
              </h4>
              <div className="space-y-2">
                {section.content.keyTips.map((tip, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2 text-white/70"
                  >
                    <ChevronRight className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ATS Explanation */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h4 className="text-xl font-bold text-white mb-4 bebas-neue tracking-wide">
                {section.content.atsExplanation.title}
              </h4>
              <ul className="space-y-2 mb-4">
                {section.content.atsExplanation.points.map((point, idx) => (
                  <li
                    key={idx}
                    className="text-white/70 text-sm flex items-start gap-2"
                  >
                    <ChevronRight className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
              <div>
                <p className="text-white/80 mb-2">Examples websites to check ATS score:</p>
                <div className="flex flex-wrap gap-2">
                  {section.content.atsExplanation.checkWebsites.map(
                    (site, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-blue-500/10 text-blue-400 text-sm rounded"
                      >
                        {site}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Template Platforms */}
            <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-xl p-6">
              <h4 className="text-xl font-bold text-blue-400 mb-4 bebas-neue tracking-wide">
                Recommended Platforms for Resume Templates
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {section.content.templatePlatforms.map((platform, idx) => (
                  <div key={idx} className="p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <platform.icon className="w-4 h-4 text-blue-400" />
                      <h5 className="text-white font-semibold">
                        {platform.name}
                      </h5>
                    </div>
                    <p className="text-white/70 text-sm">
                      {platform.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Resume Sections */}
            <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-xl p-6">
              <h4 className="text-xl font-bold text-blue-400 mb-4 bebas-neue tracking-wide">
                Want to make one from scratch without a template?
              </h4>
              <p className="text-white/70 text-sm mb-4">These are the sections to include:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {section.content.sections.map((sectionItem, idx) => (
                  <div key={idx} className="p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <sectionItem.icon className="w-4 h-4 text-blue-400" />
                      <h5 className="text-white font-semibold">
                        {sectionItem.name}
                      </h5>
                    </div>
                    <p className="text-white/70 text-sm">
                      {sectionItem.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Mentor Tip */}
            <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Award className="w-6 h-6 text-blue-400" />
                <h5 className="text-white font-bold">Mentor Tip</h5>
              </div>
              <p className="text-white/80">{section.content.mentorTip}</p>
            </div>
          </div>
        );

      case "process":
        return (
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-4">
              <Icon className="w-12 h-12 md:w-8 md:h-8 text-blue-400 flex-shrink-0" />
              <h3 className="text-2xl md:text-3xl font-bold text-white bebas-neue tracking-wider">
                {section.content.subtitle}
              </h3>
            </div>
            <p className="text-white/70 text-lg leading-relaxed">
              {section.content.description}
            </p>

            {/* Rounds Table */}
            <div className="overflow-x-auto rounded-xl border border-blue-500/30">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20">
                    <th className="text-left p-4 text-blue-400 font-bold bebas-neue tracking-wide">Round</th>
                    <th className="text-left p-4 text-blue-400 font-bold bebas-neue tracking-wide">Purpose & What It Tests</th>
                    <th className="text-left p-4 text-blue-400 font-bold bebas-neue tracking-wide">What to Expect / Format</th>
                    <th className="text-left p-4 text-blue-400 font-bold bebas-neue tracking-wide">How to Prepare</th>
                  </tr>
                </thead>
                <tbody>
                  {section.content.rounds.map((round, idx) => (
                    <tr 
                      key={idx} 
                      className={`border-t border-white/10 ${idx % 2 === 0 ? 'bg-white/5' : 'bg-white/3'}`}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">{idx + 1}</span>
                          </div>
                          <span className="text-white font-semibold">{round.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-white/80 text-sm">{round.purpose}</td>
                      <td className="p-4 text-white/80 text-sm">{round.format}</td>
                      <td className="p-4 text-white/80 text-sm">{round.preparation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* STAR Method */}
            <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-xl p-6">
              <h4 className="text-xl font-bold text-blue-400 mb-4 bebas-neue tracking-wide">
                STAR Method for Behavioral Rounds
              </h4>
              <p className="text-white/70 mb-4">
                {section.content.starMethod.description}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {section.content.starMethod.components.map((component, idx) => {
                  const [letter, description] = component.split(": ");
                  return (
                    <div
                      key={idx}
                      className="p-4 bg-white/5 rounded-lg text-center"
                    >
                      <div className="text-3xl font-bold text-blue-400 mb-2">
                        {letter}
                      </div>
                      <p className="text-white/80 text-sm">{description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case "strategy":
        return (
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-4">
              <Icon className="w-12 h-12 md:w-8 md:h-8 text-blue-400 flex-shrink-0" />
              <h3 className="text-2xl md:text-3xl font-bold text-white bebas-neue tracking-wider">
                {section.content.subtitle}
              </h3>
            </div>
            <p className="text-white/70 text-lg leading-relaxed">
              {section.content.description}
            </p>

            {/* On-Campus Roadmap */}
            <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-xl p-6">
              <h4 className="text-2xl font-bold text-blue-400 mb-6 bebas-neue tracking-wide">
                On-Campus/Off-Campus Roadmap
              </h4>
              
              {/* Phase 1 */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <div>
                    <h5 className="text-xl font-bold text-white">PHASE 1 — Foundation Phase (4-6 Weeks)</h5>
                    <p className="text-white/70 text-sm">Goal: {section.content.phases[0].goal}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h6 className="text-blue-300 font-semibold mb-2">Daily Learning Plan</h6>
                    <ul className="space-y-1">
                      {section.content.phases[0].dailyPlan.map((item, idx) => (
                        <li key={idx} className="text-white/70 text-sm flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h6 className="text-blue-300 font-semibold mb-2">Project Work</h6>
                    <div className="text-white/70 text-sm space-y-1">
                      <p>{section.content.phases[0].projectWork.description}</p>
                      <p><span className="text-blue-300">Weekdays:</span> {section.content.phases[0].projectWork.weekdays}</p>
                      <p><span className="text-blue-300">Weekends:</span> {section.content.phases[0].projectWork.weekends}</p>
                      <p>{section.content.phases[0].projectWork.structure}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 p-3 bg-blue-500/10 rounded-lg">
                  <p className="text-white/80 text-sm italic">{section.content.phases[0].note}</p>
                </div>
                
                <div className="mt-4">
                  <p className="text-green-400 font-semibold">
                    Outcome of phase 1: {section.content.phases[0].outcome}
                  </p>
                </div>
              </div>
              
              {/* Phase 2 */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <div>
                    <h5 className="text-xl font-bold text-white">PHASE 2 — Strengthening Phase (8 Weeks)</h5>
                    <p className="text-white/70 text-sm">Goal: {section.content.phases[1].goal}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h6 className="text-blue-300 font-semibold mb-2">Activities</h6>
                    <ul className="space-y-1">
                      {section.content.phases[1].dailyPlan.map((item, idx) => (
                        <li key={idx} className="text-white/70 text-sm flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h6 className="text-blue-300 font-semibold mb-2">DSA Focus</h6>
                    <p className="text-white/70 text-sm">{section.content.phases[1].dsaFocus}</p>
                    <p className="text-white/70 text-sm mt-2">{section.content.phases[1].projectNote}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-green-400 font-semibold">
                    Outcome: {section.content.phases[1].outcome}
                  </p>
                </div>
              </div>
              
              {/* Phase 3 */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <div>
                    <h5 className="text-xl font-bold text-white">PHASE 3 — Revision + Interview Phase (3-4 Weeks)</h5>
                    <p className="text-white/70 text-sm">Goal: {section.content.phases[2].goal}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h6 className="text-blue-300 font-semibold mb-2">Activities</h6>
                    <ul className="space-y-1">
                      {section.content.phases[2].activities.map((item, idx) => (
                        <li key={idx} className="text-white/70 text-sm flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h6 className="text-blue-300 font-semibold mb-2">Projects for Interviews</h6>
                    <p className="text-white/70 text-sm">You have 2 options:</p>
                    <ul className="space-y-1 mt-1">
                      {section.content.phases[2].projectOptions.map((option, idx) => (
                        <li key={idx} className="text-white/70 text-sm flex items-start gap-2">
                          <ChevronRight className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                          {option}
                        </li>
                      ))}
                    </ul>
                    <p className="text-white/70 text-sm mt-2">
                      <span className="text-blue-300">Recommendation:</span> {section.content.phases[2].recommendation}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-green-400 font-semibold">
                    Outcome: {section.content.phases[2].outcome}
                  </p>
                </div>
              </div>
            </div>

            {/* Off-Campus Strategy */}
            <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-xl p-6">
              <h4 className="text-2xl font-bold text-blue-400 mb-6 bebas-neue tracking-wide">
                {section.content.offCampusStrategy.title}
              </h4>
              <p className="text-white/70 text-lg mb-6">
                <span className="text-blue-300 font-semibold">Goal:</span> {section.content.offCampusStrategy.goal}
              </p>
              
              {section.content.offCampusStrategy.steps.map((category, catIdx) => (
                <div key={catIdx} className="mb-6">
                  <h5 className="text-xl font-bold text-blue-300 mb-4">
                    {category.category}
                  </h5>
                  <div className="space-y-4">
                    {category.steps.map((step, stepIdx) => (
                      <div key={stepIdx} className="p-4 bg-white/5 rounded-lg">
                        <h6 className="text-lg font-bold text-white mb-2">{step.step}</h6>
                        <ul className="space-y-1">
                          {step.details.map((detail, detailIdx) => (
                            <li key={detailIdx} className="text-white/70 text-sm flex items-start gap-2">
                              <ChevronRight className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                        {step.note && (
                          <p className="text-white/50 text-xs mt-2 italic">{step.note}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Download Resources */}
            
          </div>
        );

      case "mindset":
        return (
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-4">
              <Icon className="w-12 h-12 md:w-8 md:h-8 text-blue-400 flex-shrink-0" />
              <h3 className="text-2xl md:text-3xl font-bold text-white bebas-neue tracking-wider">
                {section.content.subtitle}
              </h3>
            </div>
            <p className="text-white/70 text-lg leading-relaxed">
              {section.content.description}
            </p>

            {/* Key Points Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.content.keyPoints.map((point, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-xl p-5"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                      <span className="text-white font-bold">{idx + 1}</span>
                    </div>
                    <h4 className="text-lg font-bold text-white">
                      {point.point}
                    </h4>
                  </div>
                  <p className="text-white/70 text-sm">{point.description}</p>
                </div>
              ))}
            </div>

            {/* Final Note */}
            <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="w-6 h-6 text-blue-400" />
                <h5 className="text-white font-bold">Final Note</h5>
              </div>
              <p className="text-white/80">{section.content.finalNote}</p>
            </div>
          </div>
        );

      case "tracking":
        return (
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-4">
              <Icon className="w-12 h-12 md:w-8 md:h-8 text-blue-400 flex-shrink-0" />
              <h3 className="text-2xl md:text-3xl font-bold text-white bebas-neue tracking-wider">
                {section.content.subtitle}
              </h3>
            </div>
            <p className="text-white/70 text-lg leading-relaxed">
              {section.content.description}
            </p>

            {/* Tracking Methods */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {section.content.trackingMethods.map((method, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-xl p-5"
                >
                  <h4 className="text-xl font-bold text-blue-400 mb-3 bebas-neue tracking-wide">
                    {method.method}
                  </h4>
                  <p className="text-white/70 text-sm mb-4">
                    {method.description}
                  </p>

                  {method.metrics && (
                    <div className="space-y-2">
                      <h5 className="text-white font-semibold text-sm">
                        Metrics to Track:
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {method.metrics.map((metric, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-white/5 text-white/70 text-xs rounded"
                          >
                            {metric}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {method.structure && (
                    <div className="mt-3 space-y-2">
                      <h5 className="text-white font-semibold text-sm">
                        Structure:
                      </h5>
                      <ul className="space-y-1">
                        {method.structure.map((item, i) => (
                          <li
                            key={i}
                            className="text-white/70 text-sm flex items-start gap-2"
                          >
                            <ChevronRight className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                      {method.example && (
                        <p className="text-white/50 text-xs mt-1 italic">
                          Example: {method.example}
                        </p>
                      )}
                    </div>
                  )}

                  {method.categories && (
                    <div className="mt-3">
                      <h5 className="text-white font-semibold text-sm mb-2">
                        Categories:
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {method.categories.map((category, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {method.reflectionPoints && (
                    <div className="mt-3 space-y-1">
                      <h5 className="text-white font-semibold text-sm">
                        Reflection Points:
                      </h5>
                      <ul className="space-y-1">
                        {method.reflectionPoints.map((point, i) => (
                          <li
                            key={i}
                            className="text-white/70 text-sm flex items-start gap-2"
                          >
                            <ChevronRight className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                            {point}
                          </li>
                        ))}
                      </ul>
                      {method.tip && (
                        <p className="text-white/50 text-xs mt-1 italic">
                          Tip: {method.tip}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mentor Tip */}
            <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Award className="w-6 h-6 text-blue-400" />
                <h5 className="text-white font-bold">Mentor Tip</h5>
              </div>
              <p className="text-white/80">{section.content.mentorTip}</p>
            </div>
          </div>
        );

      default:
        return null
    }
  }

  const currentSectionIndex = navigationItems.findIndex(item => item.id === activeSection)
  const isFirstSection = currentSectionIndex === 0
  const isLastSection = currentSectionIndex === navigationItems.length - 1

  return (
    <div className="w-full">
      <AnimatedTitle
        title="Placement Playbook"
        containerClass="text-center !text-white !mb-0"
      />

      {/* Disclaimer Banner */}
      <div className="max-w-4xl mx-auto mb-16">
        <div className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border-l-4 border-blue-500 rounded-r-lg p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-blue-300 mb-2 flex items-center gap-2">
                Comprehensive CSE Placement Guide
              </h3>
              <p className="text-white/80 leading-relaxed mb-3">
                This guide is written for <span className="text-blue-300 font-semibold">Computer Science & allied branches (CSE, IT, CS-AI, CS-DS, SE)</span>. If you're from the CSE cluster, this is your playbook — not a checklist, but a mentor standing beside you, showing exactly what to practise, when and why. The resources, strategies and insights shared here are carefully curated from the real placement journeys of our seniors and alumni who are currently placed in reputed companies. Their experiences, mistakes and learnings have been distilled to help you navigate placements with clarity and confidence.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Scrollable Navigation */}
        <div className="mb-12">
          <div
            ref={navScrollRef}
            className="flex overflow-x-auto pb-6 gap-2 px-2 custom-scrollbar"
          >
            {navigationItems.map((item) => {
              const NavIcon = item.icon
              return (
                <button
                  key={item.id}
                  data-nav={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-full font-semibold transition-all duration-300 bebas-neue tracking-wider whitespace-nowrap ${activeSection === item.id
                      ? "bg-blue-500/20 text-blue-400 border-2 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                      : "bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20"
                    }`}
                >
                  <NavIcon className="w-4 h-4" />
                  {item.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Main Content Container */}
        <div className="relative">
          {/* Horizontal Scroll Container */}
          <div
            ref={scrollRef}
            className="flex snap-x snap-mandatory overflow-x-auto placement-scroll"
            style={{
              scrollBehavior: 'smooth',
              scrollSnapType: 'x mandatory'
            }}
          >
            {navigationItems.map((item) => (
              <div
                key={item.id}
                ref={(el) => (sectionRefs.current[item.id] = el)}
                data-section={item.id}
                className="min-w-full snap-start bg-gradient-to-br from-blue-900/10 to-cyan-900/10 border border-white/10 rounded-2xl p-6 md:p-8 min-h-[600px] scroll-mt-4"
              >
                {activeSection === item.id && renderContent()}
              </div>
            ))}
          </div>

          {/* Section Indicator */}
          <div className="flex justify-center items-center gap-2 mt-8">
            <span className="text-white/60 text-sm">
              Section {currentSectionIndex + 1} of {navigationItems.length}
            </span>
            <div className="flex gap-1">
              {navigationItems.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleNavClick(navigationItems[idx].id)}
                  className={`w-2 h-2 rounded-full transition-all ${idx === currentSectionIndex
                      ? 'w-6 bg-gradient-to-r from-blue-500 to-cyan-500'
                      : 'bg-white/30 hover:bg-white/50'
                    }`}
                  aria-label={`Go to section ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center p-8 bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-2xl">
          <div className="flex items-center justify-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-yellow-400" />
            <p className="text-white/80 text-lg font-semibold">Important Reminder</p>
          </div>
          <p className="text-white/70 text-lg leading-relaxed max-w-3xl mx-auto">
            This playbook transforms the bridge between academic knowledge and placement success into a highway.
            <span className="text-blue-300 font-semibold"> Remember — your DSA language and development tech stack don't have to be the same . </span>
            Stay flexible while keeping your preparation strong. Choose the language you're most comfortable with for DSA,
            and later pick tech stacks based on what you want to build.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <span className="px-4 py-2 bg-white/5 text-white/70 text-sm rounded-full border border-white/10">
              For CSE Cluster Students
            </span>
            <span className="px-4 py-2 bg-white/5 text-white/70 text-sm rounded-full border border-white/10">
              Based on Real Placement Experiences
            </span>
            <span className="px-4 py-2 bg-white/5 text-white/70 text-sm rounded-full border border-white/10">
              Complete Guide for On/Off Campus
            </span>
          </div>

          {/* Keyboard Shortcut Hint */}
          <div className="mt-6 flex items-center justify-center gap-2 text-white/50 text-sm">
            <span></span>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar CSS */}
      <style jsx>{`
        .placement-scroll::-webkit-scrollbar {
          display: none;
        }
        .placement-scroll {
          -ms-overflow-style: none;
          scrollbar-width: none;
          display: flex;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scroll-behavior: smooth;
        }
        .min-w-full {
          height: fit-content;
          min-height: 600px;
        }
        .custom-scrollbar {
          overflow-x: auto;
          scrollbar-width: thin;
          scrollbar-color: rgba(59,130,246,0.8) transparent;
        }
      `}</style>
    </div>
  )
}
import { useState } from "react"
import {
  FileText, ExternalLink, Globe, ChevronRight, Target, BookOpen, Sparkles,
  Award, Zap, Brain, Book, Briefcase, TrendingUp, Code, Cpu, Database, Calendar,
  CheckCircle, AlertCircle, Users, BarChart, Cloud, Smartphone, Cog,
  Gamepad2, Network, GitBranch, Eye, MessageSquare, Filter, Clock, Star,
  Trophy, Search, Download, RefreshCw, Edit, Settings, FileCode, Layout,
  Monitor, Server, Terminal, Type, Calculator, User, ChevronLeft, ChevronRight as ChevronRightIcon
} from 'lucide-react';
import { useRef, useEffect } from "react";
import AnimatedTitle from "./AnimatedTitle";

export function PlacementGuideSection() {
  const [activeSection, setActiveSection] = useState("overview")
  const [expandedProjects, setExpandedProjects] = useState([]) // Changed to array for multiple expanded projects
  const scrollRef = useRef(null)
  const sectionRefs = useRef({})
  const navScrollRef = useRef(null)

  // Handle multiple project expansion
  const handleProjectClick = (projectId) => {
    setExpandedProjects(prev =>
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    )
  }

  // Scroll handler for navigation buttons
  const handleNavClick = (sectionId) => {
    setActiveSection(sectionId);
    const container = scrollRef.current;
    const section = sectionRefs.current[sectionId];

    if (container && section) {
      // ONLY Horizontal Scroll to section
      container.scrollTo({
        left: section.offsetLeft,
        behavior: 'smooth'
      });

      // Vertical Reset logic has been removed from here
    }
  };

  // Navigate to previous section
  const handlePrevClick = () => {
    const currentIndex = navigationItems.findIndex(item => item.id === activeSection)
    if (currentIndex > 0) {
      const prevSection = navigationItems[currentIndex - 1].id
      handleNavClick(prevSection)
    }
  }

  // Navigate to next section
  const handleNextClick = () => {
    const currentIndex = navigationItems.findIndex(item => item.id === activeSection)
    if (currentIndex < navigationItems.length - 1) {
      const nextSection = navigationItems[currentIndex + 1].id
      handleNavClick(nextSection)
    }
  }

  // Handle keyboard navigation
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

            // Update navigation scroll position
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
        description: "",
        highlights: [
          {
            title: "On-Campus Placements",
            description: "Companies visit your campus - convenient, high-volume, time-bound sprint"
          },
          {
            title: "Off-Campus Placements",
            description: "Apply directly via portals/referrals - continuous, competitive, targets product firms"
          },
          {
            title: "Pool Placements",
            description: "Multiple colleges participate - mixes scale with competition"
          },
          {
            title: "For CSE Cluster",
            description: "Bridge between academic projects and real engineering impact"
          }
        ],
        pillars: [
          "Aptitude Skills - think fast, reason clearly, handle numbers",
          "Coding Ability - structured problem-solving, not just syntax",
          "CS Fundamentals - foundation every CS engineer must carry",
          "Projects & Resume - proof you can build, not just read",
          "Placement Process - understanding each round thoroughly",
          "Strategies - on-campus vs off-campus approaches",
          "Progress Tracking - measure and improve consistently"
        ]
      },
    },
    aptitude: {
      title: "Aptitude Skills",
      icon: Brain,
      content: {
        subtitle: "Mental Warm-up Before The Coding Marathon",
        description: "Aptitude is the first filter for most companies, especially TCS, Infosys, Wipro, Capgemini, Accenture, and even product-based companies like Amazon, Wells Fargo, and JP Morgan in their initial rounds. It's about being sharp under pressure — not just 'math smart'.",
        topics: [
          {
            category: "Quantitative Aptitude",
            icon: Calculator,
            items: [
              "Number Systems, LCM & HCF, Divisibility Rules",
              "Percentages, Ratios & Proportions, Averages",
              "Profit & Loss, Simple & Compound Interest",
              "Time & Work, Time Speed & Distance",
              "Mixtures & Alligations",
              "Permutation & Combination, Probability",
              "Algebra (Linear & Quadratic Equations)",
              "Progressions (AP/GP), Mensuration (2D & 3D)"
            ],
          },
          {
            category: "Logical Reasoning & DI",
            icon: Filter,
            items: [
              "Puzzles & Seating Arrangements",
              "Patterns, Series, Blood Relations, Directions",
              "Graph/Data Interpretation (bar/line graphs, pie charts)",
              "Caselets, Table-Based Questions",
              "Coding-Decoding, Analogies",
              "Odd One Out, Syllogisms"
            ],
          },
          {
            category: "Verbal Ability",
            icon: Type,
            items: [
              "Reading Comprehension",
              "Sentence Correction & Para Jumbles",
              "Vocabulary (Synonyms/Antonyms)",
              "Fill in the Blanks"
            ],
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
        description: "Coding isn't about syntax — it's about structured thinking. Companies test your ability to understand problems, build optimal approaches, and implement clean code.",
        languages: [
          {
            name: "Python",
            badge: "Smart All-Rounder",
            use: "AI/ML, Data Science, Automation, Fast Prototyping",
            details: [
              "AI/ML/Deep Learning (TensorFlow, PyTorch)",
              "Data Science & Analytics",
              "Automation & Scripting",
              "Cybersecurity tools & pentesting",
              "Backend (limited - Django/FastAPI)",
              "Interview coding rounds (easy & fast)"
            ],
            placement: {
              friendly: "Amazing for coding interviews",
              bestFor: "AI/ML jobs, quick learning",
              notFor: "Large enterprise backend systems"
            }
          },
          {
            name: "Java",
            badge: "Most Practical",
            use: "Dev + Backend + Enterprise",
            details: [
              "Backend Development (Spring Boot dominates)",
              "Android App Development",
              "Enterprise-level applications",
              "Microservices architecture",
              "Big Data (Hadoop, Kafka, Spark)"
            ],
            placement: {
              friendly: "Excellent for DSA + Development",
              bestFor: "Service & product companies prefer Java",
              advantage: "Easier to get dev internships"
            }
          },
          {
            name: "C++",
            badge: "Performance King",
            use: "Systems + CP + High-speed Apps",
            details: [
              "Operating Systems, Compilers",
              "Game Development (Unreal Engine)",
              "High-frequency trading systems",
              "Embedded systems, Competitive programming",
              "CPUs, GPUs, robotics software"
            ],
            placement: {
              friendly: "Excellent for DSA, Fast execution",
              bestFor: "Competitive programming",
              notFor: "Web/backend application development"
            }
          },
          {
            name: "JavaScript",
            badge: "Web Frontend",
            use: "Frontend + Full Stack",
            details: [
              "Frontend development (React, Angular, Vue)",
              "Full-stack with Node.js",
              "Real-time applications",
              "Progressive Web Apps"
            ],
            placement: {
              friendly: "Great for web roles",
              bestFor: "Frontend and full-stack positions",
              advantage: "Huge ecosystem"
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
            name: "2. Approach Building",
            icon: Cog,
            points: [
              "Patterns (two pointers, sliding window, hashing, DP, recursion)",
              "Edge cases analysis",
              "Trade-off between time vs space",
              "How to simplify a problem before optimizing"
            ],
            tip: "Great coders don't jump to code — they first decide how to solve it."
          },
          {
            name: "3. Clean Code Implementation",
            icon: CheckCircle,
            points: [
              "Readable and modular code",
              "Functions > long code",
              "Works on edge cases",
              "Thorough testing"
            ],
            tip: "Clean code passes tests. Messy code fails silently."
          }
        ],
        roadmap: [
          "Variables, Loops, Functions",
          "Time & Space Complexity",
          "Arrays & Strings",
          "Two Pointers & Sliding Window",
          "Recursion & Backtracking",
          "Linked List, Stacks, Queues",
          "Hashing & Binary Search Trees",
          "Trees, Binary Trees, Heaps",
          "Graphs (DFS, BFS)",
          "Dynamic Programming (basics)",
          "Greedy Algorithms",
          "Bit Manipulation",
          "Sorting & Searching"
        ],
        practicePlatforms: [
          { name: "Strivers DSA A-Z sheet", tag: "Must Do", icon: Trophy },
          { name: "LeetCode", tag: "Most Problems", icon: Code },
          { name: "NeetCode.io", tag: "Structured", icon: Layout },
          { name: "GeeksForGeeks", tag: "Explanations", icon: FileText },
          { name: "CodeChef", tag: "Contests", icon: Users },
          { name: "HackerRank", tag: "Beginners", icon: Star }
        ],
        youtube: [
          { name: "Take U Forward", focus: "DSA" },
          { name: "Kunal Kushwaha", focus: "DSA + Dev" },
          { name: "Harkirat Singh", focus: "Web Dev" }
        ]
      },
    },
    sql: {
      title: "SQL & Databases",
      icon: Database,
      content: {
        subtitle: "Database Skills Every Developer Needs",
        description: "SQL is crucial for backend roles and data-related positions. Mastering database concepts shows you understand data persistence and management.",
        coreConcepts: [
          {
            category: "Basic Queries",
            items: ["SELECT, FROM, WHERE", "ORDER BY, GROUP BY, HAVING"]
          },
          {
            category: "Filtering",
            items: ["LIKE, IN, BETWEEN", "IS NULL, IS NOT NULL"]
          },
          {
            category: "Joins",
            items: [
              "INNER JOIN – common records",
              "LEFT JOIN – all left + matched right",
              "RIGHT JOIN – all right + matched left",
              "FULL OUTER JOIN – all records"
            ]
          },
          {
            category: "Advanced Concepts",
            items: [
              "Subqueries (nested queries)",
              "Aggregate Functions (COUNT, SUM, AVG, MIN, MAX)",
              "Set Operations (UNION, UNION ALL, INTERSECT, EXCEPT)",
              "Window Functions (ROW_NUMBER, RANK, DENSE_RANK, NTILE)",
              "CTEs (Common Table Expressions)",
              "Indexes, Normalization (1NF-3NF, BCNF)",
              "Transactions & ACID Properties",
              "Triggers & Stored Procedures",
              "Views, Query Optimization"
            ]
          }
        ],
        practicePlatforms: [
          { name: "HackerRank SQL", tag: "Practice", url: "#" },
          { name: "LeetCode Database", tag: "Advanced", url: "#" },
          { name: "GeeksforGeeks SQL", tag: "Concepts", url: "#" }
        ]
      }
    },
    fundamentals: {
      title: "CS Fundamentals",
      icon: Cpu,
      content: {
        subtitle: "The Backbone of Every Technical Interview",
        description: "Strong theory isn't enough — you must answer interview questions confidently. These core subjects are tested across all companies.",
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
              "Scheduling Algorithms: FCFS, SJF, Priority (preemptive/non-preemptive), Round Robin",
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
              "Transactions & ACID properties",
              "Indexing & Keys: Primary, Foreign, Composite, Unique",
              "Query optimization techniques"
            ],
            resource: "https://www.geeksforgeeks.org/dbms/dbms/"
          },
          {
            name: "Object-Oriented Programming",
            icon: Cog,
            topics: [
              "4 Pillars: Encapsulation, Abstraction, Inheritance, Polymorphism",
              "Classes & Objects, Constructors & Destructors",
              "Access Modifiers, Static members",
              "Interfaces & Abstract classes",
              "Exception Handling, Design Patterns basics"
            ]
          },
          {
            name: "Additional Subjects",
            icon: BookOpen,
            topics: [
              "Cloud Computing Fundamentals",
              "System Design (Low-level & High-level)",
              "Microservices Architecture",
              "Distributed Systems basics"
            ]
          }
        ],
        interviewPractice: [
          {
            platform: "InterviewBit",
            description: "Excellent subject-wise questions, from easy to hard. Includes useful cheatsheets.",
            url: "https://www.interviewbit.com/technical-interview-questions/#mcqs"
          },
          {
            platform: "PrepInsta",
            description: "Technical interview questions preparation",
            url: "https://prepinsta.com/interview-preparation/technical-interview-questions"
          },
          {
            platform: "GeeksforGeeks",
            description: "Comprehensive tutorials and practice problems",
            url: "https://www.geeksforgeeks.org"
          }
        ]

      },
    },
    projects: {
      title: "Projects",
      icon: Briefcase,
      content: {
        subtitle: "What Makes You Stand Out",
        description: "Projects are what make you stand out. Everyone can learn theory and solve DSA problems, but projects are unique per individual. A strong project can contribute 3/4 of your interview discussions in some companies.",
        principles: [
          {
            title: "Quality over Quantity",
            description: "2-3 strong projects (max 2 major + 1 mini) are better than 5 weak ones"
          },
          {
            title: "Explain Everything",
            description: "Know architecture, tech choices, challenges, and future scope for every project"
          },
          {
            title: "GitHub Best Practices",
            description: "Clean repos with frequent commits, proper README, and documentation"
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
              frontend: ["HTML", "CSS", "JavaScript", "React.js (preferred)", "Angular", "Vue.js"],
              backend: ["Node.js + Express", "Spring Boot (Java)", "Python (FastAPI, Django, Flask)", "Ruby on Rails"],
              database: ["MongoDB (NoSQL)", "PostgreSQL (SQL)", "MySQL", "Redis", "Neo4j"],
              deployment: ["AWS", "Heroku", "Vercel", "Netlify", "Docker"]
            },
            keySkills: [
              "RESTful APIs development",
              "Database integration (SQL + NoSQL)",
              "Authentication (JWT, OAuth)",
              "State management",
              "Responsive design",
              "Deployment & CI/CD"
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
              "Recommendation system for web/mobile app",
              "Chatbot using NLP (BERT, GPT)",
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
            whyImportant: "Shows understanding of modern deployment practices. Important for DevOps/SRE roles. Give least preference unless targeting DevOps roles."
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
              "E-commerce mobile app",
              "Social media app"
            ],
            whyImportant: "Demonstrates full-stack mobile development skills. Shows understanding of mobile-specific challenges and user experience."
          },
          {
            id: "open-source",
            title: "Open-Source Contribution",
            subtitle: "Not exactly a project, but valuable experience",
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
          "Maintain clean GitHub repo with frequent commits, proper README, and comments",
          "Prepare to justify all tech choices — interviewers care about reasoning",
          "Document architecture, challenges, and learnings for interview revision",
          "Remember: 2-3 good projects are enough to ace interviews"
        ],
        interviewPreparation: [
          {
            aspect: "Project Story",
            description: "2-minute explanation covering: Problem → Why you built it → Tech stack → Features → Results"
          },
          {
            aspect: "Architecture & Workflow",
            description: "Be ready to explain system architecture, data flow, database schema, and design choices"
          },
          {
            aspect: "Tech Stack Deep Dive",
            description: "Know why you used each technology and alternatives you considered"
          },
          {
            aspect: "Feature-by-Feature",
            description: "For each major feature: What it does, how implemented, logic, complexity, challenges"
          },
          {
            aspect: "DSA Connection",
            description: "Be prepared to link project features to DSA concepts and optimizations"
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
          "Make it ATS friendly, try to maintain ATS score of 60-70% & above",
          "Clean, structured resume with strong projects wins interviews"
        ],
        atsExplanation: {
          title: "What is an ATS Score?",
          points: [
            "ATS (Applicant Tracking System) score shows how well your resume matches a job description",
            "Companies use ATS software to filter resumes automatically before human review",
            "Higher ATS score means your resume is more relevant and optimized",
            "Score depends on keyword matching, clean formatting, no fancy designs/images",
            "Use standard section titles: Education, Skills, Work Experience, Projects"
          ],
          checkWebsites: ["jobscan.co", "enhancv.com", "novoresume.com"]
        },
        templatePlatforms:
          [
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
            content: "2-4 strongest with title, tech stack, git repo link, deployed link",
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
        mentorTip: "Don't overcomplicate — use templates and focus on content. Your projects and their clear explanation matter most."
      }
    },
    process: {
      title: "Placement Process",
      icon: Target,
      content: {
        subtitle: "Complete Placement Journey Overview",
        description: "Understanding each round helps you prepare effectively. Use the STAR method (Situation, Task, Action, Result) for behavioral rounds.",
        rounds: [
          {
            name: "Pre-Placement Talk / Company Info Session",
            purpose: "Explain company, role, package, selection flow, expectations",
            format: "Online/offline presentations, eligibility check",
            preparation: "Listen carefully, note emphasized skills, tailor resume",
            variation: "Some companies conduct detailed sessions, others keep it short"
          },
          {
            name: "Aptitude / Online Assessment",
            purpose: "Tests Quant, Logical Reasoning, Verbal Ability, basic CS",
            format: "MCQs, time-bound (60-90 min)",
            preparation: "Practice aptitude, improve speed + accuracy",
            variation: "Some merge aptitude with coding test"
          },
          {
            name: "Coding / Technical Test",
            purpose: "Evaluates coding skills, logic building, problem-solving",
            format: "1-3 coding questions, debugging tasks, online IDE",
            preparation: "Practice DSA, write clean code, do timed contests",
            variation: "Most important filter for SDE roles"
          },
          {
            name: "Group Discussion",
            purpose: "Tests communication, clarity, reasoning, teamwork",
            format: "Group discussion on topic/case study",
            preparation: "Practice GD topics, structure points clearly",
            variation: "Mostly in service-based, consulting companies"
          },
          {
            name: "Technical Interview",
            purpose: "Tests DSA, OOP, DBMS, OS, CN, project knowledge",
            format: "Coding on IDE/whiteboard, core CS questions, project deep-dive",
            preparation: "Review core subjects, understand projects end-to-end",
            variation: "1-3 rounds depending on role"
          },
          {
            name: "Managerial / Techno-Managerial Round",
            purpose: "Tests real-world thinking, ownership, decision-making",
            format: "Stress questions, scenario questions, project drilling",
            preparation: "Stay calm, justify decisions logically",
            variation: "Bigger companies almost always include it"
          },
          {
            name: "HR / Behavioral Interview",
            purpose: "Tests personality, culture fit, communication, goals",
            format: "Strengths/weaknesses, why company, teamwork stories",
            preparation: "Prepare HR answers, research company",
            variation: "Some combine with managerial round"
          },
          {
            name: "Best Fit / Culture Fit Round",
            purpose: "Tests match with team's working style, values, attitude",
            format: "Informal discussion with manager/lead",
            preparation: "Be honest, show positivity, teamwork examples",
            variation: "Product companies often keep as separate final round"
          },
          {
            name: "Offer + Onboarding",
            purpose: "Final confirmation of role, package, joining",
            format: "Offer letter, document submission, orientation",
            preparation: "Submit documents on time, clarify doubts politely",
            variation: "Timing varies by company"
          }
        ],
        starMethod: {
          description: "Use this during HR, Best-Fit, and Managerial rounds:",
          components: [
            "S – Situation: Describe the context in 1 line",
            "T – Task: State your responsibility or goal in 1 line",
            "A – Action: Explain what you specifically did in 1-2 lines",
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
            name: "Phase 1 — Foundation (4-6 Weeks)",
            goal: "Build strong fundamentals + consistent routine",
            dailyPlan: [
              "Start basic DSA → focus on understanding concepts deeply",
              "Practice 2 easy DSA problems/day & 3 SQL queries/day",
              "Theory subjects reading → OS, DBMS, CN, OOPS",
              "Aptitude → 30 mins every day (consistency matters)"
            ],
            projectWork: {
              start: "One major project",
              weekdays: "1 hr/day",
              weekends: "3-4 hrs only on project",
              structure: "Define objectives, create weekly deadlines, maintain documentation"
            },
            outcome: "Solid fundamentals + first structured project ready"
          },
          {
            name: "Phase 2 — Strengthening (8 Weeks)",
            goal: "Level up problem-solving + reinforce theory + add second project",
            activities: [
              "Re-read theory subjects (OS, DBMS, CN, OOPs)",
              "Continue 30 mins aptitude daily",
              "Start medium-hard DSA problems with multiple approaches",
              "Practice SQL queries + revisit after 15 days",
              "Start another mini-project for diversity",
              "Participate in coding contests every 10 days"
            ],
            dsaFocus: "Multiple approaches for same question are toughest part of DSA in interviews",
            outcome: "Improved confidence, intermediate DSA skills, two projects, stronger conceptual clarity"
          },
          {
            name: "Phase 3 — Revision + Interview (3-4 Weeks)",
            goal: "Transition from preparation → interview-ready candidate",
            activities: [
              "Solve full-length mock tests with time limits",
              "Revise theory and interview questions",
              "Attend technical mock interviews",
              "Prepare for HR, Managerial, Best Fit rounds",
              "Use STAR format for behavioral answers"
            ],
            projectOptions: [
              "Build one more project and revise all 3 later",
              "Use existing project documentation to prepare"
            ],
            recommendation: "Having another project is highly recommended to stand out",
            outcome: "Fully interview-ready with clarity, speed, confidence, and strong project knowledge"
          }
        ],
        offCampusStrategy: {
          title: "Off-Campus Strategy — Roadmap to Get Interviews Faster",
          goal: "Build credibility → Increase visibility → Unlock interview calls → Crack offers",
          steps: [
            {
              step: "1. Optimize Your LinkedIn Profile",
              actions: [
                "Use clear headline: 'Software Developer | Java | React | AWS | DSA'",
                "Add 2-3 strong projects with GitHub links",
                "Stay active — recruiters check profile activity"
              ]
            },
            {
              step: "2. Strengthen Your LeetCode/GFG Profile",
              actions: [
                "Maintain 20-40 day streak for visibility",
                "Add LeetCode/GFG link to LinkedIn + Resume"
              ]
            },
            {
              step: "3. Build Portfolio Website",
              actions: [
                "Show projects, tech stack, achievements",
                "Helps recruiters evaluate in 30 seconds"
              ]
            },
            {
              step: "4. Apply Through All Key Portals Daily",
              actions: [
                "LinkedIn Jobs, Naukri, Indeed, AngelList",
                "Company Careers Pages, Internshala"
              ]
            },
            {
              step: "5. Use Referral Power (10× Higher Chances)",
              actions: [
                "Networking > cold applying",
                "Send 3-line referral request: Who you are + Role + Resume link",
                "Aim for 5-10 referrals per week"
              ]
            },
            {
              step: "6. Open-Source Contributions",
              actions: [
                "Even 2-3 PRs in beginner repositories help",
                "Shows initiative and teamwork"
              ]
            },
            {
              step: "7. Build 1-2 Good Personal Projects",
              actions: [
                "AI, Web Dev, Cloud, or Full-Stack projects",
                "Preferably with backend + database + deployment"
              ]
            },
            {
              step: "8. Post Weekly LinkedIn Updates",
              actions: [
                "Project features added",
                "Concepts learned",
                "Coding milestones",
                "Open-source contributions"
              ]
            },
            {
              step: "9. Track All Applications",
              actions: [
                "Use spreadsheet or tools like Huntr",
                "Track: Job link, Company, Date applied, Status, Follow-up"
              ]
            },
            {
              step: "10. Prepare for ATS",
              actions: [
                "Use correct keywords",
                "Match resume with job description",
                "Clean formatting (no images/fancy designs)"
              ]
            }
          ]
        }
      }
    },
    mindset: {
      title: "Mindset & Attitude",
      icon: Brain,
      content: {
        subtitle: "Ultra-Short Guide to Success Mindset",
        description: "Technical skills are important, but your mindset during placements can make or break your success.",
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
            description: "Be curious, open to new concepts, willing to say 'I can learn this'"
          },
          {
            point: "4. Trust the Process",
            description: "Believe in your preparation, stay confident even when others get placed before you"
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
            description: "Track your prep, maintain notes, follow schedule, track applications"
          },
          {
            point: "8. Maintain Discipline",
            description: "During preparation AND interviews — how you think and structure answers matters most"
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
            description: "Customize based on your project type and domain",
            structure: [
              "Module – divide project into major components",
              "Tasks – list actionable items under each module",
              "Deadlines – assign realistic timelines",
              "Status – track progress from To Do → In Progress → Done"
            ]
          },
          {
            method: "Mistake Journal",
            description: "Revisiting mistakes every weekend prevents repetition and improves accuracy",
            categories: [
              "DSA mistakes – wrong approaches or overlooked edge cases",
              "SQL logic errors – query or syntax issues",
              "Aptitude mistakes – incorrect problem-solving steps",
              "Interview answers – points you could have explained better"
            ]
          },
          {
            method: "Monthly Review",
            description: "This practice resets your preparation direction and helps prevent burnout",
            reflectionPoints: [
              "What improved – identify your strengths and progress",
              "What slowed down – pinpoint areas where growth is lagging",
              "What needs focus next month – set clear priorities"
            ]
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
                {/* Mobile: Bigger Icon (w-10), Desktop: Original (w-8) */}
                <Icon className="w-10 h-10 md:w-8 md:h-8 text-blue-400 flex-shrink-0" />
                {/* Mobile: Adjusted text-xl, Desktop: Original text-2xl */}
                <h3 className="text-xl md:text-2xl font-bold text-white bebas-neue tracking-wider">{section.content.subtitle}</h3>
              </div>
              <p className="text-white/70 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
                {section.content.description}
              </p>
            </div>



            {/* Pillars Section - FIXED LAYOUT */}
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
              {/* MOBILE: w-12 (48px) | DESKTOP: w-8 (32px - Original) */}
              <Icon className="w-12 h-12 md:w-8 md:h-8 text-blue-400 flex-shrink-0" />
              {/* MOBILE: text-2xl | DESKTOP: text-3xl (Original) */}
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
                  <h4 className="text-lg font-bold text-white">
                    Daily Practice
                  </h4>
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
                      {topic.category}
                    </h4>
                  </div>
                  <ul className="space-y-2">
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
              {/* MOBILE: w-12 | DESKTOP: w-8 */}
              <Icon className="w-12 h-12 md:w-8 md:h-8 text-blue-400 flex-shrink-0" />
              {/* MOBILE: text-2xl | DESKTOP: text-3xl */}
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
                Choose Your Language
              </h4>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {section.content.languages.map((lang, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-gradient-to-br from-blue-900/20 to-cyan-900/20 rounded-lg border border-blue-500/20"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="text-white font-bold text-lg">
                        {lang.name}
                      </h5>
                      <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
                        {lang.badge}
                      </span>
                    </div>
                    <p className="text-white/70 text-sm mb-3">{lang.use}</p>
                    <ul className="space-y-1 mb-3">
                      {lang.details.slice(0, 3).map((detail, i) => (
                        <li
                          key={i}
                          className="text-white/60 text-xs flex items-start gap-1"
                        >
                          <ChevronRight className="w-3 h-3 text-blue-400 mt-0.5 flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                    <div className="text-xs text-white/50 border-t border-white/10 pt-2">
                      <div className="font-semibold text-blue-300">
                        Placement:
                      </div>
                      <div>{lang.placement.friendly}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                <p className="text-white/80 text-sm italic">
                  {section.content.finalNote}
                </p>
              </div>
            </div>

            {/* DSA Layers */}
            <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-xl p-6">
              <h4 className="text-xl font-bold text-blue-400 mb-6 bebas-neue tracking-wide">
                3 Layers of Coding Ability
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {section.content.dsaLayers.map((layer, idx) => (
                  <div key={idx} className="p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <layer.icon className="w-5 h-5 text-blue-400" />
                      <h5 className="text-white font-semibold">{layer.name}</h5>
                    </div>
                    <ul className="space-y-1 mb-3">
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
                    <div className="text-xs text-white/50 italic border-t border-white/10 pt-2">
                      {layer.tip}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DSA Roadmap - FIXED */}
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

            {/* Practice Platforms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h4 className="text-xl font-bold text-white mb-4 bebas-neue tracking-wide">
                  Practice Platforms
                </h4>
                <div className="space-y-3">
                  {section.content.practicePlatforms.map((platform, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-gradient-to-br from-blue-900/20 to-cyan-900/20 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <platform.icon className="w-5 h-5 text-blue-400" />
                        <span className="text-white font-semibold">
                          {platform.name}
                        </span>
                      </div>
                      <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">
                        {platform.tag}
                      </span>
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
                      className="p-3 bg-gradient-to-br from-blue-900/20 to-cyan-900/20 rounded-lg"
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
                        {channel.focus}
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
              {/* MOBILE: w-12 | DESKTOP: w-8 */}
              <Icon className="w-12 h-12 md:w-8 md:h-8 text-blue-400 flex-shrink-0" />
              {/* MOBILE: text-2xl | DESKTOP: text-3xl */}
              <h3 className="text-2xl md:text-3xl font-bold text-white bebas-neue tracking-wider">
                {section.content.subtitle}
              </h3>
            </div>
            <p className="text-white/70 text-lg leading-relaxed">
              {section.content.description}
            </p>

            {/* Core Concepts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.content.coreConcepts.map((concept, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-xl p-6"
                >
                  <h4 className="text-xl font-bold text-blue-400 mb-4 bebas-neue tracking-wide">
                    {concept.category}
                  </h4>
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
          </div>
        );

      case "fundamentals":
        return (
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-4">
              {/* MOBILE: w-12 | DESKTOP: w-8 */}
              <Icon className="w-12 h-12 md:w-8 md:h-8 text-blue-400 flex-shrink-0" />
              {/* MOBILE: text-2xl | DESKTOP: text-3xl */}
              <h3 className="text-2xl md:text-3xl font-bold text-white bebas-neue tracking-wider">
                {section.content.subtitle}
              </h3>
            </div>
            <p className="text-white/70 text-lg leading-relaxed">
              {section.content.description}
            </p>

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
          </div>
        );

      case "projects":
        return (
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-4">
              {/* MOBILE: w-12 | DESKTOP: w-8 */}
              <Icon className="w-12 h-12 md:w-8 md:h-8 text-blue-400 flex-shrink-0" />
              {/* MOBILE: text-2xl | DESKTOP: text-3xl */}
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

            {/* All Projects Grid - MULTIPLE EXPANSION ENABLED */}
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

                    {/* Expanded View Popup - Now shows for multiple projects */}
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
              {/* MOBILE: w-12 | DESKTOP: w-8 */}
              <Icon className="w-12 h-12 md:w-8 md:h-8 text-blue-400 flex-shrink-0" />
              {/* MOBILE: text-2xl | DESKTOP: text-3xl */}
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
                <p className="text-white/80 mb-2">Check ATS Score on:</p>
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
                Resume Templates
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                Resume Sections
              </h4>
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
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
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
              {/* MOBILE: w-12 | DESKTOP: w-8 */}
              <Icon className="w-12 h-12 md:w-8 md:h-8 text-blue-400 flex-shrink-0" />
              {/* MOBILE: text-2xl | DESKTOP: text-3xl */}
              <h3 className="text-2xl md:text-3xl font-bold text-white bebas-neue tracking-wider">
                {section.content.subtitle}
              </h3>
            </div>
            <p className="text-white/70 text-lg leading-relaxed">
              {section.content.description}
            </p>

            {/* Rounds Timeline */}
            <div className="space-y-4">
              {section.content.rounds.map((round, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-xl p-5"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                      <span className="text-white font-bold">{idx + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center justify-between mb-2">
                        <h4 className="text-lg font-bold text-blue-400 bebas-neue tracking-wide">
                          {round.name}
                        </h4>
                        <span className="text-xs px-2 py-1 bg-white/10 text-white/70 rounded">
                          Round {idx + 1}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <h5 className="text-white/90 text-sm font-semibold mb-1">
                            Purpose
                          </h5>
                          <p className="text-white/70 text-sm">
                            {round.purpose}
                          </p>
                        </div>
                        <div>
                          <h5 className="text-white/90 text-sm font-semibold mb-1">
                            Format
                          </h5>
                          <p className="text-white/70 text-sm">
                            {round.format}
                          </p>
                        </div>
                        <div>
                          <h5 className="text-white/90 text-sm font-semibold mb-1">
                            Preparation
                          </h5>
                          <p className="text-white/70 text-sm">
                            {round.preparation}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 p-3 bg-white/5 rounded-lg">
                        <span className="text-white/80 text-sm">
                          <span className="text-blue-400 font-semibold">
                            Note:
                          </span>{" "}
                          {round.variation}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
              {/* MOBILE: w-12 | DESKTOP: w-8 */}
              <Icon className="w-12 h-12 md:w-8 md:h-8 text-blue-400 flex-shrink-0" />
              {/* MOBILE: text-2xl | DESKTOP: text-3xl */}
              <h3 className="text-2xl md:text-3xl font-bold text-white bebas-neue tracking-wider">
                {section.content.subtitle}
              </h3>
            </div>
            <p className="text-white/70 text-lg leading-relaxed">
              {section.content.description}
            </p>

            {/* Strategy content would go here */}
            <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-xl p-6">
              <p className="text-white/70">Strategy content goes here...</p>
            </div>
          </div>
        );

      case "mindset":
        return (
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-4">
              {/* MOBILE: w-12 | DESKTOP: w-8 */}
              <Icon className="w-12 h-12 md:w-8 md:h-8 text-blue-400 flex-shrink-0" />
              {/* MOBILE: text-2xl | DESKTOP: text-3xl */}
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
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
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
              {/* MOBILE: w-12 | DESKTOP: w-8 */}
              <Icon className="w-12 h-12 md:w-8 md:h-8 text-blue-400 flex-shrink-0" />
              {/* MOBILE: text-2xl | DESKTOP: text-3xl */}
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
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mentor Tip */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
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

  // Get current section index for navigation buttons
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
        {/* Scrollable Navigation - WITH VISIBLE CUSTOM SCROLLBAR */}
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
          {/* Horizontal Scroll Container - NO VERTICAL SCROLLBAR */}
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

          </div>

          {/* Keyboard Shortcut Hint */}

        </div>
      </div>

      {/* Custom Scrollbar CSS */}
      <style jsx>{`
      /* Hide scrollbar for Chrome, Safari and Opera */
      .placement-scroll::-webkit-scrollbar {
        display: none;
      }

      /* Hide scrollbar for IE, Edge and Firefox */
      .placement-scroll {
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
        display: flex;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        scroll-behavior: smooth;
      }

      /* Ensure the content doesn't overflow vertically inside the horizontal container */
      .min-w-full {
        height: fit-content;
        min-height: 600px;
      }

      .custom-scrollbar {
        overflow-x: auto;
        scrollbar-width: thin;
        scrollbar-color: rgba(59,130,246,0.8) transparent;
      }
      
      /* Rest of your existing CSS... */
    `}</style>
    </div>
  )
}
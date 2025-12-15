import { useState } from "react"
import { 
  FileText, 
  ExternalLink, 
  Globe, 
  ChevronRight,
  Gift,
  Video,
  Target,
  BookOpen,
  Sparkles,
  Award,
  Zap,
  Brain,
  Briefcase,
  TrendingUp,
  Code,
  Cpu,
  Database
} from 'lucide-react'
import AnimatedTitle from "./AnimatedTitle"

export function PlacementGuideSection() {
  const [activeSection, setActiveSection] = useState("overview")

  const sections = {
    overview: {
      title: "Overview",
      icon: BookOpen,
      content: {
        subtitle: "Your Complete Placement Roadmap",
        description: "This guide is your mentor — showing exactly what to practice, when, and why. Whether you're targeting on-campus drives, applying off-campus, or competing in pool placements, this playbook covers every pillar of placement success.",
        highlights: [
          "Structured preparation timeline",
          "Topic-wise breakdown with resources",
          "Real interview patterns & strategies",
          "Build credibility & unlock opportunities",
        ],
      },
    },
    aptitude: {
      title: "Aptitude Skills",
      icon: Brain,
      content: {
        subtitle: "Mental Warm-up Before The Coding Marathon",
        description: "Aptitude is the first filter for most companies. It's about being sharp under pressure — not just 'math smart'. Master these core areas to ace initial screening rounds.",
        topics: [
          {
            category: "Quantitative Aptitude",
            items: [
              "Number Systems, LCM & HCF, Divisibility Rules",
              "Percentages, Ratios & Proportions, Averages",
              "Profit & Loss, Simple & Compound Interest",
              "Time & Work, Time Speed & Distance",
              "Permutation & Combination, Probability",
              "Algebra, Progressions, Mensuration",
            ],
          },
          {
            category: "Logical Reasoning & DI",
            items: [
              "Puzzles & Seating Arrangements",
              "Patterns, Series, Blood Relations",
              "Graph/Data Interpretation, Caselets",
              "Coding-Decoding, Analogies, Syllogisms",
            ],
          },
          {
            category: "Verbal Ability",
            items: [
              "Reading Comprehension",
              "Sentence Correction & Para Jumbles",
              "Vocabulary (Synonyms/Antonyms)",
              "Fill in the Blanks",
            ],
          },
        ],
        resources: [
          { name: "Books", value: "RS Aggarwal or Arun Sharma" },
          { name: "Practice", value: "Indiabix, PrepInsta" },
          { name: "YouTube", value: "Aptitude Baba" },
        ],
      },
    },
    coding: {
      title: "Coding & DSA",
      icon: Code,
      content: {
        subtitle: "Problem-Solving That Companies Actually Test",
        description: "Coding isn't about syntax — it's about structured thinking. Companies test your ability to understand problems, build optimal approaches, and implement clean code.",
        layers: [
          {
            name: "Problem Understanding",
            points: ["Identify input/output clearly", "Understand constraints", "Consider edge cases"],
          },
          {
            name: "Approach Building",
            points: [
              "Think in patterns (two pointers, sliding window, DP)",
              "Analyze time vs space trade-offs",
              "Simplify before optimizing",
            ],
          },
          {
            name: "Clean Implementation",
            points: ["Write readable, modular code", "Handle edge cases", "Test thoroughly"],
          },
        ],
        languages: [
          {
            name: "Python",
            badge: "AI + Fast Prototyping",
            use: "AI/ML, Data Science, Automation, Interview Coding",
          },
          {
            name: "Java",
            badge: "Most Practical",
            use: "Backend, Enterprise Apps, Android, Spring Boot",
          },
          {
            name: "C++",
            badge: "Performance King",
            use: "Systems, Competitive Programming, Game Dev",
          },
        ],
        roadmap: [
          "Variables, Loops, Functions",
          "Time & Space Complexity",
          "Arrays & Strings",
          "Two Pointers & Sliding Window",
          "Recursion & Backtracking",
          "Linked List, Stacks, Queues",
          "Hashing & Binary Search",
          "Trees & Graphs",
          "Dynamic Programming (basics)",
          "Greedy & Bit Manipulation",
        ],
        practice: ["Striver's A-Z DSA Sheet (must do)", "LeetCode", "NeetCode.io", "GeeksForGeeks", "CodeChef"],
      },
    },
    fundamentals: {
      title: "CS Fundamentals",
      icon: Target,
      content: {
        subtitle: "The Backbone of Every Technical Interview",
        description: "Strong theory isn't enough — you must answer interview questions confidently. These core subjects are tested across all companies.",
        subjects: [
          {
            name: "Computer Networks",
            topics: [
              "OSI Model (7 layers, protocols)",
              "TCP vs UDP (reliability vs speed)",
              "IP Addressing & Subnetting",
              "HTTP/HTTPS & Web Basics",
            ],
          },
          {
            name: "Operating Systems",
            topics: [
              "Processes & Threads",
              "Deadlocks (conditions, prevention)",
              "Scheduling Algorithms (FCFS, SJF, Round Robin)",
              "Memory Management (paging, segmentation)",
              "Semaphores & Synchronization",
            ],
          },
          {
            name: "DBMS",
            topics: [
              "SQL Queries (SELECT, JOIN, aggregate functions)",
              "Normalization & ER Diagrams",
              "Transactions & ACID properties",
              "Indexing & Keys",
              "Query Optimization",
            ],
          },
          {
            name: "OOP",
            topics: ["4 Pillars: Encapsulation, Abstraction, Inheritance, Polymorphism", "Real-world use cases"],
          },
        ],
        resources: [
          { platform: "InterviewBit", link: "Subject-wise questions + cheatsheets" },
          { platform: "PrepInsta", link: "Technical interview questions" },
          { platform: "GeeksforGeeks", link: "Comprehensive tutorials" },
        ],
      },
    },
    projects: {
      title: "Projects & Resume",
      icon: Briefcase,
      content: {
        subtitle: "What Makes You Stand Out",
        description: "Everyone learns theory and solves DSA. Projects prove you can build, not just read. Quality beats quantity — 2-3 strong projects are better than 5 weak ones.",
        principles: [
          "Know everything about your projects",
          "Explain architecture & tech choices",
          "Discuss challenges & learnings",
        ],
        recommendations: [
          {
            type: "Web Development (Must-Have)",
            tech: "Node.js/Spring Boot + React + MongoDB/PostgreSQL",
            why: "Every company expects web dev skills",
          },
          {
            type: "AI/ML Project (Must-Have)",
            tech: "Python + TensorFlow/PyTorch",
            why: "AI is trending, shows innovation",
          },
          {
            type: "Data Visualization",
            tech: "Matplotlib/Tableau/Power BI",
            why: "Analyze & present data visually",
          },
          {
            type: "Mobile App",
            tech: "Kotlin/Flutter + Firebase",
            why: "Full-stack mobile development",
          },
          {
            type: "DevOps/Cloud",
            tech: "Docker/Kubernetes + AWS/GCP",
            why: "Modern deployment practices",
          },
        ],
        resume: [
          "Keep it 1 page, clean, structured",
          "Use templates (Canva, FlowCV, Overleaf)",
          "ATS-friendly (60-70% score minimum)",
          "Sections: Header, Skills, Projects, Experience, Achievements",
        ],
      },
    },
    strategy: {
      title: "Placement Strategy",
      icon: TrendingUp,
      content: {
        subtitle: "On-Campus vs Off-Campus Approach",
        description: "Different placement types require different strategies. Understanding each approach helps maximize opportunities.",
        types: [
          {
            name: "On-Campus",
            info: "Companies visit your campus — high-volume, time-bound",
            strategy: "Sprint mentality, polish resume, first impressions matter",
          },
          {
            name: "Off-Campus",
            info: "Apply directly via portals/referrals",
            strategy: "Persistence, strong portfolio, networking & referrals win",
          },
          {
            name: "Pool Placements",
            info: "Multiple colleges compete together",
            strategy: "Polished performance, repeatable excellence",
          },
        ],
        offCampus: [
          "Optimize LinkedIn (clear headline, projects, activity)",
          "Strengthen LeetCode/GFG profile (20-40 day streak)",
          "Build portfolio website",
          "Apply daily on LinkedIn, Naukri, Indeed, AngelList",
          "Use referrals (10× higher chances)",
          "Open-source contributions (shows teamwork)",
          "Participate in hackathons & coding contests",
        ],
        process: [
          "Application / Resume Screening",
          "Aptitude Test",
          "Technical Assessment",
          "Technical Interview (DSA + Projects)",
          "HR / Managerial Round (STAR method)",
        ],
      },
    },
    resources: {
      title: "Resources Hub",
      icon: FileText,
      content: {
        subtitle: "Curated Learning Paths & Platforms",
        description: "One-stop access to all essential preparation resources, organized by domain.",
        categories: [
          {
            domain: "Coding & DSA",
            links: [
              { name: "Striver's A-Z DSA Sheet", tag: "Must Do", url: "https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/" },
              { name: "LeetCode", tag: "Practice", url: "https://leetcode.com" },
              { name: "NeetCode.io", tag: "Structured", url: "https://neetcode.io" },
              { name: "GeeksforGeeks", tag: "Concepts", url: "https://www.geeksforgeeks.org" },
            ],
          },
          {
            domain: "CS Fundamentals",
            links: [
              { name: "GeeksforGeeks", tag: "Tutorials", url: "https://www.geeksforgeeks.org" },
              { name: "InterviewBit", tag: "Questions", url: "https://www.interviewbit.com" },
              { name: "PrepInsta", tag: "Interview Prep", url: "https://prepinsta.com" },
            ],
          },
          {
            domain: "SQL",
            links: [
              { name: "HackerRank SQL", tag: "Practice", url: "https://www.hackerrank.com/domains/sql" },
              { name: "LeetCode Database", tag: "Advanced", url: "https://leetcode.com/problemset/database/" },
              { name: "GeeksforGeeks SQL", tag: "Concepts", url: "https://www.geeksforgeeks.org/sql-tutorial/" },
            ],
          },
          {
            domain: "YouTube Channels",
            links: [
              { name: "Take U Forward", tag: "DSA", url: "https://www.youtube.com/c/takeUforward" },
              { name: "Kunal Kushwaha", tag: "DSA + Dev", url: "https://www.youtube.com/c/KunalKushwaha" },
              { name: "Harkirat Singh", tag: "Web Dev", url: "https://www.youtube.com/c/HarkiratSingh" },
            ],
          },
        ],
      },
    },
  }

  const navigationItems = [
    { id: "overview", label: "Overview", icon: BookOpen },
    { id: "aptitude", label: "Aptitude", icon: Brain },
    { id: "coding", label: "Coding & DSA", icon: Code },
    { id: "fundamentals", label: "CS Fundamentals", icon: Target },
    { id: "projects", label: "Projects", icon: Briefcase },
    { id: "strategy", label: "Strategy", icon: TrendingUp },
    { id: "resources", label: "Resources", icon: FileText },
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
              <div className="inline-flex items-center gap-3 mb-6 px-6 py-3 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 rounded-full border border-cyan-500/30">
                <Icon className="w-6 h-6 text-cyan-400" />
                <h3 className="text-2xl font-bold text-white bebas-neue tracking-wider">{section.content.subtitle}</h3>
              </div>
              <p className="mt-2 mb-10 max-w-3xl mx-auto text-center bebas-neue text-lg text-blue-50/80">
                {section.content.description}
              </p>
            </div>

            {/* Highlights Grid with Prominent Numbers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {section.content.highlights.map((highlight, idx) => (
                <div
                  key={idx}
                  className="relative p-5 bg-gradient-to-br from-cyan-900/10 to-blue-900/10 border border-white/10 rounded-xl hover:border-cyan-400/30 transition-all text-center"
                >
                  {/* Number Badge */}
                  <div className="absolute -top-2 -left-2 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{idx + 1}</span>
                  </div>
                  
                  <div className="mt-3 mb-4">
                    <span className="text-white font-medium text-lg">{highlight}</span>
                  </div>
                  
                  <div className="h-0.5 w-12 mx-auto bg-gradient-to-r from-cyan-500/50 to-blue-500/50"></div>
                </div>
              ))}
            </div>

            <div className="text-center pt-8 border-t border-white/10">
              <p className="mt-2 mb-10 max-w-3xl mx-auto text-center bebas-neue text-lg text-blue-50/80">Select a section to begin exploring</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {navigationItems.slice(1).map((item) => {
                  const NavIcon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
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
              <Icon className="w-8 h-8 text-cyan-400" />
              <h3 className="text-3xl font-bold text-white bebas-neue tracking-wider">{section.content.subtitle}</h3>
            </div>
            <p className="mt-2 mb-10 bebas-neue text-lg text-blue-50/80">{section.content.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.content.topics.map((topic, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-cyan-500/30 rounded-xl p-5"
                >
                  <h4 className="text-xl font-bold text-cyan-400 mb-4 bebas-neue tracking-wide">{topic.category}</h4>
                  <ul className="space-y-2">
                    {topic.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start gap-2 text-white/80 bebas-neue text-sm">
                        <ChevronRight className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h4 className="text-xl font-bold text-white mb-4 bebas-neue tracking-wide">Recommended Resources</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {section.content.resources.map((resource, idx) => (
                  <div key={idx} className="p-4 bg-cyan-500/5 rounded-lg border border-cyan-500/20">
                    <h5 className="text-cyan-400 font-semibold mb-2">{resource.name}</h5>
                    <p className="flex items-start gap-2 text-white/80 bebas-neue text-sm">{resource.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case "coding":
        return (
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-4">
              <Icon className="w-8 h-8 text-cyan-400" />
              <h3 className="text-3xl font-bold text-white bebas-neue tracking-wider">{section.content.subtitle}</h3>
            </div>
            <p className="mt-2 mb-10 bebas-neue text-lg text-blue-50/80">{section.content.description}</p>

            <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-cyan-500/30 rounded-xl p-6">
              <h4 className="text-xl font-bold text-cyan-400 mb-4 bebas-neue tracking-wide">
                3 Layers of Coding Ability
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {section.content.layers.map((layer, idx) => (
                  <div key={idx} className="p-4 bg-white/5 rounded-lg">
                    <h5 className="text-white font-semibold mb-2">{layer.name}</h5>
                    <ul className="space-y-1">
                      {layer.points.map((point, pointIdx) => (
                        <li key={pointIdx} className="flex items-start gap-2 text-white/80 bebas-neue text-sm">
                          <ChevronRight className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h4 className="text-xl font-bold text-white mb-4 bebas-neue tracking-wide">Choose Your Language</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {section.content.languages.map((lang, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 rounded-lg border border-cyan-500/20"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="text-white font-bold text-lg">{lang.name}</h5>
                      <span className="text-xs px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded">{lang.badge}</span>
                    </div>
                    <p className="flex items-start gap-2 text-white/80 bebas-neue text-sm">{lang.use}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-cyan-500/30 rounded-xl p-6">
              <h4 className="text-xl font-bold text-cyan-400 mb-6 bebas-neue tracking-wide">DSA Roadmap (A-Z)</h4>
              
              <div className="relative pl-8 border-l border-cyan-500/30">
                {section.content.roadmap.map((topic, idx) => (
                  <div key={idx} className="relative mb-6 last:mb-0">
                    {/* Circle on the line */}
                    <div className="absolute -left-[33px] top-7 w-4 h-4 rounded-full bg-cyan-500 border-4 border-cyan-900"></div>
                    
                    {/* Content */}
                    <div className="p-3 bg-white/5 rounded-lg border border-cyan-500/20">
                      <div className="flex items-center gap-3">
                        <span className="text-cyan-400 font-mono text-lg font-bold">
                          {(idx + 1).toString().padStart(2, "0")}
                        </span>
                        <div>
                          <h5 className="text-white font-medium">{topic}</h5>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-cyan-400/80 text-xs font-mono">Week {idx + 1}</span>
                            <span className="text-white/50 text-xs">•</span>
                            <span className="text-white/50 text-xs">12 topics</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case "fundamentals":
        return (
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-4">
              <Icon className="w-8 h-8 text-cyan-400" />
              <h3 className="text-3xl font-bold text-white bebas-neue tracking-wider">{section.content.subtitle}</h3>
            </div>
            <p className="mt-2 mb-10 bebas-neue text-lg text-blue-50/80">{section.content.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {section.content.subjects.map((subject, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-cyan-500/30 rounded-xl p-6"
                >
                  <h4 className="text-xl font-bold text-cyan-400 mb-4 bebas-neue tracking-wide">{subject.name}</h4>
                  <ul className="space-y-2">
                    {subject.topics.map((topic, topicIdx) => (
                      <li key={topicIdx} className="flex items-start gap-2 text-white/80 bebas-neue text-sm">
                        <ChevronRight className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h4 className="text-xl font-bold text-white mb-4 bebas-neue tracking-wide">
                Interview Practice Resources
              </h4>
              <div className="space-y-3">
                {section.content.resources.map((resource, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 rounded-lg"
                  >
                    <span className="text-white font-semibold">{resource.platform}</span>
                    <span className="text-white/70 text-sm">{resource.link}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case "projects":
        return (
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-4">
              <Icon className="w-8 h-8 text-cyan-400" />
              <h3 className="text-3xl font-bold text-white bebas-neue tracking-wider">{section.content.subtitle}</h3>
            </div>
            <p className="mt-2 mb-10 bebas-neue text-lg text-blue-50/80">{section.content.description}</p>

            <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-500/30 rounded-xl p-6">
              <h4 className="text-xl font-bold text-cyan-400 mb-4 bebas-neue tracking-wide">Key Principles</h4>
              <div className="space-y-2">
                {section.content.principles.map((principle, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-white/80 bebas-neue text-sm">
                    <ChevronRight className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <span>{principle}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-xl font-bold text-white bebas-neue tracking-wide">Project Recommendations</h4>
              {section.content.recommendations.map((project, idx) => (
                <div
                  key={idx}
                  className="p-5 bg-white/5 border border-white/10 rounded-xl hover:border-cyan-500/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="text-white font-bold">{project.type}</h5>
                    <span className="text-xs px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full">{project.why}</span>
                  </div>
                  <p className="text-white/60 text-sm mb-1">
                    <span className="text-cyan-400 font-semibold">Tech:</span> {project.tech}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h4 className="text-xl font-bold text-white mb-4 bebas-neue tracking-wide">Resume Tips</h4>
              <ul className="space-y-2">
                {section.content.resume.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-white/80 bebas-neue text-sm">
                    <ChevronRight className="flex items-start gap-2 text-white/80 bebas-neue text-sm" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )

      case "strategy":
        return (
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-4">
              <Icon className="w-8 h-8 text-cyan-400" />
              <h3 className="text-3xl font-bold text-white bebas-neue tracking-wider">{section.content.subtitle}</h3>
            </div>
            <p className="mt-2 mb-10 bebas-neue text-lg text-blue-50/80">{section.content.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {section.content.types.map((type, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-cyan-500/30 rounded-xl p-5"
                >
                  <h4 className="text-lg font-bold text-cyan-400 mb-2 bebas-neue tracking-wide">{type.name}</h4>
                  <p className="flex items-start gap-2 text-white/80 bebas-neue text-sm">{type.info}</p>
                  <p className="flex items-start gap-2 text-white/80 bebas-neue text-xs italic">{type.strategy}</p>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-500/30 rounded-xl p-6">
              <h4 className="text-xl font-bold text-cyan-400 mb-4 bebas-neue tracking-wide">Off-Campus Roadmap</h4>
              <div className="space-y-2">
                {section.content.offCampus.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg">
                    <span className="text-cyan-400 font-mono text-sm mt-0.5">
                      {(idx + 1).toString().padStart(2, "0")}
                    </span>
                    <span className="text-white/80 text-sm">{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6">
              <h4 className="text-xl font-bold text-white mb-6 bebas-neue tracking-wide">Typical Placement Process</h4>
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                {section.content.process.map((step, idx) => (
                  <div key={idx} className="relative flex flex-col md:flex-row items-center w-full md:w-auto">
                    {/* Step Card */}
                    <div className="
                      px-4 py-3 
                      bg-gradient-to-br from-cyan-900/30 to-blue-900/30 
                      rounded-lg border border-cyan-500/30 
                      text-center
                      hover:border-cyan-400/50 hover:bg-gradient-to-br hover:from-cyan-900/40 hover:to-blue-900/40
                      transition-all duration-300
                      w-full md:w-auto
                    ">
                      <p className="text-cyan-400 font-mono text-xs mb-1">{idx + 1}</p>
                      <p className="text-white/80 text-sm font-medium">{step}</p>
                    </div>
                    
                    {/* Line Connector - Desktop */}
                    {idx < section.content.process.length - 1 && (
                      <div className="
                        hidden md:block 
                        w-12 h-0.5 
                        bg-gradient-to-r from-cyan-500/50 to-blue-500/50
                        mx-2
                      "></div>
                    )}
                    
                    {/* Line Connector - Mobile */}
                    {idx < section.content.process.length - 1 && (
                      <div className="
                        md:hidden 
                        w-0.5 h-8 
                        bg-gradient-to-b from-cyan-500/50 to-blue-500/50
                        my-2
                      "></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case "resources":
        return (
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-4">
              <Icon className="w-8 h-8 text-cyan-400" />
              <h3 className="text-3xl font-bold text-white bebas-neue tracking-wider">{section.content.subtitle}</h3>
            </div>
            <p className="mt-2 mb-10 bebas-neue text-lg text-blue-50/80">{section.content.description}</p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {section.content.categories.map((category, idx) => (
                <div
                  key={idx}
                  className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 border border-cyan-500/30 rounded-xl p-6 hover:border-cyan-400/50 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center">
                      <span className="text-cyan-400 font-bold text-lg">{idx + 1}</span>
                    </div>
                    <h4 className="text-lg font-bold text-cyan-400 bebas-neue tracking-wide">{category.domain}</h4>
                  </div>
                  
                  <div className="space-y-2">
                    {category.links.map((link, linkIdx) => (
                      <a
                        key={linkIdx}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                          flex items-center justify-between p-3 
                          bg-white/5 rounded-lg border border-white/10
                          hover:bg-white/10 hover:border-cyan-500/30 
                          hover:translate-x-1 hover:shadow-lg hover:shadow-cyan-500/10
                          transition-all duration-300 group
                          cursor-pointer
                        "
                      >
                        <div className="flex items-center gap-3">
                          {/* External Link Icon */}
                          <ExternalLink className="w-4 h-4 text-cyan-500/50 group-hover:text-cyan-400 transition-colors" />
                          
                          <div>
                            <span className="text-white/90 text-sm font-medium group-hover:text-white">
                              {link.name}
                            </span>
                            
                            {/* URL Preview */}
                            <div className="flex items-center gap-1 mt-1">
                              <Globe className="w-3 h-3 text-white/30" />
                              <span className="text-white/40 text-xs truncate max-w-[200px]">
                                {new URL(link.url).hostname}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className="
                            text-xs px-2 py-1 
                            bg-cyan-500/20 text-cyan-400 
                            rounded group-hover:bg-cyan-500/30
                            transition-colors
                          ">
                            {link.tag}
                          </span>
                          
                          {/* Arrow indicator */}
                          <ChevronRight className="
                            w-4 h-4 text-cyan-500/50 
                            group-hover:text-cyan-400 
                            group-hover:translate-x-0.5
                            transition-all
                          " />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Stats Section */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {[
                { label: "Total Resources", value: "15+", icon: FileText, color: "text-cyan-400" },
                { label: "Free Resources", value: "12", icon: Gift, color: "text-green-400" },
                { label: "Video Content", value: "8+ hrs", icon: Video, color: "text-red-400" },
                { label: "Practice Problems", value: "2000+", icon: Target, color: "text-yellow-400" },
              ].map((stat, idx) => (
                <div 
                  key={idx}
                  className="
                    bg-gradient-to-br from-white/5 to-white/0
                    border border-white/10 rounded-xl p-4
                    hover:border-cyan-500/30 hover:scale-[1.02]
                    transition-all duration-300
                    text-center
                  "
                >
                  <div className="flex justify-center mb-2">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-white/60 text-xs">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="w-full">
      <AnimatedTitle
          title="PLACEMENT PLAYBOOK"
          containerClass="text-center !text-white !mb-0 mt-20"
        />

      {/* Disclaimer Banner */}
      <div className="max-w-4xl mx-auto mb-16">
        <div className="bg-gradient-to-r from-cyan-900/20 to-cyan-900/20 border-l-4 border-cyan-500 rounded-r-lg p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-600 to-yellow-600 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Award className="w-5 h-5" />
                Curated by Successfully Placed Seniors
              </h3>
              <p className="text-white/80 leading-relaxed">
                This comprehensive guide is crafted by seniors who have secured positions at top MNCs. 
                Each individual's journey is unique, and preferences may vary. We've consolidated the most effective 
                strategies, resources, and insights to create a single source of truth for your placement preparation. Feel free to customize it according to your needs!
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 text-xs rounded-full border border-cyan-500/30">
                  Personal Experiences
                </span>
                <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full border border-blue-500/30">
                  Validated Strategies
                </span>
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full border border-purple-500/30">
                  Diverse Perspectives
                </span>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs rounded-full border border-emerald-500/30">
                  Updated Resources
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {navigationItems.map((item) => {
            const NavIcon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-full font-semibold transition-all duration-300 bebas-neue tracking-wider ${
                  activeSection === item.id
                    ? "bg-cyan-500/20 text-cyan-400 border-2 border-cyan-500/50 shadow-[0_0_20px_rgba(125,212,238,0.3)]"
                    : "bg-white/5 text-white/70 border border-white/10 hover:bg-white/10 hover:text-white hover:border-white/20"
                }`}
              >
                <NavIcon className="w-4 h-4" />
                {item.label}
              </button>
            )
          })}
        </div>

        <div className="bg-gradient-to-br from-blue-900/10 to-cyan-900/10 border border-white/10 rounded-2xl p-8 md:p-12 min-h-[600px]">
          {renderContent()}
        </div>

        <div className="mt-12 text-center p-8 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 border border-cyan-500/30 rounded-2xl">
          <p className="flex items-start gap-2 text-white/80 bebas-neue text-lg">
            This playbook transforms the bridge between academic knowledge and placement success into a highway. Master
            each pillar, stay consistent, and remember — your DSA language and development tech stack don't have to be
            the same. Stay flexible while keeping your preparation strong.
          </p>
        </div>
      </div>
    </div>
  )
}
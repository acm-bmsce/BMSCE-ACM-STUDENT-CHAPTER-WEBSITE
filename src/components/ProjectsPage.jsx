import React, { useState, useEffect, useMemo } from 'react';
import { Github, Code, TrendingUp, Search, X } from 'lucide-react';

// --------------------------------------------
// RESTORED ORIGINAL PROJECT DATA
// --------------------------------------------
const staticProjects = [
  {
    id: 1,
    title: "E-Commerce Microservices Platform",
    description: "A scalable e-commerce backend built with Node.js and gRPC, utilizing PostgreSQL for product catalog and Redis for caching.",
    imageUrl: "https://placehold.co/600x400/1e293b/f8fafc?text=Microservice+API",
    techStack: ["Node.js", "PostgreSQL", "gRPC", "Docker", "Redis"],
    category: "Backend",
    githubUrl: "https://github.com/placeholder-repo/ecommerce-platform",
  },
  {
    id: 2,
    title: "Financial Dashboard UI",
    description: "A responsive, real-time data visualization dashboard using React, designed for monitoring portfolio performance and market trends.",
    imageUrl: "https://placehold.co/600x400/0f172a/f8fafc?text=Financial+Dashboard",
    techStack: ["React", "Tailwind CSS", "Recharts", "TypeScript"],
    category: "Frontend",
    githubUrl: "https://github.com/placeholder-repo/financial-dashboard",
  },
  {
    id: 3,
    title: "Machine Learning Image Classifier",
    description: "A Python model utilizing TensorFlow to classify images of common objects. Deployed via a lightweight Flask API.",
    imageUrl: "https://placehold.co/600x400/475569/f8fafc?text=ML+Classifier",
    techStack: ["Python", "TensorFlow", "Flask", "Scikit-learn"],
    category: "Machine Learning",
    githubUrl: "https://github.com/placeholder-repo/image-classifier",
  },
  {
    id: 4,
    title: "Personal Blog & CMS",
    description: "A modern blog application with integrated content management features, built with Next.js for SSR and fast loading times.",
    imageUrl: "https://placehold.co/600x400/64748b/f8fafc?text=Blog+Platform",
    techStack: ["Next.js", "Tailwind CSS", "MongoDB", "Auth.js"],
    category: "Full Stack",
    githubUrl: "https://github.com/placeholder-repo/personal-blog",
  },
];

const ProjectCard = ({ project }) => {
  const handleClick = () => {
    window.open(project.githubUrl, "_blank");
  };

  return (
    <div
      onClick={handleClick}
      className="
        bg-[#0E181C]
        border border-[#1F3037]
        rounded-xl
        shadow-xl
        overflow-hidden
        transform transition duration-300
        hover:scale-[1.02]
        hover:border-[#2FA6B8]
        cursor-pointer
      "
    >
      <div className="relative h-48 sm:h-56">
        <img
          src={project.imageUrl}
          alt={project.title}
          className="w-full h-full object-cover transition duration-300"
          onError={(e) => {
            e.target.src = "https://placehold.co/600x400/0f172a/f8fafc?text=Project";
          }}
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition">
          <Github className="w-10 h-10 text-white/90" />
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-2xl font-bebas-neue uppercase text-white mb-2 line-clamp-2">
          {project.title}
        </h3>

        <p className="text-[#BFC7CC] text-sm mb-4 line-clamp-3">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mt-auto">
          <span className="px-3 py-1 text-xs font-medium text-[#BFC7CC] bg-[#141F23] rounded-full border border-[#1F3037]">
            {project.category}
          </span>

          {project.techStack.map((tech, index) => (
            <span
              key={index}
              className="px-3 py-1 text-xs font-medium text-[#BFC7CC] bg-[#141F23] rounded-full border border-[#1F3037]"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};



const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    setTimeout(() => {
      setProjects(staticProjects);
      setLoading(false);
    }, 500);
  }, []);

  const categories = useMemo(() => {
    const unique = [...new Set(staticProjects.map((p) => p.category))];
    return ["All", ...unique];
  }, []);

  const filteredProjects = useMemo(() => {
    let results = projects;

    if (selectedCategory !== "All") {
      results = results.filter((p) => p.category === selectedCategory);
    }

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      results = results.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    return results;
  }, [projects, searchTerm, selectedCategory]);

  return (
    <div className="min-h-screen bg-black font-sans">
      <div className="max-w-7xl mx-auto p-4 sm:p-8">

        {/* HEADER */}
        <header className="text-center mb-12 pt-16">
          <h1 className="text-5xl sm:text-7xl font-bebas-neue uppercase text-white mb-3 tracking-widest">
            Technical Projects
          </h1>
          <p className="text-xl text-white/80 font-light">
            Showcasing work in full-stack development, ML, and scalable architecture.
          </p>
        </header>

        {/* FILTER PANEL */}
        <div className="mb-10 p-6 rounded-lg shadow-xl bg-[#0E181C] border border-[#1F3037]">
          <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#BFC7CC]" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="
                  w-full py-3 pl-10 pr-4
                  bg-black text-white
                  border border-[#1F3037]
                  rounded-lg
                  focus:ring-1 focus:ring-[#2FA6B8]
                "
              />
            </div>

            {(searchTerm || selectedCategory !== "All") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                }}
                className="
                  flex items-center gap-2 px-4 py-2
                  bg-[#141F23]
                  border border-[#1F3037]
                  text-white
                  rounded-lg
                  hover:border-[#2FA6B8]
                  transition
                "
              >
                <X className="w-5 h-5" />
                Clear Filters
              </button>
            )}
          </div>

          {/* CATEGORY FILTERS */}
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`
                  px-4 py-2 text-sm font-medium rounded-full uppercase tracking-wider border transition
                  ${
                    selectedCategory === category
                      ? "bg-[#141F23] border-[#2FA6B8] text-white"
                      : "bg-transparent border-[#1F3037] text-[#BFC7CC] hover:border-[#2FA6B8]"
                  }
                `}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* PROJECT GRID */}
        {loading ? (
          <div className="text-white text-center py-20">Loading…</div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#0E181C] border border-[#1F3037] rounded-xl">
            <TrendingUp className="w-12 h-12 text-[#BFC7CC] mx-auto mb-4" />
            <p className="text-xl text-white">No projects found.</p>
          </div>
        )}

        {/* FOOTER */}
        <footer className="text-center mt-16 p-4 border-t border-[#1F3037]">
          <p className="text-sm text-[#BFC7CC]">
            <Code className="inline w-4 h-4 mr-1" />
            Backend integration ready: Data currently static.
          </p>
        </footer>

      </div>
    </div>
  );
};

export default ProjectsPage;

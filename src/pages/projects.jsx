import React, { useState, useEffect, useMemo } from 'react';
import { Github, Code, TrendingUp, Search, X, User } from 'lucide-react'; 
import projectService from '../api/projectService'; 
// ✅ ADDED: Imports
import { getOptimizedImageUrl } from "../utils/imageHelper";
import SEO from "../components/SEO";

const ProjectCard = ({ project }) => {
  const handleGithubClick = (e) => {
    e.stopPropagation(); 
    window.open(project.githubUrl, "_blank");
  };

  return (
    <div className="bg-[#0E181C] border border-[#1F3037] rounded-xl shadow-xl overflow-hidden transform transition duration-300 hover:scale-[1.02] hover:border-[#2FA6B8] flex flex-col min-h-[500px]">
      <div className="relative h-48 sm:h-56 flex-shrink-0">
        <img
          // ✅ FIX 1: Optimized Image URL
          src={getOptimizedImageUrl(project.imageUrl, 600)}
          alt={project.title}
          // ✅ FIX 2: Lazy Load
          loading="lazy"
          className="w-full h-full object-cover transition duration-300"
          onError={(e) => { e.target.src = "https://placehold.co/600x400/0f172a/f8fafc?text=Project"; }}
        />
      </div>

      <div className="p-5 flex flex-col flex-grow"> 
        {/* ... (rest of card content remains same) ... */}
        <h3 className="text-2xl font-bebas-neue uppercase text-white mb-2 line-clamp-2">{project.title}</h3>
        <p className="text-[#BFC7CC] text-sm mb-4 line-clamp-3">{project.description}</p>
        
        <div className="flex items-center text-sm text-[#BFC7CC] mb-4">
          <User className="w-4 h-4 mr-2 text-[#2FA6B8]" />
          <span className="font-medium">By: {project.author}</span>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {project.categories && project.categories.map((category, index) => (
            <span key={`cat-${index}`} className="px-3 py-1 text-xs font-medium text-[#BFC7CC] bg-[#141F23] rounded-full border border-[#1F3037]">
              {category}
            </span>
          ))}
          {project.techStack && project.techStack.map((tech, index) => (
            <span key={`tech-${index}`} className="px-3 py-1 text-xs font-medium text-[#BFC7CC] bg-[#141F23] rounded-full border border-[#1F3037]">
              {tech}
            </span>
          ))}
        </div>
        
        {project.githubUrl && (
            <button onClick={handleGithubClick} className="flex items-center justify-center gap-2 px-4 py-2 mt-auto bg-[#2FA6B8] text-white rounded-lg font-semibold hover:bg-[#268A98] transition text-sm cursor-pointer">
            <Github className="w-5 h-5" /> View on GitHub
            </button>
        )}
      </div>
    </div>
  );
};

const ProjectsPage = () => {
  // ... (State logic remains exactly the same) ...
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]); 

  useEffect(() => {
    const fetchProjects = async () => {
        try {
            setLoading(true);
            const response = await projectService.getShowcaseProjects();
            setProjects(response.data);
        } catch (error) {
            console.error("Error fetching projects:", error);
        } finally {
            setLoading(false);
        }
    };
    fetchProjects();
  }, []);

  // ... (Memo logic remains exactly the same) ...
  const categories = useMemo(() => {
    const allCategories = projects.flatMap((p) => p.categories || []);
    const unique = [...new Set(allCategories)];
    return ["All", ...unique];
  }, [projects]);

  const handleCategoryToggle = (category) => {
    if (category === "All") {
      setSelectedCategories([]);
      return;
    }
    setSelectedCategories((prev) => 
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const filteredProjects = useMemo(() => {
    let results = projects;
    if (selectedCategories.length > 0) {
      results = results.filter((project) => 
        selectedCategories.every((selectedCat) => project.categories && project.categories.includes(selectedCat))
      );
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      results = results.filter((p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.author.toLowerCase().includes(q) 
      );
    }
    return results;
  }, [projects, searchTerm, selectedCategories]);

  return (
    <div className="min-h-screen bg-black font-sans">
      {/* ✅ FIX 3: Add SEO */}
      <SEO 
        title="Projects Showcase" 
        description="Discover innovative projects built by students of ACM BMSCE." 
      />

      <div className="max-w-7xl mx-auto p-4 sm:p-8">
         {/* ... (Header and Filters remain exactly the same) ... */}
        <header className="text-center mb-12 pt-16">
          <h1 className="text-5xl sm:text-7xl font-bebas-neue uppercase text-white mb-3 tracking-widest">Technical Projects</h1>
          <p className="text-xl text-white/80 font-light">Showcasing work in full-stack development, ML, and scalable architecture.</p>
        </header>

        <div className="mb-10 p-6 rounded-lg shadow-xl bg-[#0E181C] border border-[#1F3037]">
            {/* ... (Filter Inputs logic) ... */}
             <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
                <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#BFC7CC]" />
                <input type="text" placeholder="Search projects..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full py-3 pl-10 pr-4 bg-black text-white border border-[#1F3037] rounded-lg focus:ring-1 focus:ring-[#2FA6B8]" />
                </div>
                {(searchTerm || selectedCategories.length > 0) && (
                <button onClick={() => { setSearchTerm(""); setSelectedCategories([]); }} className="flex items-center gap-2 px-4 py-2 bg-[#141F23] border border-[#1F3037] text-white rounded-lg hover:border-[#2FA6B8] transition">
                    <X className="w-5 h-5" /> Clear Filters
                </button>
                )}
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
                {categories.map((category) => {
                const isActive = category === "All" ? selectedCategories.length === 0 : selectedCategories.includes(category);
                return (
                    <button key={category} onClick={() => handleCategoryToggle(category)} className={`px-4 py-2 text-sm font-medium rounded-full uppercase tracking-wider border transition ${isActive ? "bg-[#141F23] border-[#2FA6B8] text-white" : "bg-transparent border-[#1F3037] text-[#BFC7CC] hover:border-[#2FA6B8]"}`}>
                    {category}
                    </button>
                );
                })}
            </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-white text-center py-20">Loading Projects...</div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id || project._id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[#0E181C] border border-[#1F3037] rounded-xl">
            <TrendingUp className="w-12 h-12 text-[#BFC7CC] mx-auto mb-4" />
            <p className="text-xl text-white">No projects found matching the selected criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
import React, { useState, useEffect, useMemo } from 'react';
import { Github, Code, TrendingUp, Search, X, User } from 'lucide-react'; 
import staticProjects from '../components/Data_projects.jsx'; 

// --- ProjectCard Component ---
const ProjectCard = ({ project }) => {
  const handleGithubClick = (e) => {
    e.stopPropagation(); 
    window.open(project.githubUrl, "_blank");
  };

  return (
    <div
      className="
        bg-[#0E181C]
        border border-[#1F3037]
        rounded-xl
        shadow-xl
        overflow-hidden
        transform transition duration-300
        hover:scale-[1.02]
        hover:border-[#2FA6B8]
        flex flex-col
        min-h-[500px] 
      "
    >
      <div className="relative h-48 sm:h-56 flex-shrink-0"> {/* Image area */}
        <img
          src={project.imageUrl}
          alt={project.title}
          className="w-full h-full object-cover transition duration-300"
          onError={(e) => {
            e.target.src = "https://placehold.co/600x400/0f172a/f8fafc?text=Project";
          }}
        />
      </div>

      {/* Content area: flex-col and flex-grow ensure items fill space and button is pushed down */}
      <div className="p-5 flex flex-col flex-grow"> 
        <h3 className="text-2xl font-bebas-neue uppercase text-white mb-2 line-clamp-2">
          {project.title}
        </h3>

        {/* flex-grow here ensures the description expands to fill space */}
        <p className="text-[#BFC7CC] text-sm mb-4 line-clamp-3"> 
          {project.description}
        </p>

        {/* MODIFIED: Author Display - Removed tabs and simplified spacing */}
        <div className="flex items-center text-sm text-[#BFC7CC] mb-4">
          <User className="w-4 h-4 mr-2 text-[#2FA6B8]" />
          <span className="font-medium">By{"\t"}:{"\t"}{project.author}{"\t"}</span>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          
          {/* Loop through all categories */}
          {project.categories && project.categories.map((category, index) => (
            <span
              key={`cat-${index}`}
              className="px-3 py-1 text-xs font-medium text-[#BFC7CC] bg-[#141F23] rounded-full border border-[#1F3037]"
            >
              {category}
            </span>
          ))}

          {/* Tech Stack remains a separate loop */}
          {project.techStack.map((tech, index) => (
            <span
              key={`tech-${index}`}
              className="px-3 py-1 text-xs font-medium text-[#BFC7CC] bg-[#141F23] rounded-full border border-[#1F3037]"
            >
              {tech}
            </span>
          ))}
        </div>
        
        {/* ADDED: GitHub Button for Redirection (mt-auto pushes it to the bottom) */}
        <button
          onClick={handleGithubClick}
          className="
            flex items-center justify-center gap-2
            px-4 py-2 mt-auto  
            bg-[#2FA6B8] text-white
            rounded-lg
            font-semibold
            hover:bg-[#268A98]
            transition
            text-sm
            cursor-pointer
          "
        >
          <Github className="w-5 h-5" />
          View on GitHub
        </button>
      </div>
    </div>
  );
};

// --- ProjectsPage Component (Multiple Filter Enabled) ---

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // 🔑 CHANGE 1: Use an array for multiple selections
  const [selectedCategories, setSelectedCategories] = useState([]); 

  useEffect(() => {
    // Uses the imported staticProjects array
    setTimeout(() => {
      setProjects(staticProjects);
      setLoading(false);
    }, 500);
  }, []);

  const categories = useMemo(() => {
    // Flatten the array of categories from all projects and use Set to ensure uniqueness
    const allCategories = staticProjects.flatMap((p) => p.categories || []);
    const unique = [...new Set(allCategories)];
    // "All" is still the first option
    return ["All", ...unique];
  }, []);

  // 🔑 NEW FUNCTION: Toggle categories in the array
  const handleCategoryToggle = (category) => {
    // If "All" is selected, clear all other filters
    if (category === "All") {
      setSelectedCategories([]);
      return;
    }

    setSelectedCategories((prevCategories) => {
      if (prevCategories.includes(category)) {
        // If selected, remove it
        return prevCategories.filter((c) => c !== category);
      } else {
        // If not selected, add it
        return [...prevCategories, category];
      }
    });
  };

  // 🔑 UPDATED MEMO: Check if a project contains ALL selected categories
  const filteredProjects = useMemo(() => {
    let results = projects;
    
    const activeFilters = selectedCategories.length > 0; 

    if (activeFilters) {
      // Filter projects that include ALL selected categories (AND logic)
      results = results.filter((project) => {
        // .every() checks if ALL elements in selectedCategories satisfy the condition
        return selectedCategories.every((selectedCat) => 
          project.categories && project.categories.includes(selectedCat)
        );
      });
    }

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      results = results.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.author.toLowerCase().includes(q) 
      );
    }

    return results;
    
  }, [projects, searchTerm, selectedCategories]); // Dependency updated

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
                placeholder="Search projects (title, description, or author)..." 
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

            {/* Clear Filters Button (Updated to check selectedCategories) */}
            {(searchTerm || selectedCategories.length > 0) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategories([]); // Reset the array
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

          {/* CATEGORY FILTERS (Updated to handle multiple selection) */}
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => {
              
              const isAllButton = category === "All";
              // "All" is active only when the selection array is empty.
              // Other categories are active if they are included in the selection array.
              const isActive = isAllButton 
                ? selectedCategories.length === 0 
                : selectedCategories.includes(category); 

              return (
                <button
                  key={category}
                  onClick={() => handleCategoryToggle(category)} // Use new toggle function
                  className={`
                    px-4 py-2 text-sm font-medium rounded-full uppercase tracking-wider border transition
                    ${
                      isActive
                        ? "bg-[#141F23] border-[#2FA6B8] text-white"
                        : "bg-transparent border-[#1F3037] text-[#BFC7CC] hover:border-[#2FA6B8]"
                    }
                  `}
                >
                  {category}
                </button>
              );
            })}
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
            <p className="text-xl text-white">No projects found matching the selected criteria.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProjectsPage;
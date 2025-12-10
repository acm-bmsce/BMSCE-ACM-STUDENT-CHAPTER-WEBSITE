import React, { useState, useEffect } from 'react';
import { 
  Plus, FolderGit, Github, CheckCircle, Trash2, 
  Loader2, Edit, X, ChevronLeft, ChevronRight 
} from 'lucide-react';
import projectService from '../../api/projectService';
import ImageUpload from '../../components/ImageUpload'; // ✅ Import Uploader

const ManageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [filter, setFilter] = useState('ALL'); // ALL, PENDING, APPROVED
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Pagination State
  const [page, setPage] = useState(1);
  const LIMIT = 9;
  const [hasMore, setHasMore] = useState(true);

  // Track Editing State
  const [editingId, setEditingId] = useState(null);

  const initialFormState = {
    title: '', description: '', author: '',
    githubUrl: '', imageUrl: '', categories: '', techStack: ''   
  };
  const [formData, setFormData] = useState(initialFormState);

  // --- 1. FETCH PROJECTS (With Pagination) ---
  const fetchProjects = async (currentPage = 1) => {
    try {
      setLoading(true);
      const skip = (currentPage - 1) * LIMIT;
      
      const response = await projectService.getAllProjects(LIMIT, skip);
      const newProjects = response.data;
      
      setProjects(newProjects);
      
      if (newProjects.length < LIMIT) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects(page);
  }, [page]);

  // --- PAGINATION HANDLERS ---
  const handleNextPage = () => { if (hasMore) setPage(prev => prev + 1); };
  const handlePrevPage = () => { if (page > 1) setPage(prev => prev - 1); };

  // --- 2. OPEN CREATE MODAL ---
  const openCreateModal = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setIsFormOpen(true);
  };

  // --- 3. OPEN EDIT MODAL ---
  const handleEdit = (project) => {
    setEditingId(project.id || project._id);
    const cats = project.categories ? project.categories.join(', ') : '';
    const tech = project.techStack ? project.techStack.join(', ') : '';

    setFormData({
        title: project.title,
        description: project.description,
        author: project.author,
        githubUrl: project.githubUrl || '',
        imageUrl: project.imageUrl || '',
        categories: cats,
        techStack: tech
    });
    setIsFormOpen(true);
  };

  // --- 4. SUBMIT (CREATE OR UPDATE) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        categories: formData.categories.split(',').map(s => s.trim()).filter(s => s),
        techStack: formData.techStack.split(',').map(s => s.trim()).filter(s => s)
      };

      if (editingId) {
        await projectService.updateProject(editingId, payload);
        alert("Project Updated Successfully!");
      } else {
        await projectService.submitProject(payload);
        alert("Project Added Successfully!");
      }
      
      setIsFormOpen(false);
      setFormData(initialFormState);
      setEditingId(null);
      fetchProjects(page);

    } catch (error) {
      console.error("Error saving project:", error);
      alert("Failed to save project.");
    } finally {
      setSubmitting(false);
    }
  };

  // --- 5. APPROVE PROJECT ---
  const handleApprove = async (id) => {
    try {
      await projectService.approveProject(id);
      setProjects(prev => prev.map(p => 
        (p.id || p._id) === id ? { ...p, status: 'APPROVED' } : p
      ));
    } catch (error) {
      alert("Failed to approve project.");
    }
  };

  // --- 6. DELETE PROJECT ---
  const handleDelete = async (id) => {
     if(!window.confirm("Delete this project?")) return;
     try {
         await projectService.deleteProject(id); 
         setProjects(prev => prev.filter(p => (p.id || p._id) !== id));
     } catch(err) { console.error(err); }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const filteredProjects = projects.filter(p => {
    if (filter === 'ALL') return true;
    return p.status === filter;
  });

  return (
    <div className="relative min-h-screen pb-20">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-[#1F3037] pb-6 gap-4">
        <div>
          <h2 className="text-4xl font-bebas-neue text-white tracking-widest">Project Approvals</h2>
          <p className="text-[#BFC7CC] text-sm mt-1">Page {page}</p>
        </div>
        
        <div className="flex gap-3">
           <div className="flex bg-[#0E181C] border border-[#1F3037] rounded-lg p-1">
              {['ALL', 'PENDING', 'APPROVED'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-1 text-xs font-bold rounded-md transition-all ${
                    filter === f ? 'bg-[#2FA6B8] text-white' : 'text-[#BFC7CC] hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
           </div>

           <button 
            onClick={openCreateModal}
            className="bg-[#2FA6B8] hover:bg-[#268A98] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all font-medium text-sm"
          >
            <Plus size={18} /> Add Manual
          </button>
        </div>
      </div>

      {/* PROJECTS LIST */}
      {loading ? (
        <div className="text-center text-white py-20"><Loader2 className="animate-spin inline mr-2"/> Loading Projects...</div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center text-gray-500 py-20 border border-dashed border-[#1F3037] rounded-xl">
           {page === 1 ? 'No projects found.' : 'No more projects on this page.'}
        </div>
      ) : (
        <div className="space-y-4">
            {filteredProjects.map((project) => (
            <div key={project.id || project._id} className="bg-[#0E181C] border border-[#1F3037] rounded-xl p-5 flex flex-col md:flex-row gap-6 hover:border-[#2FA6B8] transition-all group">
                
                <div className="w-full md:w-32 h-24 bg-[#141F23] rounded-lg flex items-center justify-center border border-[#1F3037] overflow-hidden">
                {project.imageUrl ? <img src={project.imageUrl} alt="" className="w-full h-full object-cover" /> : <FolderGit className="text-[#BFC7CC]" />}
                </div>

                <div className="flex-1">
                <div className="flex justify-between items-start">
                    <div>
                    <h3 className="text-xl font-bebas-neue text-white tracking-wide">{project.title}</h3>
                    <p className="text-[#BFC7CC] text-xs font-mono uppercase mb-2">By: {project.author}</p>
                    </div>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold tracking-wider border ${
                    project.status === 'APPROVED' 
                        ? 'bg-green-500/10 text-green-400 border-green-500/30' 
                        : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                    }`}>
                    {project.status}
                    </span>
                </div>
                
                <p className="text-[#BFC7CC] text-sm mb-3 line-clamp-2">{project.description}</p>
                
                <div className="flex flex-wrap gap-2">
                    {project.categories?.map((c, i) => (
                    <span key={i} className="text-[10px] px-2 py-1 bg-[#1F3037] rounded-full text-white">{c}</span>
                    ))}
                </div>
                </div>

                <div className="flex md:flex-col justify-between items-end gap-2 border-t md:border-t-0 md:border-l border-[#1F3037] pt-4 md:pt-0 md:pl-4">
                  <div className="flex gap-2">
                      {project.status === 'PENDING' && (
                      <button onClick={() => handleApprove(project.id || project._id)} className="flex items-center gap-2 px-3 py-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-xs font-bold transition-all">
                          <CheckCircle size={14} /> APPROVE
                      </button>
                      )}
                      {project.githubUrl && (
                          <a href={project.githubUrl} target="_blank" rel="noreferrer" className="p-2 bg-[#1F3037] hover:bg-white hover:text-black rounded-lg text-white transition-all">
                          <Github size={16} />
                          </a>
                      )}
                  </div>
                  
                  <div className="flex gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(project)} className="text-blue-400 hover:text-blue-300 p-1">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => handleDelete(project.id || project._id)} className="text-red-400 hover:text-red-300 p-1">
                        <Trash2 size={16} />
                      </button>
                  </div>
                </div>

            </div>
            ))}
        </div>
      )}

      {/* PAGINATION CONTROLS */}
      <div className="flex justify-center items-center gap-4 mt-10">
        <button 
          onClick={handlePrevPage} 
          disabled={page === 1 || loading}
          className="flex items-center gap-2 px-4 py-2 bg-[#1F3037] text-white rounded-lg disabled:opacity-50 hover:bg-[#2FA6B8] transition-colors"
        >
          <ChevronLeft size={16} /> Previous
        </button>
        
        <span className="text-[#BFC7CC] text-sm font-mono">Page {page}</span>
        
        <button 
          onClick={handleNextPage} 
          disabled={!hasMore || loading}
          className="flex items-center gap-2 px-4 py-2 bg-[#1F3037] text-white rounded-lg disabled:opacity-50 hover:bg-[#2FA6B8] transition-colors"
        >
          Next <ChevronRight size={16} />
        </button>
      </div>

      {/* FORM MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsFormOpen(false)}></div>
          <div className="relative w-full max-w-lg bg-[#0E181C] border-l border-[#1F3037] h-full overflow-y-auto p-8 shadow-2xl animate-in slide-in-from-right">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-3xl font-bebas-neue text-white">
                    {editingId ? 'Edit Project' : 'Add Project'}
                </h3>
                <button onClick={() => setIsFormOpen(false)}><X className="text-white" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <input name="title" value={formData.title} onChange={handleInputChange} placeholder="Title" className="admin-input" required />
              <input name="author" value={formData.author} onChange={handleInputChange} placeholder="Author(s)" className="admin-input" required />
              <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" rows="3" className="admin-input" required />
              
              {/* ✅ UPDATED: Image Upload Component */}
              <div className="space-y-2">
                 <ImageUpload 
                   existingImage={formData.imageUrl}
                   onUploadComplete={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
                 />
              </div>

              <input name="githubUrl" value={formData.githubUrl} onChange={handleInputChange} placeholder="GitHub URL" className="admin-input" />
              <input name="categories" value={formData.categories} onChange={handleInputChange} placeholder="Categories (comma separated)" className="admin-input" />
              <input name="techStack" value={formData.techStack} onChange={handleInputChange} placeholder="Tech Stack (comma separated)" className="admin-input" />
              
              <button type="submit" disabled={submitting} className="w-full bg-[#2FA6B8] text-white font-bebas-neue text-xl py-3 rounded-lg mt-4 flex justify-center items-center gap-2">
                 {submitting ? <Loader2 className="animate-spin" /> : (editingId ? "Update Project" : "Save Project")}
              </button>
            </form>
          </div>
        </div>
      )}
      
      <style>{`
        .admin-input {
          width: 100%;
          background: #000;
          border: 1px solid #1F3037;
          border-radius: 0.5rem;
          padding: 0.75rem;
          color: white;
          outline: none;
        }
        .admin-input:focus { border-color: #2FA6B8; }
      `}</style>
    </div>
  );
};

export default ManageProjects;
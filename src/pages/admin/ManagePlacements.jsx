import React, { useState, useEffect } from 'react';
import { 
  Plus, Instagram, Trash2, Edit, X, Loader2, 
  ChevronLeft, ChevronRight 
} from 'lucide-react';
import placementService from '../../api/placementService';
import ImageUpload from '../../components/ImageUpload'; // ✅ Import Uploader

const ManagePlacements = () => {
  const [insights, setInsights] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Pagination State
  const [page, setPage] = useState(1);
  const LIMIT = 9;
  const [hasMore, setHasMore] = useState(true);

  // Track Editing State
  const [editingId, setEditingId] = useState(null);

  const initialForm = {
    personName: '', description: '', image: '', insta_link: ''
  };
  const [formData, setFormData] = useState(initialForm);

  // --- 1. FETCH INSIGHTS (With Pagination) ---
  const fetchInsights = async (currentPage = 1) => {
    try {
      setLoading(true);
      const skip = (currentPage - 1) * LIMIT;
      
      const response = await placementService.getInsights(LIMIT, skip);
      const newInsights = response.data;
      
      setInsights(newInsights);
      
      if (newInsights.length < LIMIT) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (error) {
      console.error("Error fetching insights:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights(page);
  }, [page]);

  // --- PAGINATION HANDLERS ---
  const handleNextPage = () => { if (hasMore) setPage(prev => prev + 1); };
  const handlePrevPage = () => { if (page > 1) setPage(prev => prev - 1); };

  // --- 2. OPEN CREATE MODAL ---
  const openCreateModal = () => {
    setEditingId(null);
    setFormData(initialForm);
    setIsFormOpen(true);
  };

  // --- 3. OPEN EDIT MODAL ---
  const handleEdit = (item) => {
    setEditingId(item.id || item._id);
    setFormData({
        personName: item.personName,
        description: item.description,
        image: item.image || '',
        insta_link: item.insta_link || ''
    });
    setIsFormOpen(true);
  };

  // --- 4. SUBMIT (CREATE OR UPDATE) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (editingId) {
        await placementService.updateInsight(editingId, formData);
        alert("Insight Updated Successfully!");
      } else {
        await placementService.createInsight(formData);
        alert("Insight Added Successfully!");
      }
      
      setIsFormOpen(false);
      setFormData(initialForm);
      setEditingId(null);
      fetchInsights(page);

    } catch (error) {
      console.error("Error saving insight:", error);
      alert("Failed to save insight.");
    } finally {
      setSubmitting(false);
    }
  };

  // --- 5. DELETE INSIGHT ---
  const handleDelete = async (id) => {
    if(!window.confirm("Delete this insight?")) return;
    try {
        await placementService.deleteInsight(id);
        setInsights(prev => prev.filter(item => (item.id || item._id) !== id));
    } catch (error) {
        console.error("Delete failed", error);
        alert("Failed to delete insight.");
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="relative min-h-screen pb-20">
      
      <div className="flex justify-between items-end mb-8 border-b border-[#1F3037] pb-6">
        <div>
          <h2 className="text-4xl font-bebas-neue text-white tracking-widest">Placement Insights</h2>
          <p className="text-[#BFC7CC] text-sm mt-1">Page {page}</p>
        </div>
        <button 
          onClick={openCreateModal} 
          className="bg-[#2FA6B8] hover:bg-[#268A98] text-white px-5 py-2 rounded-lg flex items-center gap-2 font-medium"
        >
          <Plus size={20} /> Add Insight
        </button>
      </div>

      {/* INSIGHTS GRID */}
      {loading ? (
        <div className="text-center text-white py-20"><Loader2 className="animate-spin inline mr-2"/> Loading...</div>
      ) : insights.length === 0 ? (
        <div className="text-center text-gray-500 py-20 border border-dashed border-[#1F3037] rounded-xl">
           {page === 1 ? 'No insights found.' : 'No more insights on this page.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {insights.map((item) => (
            <div key={item.id || item._id} className="bg-[#0E181C] border border-[#1F3037] p-6 rounded-xl relative group hover:border-[#2FA6B8] transition-all">
                
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleEdit(item)}
                    className="text-blue-400 hover:bg-white/10 p-1 rounded"
                    title="Edit"
                  >
                    <Edit size={16}/>
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id || item._id)} 
                    className="text-red-400 hover:bg-white/10 p-1 rounded"
                    title="Delete"
                  >
                    <Trash2 size={16}/>
                  </button>
                </div>

                <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#2FA6B8]">
                    <img src={item.image || "https://placehold.co/100"} alt={item.personName} className="w-full h-full object-cover" />
                </div>
                <div>
                    <h3 className="text-white font-bold text-lg leading-tight">{item.personName}</h3>
                    <p className="text-[#2FA6B8] text-sm">{item.description}</p>
                </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[#1F3037] flex justify-between items-center">
                <span className="text-xs text-[#BFC7CC]">Insight Series</span>
                {item.insta_link && (
                    <a href={item.insta_link} target="_blank" rel="noreferrer" className="text-pink-500 hover:text-pink-400">
                    <Instagram size={18} />
                    </a>
                )}
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

      {/* SLIDE OVER FORM */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsFormOpen(false)}></div>
          <div className="relative w-full max-w-md bg-[#0E181C] border-l border-[#1F3037] h-full p-8 shadow-2xl animate-in slide-in-from-right overflow-y-auto">
             <div className="flex justify-between items-center mb-8">
               <h3 className="text-3xl font-bebas-neue text-white">
                 {editingId ? 'Edit Insight' : 'New Insight'}
               </h3>
               <button onClick={() => setIsFormOpen(false)}><X className="text-white" /></button>
             </div>
             
             <form onSubmit={handleSubmit} className="space-y-4">
               <div className="space-y-2">
                 <label className="text-xs text-[#BFC7CC]">Full Name</label>
                 <input name="personName" value={formData.personName} onChange={handleInputChange} className="w-full bg-black border border-[#1F3037] rounded p-3 text-white focus:border-[#2FA6B8] outline-none" placeholder="e.g. John Doe" required />
               </div>
               
               <div className="space-y-2">
                 <label className="text-xs text-[#BFC7CC]">Role & Company</label>
                 <input name="description" value={formData.description} onChange={handleInputChange} className="w-full bg-black border border-[#1F3037] rounded p-3 text-white focus:border-[#2FA6B8] outline-none" placeholder="e.g. Analyst, Google" required />
               </div>

               {/* ✅ UPDATED: Image Upload Component */}
               <div className="space-y-2">
                 <ImageUpload 
                   existingImage={formData.image}
                   onUploadComplete={(url) => setFormData(prev => ({ ...prev, image: url }))}
                 />
               </div>

               <div className="space-y-2">
                 <label className="text-xs text-[#BFC7CC]">Instagram Link</label>
                 <input name="insta_link" value={formData.insta_link} onChange={handleInputChange} className="w-full bg-black border border-[#1F3037] rounded p-3 text-white focus:border-[#2FA6B8] outline-none" placeholder="https://instagram.com/..." />
               </div>

               <button type="submit" disabled={submitting} className="w-full bg-[#2FA6B8] text-white font-bebas-neue text-xl py-3 rounded-lg mt-6 flex justify-center items-center gap-2">
                  {submitting ? <Loader2 className="animate-spin" /> : (editingId ? "Update Insight" : "Add Insight")}
               </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePlacements;
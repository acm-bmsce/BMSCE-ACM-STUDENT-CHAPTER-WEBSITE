import React, { useState } from 'react';
import { Upload, Loader2, X, CheckCircle } from 'lucide-react';
import axios from 'axios';

// 🔴 REPLACE THESE WITH YOUR CLOUDINARY DETAILS
const CLOUD_NAME = "dzccr1oot"; 
const UPLOAD_PRESET = "Website-Image"; 

const ImageUpload = ({ existingImage, onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(existingImage || '');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    
    // Create Form Data for Cloudinary
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', UPLOAD_PRESET);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        formData
      );
      
      const url = response.data.secure_url;
      setPreview(url);
      onUploadComplete(url); // Send URL back to the parent form
    } catch (error) {
      console.error("Upload failed", error);
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview('');
    onUploadComplete('');
  };

  return (
    <div className="w-full">
      <label className="text-sm text-[#BFC7CC] font-medium mb-2 block">Event/Project Image</label>
      
      {/* PREVIEW AREA */}
      {preview ? (
        <div className="relative w-full h-48 bg-[#0E181C] border border-[#2FA6B8] rounded-lg overflow-hidden group">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          <button 
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full hover:bg-red-500 transition-colors"
          >
            <X size={16} />
          </button>
          <div className="absolute bottom-2 right-2 bg-black/70 text-[#2FA6B8] px-2 py-1 rounded text-xs flex items-center gap-1">
             <CheckCircle size={12} /> Uploaded
          </div>
        </div>
      ) : (
        /* UPLOAD BUTTON */
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#1F3037] rounded-lg cursor-pointer hover:border-[#2FA6B8] hover:bg-[#2FA6B8]/5 transition-all">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {uploading ? (
              <Loader2 className="animate-spin text-[#2FA6B8] mb-2" size={24} />
            ) : (
              <Upload className="text-[#BFC7CC] mb-2" size={24} />
            )}
            <p className="text-xs text-[#BFC7CC]">
              {uploading ? "Uploading..." : "Click to upload image"}
            </p>
          </div>
          <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={uploading} />
        </label>
      )}
    </div>
  );
};

export default ImageUpload;
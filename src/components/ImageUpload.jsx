import React, { useState } from 'react';
import { storage } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Upload, X, Check, Loader2 } from 'lucide-react';

const ImageUpload = ({ onUploadComplete, existingImage }) => {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(existingImage || '');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create a Preview immediately
    setPreview(URL.createObjectURL(file));
    uploadFile(file);
  };

  const uploadFile = (file) => {
    setIsUploading(true);
    const fileName = `images/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(p);
      }, 
      (error) => {
        console.error("Upload Error:", error);
        setIsUploading(false);
        alert("Upload failed.");
      }, 
      () => {
        // Success! Get the URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setIsUploading(false);
          onUploadComplete(downloadURL); // Pass URL back to parent form
        });
      }
    );
  };

  const clearImage = () => {
    setPreview('');
    onUploadComplete(''); // Clear URL in parent form
  };

  return (
    <div className="w-full">
      <label className="text-sm text-[#BFC7CC] font-medium mb-2 block">Event Image</label>
      
      {!preview ? (
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#1F3037] rounded-lg cursor-pointer hover:border-[#2FA6B8] bg-black hover:bg-[#0E181C] transition-all group">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {isUploading ? (
               <Loader2 className="w-8 h-8 text-[#2FA6B8] animate-spin" />
            ) : (
               <>
                 <Upload className="w-8 h-8 text-[#BFC7CC] group-hover:text-[#2FA6B8] mb-2" />
                 <p className="text-xs text-[#BFC7CC]">Click to Upload (PNG, JPG)</p>
               </>
            )}
          </div>
          <input 
            type="file" 
            className="hidden" 
            accept="image/*"
            onChange={handleFileChange} 
            disabled={isUploading}
          />
        </label>
      ) : (
        <div className="relative w-full h-48 rounded-lg overflow-hidden border border-[#1F3037] group">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          
          {isUploading && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white text-xs">
               <Loader2 className="w-6 h-6 animate-spin mb-2 text-[#2FA6B8]" />
               Uploading... {Math.round(progress)}%
            </div>
          )}

          {!isUploading && (
            <button 
              type="button"
              onClick={clearImage}
              className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full hover:bg-red-500 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
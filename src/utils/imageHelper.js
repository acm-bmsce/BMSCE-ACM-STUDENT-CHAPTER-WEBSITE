// src/utils/imageHelper.js

export const getOptimizedImageUrl = (url, width = 600) => {
  if (!url) return "https://placehold.co/600x400/1F3037/white?text=ACM+Image";
  
  // Only optimize if it's a Cloudinary URL
  if (url.includes('cloudinary.com')) {
    // Inject transformations: w_{width} (resize), q_auto (quality), f_auto (format)
    return url.replace('/upload/', `/upload/w_${width},q_auto,f_auto/`);
  }
  
  return url;
};
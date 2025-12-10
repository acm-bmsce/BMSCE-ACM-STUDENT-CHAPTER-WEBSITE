// src/components/SEO.jsx
import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description }) => {
  const siteName = "ACM BMSCE";
  
  return (
    <Helmet>
      {/* Basic Tags */}
      <title>{`${title} | ${siteName}`}</title>
      <meta name="description" content={description} />
      
      {/* Social Media Tags (Open Graph) */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
    </Helmet>
  );
};

export default SEO;
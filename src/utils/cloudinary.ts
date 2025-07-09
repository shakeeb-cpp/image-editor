import { Cloudinary } from '@cloudinary/url-gen';

// Initialize Cloudinary (you'll need to set your cloud name)
const cld = new Cloudinary({
  cloud: {
    cloudName: 'dbcxk1kab' // Replace with your actual cloud name
  }
});

console.log(cld)

export const uploadImage = async (file: File): Promise<{ publicId: string; url: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', 'image-editor'); // Replace with your upload preset
  
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/dbcxk1kab/image/upload`, // Replace 'dbcxk1kab' with your cloud name
      {
        method: 'POST',
        body: formData,
      }
    );
    
    if (!response.ok) {
      throw new Error('Upload failed');
    }
    
    const data = await response.json();
    return {
      publicId: data.public_id,
      url: data.secure_url,
    };
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};


export const downloadImage = async (url: string, filename: string = 'imagecraft_export.jpg') => {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('Download error:', error);
  }
};
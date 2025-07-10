import { Cloudinary } from '@cloudinary/url-gen';

// Initialize Cloudinary (you'll need to set your cloud name)
const cld = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_ClOUD_NAME // Replace with your actual cloud name
  }
});

console.log(cld)

export const uploadImage = async (file: File): Promise<{ publicId: string; url: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', import.meta.env.VITE_UPLOAD_PRESET_NAME); // Replace with your upload preset
  
  try {
    const response = await fetch(
      import.meta.env.VITE_ClOUDINARY_URL, // Replace import.meta.env.VITE_ClOUD_NAME with your cloud name
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


export type ExportFormat = 'jpeg' | 'png' | 'webp';

export const getFormattedImageUrl = (originalUrl: string, format: ExportFormat): string => {
  // If the URL already has transformations, we need to add the format parameter
  if (originalUrl.includes('/upload/')) {
    // Insert format transformation after /upload/
    return originalUrl.replace('/upload/', `/upload/f_${format}/`);
  }

  // If no transformations exist, add format transformation
  const urlParts = originalUrl.split('/upload/');
  if (urlParts.length === 2) {
    return `${urlParts[0]}/upload/f_${format}/${urlParts[1]}`;
  }

  return originalUrl;
};

export const downloadImage = async (
  url: string,
  format: ExportFormat = 'jpeg',
  filename?: string
) => {
  try {
    // Get the formatted URL for the specified format
    const formattedUrl = getFormattedImageUrl(url, format);

    // Generate filename if not provided
    const defaultFilename = filename || `imagecraft_export.${format === 'jpeg' ? 'jpg' : format}`;

    const response = await fetch(formattedUrl);
    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = defaultFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('Download error:', error);
    throw error;
  }
};
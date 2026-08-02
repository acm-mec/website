/**
 * Uploads an image file to ImgBB using the REST API v1.
 * @param {File} file - The image file object from file input
 * @param {string} [customApiKey] - Optional custom API key to override env key
 * @returns {Promise<{ url: string, display_url: string, delete_url: string }>}
 */
export async function uploadToImgBB(file, customApiKey = "") {
  const apiKey = customApiKey || import.meta.env.VITE_IMGBB_API_KEY;

  if (!apiKey) {
    throw new Error(
      "ImgBB API Key is missing. Please configure VITE_IMGBB_API_KEY in your .env file or enter an API key in Admin Settings."
    );
  }

  if (!file) {
    throw new Error("No image file provided for upload.");
  }

  // Validate file size (max 32MB according to ImgBB specs)
  const MAX_SIZE_MB = 32;
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    throw new Error(`Image file size exceeds maximum limit of ${MAX_SIZE_MB}MB.`);
  }

  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch(`https://api.imgbb.com/1/upload?key=${encodeURIComponent(apiKey)}`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      const errorMsg = data?.error?.message || `ImgBB upload failed with status ${response.status}`;
      throw new Error(errorMsg);
    }

    return {
      url: data.data.url,
      display_url: data.data.display_url || data.data.url,
      delete_url: data.data.delete_url || "",
    };
  } catch (error) {
    console.error("Error uploading image to ImgBB:", error);
    throw error;
  }
}

// actions.ts
import axios from "axios";

export const sendFile = async (file: File): Promise<{ fileUrl: string | null; error: string | null }> => {
  const data = new FormData();
  data.append("image", file);

  try {
    const response = await axios.post("/api/image-upload", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const url = response.data as { fileUrl: string };

    if (!url.fileUrl) throw new Error("File URL not found in response");

    return { fileUrl: url.fileUrl, error: null };
  } catch (err: any) {
    return { fileUrl: null, error: err.message || "Unknown error" };
  }
};

import axios from "axios";

async function uploadToStorage(file: File): Promise<string> {
  // TODO: Implement actual file upload to a storage service
  // For now, we'll use a mock URL
  return new Promise((resolve) => {
    // Simulate file upload delay
    setTimeout(() => {
      const mockUrl = `https://storage.example.com/files/${file.name}`;
      resolve(mockUrl);
    }, 1000);
  });
}

async function createFileRecord(url: string) {
  const response = await axios.post("/api/uploadFile", { url });
  return response.data;
}

const UploadService = {
  async uploadFile(file: File) {
    // First upload to storage
    const url = await uploadToStorage(file);

    // Then create a record in the database
    const fileRecord = await createFileRecord(url);

    return fileRecord;
  },
};

export default UploadService;

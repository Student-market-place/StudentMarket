import { Input } from "@/components/ui/input";
import { useState } from "react";
import UploadService from "@/services/upload.service";

interface FileUploadProps {
  onUploadComplete: (url: string) => void;
  accept?: string;
}

export function FileUpload({ onUploadComplete, accept = "*/*" }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('📄 Fichier CV sélectionné:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    try {
      setIsUploading(true);
      console.log('⏳ Début de l\'upload du CV...');
      const { url } = await UploadService.uploadFile(file, 'cv');
      console.log('✅ CV uploadé avec succès:', url);
      onUploadComplete(url);
    } catch (error) {
      console.error('❌ Erreur lors de l\'upload du CV:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Input
        type="file"
        accept={accept}
        onChange={handleFileChange}
        disabled={isUploading}
        className="w-full"
      />
      {isUploading && <p className="text-sm text-muted-foreground">Upload en cours...</p>}
    </div>
  );
} 
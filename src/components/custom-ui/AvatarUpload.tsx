"use client";

import type React from "react";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import UploadService from "@/services/upload.service";

interface AvatarUploadProps {
  fallback: string;
  onUploadComplete: (url: string) => void;
}

export function AvatarUpload({ fallback, onUploadComplete }: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('📸 Fichier image sélectionné:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    console.log('🖼️ Preview URL créée:', objectUrl);

    try {
      setIsUploading(true);
      console.log('⏳ Début de l\'upload de l\'image de profil...');
      const { url } = await UploadService.uploadFile(file, 'profile-pictures');
      console.log('✅ Image uploadée avec succès:', url);
      onUploadComplete(url);
    } catch (error) {
      console.error('❌ Erreur lors de l\'upload de l\'image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className="h-24 w-24">
        <AvatarImage src={preview || ""} />
        <AvatarFallback>{fallback}</AvatarFallback>
      </Avatar>
      <Input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={isUploading}
        className="w-full max-w-xs"
      />
      {isUploading && <p className="text-sm text-muted-foreground">Upload en cours...</p>}
    </div>
  );
}

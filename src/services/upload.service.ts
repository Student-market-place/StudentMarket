import { supabase } from '@/lib/supabase';
import { StorageError } from '@supabase/storage-js';

interface UploadResponse {
  url: string;
}

async function uploadFile(file: File, folder: 'profile-pictures' | 'cv'): Promise<UploadResponse> {
  try {
    console.log(`🚀 Début de l'upload dans le dossier ${folder}:`, {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });

    const fileName = `${folder}/${Date.now()}-${file.name}`;
    console.log('📝 Nom du fichier généré:', fileName);

    // Configuration de l'upload public avec l'API anonyme
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('files')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      });

    if (uploadError) {
      console.error('❌ Erreur Supabase lors de l\'upload:', {
        message: uploadError.message,
        name: uploadError.name
      });
      throw uploadError;
    }

    console.log('✅ Upload réussi:', uploadData);

    // Génération de l'URL publique
    const { data: { publicUrl } } = supabase.storage
      .from('files')
      .getPublicUrl(fileName);

    console.log('🔗 URL publique générée:', publicUrl);

    return {
      url: publicUrl
    };
  } catch (error) {
    if (error instanceof StorageError) {
      console.error('❌ Erreur détaillée lors de l\'upload:', {
        message: error.message,
        name: error.name
      });
    } else {
      console.error('❌ Erreur inconnue lors de l\'upload:', error);
    }
    throw error;
  }
}

const UploadService = {
  uploadFile
};

export default UploadService; 
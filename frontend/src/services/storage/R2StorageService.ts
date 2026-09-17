import { StorageService, StorageUploadResult } from './StorageService';

export class R2StorageService implements StorageService {
  async getSignedUploadUrl(folder: string, filename: string, contentType: string = 'image/jpeg'): Promise<StorageUploadResult> {
    try {
      const res = await fetch('/api/storage/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ folder, filename, contentType }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        return data.data;
      }
      throw new Error(data.error?.message || 'Failed to get upload URL');
    } catch (e: any) {
      return {
        key: `aviron/${folder}/${filename}`,
        uploadUrl: `https://demo-r2.aviron.io/upload-simulated`,
        publicUrl: `https://demo-r2.aviron.io/media/aviron/${folder}/${filename}`,
        isSimulated: true,
      };
    }
  }

  async getSignedDownloadUrl(key: string): Promise<string> {
    try {
      const res = await fetch(`/api/storage/signed-url?key=${encodeURIComponent(key)}`);
      const data = await res.json();
      return data.data?.downloadUrl || `https://demo-r2.aviron.io/media/${key}`;
    } catch {
      return `https://demo-r2.aviron.io/media/${key}`;
    }
  }
}

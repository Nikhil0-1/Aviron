import { StorageService, StorageUploadResult } from './StorageService';

export class DemoStorageService implements StorageService {
  async getSignedUploadUrl(folder: string, filename: string, contentType: string = 'image/jpeg'): Promise<StorageUploadResult> {
    const key = `aviron/${folder}/${filename}`;
    return {
      key,
      uploadUrl: `https://demo-r2.aviron.io/upload-simulated?key=${encodeURIComponent(key)}`,
      publicUrl: `https://demo-r2.aviron.io/media/${key}`,
      isSimulated: true,
    };
  }

  async getSignedDownloadUrl(key: string): Promise<string> {
    return `https://demo-r2.aviron.io/media/${key}`;
  }
}

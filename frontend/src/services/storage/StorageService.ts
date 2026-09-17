export interface StorageUploadResult {
  key: string;
  uploadUrl: string;
  publicUrl: string;
  isSimulated: boolean;
}

export interface StorageService {
  getSignedUploadUrl(folder: string, filename: string, contentType?: string): Promise<StorageUploadResult>;
  getSignedDownloadUrl(key: string): Promise<string>;
}

import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const accountId = process.env.R2_ACCOUNT_ID || '';
const accessKeyId = process.env.R2_ACCESS_KEY_ID || '';
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY || '';
export const bucketName = process.env.R2_BUCKET_NAME || 'aviron-rescue-storage';

export let isR2Configured = false;
export let r2Client: S3Client | null = null;

if (accountId && accessKeyId && secretAccessKey && !accountId.includes('your-cloudflare-account')) {
  try {
    r2Client = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });
    isR2Configured = true;
    console.log('☁️ Cloudflare R2 Storage S3 client initialized.');
  } catch (error) {
    console.warn('⚠️ Could not initialize Cloudflare R2 S3 Client:', error);
  }
} else {
  console.log('ℹ️ Cloudflare R2 credentials not set. Simulated media URLs active.');
}

export async function generateR2SignedUploadUrl(key: string, contentType: string = 'image/jpeg') {
  if (!isR2Configured || !r2Client) {
    return {
      uploadUrl: `https://demo-r2.aviron.io/upload-simulated?key=${encodeURIComponent(key)}`,
      publicUrl: `https://demo-r2.aviron.io/media/${key}`,
      isSimulated: true,
    };
  }

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 });
  const publicUrl = `${process.env.R2_ENDPOINT}/${bucketName}/${key}`;

  return { uploadUrl, publicUrl, isSimulated: false };
}

export async function generateR2SignedDownloadUrl(key: string) {
  if (!isR2Configured || !r2Client) {
    return `https://demo-r2.aviron.io/media/${key}`;
  }

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  return await getSignedUrl(r2Client, command, { expiresIn: 86400 });
}

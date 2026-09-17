import { Router } from 'express';
import { generateR2SignedUploadUrl, generateR2SignedDownloadUrl } from '../config/r2';

const router = Router();

// POST /api/storage/upload-url
router.post('/upload-url', async (req, res) => {
  try {
    const { folder, filename, contentType } = req.body;
    const targetFolder = folder || 'missions/general';
    const targetName = filename || `media-${Date.now()}.jpg`;
    const key = `aviron/${targetFolder}/${targetName}`;

    const urlData = await generateR2SignedUploadUrl(key, contentType || 'image/jpeg');

    return res.json({
      success: true,
      data: {
        key,
        uploadUrl: urlData.uploadUrl,
        publicUrl: urlData.publicUrl,
        isSimulated: urlData.isSimulated,
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
});

// GET /api/storage/signed-url
router.get('/signed-url', async (req, res) => {
  try {
    const { key } = req.query;
    if (!key) {
      return res.status(400).json({ success: false, error: { code: 'INVALID_INPUT', message: 'File key is required' } });
    }

    const downloadUrl = await generateR2SignedDownloadUrl(String(key));
    return res.json({ success: true, data: { downloadUrl } });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
});

export default router;

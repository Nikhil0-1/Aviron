import { Router } from 'express';
import { prisma } from '../db/prisma';

const router = Router();

// GET /api/detections
router.get('/', async (req, res) => {
  try {
    const detections = await prisma.detection.findMany({
      include: {
        avironUnit: { select: { code: true, name: true } },
        survivors: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return res.json({ success: true, data: detections });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
});

export default router;

import { Router } from 'express';
import { prisma } from '../db/prisma';

const router = Router();

// GET /api/alerts
router.get('/', async (req, res) => {
  try {
    const alerts = await prisma.alert.findMany({
      include: {
        avironUnit: { select: { code: true, name: true } },
        mission: { select: { code: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return res.json({ success: true, data: alerts });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
});

// PATCH /api/alerts/:id/acknowledge
router.patch('/:id/acknowledge', async (req, res) => {
  try {
    const alert = await prisma.alert.update({
      where: { id: req.params.id },
      data: { isAcknowledged: true },
    });
    return res.json({ success: true, data: alert });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
});

export default router;

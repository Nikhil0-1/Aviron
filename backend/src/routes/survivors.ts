import { Router } from 'express';
import { prisma } from '../db/prisma';
import { broadcastEvent } from '../services/websocketService';

const router = Router();

// GET /api/survivors
router.get('/', async (req, res) => {
  try {
    const survivors = await prisma.survivor.findMany({
      include: {
        assessments: { orderBy: { assessedAt: 'desc' } },
        mission: { select: { code: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ success: true, data: survivors });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
});

// PATCH /api/survivors/:id/status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, notes } = req.body;
    const survivor = await prisma.survivor.update({
      where: { id: req.params.id },
      data: {
        status,
        ...(notes && { notes }),
      },
    });

    broadcastEvent('survivor_update', { survivor });

    return res.json({ success: true, data: survivor });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
});

// POST /api/survivors/:id/medical
router.post('/:id/medical', async (req, res) => {
  try {
    const { triageLevel, heartRate, spO2, temperature, notes } = req.body;
    const assessment = await prisma.medicalAssessment.create({
      data: {
        survivorId: req.params.id,
        triageLevel: triageLevel || 'YELLOW',
        heartRate: parseInt(heartRate || '80'),
        spO2: parseInt(spO2 || '95'),
        temperature: parseFloat(temperature || '36.8'),
        notes: notes || 'Vitals checked by medical operator.',
      },
    });

    return res.status(201).json({ success: true, data: assessment });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
});

export default router;

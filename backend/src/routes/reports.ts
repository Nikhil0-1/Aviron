import { Router } from 'express';
import { prisma } from '../db/prisma';

const router = Router();

// GET /api/reports
router.get('/', async (req, res) => {
  try {
    const reports = await prisma.missionReport.findMany({
      include: {
        mission: {
          include: {
            avironUnit: true,
            survivors: true,
            events: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ success: true, data: reports });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
});

// GET /api/reports/:id
router.get('/:id', async (req, res) => {
  try {
    const report = await prisma.missionReport.findUnique({
      where: { id: req.params.id },
      include: {
        mission: {
          include: {
            avironUnit: true,
            survivors: { include: { assessments: true } },
            waypoints: true,
            events: { orderBy: { timestamp: 'asc' } },
            alerts: true,
            payloads: true,
          },
        },
      },
    });

    if (!report) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Report not found' } });
    }

    return res.json({ success: true, data: report });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
});

// POST /api/reports
router.post('/', async (req, res) => {
  try {
    const { missionId, operatorName, durationMinutes, distanceKm, survivorsFound, batteryUsed, summary } = req.body;

    const mission = await prisma.mission.findUnique({ where: { id: missionId } });
    if (!mission) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Mission not found' } });
    }

    const report = await prisma.missionReport.create({
      data: {
        missionId,
        title: `Official Rescue Report: ${mission.code} - ${mission.title}`,
        operatorName: operatorName || 'Sarah Connor (Operator)',
        startTime: mission.createdAt,
        endTime: new Date(),
        durationMinutes: parseInt(durationMinutes || '35'),
        distanceKm: parseFloat(distanceKm || '6.8'),
        survivorsFound: parseInt(survivorsFound || '1'),
        batteryUsed: parseFloat(batteryUsed || '26.0'),
        summary: summary || `Autonomous mission ${mission.code} successfully executed. Survivors localized and emergency payload delivered.`,
      },
    });

    return res.status(201).json({ success: true, data: report });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
});

export default router;

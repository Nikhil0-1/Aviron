import { Router } from 'express';
import { prisma } from '../db/prisma';
import { broadcastEvent } from '../services/websocketService';

const router = Router();

// GET /api/missions - List missions
router.get('/', async (req, res) => {
  try {
    const missions = await prisma.mission.findMany({
      include: {
        avironUnit: true,
        survivors: true,
        waypoints: { orderBy: { seq: 'asc' } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ success: true, data: missions });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
});

// POST /api/missions - Create mission
router.post('/', async (req, res) => {
  try {
    const { title, type, priority, targetLat, targetLng, searchRadius, avironUnitId, waypoints } = req.body;

    if (!title || !type || !targetLat || !targetLng) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_INPUT', message: 'Missing required mission fields' },
      });
    }

    const count = await prisma.mission.count();
    const code = `AV-${String(count + 1).padStart(3, '0')}`;

    const newMission = await prisma.mission.create({
      data: {
        code,
        title,
        type,
        priority: priority || 'HIGH',
        status: 'READY',
        targetLat: parseFloat(targetLat),
        targetLng: parseFloat(targetLng),
        searchRadius: parseFloat(searchRadius || '500'),
        avironUnitId: avironUnitId || null,
        waypoints: {
          create: Array.isArray(waypoints)
            ? waypoints.map((wp: any, idx: number) => ({
                seq: idx + 1,
                lat: parseFloat(wp.lat),
                lng: parseFloat(wp.lng),
                altitude: parseFloat(wp.altitude || '15'),
                action: wp.action || 'NAVIGATE',
              }))
            : [],
        },
      },
      include: {
        waypoints: true,
        avironUnit: true,
      },
    });

    broadcastEvent('mission_update', {
      event: 'CREATED',
      mission: newMission,
    });

    return res.status(201).json({ success: true, data: newMission });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
});

// GET /api/missions/:id - Get mission details
router.get('/:id', async (req, res) => {
  try {
    const mission = await prisma.mission.findUnique({
      where: { id: req.params.id },
      include: {
        avironUnit: true,
        waypoints: { orderBy: { seq: 'asc' } },
        survivors: { include: { assessments: true } },
        detections: true,
        payloads: true,
        alerts: { orderBy: { createdAt: 'desc' } },
        events: { orderBy: { timestamp: 'desc' } },
        reports: true,
      },
    });

    if (!mission) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Mission not found' } });
    }

    return res.json({ success: true, data: mission });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
});

// POST /api/missions/:id/start
router.post('/:id/start', async (req, res) => {
  try {
    const mission = await prisma.mission.update({
      where: { id: req.params.id },
      data: { status: 'IN_PROGRESS' },
      include: { avironUnit: true },
    });

    if (mission.avironUnitId) {
      await prisma.avironUnit.update({
        where: { id: mission.avironUnitId },
        data: { status: 'ACTIVE' },
      });
    }

    await prisma.missionEvent.create({
      data: {
        missionId: mission.id,
        eventType: 'MISSION_STARTED',
        description: `Mission ${mission.code} initiated by operator.`,
      },
    });

    broadcastEvent('mission_update', { event: 'STARTED', mission });

    return res.json({ success: true, message: `Mission ${mission.code} started`, data: mission });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
});

// POST /api/missions/:id/pause
router.post('/:id/pause', async (req, res) => {
  try {
    const mission = await prisma.mission.update({
      where: { id: req.params.id },
      data: { status: 'PAUSED' },
    });

    broadcastEvent('mission_update', { event: 'PAUSED', mission });

    return res.json({ success: true, message: `Mission ${mission.code} paused`, data: mission });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
});

// POST /api/missions/:id/resume
router.post('/:id/resume', async (req, res) => {
  try {
    const mission = await prisma.mission.update({
      where: { id: req.params.id },
      data: { status: 'IN_PROGRESS' },
    });

    broadcastEvent('mission_update', { event: 'RESUMED', mission });

    return res.json({ success: true, message: `Mission ${mission.code} resumed`, data: mission });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
});

// POST /api/missions/:id/abort
router.post('/:id/abort', async (req, res) => {
  try {
    const mission = await prisma.mission.update({
      where: { id: req.params.id },
      data: { status: 'ABORTED' },
    });

    if (mission.avironUnitId) {
      await prisma.avironUnit.update({
        where: { id: mission.avironUnitId },
        data: { status: 'STANDBY', speed: 0.0 },
      });
    }

    await prisma.missionEvent.create({
      data: {
        missionId: mission.id,
        eventType: 'MISSION_ABORTED',
        description: `Mission ${mission.code} aborted by command center.`,
      },
    });

    broadcastEvent('mission_update', { event: 'ABORTED', mission });

    return res.json({ success: true, message: `Mission ${mission.code} aborted`, data: mission });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
});

export default router;

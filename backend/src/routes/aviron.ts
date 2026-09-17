import { Router } from 'express';
import { prisma } from '../db/prisma';
import { broadcastEvent } from '../services/websocketService';

const router = Router();

// GET /api/aviron - List all units
router.get('/', async (req, res) => {
  try {
    const units = await prisma.avironUnit.findMany({
      include: {
        missions: {
          where: { status: { in: ['IN_PROGRESS', 'READY', 'PAUSED'] } },
          take: 1,
        },
      },
      orderBy: { code: 'asc' },
    });
    return res.json({ success: true, data: units });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
});

// GET /api/aviron/:id - Get unit detail
router.get('/:id', async (req, res) => {
  try {
    const unit = await prisma.avironUnit.findUnique({
      where: { id: req.params.id },
      include: {
        missions: true,
        telemetry: { take: 20, orderBy: { timestamp: 'desc' } },
        alerts: { take: 10, orderBy: { createdAt: 'desc' } },
        payloads: true,
      },
    });

    if (!unit) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'AVIRON unit not found' } });
    }

    return res.json({ success: true, data: unit });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
});

// GET /api/aviron/:id/status
router.get('/:id/status', async (req, res) => {
  try {
    const unit = await prisma.avironUnit.findUnique({
      where: { id: req.params.id },
      select: { id: true, code: true, name: true, status: true, battery: true, signalStrength: true, lastSeen: true },
    });
    if (!unit) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Unit not found' } });
    }
    return res.json({ success: true, data: unit });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
});

// GET /api/aviron/:id/telemetry
router.get('/:id/telemetry', async (req, res) => {
  try {
    const telemetry = await prisma.telemetry.findMany({
      where: { avironUnitId: req.params.id },
      take: 50,
      orderBy: { timestamp: 'desc' },
    });
    return res.json({ success: true, data: telemetry });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
});

// POST /api/aviron/:id/return-home
router.post('/:id/return-home', async (req, res) => {
  try {
    const unit = await prisma.avironUnit.update({
      where: { id: req.params.id },
      data: { status: 'ACTIVE' },
    });

    const timestamp = new Date().toISOString();
    broadcastEvent('command_acknowledgement', {
      unitId: unit.id,
      unitCode: unit.code,
      command: 'RETURN_TO_BASE',
      status: 'ACKNOWLEDGED',
      timestamp,
    });

    return res.json({
      success: true,
      message: `Command RETURN_TO_BASE acknowledged by ${unit.code}`,
      data: { command: 'RETURN_TO_BASE', unitCode: unit.code, acknowledgedAt: timestamp },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
});

// POST /api/aviron/:id/emergency-stop
router.post('/:id/emergency-stop', async (req, res) => {
  try {
    const unit = await prisma.avironUnit.update({
      where: { id: req.params.id },
      data: { status: 'STANDBY', speed: 0.0 },
    });

    const timestamp = new Date().toISOString();
    broadcastEvent('system_alert', {
      severity: 'CRITICAL',
      title: 'EMERGENCY STOP ENGAGED',
      message: `Emergency stop initiated for ${unit.code}. Motors halted. Hover/Hold position active.`,
      unitId: unit.id,
      timestamp,
    });

    return res.json({
      success: true,
      message: `EMERGENCY STOP executed for ${unit.code}`,
      data: { command: 'EMERGENCY_STOP', unitCode: unit.code, status: 'HALTED', timestamp },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
});

export default router;

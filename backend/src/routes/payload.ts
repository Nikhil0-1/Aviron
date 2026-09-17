import { Router } from 'express';
import { prisma } from '../db/prisma';
import { broadcastEvent } from '../services/websocketService';

const router = Router();

// POST /api/payload/deploy
router.post('/deploy', async (req, res) => {
  try {
    const { payloadId, missionId, avironUnitId } = req.body;

    let payload;
    if (payloadId) {
      payload = await prisma.payload.update({
        where: { id: payloadId },
        data: {
          status: 'DELIVERED',
          deployedAt: new Date(),
        },
      });
    } else {
      payload = await prisma.payload.create({
        data: {
          name: 'Emergency Medical Assistance Kit',
          type: 'MEDICAL_KIT',
          status: 'DELIVERED',
          deployedAt: new Date(),
          missionId,
          avironUnitId,
        },
      });
    }

    if (missionId) {
      await prisma.missionEvent.create({
        data: {
          missionId,
          eventType: 'PAYLOAD_DEPLOYED',
          description: `Payload "${payload.name}" released and delivered to survivor location.`,
        },
      });
    }

    broadcastEvent('payload_update', {
      event: 'DEPLOYED',
      payload,
    });

    return res.json({
      success: true,
      message: `Payload ${payload.name} successfully deployed!`,
      data: payload,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
});

export default router;

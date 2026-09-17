import { Router } from 'express';
import { supabase, isSupabaseConfigured } from '../config/supabase';
import { prisma } from '../db/prisma';

const router = Router();

// POST /api/profiles/sync - Sync Firebase user with Supabase profiles
router.post('/sync', async (req, res) => {
  try {
    const { firebase_uid, email, full_name, role } = req.body;

    if (!firebase_uid || !email) {
      return res.status(400).json({ success: false, error: { code: 'INVALID_INPUT', message: 'Missing firebase_uid or email' } });
    }

    const assignedRole = role || 'OPERATOR';

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('profiles')
        .upsert(
          {
            firebase_uid,
            email,
            full_name: full_name || 'AVIRON Operator',
            role: assignedRole,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'firebase_uid' }
        )
        .select()
        .single();

      if (error) {
        console.warn('Supabase upsert profile warning:', error.message);
      } else {
        return res.json({ success: true, data });
      }
    }

    // Fallback sync with local Prisma DB
    const user = await prisma.user.upsert({
      where: { email },
      update: { name: full_name || 'AVIRON Operator', role: assignedRole },
      create: {
        email,
        name: full_name || 'AVIRON Operator',
        password: 'synced_firebase_auth',
        role: assignedRole,
      },
    });

    return res.json({
      success: true,
      data: {
        id: user.id,
        firebase_uid,
        full_name: user.name,
        email: user.email,
        role: user.role,
        updated_at: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: error.message } });
  }
});

export default router;

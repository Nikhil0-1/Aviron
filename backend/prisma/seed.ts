import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding AVIRON database...');

  // Clean existing data
  await prisma.connectionLog.deleteMany({});
  await prisma.systemComponent.deleteMany({});
  await prisma.missionReport.deleteMany({});
  await prisma.missionEvent.deleteMany({});
  await prisma.communicationMessage.deleteMany({});
  await prisma.alert.deleteMany({});
  await prisma.payload.deleteMany({});
  await prisma.medicalAssessment.deleteMany({});
  await prisma.survivor.deleteMany({});
  await prisma.detection.deleteMany({});
  await prisma.telemetry.deleteMany({});
  await prisma.waypoint.deleteMany({});
  await prisma.mission.deleteMany({});
  await prisma.avironUnit.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Users
  const hashedPassword = await bcrypt.hash('aviron2026', 10);
  
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@aviron.io',
      name: 'Cmdr. Alex Vance',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });

  const operatorUser = await prisma.user.create({
    data: {
      email: 'operator@aviron.io',
      name: 'Sarah Connor (Operator)',
      password: hashedPassword,
      role: 'OPERATOR',
    },
  });

  const medicalUser = await prisma.user.create({
    data: {
      email: 'medical@aviron.io',
      name: 'Dr. Elena Rostova',
      password: hashedPassword,
      role: 'MEDICAL_OPERATOR',
    },
  });

  const viewerUser = await prisma.user.create({
    data: {
      email: 'viewer@aviron.io',
      name: 'HQ Dispatcher (Read-Only)',
      password: hashedPassword,
      role: 'VIEWER',
    },
  });

  console.log('✅ Users seeded');

  // 2. AVIRON Units
  const unit1 = await prisma.avironUnit.create({
    data: {
      code: 'AVIRON-01',
      name: 'Alpha Sentinel',
      model: 'AVIRON Mk-IV Amphibious Recon',
      status: 'ACTIVE',
      battery: 74.0,
      lat: 28.6139,
      lng: 77.2090,
      speed: 4.8,
      heading: 135.0,
      signalStrength: 92,
      ipAddress: '192.168.1.100',
    },
  });

  const unit2 = await prisma.avironUnit.create({
    data: {
      code: 'AVIRON-02',
      name: 'Bravo Vanguard',
      model: 'AVIRON Mk-IV Rapid Drone',
      status: 'STANDBY',
      battery: 91.5,
      lat: 28.6180,
      lng: 77.2150,
      speed: 0.0,
      heading: 0.0,
      signalStrength: 98,
      ipAddress: '192.168.1.101',
    },
  });

  const unit3 = await prisma.avironUnit.create({
    data: {
      code: 'AVIRON-03',
      name: 'Charlie Guardian',
      model: 'AVIRON Mk-III Heavy Payload',
      status: 'CHARGING',
      battery: 42.0,
      lat: 28.6100,
      lng: 77.2020,
      speed: 0.0,
      heading: 270.0,
      signalStrength: 88,
      ipAddress: '192.168.1.102',
    },
  });

  const unit4 = await prisma.avironUnit.create({
    data: {
      code: 'AVIRON-04',
      name: 'Delta Scout',
      model: 'AVIRON Mk-II Micro Drone',
      status: 'OFFLINE',
      battery: 12.0,
      lat: 28.6050,
      lng: 77.1950,
      speed: 0.0,
      heading: 90.0,
      signalStrength: 0,
      ipAddress: '192.168.1.103',
    },
  });

  console.log('✅ AVIRON Units seeded');

  // 3. Missions
  const mission1 = await prisma.mission.create({
    data: {
      code: 'AV-001',
      title: 'Flood Rescue & Survivor Extraction',
      type: 'FLOOD_RESCUE',
      priority: 'CRITICAL',
      status: 'IN_PROGRESS',
      targetLat: 28.6155,
      targetLng: 77.2125,
      searchRadius: 600.0,
      avironUnitId: unit1.id,
      waypoints: {
        create: [
          { seq: 1, lat: 28.6139, lng: 77.2090, altitude: 20, action: 'TAKEOFF', isReached: true },
          { seq: 2, lat: 28.6145, lng: 77.2105, altitude: 25, action: 'NAVIGATE', isReached: true },
          { seq: 3, lat: 28.6150, lng: 77.2115, altitude: 22, action: 'SEARCH_PATTERN', isReached: true },
          { seq: 4, lat: 28.6155, lng: 77.2125, altitude: 15, action: 'HOVER_SURVIVOR', isReached: false },
          { seq: 5, lat: 28.6160, lng: 77.2140, altitude: 20, action: 'DEPLOY_PAYLOAD', isReached: false },
          { seq: 6, lat: 28.6139, lng: 77.2090, altitude: 20, action: 'RETURN_BASE', isReached: false },
        ],
      },
    },
  });

  const mission2 = await prisma.mission.create({
    data: {
      code: 'AV-002',
      title: 'Medical Supply Drop to Sector 4',
      type: 'MEDICAL_SUPPLY_DELIVERY',
      priority: 'HIGH',
      status: 'READY',
      targetLat: 28.6220,
      targetLng: 77.2210,
      searchRadius: 400.0,
      avironUnitId: unit2.id,
    },
  });

  const mission3 = await prisma.mission.create({
    data: {
      code: 'AV-003',
      title: 'Thermal Wildfire Reconnaissance',
      type: 'DISASTER_RECON',
      priority: 'MEDIUM',
      status: 'COMPLETED',
      targetLat: 28.6300,
      targetLng: 77.2300,
      searchRadius: 1000.0,
      avironUnitId: unit1.id,
    },
  });

  console.log('✅ Missions seeded');

  // 4. Detection & Survivor
  const detection1 = await prisma.detection.create({
    data: {
      avironUnitId: unit1.id,
      missionId: mission1.id,
      type: 'HUMAN',
      confidence: 94.2,
      lat: 28.6152,
      lng: 77.2120,
      isConfirmed: true,
    },
  });

  const survivor1 = await prisma.survivor.create({
    data: {
      code: 'SURVIVOR #001',
      detectionId: detection1.id,
      missionId: mission1.id,
      status: 'ASSISTANCE_REQUESTED',
      heartRate: 88,
      spO2: 96,
      temperature: 36.9,
      lat: 28.6152,
      lng: 77.2120,
      notes: 'Stranded on elevated structure due to rising floodwaters. Waving for rescue.',
    },
  });

  await prisma.medicalAssessment.create({
    data: {
      survivorId: survivor1.id,
      triageLevel: 'YELLOW',
      heartRate: 88,
      spO2: 96,
      temperature: 36.9,
      notes: 'Stable vitals, mild hypothermia risk. Medical kit required immediately.',
    },
  });

  console.log('✅ Detections & Survivors seeded');

  // 5. Payloads
  await prisma.payload.createMany({
    data: [
      {
        avironUnitId: unit1.id,
        missionId: mission1.id,
        name: 'Rapid Emergency Aid Kit (REAK-1)',
        type: 'MEDICAL_KIT',
        status: 'LOADED',
      },
      {
        avironUnitId: unit1.id,
        missionId: mission1.id,
        name: 'Emergency VHF Comm Beacon',
        type: 'COMM_DEVICE',
        status: 'READY',
      },
      {
        avironUnitId: unit2.id,
        missionId: mission2.id,
        name: 'Insulin & Blood Plasma Transport Unit',
        type: 'EMERGENCY_SUPPLIES',
        status: 'READY',
      },
    ],
  });

  console.log('✅ Payloads seeded');

  // 6. Alerts
  await prisma.alert.createMany({
    data: [
      {
        avironUnitId: unit1.id,
        missionId: mission1.id,
        severity: 'HIGH',
        title: 'SURVIVOR DETECTED',
        message: 'AI thermal vision confirmed human presence at 28.6152, 77.2120 with 94.2% confidence.',
        isAcknowledged: false,
      },
      {
        avironUnitId: unit1.id,
        missionId: mission1.id,
        severity: 'WARNING',
        title: 'OBSTACLE AVOIDANCE ENGAGED',
        message: 'Debris structure detected in primary flight path. Autonomous recalculation active.',
        isAcknowledged: true,
      },
      {
        avironUnitId: unit4.id,
        severity: 'CRITICAL',
        title: 'UNIT OFFLINE',
        message: 'AVIRON-04 telemetry signal lost. Battery depleted at 12%. Emergency beacon initiated.',
        isAcknowledged: false,
      },
    ],
  });

  console.log('✅ Alerts seeded');

  // 7. Timeline Events
  await prisma.missionEvent.createMany({
    data: [
      { missionId: mission1.id, eventType: 'MISSION_STARTED', description: 'Mission AV-001 launched under operator command.' },
      { missionId: mission1.id, eventType: 'GPS_LOCK', description: 'Dual RTK GPS locked with 12 satellites. Accuracy 0.05m.' },
      { missionId: mission1.id, eventType: 'OBSTACLE_DETECTED', description: 'Power line obstacle identified. Route recalculated dynamically.' },
      { missionId: mission1.id, eventType: 'SURVIVOR_DETECTED', description: 'Human presence detected via RGB + Thermal sensor fusion.' },
      { missionId: mission1.id, eventType: 'COMMUNICATION_LINK', description: 'VHF Emergency link established with stranded survivor.' },
    ],
  });

  // 8. Communication Messages
  await prisma.communicationMessage.createMany({
    data: [
      { avironUnitId: unit1.id, sender: 'OPERATOR', message: 'AVIRON-01, proceed to sector 2 flood coordinates.' },
      { avironUnitId: unit1.id, sender: 'AVIRON', message: 'Command acknowledged. Navigation lock engaged. En route.' },
      { avironUnitId: unit1.id, sender: 'AVIRON', message: 'Visual and thermal match found. Survivor confirmed.' },
      { avironUnitId: unit1.id, sender: 'OPERATOR', message: 'Prepare medical payload deployment. Stand by for drop signal.' },
    ],
  });

  // 9. System Components Health
  await prisma.systemComponent.createMany({
    data: [
      { name: 'Raspberry Pi 4 Gateway', type: 'HARDWARE', status: 'ONLINE', details: 'CPU Temp: 42°C | RAM: 1.2GB/4GB | Uptime: 14h 22m' },
      { name: 'Dual RTK GPS Module', type: 'NAVIGATION', status: 'ONLINE', details: 'Satellites: 14 | Accuracy: 0.03m | Lock: FIX' },
      { name: 'HD RGB Optical Sensor', type: 'CAMERA', status: 'ONLINE', details: '1080p @ 60fps stream active' },
      { name: 'FLIR Thermal Camera', type: 'CAMERA', status: 'ONLINE', details: '640x512 Radiometric Core active' },
      { name: 'LIDAR Obstacle Scanner', type: 'SENSOR', status: 'ONLINE', details: '360° Scanning @ 20Hz' },
      { name: 'Long-Range Mesh Telemetry', type: 'NETWORK', status: 'ONLINE', details: 'Latency: 18ms | RSSI: -64 dBm' },
      { name: 'BMS Battery Management', type: 'HARDWARE', status: 'ONLINE', details: 'Cell Temp: 28°C | Health: 98%' },
    ],
  });

  // 10. Sample Completed Mission Report
  await prisma.missionReport.create({
    data: {
      missionId: mission3.id,
      title: 'Wildfire Reconnaissance Post-Mission Summary',
      operatorName: 'Sarah Connor',
      startTime: new Date(Date.now() - 86400000),
      endTime: new Date(Date.now() - 80000000),
      durationMinutes: 106,
      distanceKm: 14.2,
      survivorsFound: 2,
      batteryUsed: 68.5,
      summary: 'AVIRON-01 completed full perimeter thermal scan of sector 7. Identified 2 stranded forestry workers, broadcast coordinates to ground rescue team, and deployed emergency beacons successfully.',
    },
  });

  console.log('✅ Mission Reports & System Components seeded');
  console.log('🎉 AVIRON database seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

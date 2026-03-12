import { PrismaClient, TrackingType } from '@prisma/client';

const prisma = new PrismaClient();

// Fixed UUIDs for system records — stable across re-runs
const symptoms = [
  { id: 'a1000000-0000-0000-0000-000000000001', name: 'Headache', category: 'neurological' },
  { id: 'a1000000-0000-0000-0000-000000000002', name: 'Fatigue', category: 'general' },
  { id: 'a1000000-0000-0000-0000-000000000003', name: 'Joint Pain', category: 'pain' },
  { id: 'a1000000-0000-0000-0000-000000000004', name: 'Muscle Pain', category: 'pain' },
  { id: 'a1000000-0000-0000-0000-000000000005', name: 'Nausea', category: 'digestive' },
  { id: 'a1000000-0000-0000-0000-000000000006', name: 'Brain Fog', category: 'neurological' },
  { id: 'a1000000-0000-0000-0000-000000000007', name: 'Dizziness', category: 'neurological' },
  { id: 'a1000000-0000-0000-0000-000000000008', name: 'Insomnia', category: 'sleep' },
  { id: 'a1000000-0000-0000-0000-000000000009', name: 'Anxiety', category: 'mental' },
  { id: 'a1000000-0000-0000-0000-000000000010', name: 'Stomach Pain', category: 'digestive' },
  { id: 'a1000000-0000-0000-0000-000000000011', name: 'Back Pain', category: 'pain' },
];

const habits: { id: string; name: string; trackingType: TrackingType; unit: string | null }[] = [
  { id: 'b1000000-0000-0000-0000-000000000001', name: 'Sleep Duration', trackingType: TrackingType.duration, unit: 'hours' },
  { id: 'b1000000-0000-0000-0000-000000000002', name: 'Water Intake', trackingType: TrackingType.numeric, unit: 'glasses' },
  { id: 'b1000000-0000-0000-0000-000000000003', name: 'Exercise', trackingType: TrackingType.boolean, unit: null },
  { id: 'b1000000-0000-0000-0000-000000000004', name: 'Alcohol', trackingType: TrackingType.boolean, unit: null },
  { id: 'b1000000-0000-0000-0000-000000000005', name: 'Caffeine', trackingType: TrackingType.numeric, unit: 'cups' },
];

async function main() {
  console.log('Seeding default symptoms...');
  for (const symptom of symptoms) {
    await prisma.symptom.upsert({
      where: { id: symptom.id },
      update: {},
      create: { id: symptom.id, userId: null, name: symptom.name, category: symptom.category, isActive: true },
    });
  }

  console.log('Seeding default habits...');
  for (const habit of habits) {
    await prisma.habit.upsert({
      where: { id: habit.id },
      update: {},
      create: { id: habit.id, userId: null, name: habit.name, trackingType: habit.trackingType, unit: habit.unit, isActive: true },
    });
  }

  console.log('Done.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

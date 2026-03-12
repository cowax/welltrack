import { PrismaClient, TrackingType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding default symptoms...');

  const symptoms = [
    { name: 'Headache', category: 'neurological' },
    { name: 'Fatigue', category: 'general' },
    { name: 'Joint Pain', category: 'pain' },
    { name: 'Muscle Pain', category: 'pain' },
    { name: 'Nausea', category: 'digestive' },
    { name: 'Brain Fog', category: 'neurological' },
    { name: 'Dizziness', category: 'neurological' },
    { name: 'Insomnia', category: 'sleep' },
    { name: 'Anxiety', category: 'mental' },
    { name: 'Stomach Pain', category: 'digestive' },
    { name: 'Back Pain', category: 'pain' },
  ];

  for (const symptom of symptoms) {
    await prisma.symptom.upsert({
      where: {
        // system symptoms have no userId; use name as the unique key for seeding
        id: `system-symptom-${symptom.name.toLowerCase().replace(/ /g, '-')}`,
      },
      update: {},
      create: {
        id: `system-symptom-${symptom.name.toLowerCase().replace(/ /g, '-')}`,
        userId: null,
        name: symptom.name,
        category: symptom.category,
        isActive: true,
      },
    });
  }

  console.log('Seeding default habits...');

  const habits: { name: string; trackingType: TrackingType; unit: string | null }[] = [
    { name: 'Sleep Duration', trackingType: TrackingType.duration, unit: 'hours' },
    { name: 'Water Intake', trackingType: TrackingType.numeric, unit: 'glasses' },
    { name: 'Exercise', trackingType: TrackingType.boolean, unit: null },
    { name: 'Alcohol', trackingType: TrackingType.boolean, unit: null },
    { name: 'Caffeine', trackingType: TrackingType.numeric, unit: 'cups' },
  ];

  for (const habit of habits) {
    await prisma.habit.upsert({
      where: {
        id: `system-habit-${habit.name.toLowerCase().replace(/ /g, '-')}`,
      },
      update: {},
      create: {
        id: `system-habit-${habit.name.toLowerCase().replace(/ /g, '-')}`,
        userId: null,
        name: habit.name,
        trackingType: habit.trackingType,
        unit: habit.unit,
        isActive: true,
      },
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

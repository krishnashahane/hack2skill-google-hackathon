import db from './firebase.js';

const volunteers = [
  {
    name: 'Priya Sharma',
    email: 'priya@example.com',
    phone: '+91 98765 43210',
    skills: ['First Aid', 'Teaching', 'Counseling'],
    available: true,
    location: { lat: 19.076, lng: 72.8777 }, // Mumbai
    createdAt: new Date().toISOString(),
  },
  {
    name: 'Rahul Patel',
    email: 'rahul@example.com',
    phone: '+91 98765 43211',
    skills: ['Cooking', 'Driving', 'First Aid'],
    available: true,
    location: { lat: 19.082, lng: 72.8812 },
    createdAt: new Date().toISOString(),
  },
  {
    name: 'Ananya Iyer',
    email: 'ananya@example.com',
    phone: '+91 98765 43212',
    skills: ['Teaching', 'Translation', 'Event Management'],
    available: true,
    location: { lat: 19.0596, lng: 72.8295 },
    createdAt: new Date().toISOString(),
  },
  {
    name: 'Vikram Singh',
    email: 'vikram@example.com',
    phone: '+91 98765 43213',
    skills: ['Construction', 'Driving', 'Heavy Lifting'],
    available: true,
    location: { lat: 19.0895, lng: 72.8656 },
    createdAt: new Date().toISOString(),
  },
  {
    name: 'Meera Joshi',
    email: 'meera@example.com',
    phone: '+91 98765 43214',
    skills: ['Nursing', 'First Aid', 'Counseling'],
    available: false,
    location: { lat: 19.0728, lng: 72.8826 },
    createdAt: new Date().toISOString(),
  },
  {
    name: 'Arjun Nair',
    email: 'arjun@example.com',
    phone: '+91 98765 43215',
    skills: ['IT Support', 'Teaching', 'Photography'],
    available: true,
    location: { lat: 19.1136, lng: 72.8697 },
    createdAt: new Date().toISOString(),
  },
  {
    name: 'Deepa Menon',
    email: 'deepa@example.com',
    phone: '+91 98765 43216',
    skills: ['Cooking', 'Event Management', 'Fundraising'],
    available: true,
    location: { lat: 19.0452, lng: 72.8198 },
    createdAt: new Date().toISOString(),
  },
  {
    name: 'Karan Malhotra',
    email: 'karan@example.com',
    phone: '+91 98765 43217',
    skills: ['Driving', 'Construction', 'First Aid'],
    available: true,
    location: { lat: 19.0987, lng: 72.8882 },
    createdAt: new Date().toISOString(),
  },
  {
    name: 'Sanya Gupta',
    email: 'sanya@example.com',
    phone: '+91 98765 43218',
    skills: ['Counseling', 'Teaching', 'Translation'],
    available: true,
    location: { lat: 19.0644, lng: 72.8359 },
    createdAt: new Date().toISOString(),
  },
  {
    name: 'Rohan Das',
    email: 'rohan@example.com',
    phone: '+91 98765 43219',
    skills: ['IT Support', 'Photography', 'Fundraising'],
    available: true,
    location: { lat: 19.1176, lng: 72.9060 },
    createdAt: new Date().toISOString(),
  },
];

const tasks = [
  {
    title: 'Emergency Medical Camp',
    description: 'Set up and run a medical camp in Dharavi area for flood-affected families.',
    requiredSkills: ['First Aid', 'Nursing', 'Counseling'],
    urgency: 'high',
    status: 'pending',
    location: { lat: 19.0438, lng: 72.8534 },
    createdAt: new Date().toISOString(),
  },
  {
    title: 'Community Kitchen Setup',
    description: 'Organize and manage a community kitchen serving 500+ meals daily.',
    requiredSkills: ['Cooking', 'Event Management'],
    urgency: 'high',
    status: 'pending',
    location: { lat: 19.0760, lng: 72.8777 },
    createdAt: new Date().toISOString(),
  },
  {
    title: 'School Tutoring Program',
    description: 'After-school tutoring for underprivileged children in Andheri.',
    requiredSkills: ['Teaching', 'Counseling'],
    urgency: 'medium',
    status: 'pending',
    location: { lat: 19.1197, lng: 72.8464 },
    createdAt: new Date().toISOString(),
  },
  {
    title: 'Shelter Repair Drive',
    description: 'Repair damaged shelters in coastal areas after recent storms.',
    requiredSkills: ['Construction', 'Heavy Lifting', 'Driving'],
    urgency: 'medium',
    status: 'pending',
    location: { lat: 19.0888, lng: 72.8690 },
    createdAt: new Date().toISOString(),
  },
  {
    title: 'Fundraising Gala Planning',
    description: 'Organize annual fundraising event for NGO partnerships.',
    requiredSkills: ['Fundraising', 'Event Management', 'Photography'],
    urgency: 'low',
    status: 'pending',
    location: { lat: 19.0596, lng: 72.8295 },
    createdAt: new Date().toISOString(),
  },
];

async function seed() {
  console.log('🌱 Seeding database...');

  // Clear existing data if using in-memory
  if (db._clear) db._clear();

  for (const v of volunteers) {
    await db.collection('volunteers').add(v);
  }
  console.log(`✅ Added ${volunteers.length} volunteers`);

  for (const t of tasks) {
    await db.collection('tasks').add(t);
  }
  console.log(`✅ Added ${tasks.length} tasks`);

  console.log('🎉 Seed complete!');
}

export { seed, volunteers, tasks };

// Run directly
const isDirectRun = process.argv[1]?.includes('seed.js');
if (isDirectRun) {
  seed().catch(console.error);
}

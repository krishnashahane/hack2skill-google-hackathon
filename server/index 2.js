import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import db from './firebase.js';
import { findTopMatches } from './matching.js';
import { seed } from './seed.js';
import { getAISummary } from './ai.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// ─── Socket.io ────────────────────────────────────
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('task:update', (data) => {
    io.emit('task:updated', data);
  });

  socket.on('volunteer:assigned', (data) => {
    io.emit('notification', {
      type: 'assignment',
      title: `${data.volunteerName} assigned to ${data.taskTitle}`,
      time: new Date().toISOString(),
    });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// ─── Health Check ──────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Seed Data ─────────────────────────────────────
app.post('/api/seed', async (req, res) => {
  try {
    await seed();
    res.json({ success: true, message: 'Database seeded successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── Volunteers ────────────────────────────────────
app.get('/api/volunteers', async (req, res) => {
  try {
    const snapshot = await db.collection('volunteers').get();
    const volunteers = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(volunteers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/volunteers/:id', async (req, res) => {
  try {
    const doc = await db.collection('volunteers').doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Volunteer not found' });
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/volunteers', async (req, res) => {
  try {
    const { name, email, phone, skills, available, location, age, gender, medicalNotes } = req.body;
    if (!name || !email || !skills || !location) {
      return res.status(400).json({ error: 'Missing required fields: name, email, skills, location' });
    }
    const data = {
      name, email, phone: phone || '', skills: skills || [], available: available !== false,
      location, age: age || '', gender: gender || '', medicalNotes: medicalNotes || '',
      reliabilityScore: 100, totalHours: 0, tasksCompleted: 0,
      createdAt: new Date().toISOString(),
    };
    const ref = await db.collection('volunteers').add(data);
    const volunteer = { id: ref.id, ...data };
    io.emit('volunteer:new', volunteer);
    res.status(201).json(volunteer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/volunteers/:id', async (req, res) => {
  try {
    const doc = await db.collection('volunteers').doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ error: 'Volunteer not found' });
    await db.collection('volunteers').doc(req.params.id).update(req.body);
    res.json({ id: req.params.id, ...doc.data(), ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── Tasks ─────────────────────────────────────────
app.get('/api/tasks', async (req, res) => {
  try {
    const snapshot = await db.collection('tasks').get();
    const tasks = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const urgencyOrder = { high: 0, medium: 1, low: 2 };
    tasks.sort((a, b) => (urgencyOrder[a.urgency] ?? 3) - (urgencyOrder[b.urgency] ?? 3));
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const { title, description, requiredSkills, urgency, location } = req.body;
    if (!title || !requiredSkills || !urgency || !location) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const data = {
      title, description: description || '', requiredSkills, urgency,
      status: 'pending', location, createdAt: new Date().toISOString(),
    };
    const ref = await db.collection('tasks').add(data);
    const task = { id: ref.id, ...data };
    io.emit('task:new', task);
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/tasks/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    await db.collection('tasks').doc(req.params.id).update({
      status, updatedAt: new Date().toISOString(),
    });
    io.emit('task:updated', { taskId: req.params.id, status });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── Matching ──────────────────────────────────────
app.get('/api/match/:taskId', async (req, res) => {
  try {
    const taskDoc = await db.collection('tasks').doc(req.params.taskId).get();
    if (!taskDoc.exists) return res.status(404).json({ error: 'Task not found' });
    const task = { id: taskDoc.id, ...taskDoc.data() };
    const volSnapshot = await db.collection('volunteers').get();
    const volunteers = volSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const matches = findTopMatches(volunteers, task);
    res.json({ task, matches });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── Assign Volunteer ──────────────────────────────
app.post('/api/tasks/:taskId/assign', async (req, res) => {
  try {
    const { volunteerId } = req.body;
    if (!volunteerId) return res.status(400).json({ error: 'volunteerId required' });

    const taskDoc = await db.collection('tasks').doc(req.params.taskId).get();
    if (!taskDoc.exists) return res.status(404).json({ error: 'Task not found' });

    const volDoc = await db.collection('volunteers').doc(volunteerId).get();
    if (!volDoc.exists) return res.status(404).json({ error: 'Volunteer not found' });

    await db.collection('tasks').doc(req.params.taskId).update({
      status: 'assigned', assignedVolunteer: volunteerId,
      assignedVolunteerName: volDoc.data().name,
      assignedAt: new Date().toISOString(),
    });

    io.emit('task:assigned', {
      taskId: req.params.taskId, taskTitle: taskDoc.data().title,
      volunteerId, volunteerName: volDoc.data().name,
    });

    res.json({ success: true, message: `Assigned ${volDoc.data().name} to task` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── Complete Task ─────────────────────────────────
app.post('/api/tasks/:taskId/complete', async (req, res) => {
  try {
    const taskDoc = await db.collection('tasks').doc(req.params.taskId).get();
    if (!taskDoc.exists) return res.status(404).json({ error: 'Task not found' });

    await db.collection('tasks').doc(req.params.taskId).update({
      status: 'completed', completedAt: new Date().toISOString(),
    });

    io.emit('task:completed', { taskId: req.params.taskId });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── Feedback ──────────────────────────────────────
app.post('/api/feedback', async (req, res) => {
  try {
    const { taskId, volunteerId, rating, comment } = req.body;
    const data = {
      taskId, volunteerId, rating, comment,
      createdAt: new Date().toISOString(),
    };
    const ref = await db.collection('feedback').add(data);
    res.status(201).json({ id: ref.id, ...data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/feedback', async (req, res) => {
  try {
    const snapshot = await db.collection('feedback').get();
    const feedback = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── Notifications ─────────────────────────────────
app.get('/api/notifications', async (req, res) => {
  try {
    const snapshot = await db.collection('notifications').get();
    const notifications = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── AI Summary ────────────────────────────────────
app.post('/api/ai/summary', async (req, res) => {
  try {
    const { prompt } = req.body;
    const volSnapshot = await db.collection('volunteers').get();
    const taskSnapshot = await db.collection('tasks').get();
    const volunteers = volSnapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    const tasks = taskSnapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    const summary = await getAISummary(prompt, { volunteers, tasks });
    res.json({ summary });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ─── Stats ─────────────────────────────────────────
app.get('/api/stats', async (req, res) => {
  try {
    const volSnapshot = await db.collection('volunteers').get();
    const taskSnapshot = await db.collection('tasks').get();
    const tasks = taskSnapshot.docs.map((d) => d.data());
    const totalVolunteers = volSnapshot.docs.length;
    const totalTasks = tasks.length;
    const activeTasks = tasks.filter((t) => t.status === 'pending' || t.status === 'assigned').length;
    const completedTasks = tasks.filter((t) => t.status === 'completed').length;
    const assignedTasks = tasks.filter((t) => t.status === 'assigned').length;
    const highUrgency = tasks.filter((t) => t.urgency === 'high').length;
    const efficiency = totalTasks > 0 ? Math.round(((assignedTasks + completedTasks) / totalTasks) * 100) : 0;

    res.json({ totalVolunteers, totalTasks, activeTasks, completedTasks, assignedTasks, highUrgency, efficiency });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

httpServer.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Socket.io enabled for real-time updates`);
  // Auto-seed on startup if using in-memory DB
  try {
    const snapshot = await db.collection('volunteers').get();
    if (snapshot.docs.length === 0) {
      await seed();
      console.log('Auto-seeded demo data');
    }
  } catch (e) {
    console.warn('Auto-seed skipped:', e.message);
  }
});

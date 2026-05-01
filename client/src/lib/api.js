import axios from 'axios';
import { demoTasks, demoVolunteers } from './demoData';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 3500,
  headers: { 'Content-Type': 'application/json' },
});

const STORAGE_KEY = 'smartalloc-demo-state';
const urgencyOrder = { high: 0, medium: 1, low: 2 };

const clone = (value) => JSON.parse(JSON.stringify(value));

const initialDemoState = () => ({
  volunteers: clone(demoVolunteers),
  tasks: clone(demoTasks),
});

const loadDemoState = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const state = initialDemoState();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return state;
  }
  try {
    const parsed = JSON.parse(raw);
    if ((!parsed.volunteers || parsed.volunteers.length === 0) && (!parsed.tasks || parsed.tasks.length === 0)) {
      const state = initialDemoState();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return state;
    }
    return parsed;
  } catch {
    const state = initialDemoState();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return state;
  }
};

const saveDemoState = (state) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  return state;
};

const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const radius = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return radius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const calculateMatch = (volunteer, task) => {
  const requiredSkills = task.requiredSkills || [];
  const volunteerSkills = volunteer.skills || [];
  const normalizedSkills = volunteerSkills.map((skill) => skill.toLowerCase());
  const matchedSkills = requiredSkills.filter((skill) => normalizedSkills.includes(skill.toLowerCase()));
  const skillScore = requiredSkills.length > 0 ? (matchedSkills.length / requiredSkills.length) * 50 : 0;
  const distance = volunteer.location && task.location
    ? haversineDistance(volunteer.location.lat, volunteer.location.lng, task.location.lat, task.location.lng)
    : null;
  const proximityScore = distance === null ? 0 : Math.max(0, 30 * (1 - distance / 100));
  const availabilityScore = volunteer.available ? 20 : 0;
  const totalScore = Math.round((skillScore + proximityScore + availabilityScore) * 10) / 10;

  return {
    volunteerId: volunteer.id,
    volunteerName: volunteer.name,
    volunteerEmail: volunteer.email,
    volunteerSkills,
    volunteerLocation: volunteer.location,
    volunteerAvailable: volunteer.available,
    totalScore,
    maxScore: 100,
    breakdown: {
      skill: Math.round(skillScore * 10) / 10,
      proximity: Math.round(proximityScore * 10) / 10,
      availability: availabilityScore,
    },
    matchedSkills,
    distance: distance === null ? null : Math.round(distance * 10) / 10,
  };
};

const findTopMatches = (volunteers, task, limit = 3) =>
  volunteers
    .map((volunteer) => calculateMatch(volunteer, task))
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, limit)
    .map((match, index) => ({ ...match, rank: index + 1, isBestMatch: index === 0 }));

const withFallback = async (request, fallback) => {
  try {
    const result = await request();
    if (result === undefined || result === null || typeof result === 'string') throw new Error('Invalid API response');
    return result;
  } catch {
    return fallback();
  }
};

// Volunteers
export const getVolunteers = () =>
  withFallback(
    () => api.get('/volunteers').then((r) => r.data),
    () => loadDemoState().volunteers
  );

export const createVolunteer = (data) =>
  withFallback(
    () => api.post('/volunteers', data).then((r) => r.data),
    () => {
      const state = loadDemoState();
      const volunteer = { id: `vol-${Date.now()}`, ...data, createdAt: new Date().toISOString() };
      saveDemoState({ ...state, volunteers: [volunteer, ...state.volunteers] });
      return volunteer;
    }
  );

// Tasks
export const getTasks = () =>
  withFallback(
    () => api.get('/tasks').then((r) => r.data),
    () => loadDemoState().tasks.sort((a, b) => (urgencyOrder[a.urgency] ?? 3) - (urgencyOrder[b.urgency] ?? 3))
  );

export const createTask = (data) =>
  withFallback(
    () => api.post('/tasks', data).then((r) => r.data),
    () => {
      const state = loadDemoState();
      const task = {
        id: `task-${Date.now()}`,
        ...data,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      saveDemoState({ ...state, tasks: [task, ...state.tasks] });
      return task;
    }
  );

export const assignTask = (taskId, volunteerId) =>
  withFallback(
    () => api.post(`/tasks/${taskId}/assign`, { volunteerId }).then((r) => r.data),
    () => {
      const state = loadDemoState();
      const volunteer = state.volunteers.find((v) => v.id === volunteerId);
      const tasks = state.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: 'assigned',
              assignedVolunteer: volunteerId,
              assignedVolunteerName: volunteer?.name || 'Volunteer',
              assignedAt: new Date().toISOString(),
            }
          : task
      );
      saveDemoState({ ...state, tasks });
      return { success: true };
    }
  );

export const completeTask = (taskId) =>
  withFallback(
    () => api.post(`/tasks/${taskId}/complete`).then((r) => r.data),
    () => {
      const state = loadDemoState();
      const tasks = state.tasks.map((task) =>
        task.id === taskId ? { ...task, status: 'completed', completedAt: new Date().toISOString() } : task
      );
      saveDemoState({ ...state, tasks });
      return { success: true };
    }
  );

// Matching
export const getMatches = (taskId) =>
  withFallback(
    () => api.get(`/match/${taskId}`).then((r) => r.data),
    () => {
      const state = loadDemoState();
      const task = state.tasks.find((t) => t.id === taskId);
      return { task, matches: task ? findTopMatches(state.volunteers, task) : [] };
    }
  );

// Stats
export const getStats = () =>
  withFallback(
    () => api.get('/stats').then((r) => r.data),
    () => {
      const { volunteers, tasks } = loadDemoState();
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter((t) => t.status === 'completed').length;
      const assignedTasks = tasks.filter((t) => t.status === 'assigned').length;
      return {
        totalVolunteers: volunteers.length,
        totalTasks,
        activeTasks: tasks.filter((t) => t.status === 'pending' || t.status === 'assigned').length,
        completedTasks,
        assignedTasks,
        highUrgency: tasks.filter((t) => t.urgency === 'high').length,
        efficiency: totalTasks > 0 ? Math.round(((assignedTasks + completedTasks) / totalTasks) * 100) : 0,
      };
    }
  );

// Seed
export const seedDatabase = () =>
  withFallback(
    () => api.post('/seed').then((r) => r.data),
    () => {
      saveDemoState(initialDemoState());
      return { success: true, message: 'Local demo data loaded' };
    }
  );

export default api;

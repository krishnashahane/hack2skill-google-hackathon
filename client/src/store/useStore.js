import { create } from 'zustand';
import * as api from '../lib/api';

const useStore = create((set, get) => ({
  // State
  volunteers: [],
  tasks: [],
  stats: null,
  matches: null,
  matchTask: null,
  loading: {
    volunteers: false,
    tasks: false,
    stats: false,
    matches: false,
    seed: false,
  },

  // Volunteers
  fetchVolunteers: async () => {
    set((s) => ({ loading: { ...s.loading, volunteers: true } }));
    try {
      const volunteers = await api.getVolunteers();
      set((s) => ({ volunteers, loading: { ...s.loading, volunteers: false } }));
    } catch (err) {
      set((s) => ({ loading: { ...s.loading, volunteers: false } }));
      throw err;
    }
  },

  addVolunteer: async (data) => {
    const volunteer = await api.createVolunteer(data);
    set((s) => ({ volunteers: [volunteer, ...s.volunteers] }));
    return volunteer;
  },

  // Tasks
  fetchTasks: async () => {
    set((s) => ({ loading: { ...s.loading, tasks: true } }));
    try {
      const tasks = await api.getTasks();
      set((s) => ({ tasks, loading: { ...s.loading, tasks: false } }));
    } catch (err) {
      set((s) => ({ loading: { ...s.loading, tasks: false } }));
      throw err;
    }
  },

  addTask: async (data) => {
    const task = await api.createTask(data);
    set((s) => ({ tasks: [task, ...s.tasks] }));
    return task;
  },

  assignTaskToVolunteer: async (taskId, volunteerId) => {
    const result = await api.assignTask(taskId, volunteerId);
    // Refresh tasks
    await get().fetchTasks();
    return result;
  },

  completeTask: async (taskId) => {
    await api.completeTask(taskId);
    await get().fetchTasks();
  },

  // Matching
  fetchMatches: async (taskId) => {
    set((s) => ({ loading: { ...s.loading, matches: true }, matches: null }));
    try {
      const data = await api.getMatches(taskId);
      set((s) => ({
        matches: data.matches,
        matchTask: data.task,
        loading: { ...s.loading, matches: false },
      }));
      return data;
    } catch (err) {
      set((s) => ({ loading: { ...s.loading, matches: false } }));
      throw err;
    }
  },

  clearMatches: () => set({ matches: null, matchTask: null }),

  // Stats
  fetchStats: async () => {
    set((s) => ({ loading: { ...s.loading, stats: true } }));
    try {
      const stats = await api.getStats();
      set((s) => ({ stats, loading: { ...s.loading, stats: false } }));
    } catch (err) {
      set((s) => ({ loading: { ...s.loading, stats: false } }));
      throw err;
    }
  },

  // Seed
  seedData: async () => {
    set((s) => ({ loading: { ...s.loading, seed: true } }));
    try {
      await api.seedDatabase();
      await Promise.all([get().fetchVolunteers(), get().fetchTasks(), get().fetchStats()]);
      set((s) => ({ loading: { ...s.loading, seed: false } }));
    } catch (err) {
      set((s) => ({ loading: { ...s.loading, seed: false } }));
      throw err;
    }
  },
}));

export default useStore;

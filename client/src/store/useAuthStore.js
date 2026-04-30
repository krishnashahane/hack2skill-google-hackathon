import { create } from 'zustand';

const DEMO_USERS = [
  { id: 'admin-1', name: 'Aditya Makurwar', email: 'admin@ngohub.org', password: 'admin123', role: 'admin', org: 'NGO Hub Foundation' },
  { id: 'vol-priya', name: 'Priya Sharma', email: 'priya@example.com', password: 'vol123', role: 'volunteer', skills: ['First Aid', 'Teaching', 'Counseling'], location: { lat: 19.076, lng: 72.8777 } },
  { id: 'vol-rahul', name: 'Rahul Patel', email: 'rahul@example.com', password: 'vol123', role: 'volunteer', skills: ['Cooking', 'Driving', 'First Aid'], location: { lat: 19.082, lng: 72.8812 } },
  { id: 'vol-ananya', name: 'Ananya Iyer', email: 'ananya@example.com', password: 'vol123', role: 'volunteer', skills: ['Teaching', 'Translation', 'Event Management'], location: { lat: 19.0596, lng: 72.8295 } },
  { id: 'vol-vikram', name: 'Vikram Singh', email: 'vikram@example.com', password: 'vol123', role: 'volunteer', skills: ['Construction', 'Driving', 'Heavy Lifting'], location: { lat: 19.0895, lng: 72.8656 } },
  { id: 'vol-krishna', name: 'Krishna Shahane', email: 'krishna@example.com', password: 'vol123', role: 'admin', org: 'Rising Lion' },
];

const AUTH_KEY = 'ngohub-auth';

const loadUser = () => {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
};

const useAuthStore = create((set) => ({
  user: loadUser(),

  login: (email, password) => {
    const found = DEMO_USERS.find(u => u.email === email && u.password === password);
    if (!found) return null;
    const { password: _, ...user } = found;
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    set({ user });
    return user;
  },

  signup: (data) => {
    const user = {
      id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      role: data.role,
      skills: [],
      location: null,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    set({ user });
    return user;
  },

  logout: () => {
    localStorage.removeItem(AUTH_KEY);
    set({ user: null });
  },

  updateProfile: (updates) => {
    set((s) => {
      const user = { ...s.user, ...updates };
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      return { user };
    });
  },
}));

export default useAuthStore;

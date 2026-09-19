import { createContext, useContext, useState, useEffect, useMemo } from 'react';

// Safe JSON parse — prevents crash on corrupt localStorage data
function safeParse(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch (e) {
    localStorage.removeItem(key);
    return fallback;
  }
}

function localDate() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  return new Date(now - offset).toISOString().slice(0, 10);
}

const AppContext = createContext();

const defaultTasks = [];

const defaultHabits = [];

const defaultGoals = [];

const defaultNotes = [];

const defaultEvents = [];

const defaultAchievements = [
  { id: 1, title: "7 kun ketma-ket", description: "7 kun ketma-ket vazifa bajarildi", icon: "🏆", unlocked: false, progress: 0 },
  { id: 2, title: "30 kun sport", description: "30 kun sport qilindi", icon: "🏆", unlocked: false, progress: 0 },
  { id: 3, title: "100 ta task", description: "100 ta task yakunlandi", icon: "🏆", unlocked: false, progress: 0 },
  { id: 4, title: "Birinchi maqsad", description: "Birinchi maqsad bajarildi", icon: "🏆", unlocked: false, progress: 0 },
  { id: 5, title: "50 kun streak", description: "50 kun ketma-ket planner yuritish", icon: "🏆", unlocked: false, progress: 0 },
  { id: 6, title: "Budjet ustasi", description: "1 oy davomida kunlik limitdan oshmadi", icon: "💰", unlocked: false, progress: 0 },
  { id: 7, title: "Tejamkor", description: "Oylik jamg'arma maqsadiga erishdi", icon: "🐷", unlocked: false, progress: 0 },
  { id: 8, title: "10 ta odat", description: "10 ta odatni streak bilan davom ettirdi", icon: "🔥", unlocked: false, progress: 0 },
];

export function AppProvider({ children }) {
  const [tasks, setTasks] = useState(() => safeParse('flowly-tasks', defaultTasks));
  const [habits, setHabits] = useState(() => safeParse('flowly-habits', defaultHabits));
  const [goals, setGoals] = useState(() => safeParse('flowly-goals', defaultGoals));
  const [notes, setNotes] = useState(() => safeParse('flowly-notes', defaultNotes));
  const [events, setEvents] = useState(() => safeParse('flowly-events', defaultEvents));

  const [achievements] = useState(defaultAchievements);

  const [notifications, setNotifications] = useState(() => safeParse('flowly-notifications', []));

  useEffect(() => { localStorage.setItem('flowly-tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('flowly-habits', JSON.stringify(habits)); }, [habits]);
  useEffect(() => { localStorage.setItem('flowly-goals', JSON.stringify(goals)); }, [goals]);
  useEffect(() => { localStorage.setItem('flowly-notes', JSON.stringify(notes)); }, [notes]);
  useEffect(() => { localStorage.setItem('flowly-events', JSON.stringify(events)); }, [events]);
  useEffect(() => { localStorage.setItem('flowly-notifications', JSON.stringify(notifications)); }, [notifications]);

  // Check notifications for upcoming events
  useEffect(() => {
    const now = new Date();
    const upcoming = events.filter(e => {
      const eventDate = new Date(e.date);
      const diff = eventDate - now;
      return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000; // within 7 days
    });
    if (upcoming.length > 0) {
      const newNotifs = upcoming.map(e => ({
        id: `event-${e.id}`,
        title: `${e.icon} ${e.title}`,
        message: `${e.date} da bo'lib o'tadi`,
        read: false,
        date: now.toISOString(),
      }));
      setNotifications(prev => {
        const existingIds = prev.map(n => n.id);
        const filtered = newNotifs.filter(n => !existingIds.includes(n.id));
        return [...filtered, ...prev].slice(0, 20);
      });
    }
  }, [events]);

  const toggleTask = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const addTask = (task) => {
    setTasks([...tasks, { ...task, id: Date.now() }]);
  };

  const editTask = (id, updatedData) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, ...updatedData } : t));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // Auto-reset habits daily (todayDone resets at midnight)
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const lastReset = localStorage.getItem('flowly-habits-last-reset');
    if (lastReset !== today) {
      setHabits(prev => prev.map(h => ({
        ...h,
        todayDone: false,
        // If yesterday was done, keep streak. If not, reset streak.
        streak: h.todayDone ? h.streak : (h.lastDoneDate === lastReset ? h.streak : 0),
        lastDoneDate: h.todayDone ? lastReset : h.lastDoneDate,
      })));
      localStorage.setItem('flowly-habits-last-reset', today);
    }
  }, []);

  const toggleHabit = (id) => {
    const today = localDate();
    setHabits(prev => prev.map(h => h.id === id ? {
      ...h,
      todayDone: !h.todayDone,
      streak: h.todayDone ? Math.max(0, (h.streak || 0) - 1) : (h.streak || 0) + 1,
      lastDoneDate: !h.todayDone ? today : h.lastDoneDate,
    } : h));
  };

  const addHabit = (habit) => {
    setHabits([...habits, { ...habit, id: Date.now(), streak: 0, completedDays: [], todayDone: false }]);
  };

  const editHabit = (id, updatedData) => {
    setHabits(habits.map(h => h.id === id ? { ...h, ...updatedData } : h));
  };

  const deleteHabit = (id) => {
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  const addGoal = (goal) => {
    setGoals([...goals, { ...goal, id: Date.now(), progress: 0, status: 'planned', completedSteps: [] }]);
  };

  const editGoal = (id, updatedData) => {
    setGoals(goals.map(g => g.id === id ? { ...g, ...updatedData } : g));
  };

  const deleteGoal = (id) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const updateGoalProgress = (id, stepIndex) => {
    setGoals(prev => prev.map(g => {
      if (g.id === id) {
        const completed = Array.isArray(g.completedSteps) ? g.completedSteps : [];
        const steps = Array.isArray(g.steps) ? g.steps : [];
        if (stepIndex < 0 || stepIndex >= steps.length) return g;
        const completedSteps = completed.includes(stepIndex)
          ? completed.filter(s => s !== stepIndex)
          : [...completed, stepIndex];
        const progress = Math.round((completedSteps.length / steps.length) * 100);
        return { ...g, completedSteps, progress, status: progress === 100 ? 'completed' : 'in-progress' };
      }
      return g;
    }));
  };

  const addNote = (note) => {
    setNotes([...notes, { ...note, id: Date.now(), date: new Date().toISOString().split('T')[0] }]);
  };

  const editNote = (id, updatedData) => {
    setNotes(notes.map(n => n.id === id ? { ...n, ...updatedData } : n));
  };

  const deleteNote = (id) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const addEvent = (event) => {
    setEvents([...events, { ...event, id: Date.now() }]);
  };

  const editEvent = (id, updatedData) => {
    setEvents(events.map(e => e.id === id ? { ...e, ...updatedData } : e));
  };

  const deleteEvent = (id) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  const markNotificationRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // Life Score calculation (memoized)
  const lifeScore = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const taskScore = totalTasks > 0 ? (completedTasks / totalTasks) * 40 : 0;

    const totalHabits = habits.length;
    const completedHabits = habits.filter(h => h.todayDone).length;
    const habitScore = totalHabits > 0 ? (completedHabits / totalHabits) * 30 : 0;

    const totalGoals = goals.length;
    const avgGoalProgress = totalGoals > 0 ? goals.reduce((acc, g) => acc + g.progress, 0) / totalGoals : 0;
    const goalScore = (avgGoalProgress / 100) * 30;

    return Math.round(taskScore + habitScore + goalScore);
  }, [tasks, habits, goals]);

  const calculateLifeScore = () => lifeScore;

  return (
    <AppContext.Provider value={{
      tasks, toggleTask, addTask, editTask, deleteTask,
      habits, toggleHabit, addHabit, editHabit, deleteHabit,
      goals, addGoal, editGoal, deleteGoal, updateGoalProgress,
      notes, addNote, editNote, deleteNote,
      events, addEvent, editEvent, deleteEvent,
      achievements,
      notifications, markNotificationRead, clearNotifications,
      calculateLifeScore,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);

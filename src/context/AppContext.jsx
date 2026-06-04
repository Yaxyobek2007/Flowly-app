import { createContext, useContext, useState, useEffect } from 'react';

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
];

export function AppProvider({ children }) {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('flowly-tasks');
    return saved ? JSON.parse(saved) : defaultTasks;
  });

  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem('flowly-habits');
    return saved ? JSON.parse(saved) : defaultHabits;
  });

  const [goals, setGoals] = useState(() => {
    const saved = localStorage.getItem('flowly-goals');
    return saved ? JSON.parse(saved) : defaultGoals;
  });

  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem('flowly-notes');
    return saved ? JSON.parse(saved) : defaultNotes;
  });

  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('flowly-events');
    return saved ? JSON.parse(saved) : defaultEvents;
  });

  const [achievements] = useState(defaultAchievements);

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('flowly-notifications');
    return saved ? JSON.parse(saved) : [];
  });

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
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const addTask = (task) => {
    setTasks([...tasks, { ...task, id: Date.now() }]);
  };

  const editTask = (id, updatedData) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, ...updatedData } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const toggleHabit = (id) => {
    setHabits(habits.map(h => h.id === id ? { ...h, todayDone: !h.todayDone, streak: !h.todayDone ? h.streak + 1 : h.streak - 1 } : h));
  };

  const addHabit = (habit) => {
    setHabits([...habits, { ...habit, id: Date.now(), streak: 0, completedDays: [], todayDone: false }]);
  };

  const editHabit = (id, updatedData) => {
    setHabits(habits.map(h => h.id === id ? { ...h, ...updatedData } : h));
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  const addGoal = (goal) => {
    setGoals([...goals, { ...goal, id: Date.now(), progress: 0, status: 'planned', completedSteps: [] }]);
  };

  const editGoal = (id, updatedData) => {
    setGoals(goals.map(g => g.id === id ? { ...g, ...updatedData } : g));
  };

  const deleteGoal = (id) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  const updateGoalProgress = (id, stepIndex) => {
    setGoals(goals.map(g => {
      if (g.id === id) {
        const completedSteps = g.completedSteps.includes(stepIndex)
          ? g.completedSteps.filter(s => s !== stepIndex)
          : [...g.completedSteps, stepIndex];
        const progress = Math.round((completedSteps.length / g.steps.length) * 100);
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
    setNotes(notes.filter(n => n.id !== id));
  };

  const addEvent = (event) => {
    setEvents([...events, { ...event, id: Date.now() }]);
  };

  const editEvent = (id, updatedData) => {
    setEvents(events.map(e => e.id === id ? { ...e, ...updatedData } : e));
  };

  const deleteEvent = (id) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const markNotificationRead = (id) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // Life Score calculation
  const calculateLifeScore = () => {
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
  };

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

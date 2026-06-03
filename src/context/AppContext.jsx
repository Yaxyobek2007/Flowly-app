import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const defaultTasks = [
  { id: 1, title: "Uyg'onish", time: "06:00", completed: true, priority: "medium", day: "monday", category: "personal" },
  { id: 2, title: "Sport", time: "06:30", completed: true, priority: "high", day: "monday", category: "health" },
  { id: 3, title: "Universitet", time: "08:00", completed: true, priority: "high", day: "monday", category: "education" },
  { id: 4, title: "Ovqatlanish", time: "12:30", completed: false, priority: "medium", day: "monday", category: "personal" },
  { id: 5, title: "Dars tayyorlash", time: "18:00", completed: false, priority: "high", day: "monday", category: "education" },
  { id: 6, title: "Kitob o'qish", time: "20:00", completed: false, priority: "medium", day: "monday", category: "personal" },
  { id: 7, title: "Uyqu", time: "23:00", completed: false, priority: "low", day: "monday", category: "personal" },
  { id: 8, title: "Uyg'onish", time: "06:00", completed: true, priority: "medium", day: "tuesday", category: "personal" },
  { id: 9, title: "Sport", time: "06:30", completed: false, priority: "high", day: "tuesday", category: "health" },
  { id: 10, title: "Trading tahlil", time: "09:00", completed: false, priority: "high", day: "tuesday", category: "finance" },
  { id: 11, title: "Universitet", time: "10:00", completed: false, priority: "high", day: "tuesday", category: "education" },
  { id: 12, title: "Ingliz tili darsi", time: "16:00", completed: false, priority: "high", day: "wednesday", category: "education" },
  { id: 13, title: "Loyiha ustida ishlash", time: "18:00", completed: false, priority: "high", day: "wednesday", category: "work" },
  { id: 14, title: "Sport", time: "06:30", completed: false, priority: "high", day: "thursday", category: "health" },
  { id: 15, title: "Universitet", time: "08:00", completed: false, priority: "high", day: "thursday", category: "education" },
];

const defaultHabits = [
  { id: 1, name: "Sport", icon: "💪", streak: 30, completedDays: Array.from({length: 30}, (_, i) => i+1), todayDone: true, dailyTarget: 1 },
  { id: 2, name: "Kitob o'qish", icon: "📚", streak: 15, completedDays: Array.from({length: 15}, (_, i) => i+1), todayDone: true, dailyTarget: 1 },
  { id: 3, name: "Ingliz tili", icon: "🇺🇸", streak: 22, completedDays: Array.from({length: 22}, (_, i) => i+1), todayDone: false, dailyTarget: 1 },
  { id: 4, name: "Trading", icon: "📈", streak: 10, completedDays: Array.from({length: 10}, (_, i) => i+1), todayDone: false, dailyTarget: 1 },
  { id: 5, name: "Erta uyg'onish", icon: "⏰", streak: 45, completedDays: Array.from({length: 45}, (_, i) => i+1), todayDone: true, dailyTarget: 1 },
  { id: 6, name: "Meditatsiya", icon: "🧘", streak: 7, completedDays: Array.from({length: 7}, (_, i) => i+1), todayDone: false, dailyTarget: 1 },
  { id: 7, name: "Yugurish", icon: "🏃", streak: 12, completedDays: Array.from({length: 12}, (_, i) => i+1), todayDone: false, dailyTarget: 2 },
];

const defaultGoals = [
  { id: 1, title: "Universitetni muvaffaqiyatli bitirish", deadline: "2028-06-01", progress: 35, status: "in-progress", steps: ["1-kurs yakunlash", "2-kurs yakunlash", "3-kurs yakunlash", "4-kurs yakunlash", "Diplom himoya"], completedSteps: [0] },
  { id: 2, title: "IT kompaniyasiga ishga kirish", deadline: "2027-09-01", progress: 20, status: "in-progress", steps: ["Portfolio yaratish", "Resume tayyorlash", "Interview tayyorgarlik", "Stajga topshirish", "Ishga kirish"], completedSteps: [0] },
  { id: 3, title: "Avtomobil sotib olish", deadline: "2028-12-01", progress: 15, status: "in-progress", steps: ["Pul yig'ish", "Guvohnoma olish", "Mashina tanlash", "Xarid qilish"], completedSteps: [] },
  { id: 4, title: "Trading kapitalini oshirish", deadline: "2027-06-01", progress: 40, status: "in-progress", steps: ["Strategiya yaratish", "Backtesting", "Demo savdo", "Real savdo", "Kapital 2x oshirish"], completedSteps: [0, 1] },
  { id: 5, title: "Biznes ochish", deadline: "2029-01-01", progress: 10, status: "planned", steps: ["G'oya tanlash", "Biznes reja", "Kapital topish", "Ro'yxatdan o'tish", "Ishga tushirish"], completedSteps: [] },
];

const defaultNotes = [
  { id: 1, title: "Trading strategiyalari", content: "1. Trend following\n2. Support/Resistance\n3. Risk management: har bir savdoda 2% dan ko'p risk qilmaslik", category: "finance", date: "2026-06-01" },
  { id: 2, title: "Biznes g'oyalari", content: "1. SaaS productivity app\n2. E-commerce marketplace\n3. Educational platform", category: "business", date: "2026-05-28" },
  { id: 3, title: "Loyiha rejalari", content: "Flowly ilovasini yaratish:\n- Frontend: React\n- Backend: Node.js\n- Database: PostgreSQL\n- Mobile: React Native", category: "tech", date: "2026-06-02" },
];

const defaultEvents = [
  { id: 1, title: "Tug'ilgan kun", date: "2026-07-07", type: "birthday", icon: "🎂", location: "Andijon" },
  { id: 2, title: "Konferensiya", date: "2026-07-23", type: "event", icon: "📍", location: "Tashkent City", time: "14:00" },
  { id: 3, title: "Imtihon", date: "2026-06-15", type: "exam", icon: "📚" },
  { id: 4, title: "Ish uchrashuvi", date: "2026-06-10", type: "meeting", icon: "💼", location: "Ofis", time: "10:00" },
];

const defaultAchievements = [
  { id: 1, title: "7 kun ketma-ket", description: "7 kun ketma-ket vazifa bajarildi", icon: "🏆", unlocked: true, date: "2026-05-20" },
  { id: 2, title: "Sport master", description: "30 kun sport qilindi", icon: "🏆", unlocked: true, date: "2026-06-01" },
  { id: 3, title: "100 ta task", description: "100 ta task yakunlandi", icon: "🏆", unlocked: false, progress: 78 },
  { id: 4, title: "Birinchi maqsad", description: "Birinchi maqsad bajarildi", icon: "🏆", unlocked: false, progress: 35 },
  { id: 5, title: "50 kun streak", description: "50 kun ketma-ket planner yuritish", icon: "🏆", unlocked: false, progress: 88 },
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

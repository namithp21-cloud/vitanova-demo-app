/*
Vitanova - Merged Frontend & Simulated Backend
- The original Node.js backend logic is simulated using mock API functions that persist data in the browser's localStorage.
- This creates a fully interactive, client-side application without needing a separate server or database.
- It features distinct user roles (Student and Counselor) with different dashboards and permissions.
- All original features like screenings, bookings, forums, and video libraries are functional.
- New Feature: Added a multi-step sign-up process with OTP verification simulation.
- Emergency Feature: Added an SOS button, location sharing, and local emergency contacts.
- UI/UX Update: Collapsible navigation for a focused view.
- New Feature: AI Chatbot "Neura" for assistance and FAQs.
- New Feature: Daily check-in and weekly screening reminders.
- UI Update: Applied new calming color scheme and custom logo.
- Dark Theme Update: Implemented a new slate blue color palette for a modern look.
- New Feature: Added a daily inspirational quote to the student dashboard.
- New Feature: Added validation for email and phone numbers during signup and password reset.
- Update: Replaced the monthly calendar with a simplified "Today/Tomorrow" selector for appointments.
- Fix: Improved the error message when a user tries to sign up with an existing email.
*/

import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, Sun, Moon, Bell, MessageSquare, CalendarDays, Home, Shield, X, Send, Loader2, Film, Upload, BookOpen, Smile, Meh, Frown, Phone, Wind, PlayCircle, PauseCircle, PenSquare, CheckSquare, Trash2, Plus, Search, ArrowLeft, LogOut, Mail, KeyRound, UserCheck, User, BarChart2, FileText, BadgeCheck, Siren, MapPin, Mic, Video, Menu, Bot, UserCog } from "lucide-react";

// -- Color Scheme Configuration ----------------------------------------------------
const colors = {
  primary: '#2AB3B3',
  secondary: '#7BC950',
  accent: '#FDD835',
  background: '#FFF8E7',
  'text-main': '#4A4A4A',
};

// (The rest of your app code continues here...)
// Due to space, please copy-paste all of your code from githubtest.txt
// It starts with all your mock API, component, and main app logic
// At the end, make sure you export the component as default:


// -- Mock API & Data Persistence (Simulating the Node.js Backend) -----------------
const mockDelay = (ms = 700) => new Promise((r) => setTimeout(r, ms));

const dataStorageKey = "vitanova_demo_data_v7";
const userStorageKey = "vitanova_user_v7";
const allUsersStorageKey = "vitanova_all_users_v7";
const permissionsKey = "vitanova_permissions_v1";
const lastCheckInKey = "vitanova_last_checkin_v1";


const mockVideos = [
    { _id: 'v_1', title: 'Mindfulness Meditation for Beginners', description: 'A 10-minute guided meditation to help you reduce stress and find calm.', thumbnailUrl: 'https://placehold.co/600x400/2AB3B3/ffffff?text=Mindfulness', videoUrl: 'https://www.youtube.com/embed/O-6f5wQXSu8' },
    { _id: 'v_2', title: 'Understanding Anxiety', description: 'Learn about the common signs of anxiety and effective coping strategies.', thumbnailUrl: 'https://placehold.co/600x400/7BC950/ffffff?text=Anxiety', videoUrl: 'https://www.youtube.com/embed/WWloIAQpMcQ' },
    { _id: 'v_3', title: 'Tips for a Better Sleep', description: 'Improve your sleep hygiene with these simple and effective tips.', thumbnailUrl: 'https://placehold.co/600x400/FDD835/4A4A4A?text=Sleep', videoUrl: 'https://www.youtube.com/embed/3_h_q_p_pA4' },
    { _id: 'v_4', title: 'The Importance of a Balanced Diet', description: 'Discover how nutrition impacts your mental and physical health.', thumbnailUrl: 'https://placehold.co/600x400/ef4444/ffffff?text=Diet', videoUrl: 'https://www.youtube.com/embed/YF_h_oYwpmE' }
];

const mockResources = {
    articles: [
        { _id: 'a1', title: 'Managing Exam Stress', snippet: 'Techniques to stay calm and focused during exam season.', content: `<h3 class="text-lg font-bold mb-2">Understanding Exam Stress</h3><p class="mb-4">Exam stress is a common experience for students. A little bit of stress can be a motivator, but too much can impact performance and well-being. Common symptoms include difficulty sleeping, changes in appetite, irritability, and trouble concentrating.</p><h3 class="text-lg font-bold mb-2">Effective Strategies</h3><ul class="list-disc list-inside space-y-2"><li><strong>Time Management:</strong> Create a realistic study schedule. Break down large topics into smaller, manageable chunks.</li><li><strong>Healthy Habits:</strong> Ensure you get enough sleep (7-9 hours), eat nutritious meals, and stay hydrated. Avoid excessive caffeine.</li><li><strong>Relaxation Techniques:</strong> Practice deep breathing, mindfulness, or light exercise like walking to calm your nerves.</li><li><strong>Stay Positive:</strong> Focus on your effort, not just the outcome. Remind yourself of past successes.</li></ul>`},
    ],
    hotlines: [
        { _id: 'h1', name: 'National Suicide Prevention Lifeline', phone: '988', available: '24/7' },
        { _id: 'h2', name: 'Crisis Text Line', phone: 'Text HOME to 741741', available: '24/7' },
    ],
    soundscapes: [
        { id: 'sound1', title: 'Gentle Rain' },
        { id: 'sound2', title: 'Forest Ambience' },
        { id: 'sound3', title: 'Ocean Waves' },
    ]
};

const getStoredData = (userId) => {
    let allData = {};
    try {
        const storedData = localStorage.getItem(dataStorageKey);
        allData = storedData ? JSON.parse(storedData) : {};
    } catch (e) {
        console.error("Failed to parse stored data:", e);
        allData = {};
    }
    
    const baseData = {
        videos: allData.videos || mockVideos,
        resources: allData.resources || mockResources,
        forum: allData.forum || [],
    };

    if (!userId) return baseData;

    return {
        ...baseData,
        screenings: (allData.screenings || []).filter(s => s.user === userId),
        bookings: (allData.bookings || []).filter(b => b.user === userId),
        moods: (allData.moods || []).filter(m => m.user === userId),
        journal: (allData.journal || []).filter(j => j.user === userId),
        goals: (allData.goals || []).filter(g => g.user === userId),
    };
};

const getAllData = () => {
    try {
        const storedData = localStorage.getItem(dataStorageKey);
        const allData = storedData ? JSON.parse(storedData) : {};
        return {
            videos: allData.videos || mockVideos,
            resources: allData.resources || mockResources,
            screenings: allData.screenings || [],
            bookings: allData.bookings || [],
            forum: allData.forum || [],
            moods: allData.moods || [],
            journal: allData.journal || [],
            goals: allData.goals || [],
        }
    } catch(e) {
        return getStoredData(null);
    }
};

const setStoredData = (newData) => {
    try {
        localStorage.setItem(dataStorageKey, JSON.stringify(newData));
    } catch (e) {
        console.error("Failed to save data to localStorage:", e);
    }
};

const getStoredUsers = () => {
    try {
        const users = localStorage.getItem(allUsersStorageKey);
        return users ? JSON.parse(users) : [];
    } catch (e) {
        return [];
    }
};

const setStoredUsers = (users) => {
    localStorage.setItem(allUsersStorageKey, JSON.stringify(users));
};

const getYoutubeEmbedUrl = (url) => {
    if (!url) return '';
    try {
        let videoId = '';
        if (url.includes('watch?v=')) videoId = new URL(url).searchParams.get('v');
        else if (url.includes('youtu.be/')) videoId = new URL(url).pathname.substring(1);
        else if (url.includes('/embed/')) return url;
        if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    } catch (error) { console.error('Invalid URL for YouTube embedding:', error); }
    return url;
};

// --- Mock API Functions ---
async function apiSignUpUser(userData) {
    await mockDelay();
    const allUsers = getStoredUsers();
    if (allUsers.find(u => u.email === userData.email)) throw new Error("User already exists");
    
    const baseNewUser = { id: `user_${Date.now()}`, ...userData };
    if (baseNewUser.role === 'counselor') {
        baseNewUser.availabilityCalendar = {};
    }

    allUsers.push(baseNewUser);
    setStoredUsers(allUsers);
    return baseNewUser;
}
async function apiResetPassword({ email, newPassword }) {
    await mockDelay();
    const allUsers = getStoredUsers();
    const userIndex = allUsers.findIndex(u => u.email === email);
    if (userIndex === -1) {
        if (email === 'student@campus.edu' || email === 'counselor@campus.edu') {
            return { success: true };
        }
        throw new Error("User with this email does not exist.");
    }
    allUsers[userIndex].password = newPassword;
    setStoredUsers(allUsers);
    return { success: true };
}
async function apiUpdateCounselorProfile({ userId, availabilityCalendar }) {
    await mockDelay(400);
    const allUsers = getStoredUsers();
    const userIndex = allUsers.findIndex(u => u.id === userId);
    if(userIndex > -1) {
        allUsers[userIndex].availabilityCalendar = availabilityCalendar;
        setStoredUsers(allUsers);
        return allUsers[userIndex];
    }
    throw new Error("Counselor not found");
}
async function apiSubmitScreening({ tool, responses, user }) {
    await mockDelay();
    const score = responses.reduce((a, b) => a + b, 0);
    const riskKey = score >= 20 ? "severe" : score >= 15 ? "moderately_severe" : score >= 10 ? "moderate" : score >= 5 ? "mild" : "minimal";
    const entry = { _id: `s_${Date.now()}`, user: user.id, tool, responses, score, risk: riskKey, createdAt: new Date().toISOString() };
    const db = getAllData();
    db.screenings = [entry, ...(db.screenings || [])];
    setStoredData(db);
    return entry;
}
async function apiCreateBooking({ counselor, slot, user }) {
    await mockDelay();
    const booking = { _id: `b_${Date.now()}`, user: user.id, counselorId: counselor.id, counselorName: counselor.name, slot, status: "Confirmed", createdAt: new Date().toISOString() };
    const db = getAllData();
    db.bookings = [booking, ...(db.bookings || [])];
    setStoredData(db);
    return booking;
}
async function apiPostForum({ anonHandle, content, user }) {
    await mockDelay();
    const post = { _id: `p_${Date.now()}`, user: user.id, anonHandle, content, createdAt: new Date().toISOString(), replies: [] };
    const db = getAllData();
    db.forum = [post, ...(db.forum || [])];
    setStoredData(db);
    return post;
}
async function apiUploadVideo({ title, description, thumbnailUrl, videoUrl }) {
    await mockDelay();
    const newVideo = { _id: `v_${Date.now()}`, title, description, thumbnailUrl, videoUrl: getYoutubeEmbedUrl(videoUrl), createdAt: new Date().toISOString() };
    const db = getAllData();
    db.videos = [newVideo, ...(db.videos || [])];
    setStoredData(db);
    return newVideo;
}
async function apiLogMood({ mood, user }) {
    await mockDelay(300);
    const today = new Date().toISOString().split('T')[0];
    const entry = { date: today, mood, user: user.id };
    const db = getAllData();
    const moodIndex = (db.moods || []).findIndex(m => m.date === today && m.user === user.id);
    if (moodIndex > -1) db.moods[moodIndex] = entry;
    else db.moods.unshift(entry);
    setStoredData(db);
    return entry;
}
async function apiSubmitJournalEntry({ content, user }) {
    await mockDelay();
    const entry = { _id: `j_${Date.now()}`, user: user.id, content, createdAt: new Date().toISOString() };
    const db = getAllData();
    db.journal = [entry, ...(db.journal || [])];
    setStoredData(db);
    return entry;
}
async function apiCreateGoal({ content, user }) {
    await mockDelay();
    const entry = { _id: `g_${Date.now()}`, user: user.id, content, completed: false, createdAt: new Date().toISOString() };
    const db = getAllData();
    db.goals = [entry, ...(db.goals || [])];
    setStoredData(db);
    return entry;
}
async function apiToggleGoal({ goalId, user }) {
    await mockDelay(200);
    const db = getAllData();
    const goalIndex = (db.goals || []).findIndex(g => g._id === goalId && g.user === user.id);
    if (goalIndex > -1) {
        db.goals[goalIndex].completed = !db.goals[goalIndex].completed;
        setStoredData(db);
        return db.goals[goalIndex];
    }
    return null;
}
async function apiDeleteGoal({ goalId, user }) {
    await mockDelay(200);
    const db = getAllData();
    db.goals = (db.goals || []).filter(g => !(g._id === goalId && g.user === user.id));
    setStoredData(db);
    return { goalId };
}

// -- UI Components --
const Card = ({ children, className = '', ...props }) => (<div className={`bg-white/60 dark:bg-slate-800/60 p-6 rounded-2xl shadow-sm backdrop-blur-sm ${className}`} {...props}>{children}</div>);
const Badge = ({ children, color = "bg-blue-100 text-blue-800", className = '' }) => (<span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${color} ${className}`}>{children}</span>);
const Button = ({ children, onClick, disabled = false, loading = false, icon: Icon, variant = 'primary', className = '', ...props }) => {
    const variants = { 
        primary: `bg-[${colors.primary}] hover:opacity-90 text-white`, 
        secondary: `bg-[${colors.accent}] hover:opacity-90 text-[${colors['text-main']}]`, 
        danger: 'bg-red-600 hover:bg-red-700 text-white' 
    };
    return (<button onClick={onClick} disabled={disabled || loading} className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[${colors.primary}] ${className} ${variants[variant]}`} {...props}>{loading ? <Loader2 size={18} className="animate-spin" /> : (Icon && <Icon size={16} />)}<span>{children}</span></button>);
};
const Modal = ({ title, children, isOpen, onClose }) => {
    if (!isOpen) return null;
    return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}><div className="bg-background dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg p-6 m-4" onClick={e => e.stopPropagation()}><div className="flex justify-between items-center mb-4"><h3 className="text-lg font-bold text-text-main dark:text-slate-200">{title}</h3><button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700"><X size={20} /></button></div>{children}</div></div>);
};

const DailyQuote = () => {
    const [currentQuote, setCurrentQuote] = useState(null);

    const quotes = useMemo(() => [
        { quote: "The sun is a daily reminder that we too can rise again from the darkness, that we too can shine our own light.", author: "S. Ajna" },
        { quote: "You are not your illness. You have an individual story to tell. You have a name, a history, a personality. Staying yourself is part of the battle.", author: "Julian Seifter" },
        { quote: "Your present circumstances don’t determine where you can go; they merely determine where you start.", author: "Nido Qubein" },
        { quote: "It is okay to have depression, it is okay to have anxiety and it is okay to have an adjustment disorder. We need to improve the conversation. We all have mental health in the same way we all have physical health.", author: "Prince Harry" },
        { quote: "Promise me you'll always remember: You're braver than you believe, and stronger than you seem, and smarter than you think.", author: "A. A. Milne" },
        { quote: "Even if we don’t have the power to choose where we come from, we can still choose where we go from there.", author: "Stephen Chbosky" },
        { quote: "The bravest thing I ever did was continuing my life when I wanted to die.", author: "Juliette Lewis" },
        { quote: "Your illness does not define you. Your strength and courage does.", author: "Unknown" },
        { quote: "Just because you are struggling doesn't mean you are failing.", author: "Unknown" },
        { quote: "Healing is not linear. There will be setbacks. But you will get there.", author: "Unknown" },
    ], []);

    useEffect(() => {
        const quoteIndex = Math.floor(Math.random() * quotes.length);
        setCurrentQuote(quotes[quoteIndex]);
    }, [quotes]);

    if (!currentQuote) {
        return null;
    }

    const { quote, author } = currentQuote;

    return (
        <Card className="mb-6 bg-teal-50/70 dark:bg-slate-800 border border-teal-200 dark:border-slate-700">
            <h3 className="font-bold text-lg mb-3 text-teal-800 dark:text-teal-400">Quote for the Moment</h3>
            <blockquote className="text-center">
                <p className="text-lg italic text-teal-900 dark:text-slate-300">"{quote}"</p>
                <cite className="block text-right mt-2 not-italic font-semibold text-teal-700 dark:text-teal-500">- {author}</cite>
            </blockquote>
        </Card>
    );
};


const VitaNovaLogo = () => (
    <svg width="48" height="48" viewBox="0 0 100 100" className="w-10 h-10">
        <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor: colors.primary, stopOpacity:1}} />
                <stop offset="100%" style={{stopColor: colors.secondary, stopOpacity:1}} />
            </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="48" fill="url(#logoGradient)" />
        <circle cx="50" cy="50" r="42" className="fill-background dark:fill-slate-900" />
        <path d="M50,75 C50,75 50,65 58,60 C65,55 70,45 70,35 C70,20 60,15 50,25" className="stroke-text-main dark:stroke-slate-300" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M50,75 C50,75 50,65 42,60 C35,55 30,45 30,35 C30,20 40,15 50,25" stroke={colors.primary} strokeWidth="3" fill={colors.primary} strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M50,75 V90" className="stroke-text-main dark:stroke-slate-300" strokeWidth="3" strokeLinecap="round"/>
        <path d="M50,90 C40,85 35,75 42,70" className="stroke-text-main dark:stroke-slate-300" strokeWidth="3" fill="none" strokeLinecap="round"/>
        <path d="M50,90 C60,85 65,75 58,70" className="stroke-text-main dark:stroke-slate-300" strokeWidth="3" fill="none" strokeLinecap="round"/>
    </svg>
);

const Header = ({ theme, onToggleTheme, currentUser, onLogout }) => (<header className="flex justify-between items-center mb-8"><div className="flex items-center gap-3"><VitaNovaLogo /><h1 className="text-3xl font-bold text-text-main dark:text-slate-200">Vitanova</h1></div><div className="flex items-center gap-4">{currentUser && <span className="text-sm font-semibold capitalize hidden sm:inline">Welcome, {currentUser.name || currentUser.role}</span>}<button onClick={onToggleTheme} title={theme === 'light' ? 'Switch to Dark' : 'Switch to Light'} className="p-2 rounded-full hover:bg-gray-200/50 dark:hover:bg-slate-700"><Moon size={18} /></button>{currentUser && <button onClick={onLogout} title="Logout" className="p-2 rounded-full hover:bg-gray-200/50 dark:hover:bg-slate-700"><LogOut size={18} className="text-red-500" /></button>}</div></header>);
const NavItem = ({ title, description, active, onClick, icon: Icon, color, isCollapsed }) => (<button onClick={onClick} className={`w-full text-left p-3 rounded-xl transition-all border-2 ${active ? `bg-teal-50 dark:bg-teal-500/10 border-teal-200 dark:border-teal-500/20 shadow-sm` : 'bg-gray-50/50 dark:bg-slate-800/50 border-transparent hover:bg-teal-50/50 hover:border-teal-100 dark:hover:bg-teal-500/10 dark:hover:border-teal-900/10'}`}><div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}><div className={`p-2 rounded-lg ${active ? 'bg-white/60 dark:bg-teal-500/20' : 'bg-white/80 dark:bg-slate-700/50'}`}><Icon size={18} style={{color}}/></div><div className={isCollapsed ? 'hidden' : 'block'}><span className={`font-bold text-lg`} style={{color}}>{title}</span><p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{description}</p></div></div></button>);
const BasicDetailsForm = ({ formData, handleInputChange, errors = {} }) => (
    <div className="space-y-4">
        <div><label className="block text-sm font-medium mb-1">Full Name</label><div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3"><User size={16} className="text-gray-400" /></span><input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="John Doe" className="w-full p-2 pl-10 rounded-lg bg-gray-100 dark:bg-slate-700" /></div></div>
        <div><label className="block text-sm font-medium mb-1">Age</label><div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3"><BadgeCheck size={16} className="text-gray-400" /></span><input type="number" name="age" value={formData.age} onChange={handleInputChange} placeholder="e.g., 21" className="w-full p-2 pl-10 rounded-lg bg-gray-100 dark:bg-slate-700" /></div></div>
        <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3"><Phone size={16} className="text-gray-400" /></span><input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="e.g., 9876543210" className="w-full p-2 pl-10 rounded-lg bg-gray-100 dark:bg-slate-700" /></div>
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>
        <div>
            <label className="block text-sm font-medium mb-1">Emergency Contact Number</label>
            <div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3"><Phone size={16} className="text-gray-400" /></span><input type="tel" name="emergencyContact" value={formData.emergencyContact} onChange={handleInputChange} placeholder="Emergency contact's phone" className="w-full p-2 pl-10 rounded-lg bg-gray-100 dark:bg-slate-700" /></div>
            {errors.emergencyContact && <p className="text-red-500 text-xs mt-1">{errors.emergencyContact}</p>}
        </div>
        <div><label className="block text-sm font-medium mb-1">Address</label><div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3"><Home size={16} className="text-gray-400" /></span><textarea name="address" value={formData.address} onChange={handleInputChange} rows="3" placeholder="123 University Ave, College Town" className="w-full p-2 pl-10 rounded-lg bg-gray-100 dark:bg-slate-700"></textarea></div></div>
    </div>
);

const LoginView = ({ onLogin, loading, setAuthView }) => {
    const [email, setEmail] = useState('student@campus.edu');
    const [password, setPassword] = useState('password123');
    const [role, setRole] = useState('student');

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
            <Card className="w-full max-w-md">
                <div className="text-center mb-8">
                     <div className="inline-block"><VitaNovaLogo /></div>
                    <h1 className="text-3xl font-bold mt-4 text-primary">Vitanova Login</h1>
                    <p className="text-gray-500 dark:text-slate-400 mt-2">Sign in to access your dashboard.</p>
                </div>
                
                <form onSubmit={(e) => { e.preventDefault(); onLogin(role, email, password); }} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <div className="relative">
                           <span className="absolute inset-y-0 left-0 flex items-center pl-3"><Mail size={16} className="text-gray-400" /></span>
                           <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full p-2 pl-10 rounded-lg bg-gray-100 dark:bg-slate-700" />
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <div className="relative">
                           <span className="absolute inset-y-0 left-0 flex items-center pl-3"><KeyRound size={16} className="text-gray-400" /></span>
                           <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full p-2 pl-10 rounded-lg bg-gray-100 dark:bg-slate-700" />
                        </div>
                    </div>
                    <div className="text-right text-sm">
                        <button type="button" onClick={() => setAuthView('forgotPassword')} className="font-semibold text-gray-500 dark:text-slate-400 hover:text-primary">Forgot Password?</button>
                    </div>
                    <div className="flex justify-center gap-4 pt-2">
                       <label className="flex items-center gap-2">
                           <input type="radio" name="role" value="student" checked={role === 'student'} onChange={() => setRole('student')} className="text-primary focus:ring-primary" />
                           Student
                       </label>
                       <label className="flex items-center gap-2">
                           <input type="radio" name="role" value="counselor" checked={role === 'counselor'} onChange={() => {setRole('counselor'); setEmail('counselor@campus.edu')}} className="text-primary focus:ring-primary"/>
                           Counselor
                       </label>
                    </div>
                    <div className="pt-4 space-y-2">
                         <Button type="submit" loading={loading} icon={User} className="w-full">Login</Button>
                         <p className="text-center text-sm">
                            Don't have an account? <button type="button" onClick={() => setAuthView('signup')} className="font-semibold text-primary">Sign Up</button>
                         </p>
                    </div>
                </form>
            </Card>
        </div>
    )
};

const SignUpView = ({ onSignUp, loading, setLoading, setAuthView, setModalContent }) => {
    const [step, setStep] = useState(1);
    const [role, setRole] = useState('student');
    const [formData, setFormData] = useState({ name: '', age: '', address: '', phone: '', emergencyContact: '', email: '', password: '', otp: '', license: '', certifications: '' });
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
    const validatePhone = (phone) => /^\d{10}$/.test(phone);
    
    const handleNextStep = async () => {
        if (!validateEmail(formData.email)) {
            setErrors({ email: "Please enter a valid email address." });
            return;
        }
        setLoading(true);
        await mockDelay();
        setLoading(false);
        setModalContent({ title: "OTP Sent", body: `A verification code has been sent to ${formData.email} (simulation). For this demo, any 6 digits will work.` });
        setStep(step + 1);
    };

    const handleFinalSubmit = () => {
        const newErrors = {};
        if (!validatePhone(formData.phone)) {
            newErrors.phone = "Please enter a valid 10-digit phone number.";
        }
        if (formData.emergencyContact && !validatePhone(formData.emergencyContact)) {
            newErrors.emergencyContact = "Please enter a valid 10-digit emergency contact number.";
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        onSignUp(formData, role);
    };

    const renderStep = () => {
        switch (step) {
            case 1: return (<><h2 className="text-xl font-bold text-center mb-6">Join Vitanova</h2><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><button onClick={() => { setRole('student'); setStep(2); }} className="p-6 border-2 rounded-lg hover:border-primary hover:bg-teal-50 dark:hover:bg-slate-700 transition-colors text-center"><User size={32} className="mx-auto mb-2 text-primary" /><h3 className="font-semibold">I am a Student</h3><p className="text-xs text-gray-500 dark:text-slate-400">Seeking support and resources.</p></button><button onClick={() => { setRole('counselor'); setStep(2); }} className="p-6 border-2 rounded-lg hover:border-primary hover:bg-teal-50 dark:hover:bg-slate-700 transition-colors text-center"><UserCheck size={32} className="mx-auto mb-2 text-primary" /><h3 className="font-semibold">I am a Counselor</h3><p className="text-xs text-gray-500 dark:text-slate-400">Looking to provide support.</p></button></div></>);
            case 2: return (<><h2 className="text-xl font-bold text-center mb-6">Create Your {role === 'student' ? 'Student' : 'Counselor'} Account</h2><div className="space-y-4"><div><label className="block text-sm font-medium mb-1">Email</label><div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3"><Mail size={16} className="text-gray-400" /></span><input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="you@example.com" className="w-full p-2 pl-10 rounded-lg bg-gray-100 dark:bg-slate-700" /></div>{errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}</div><div><label className="block text-sm font-medium mb-1">Password</label><div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3"><KeyRound size={16} className="text-gray-400" /></span><input type="password" name="password" value={formData.password} onChange={handleInputChange} placeholder="••••••••" className="w-full p-2 pl-10 rounded-lg bg-gray-100 dark:bg-slate-700" /></div></div></div><div className="mt-6"><Button onClick={handleNextStep} loading={loading} className="w-full">Send Verification Code</Button></div></>);
            case 3: return (<><h2 className="text-xl font-bold text-center mb-6">Verify Your Email</h2><p className="text-center text-sm text-gray-500 dark:text-slate-400 mb-4">Enter the 6-digit code sent to {formData.email}.</p><div><label className="block text-sm font-medium mb-1">Verification Code (OTP)</label><div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3"><BadgeCheck size={16} className="text-gray-400" /></span><input type="text" name="otp" value={formData.otp} onChange={handleInputChange} placeholder="123456" className="w-full p-2 pl-10 rounded-lg bg-gray-100 dark:bg-slate-700" /></div></div><div className="mt-6"><Button onClick={() => setStep(role === 'counselor' ? 4 : 5)} loading={loading} className="w-full">Verify & Continue</Button></div></>);
            case 4: return (<><h2 className="text-xl font-bold text-center mb-6">Professional Verification</h2><p className="text-center text-sm text-gray-500 dark:text-slate-400 mb-4">Please provide your professional credentials. This information will be kept confidential.</p><div className="space-y-4"><div><label className="block text-sm font-medium mb-1">Medical License Number</label><div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3"><FileText size={16} className="text-gray-400" /></span><input type="text" name="license" value={formData.license} onChange={handleInputChange} placeholder="e.g., A-123456" className="w-full p-2 pl-10 rounded-lg bg-gray-100 dark:bg-slate-700" /></div></div><div><label className="block text-sm font-medium mb-1">Certifications</label><div className="relative"><span className="absolute inset-y-0 left-0 flex items-center pl-3"><FileText size={16} className="text-gray-400" /></span><textarea name="certifications" value={formData.certifications} onChange={handleInputChange} rows="3" placeholder="List relevant certifications" className="w-full p-2 pl-10 rounded-lg bg-gray-100 dark:bg-slate-700"></textarea></div></div></div><div className="mt-6"><Button onClick={() => setStep(5)} loading={loading} className="w-full">Continue</Button></div></>);
            case 5: return (<><h2 className="text-xl font-bold text-center mb-6">Tell Us About Yourself</h2><p className="text-center text-sm text-gray-500 dark:text-slate-400 mb-4">This helps us personalize your experience.</p><BasicDetailsForm formData={formData} handleInputChange={handleInputChange} errors={errors} /><div className="mt-6"><Button onClick={handleFinalSubmit} loading={loading} className="w-full">Complete Registration</Button></div></>);
            default: return null;
        }
    };
    return (<div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]"><Card className="w-full max-w-md">{renderStep()}<p className="text-center text-sm mt-6">{step > 1 && <button onClick={() => setStep(step === 5 && role === 'student' ? 3 : step - 1)} className="font-semibold text-gray-500 dark:text-slate-400 hover:underline mr-4">Back</button>}Already have an account? <button onClick={() => setAuthView('login')} className="font-semibold text-primary">Log In</button></p></Card></div>);
}

const ForgotPasswordView = ({ onResetPassword, loading, setLoading, setAuthView, setModalContent }) => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    
    const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

    const handleSendCode = async () => {
        setError('');
        if (!validateEmail(email)) {
            setError("Please enter a valid email address.");
            return;
        }
        setLoading(true);
        await mockDelay();
        setLoading(false);
        setModalContent({ title: "Verification Code Sent", body: `A verification code has been sent to ${email} (simulation). For this demo, any 6 digits will work.` });
        setStep(2);
    };
    
    const handleVerifyCode = () => {
        if (otp.length !== 6) {
             setModalContent({ title: "Error", body: "Please enter a valid 6-digit OTP." });
            return;
        }
        setStep(3);
    };

    const handleReset = () => {
        if (newPassword.length < 6) {
            setModalContent({ title: "Error", body: "Password must be at least 6 characters long." });
            return;
        }
        if (newPassword !== confirmPassword) {
            setModalContent({ title: "Error", body: "Passwords do not match." });
            return;
        }
        onResetPassword({ email, newPassword });
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (<>
                    <h2 className="text-xl font-bold text-center mb-6">Forgot Password</h2>
                    <p className="text-center text-sm text-gray-500 dark:text-slate-400 mb-4">Enter your email to receive a verification code.</p>
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <div className="relative">
                           <span className="absolute inset-y-0 left-0 flex items-center pl-3"><Mail size={16} className="text-gray-400" /></span>
                           <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full p-2 pl-10 rounded-lg bg-gray-100 dark:bg-slate-700" />
                        </div>
                        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
                    </div>
                    <div className="mt-6"><Button onClick={handleSendCode} loading={loading} className="w-full">Send Code</Button></div>
                </>);
            case 2:
                return (<>
                    <h2 className="text-xl font-bold text-center mb-6">Enter Verification Code</h2>
                    <p className="text-center text-sm text-gray-500 dark:text-slate-400 mb-4">Enter the 6-digit code sent to {email}.</p>
                    <div>
                        <label className="block text-sm font-medium mb-1">Verification Code (OTP)</label>
                        <div className="relative">
                           <span className="absolute inset-y-0 left-0 flex items-center pl-3"><BadgeCheck size={16} className="text-gray-400" /></span>
                           <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="123456" className="w-full p-2 pl-10 rounded-lg bg-gray-100 dark:bg-slate-700" />
                        </div>
                    </div>
                    <div className="mt-6"><Button onClick={handleVerifyCode} className="w-full">Verify</Button></div>
                </>);
            case 3:
                 return (<>
                    <h2 className="text-xl font-bold text-center mb-6">Reset Your Password</h2>
                    <p className="text-center text-sm text-gray-500 dark:text-slate-400 mb-4">Enter and confirm your new password.</p>
                    <div className="space-y-4">
                        <div>
                           <label className="block text-sm font-medium mb-1">New Password</label>
                           <div className="relative">
                               <span className="absolute inset-y-0 left-0 flex items-center pl-3"><KeyRound size={16} className="text-gray-400" /></span>
                               <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" className="w-full p-2 pl-10 rounded-lg bg-gray-100 dark:bg-slate-700" />
                           </div>
                       </div>
                       <div>
                           <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                           <div className="relative">
                               <span className="absolute inset-y-0 left-0 flex items-center pl-3"><KeyRound size={16} className="text-gray-400" /></span>
                               <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="w-full p-2 pl-10 rounded-lg bg-gray-100 dark:bg-slate-700" />
                           </div>
                       </div>
                    </div>
                    <div className="mt-6"><Button onClick={handleReset} loading={loading} className="w-full">Reset Password</Button></div>
                </>);
            default: return null;
        }
    };
     return (<div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]"><Card className="w-full max-w-md">{renderStep()}<p className="text-center text-sm mt-6"><button onClick={() => setAuthView('login')} className="font-semibold text-primary">Back to Login</button></p></Card></div>);
};

const SimpleBookingCalendar = ({ onDateSelect, selectedDate, isDateAvailable }) => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    const dates = [today, tomorrow];

    return (
        <div>
             <div className="flex gap-4">
                {dates.map(date => {
                    const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
                    const available = isDateAvailable ? isDateAvailable(date) : true; 

                    return (
                        <button
                            key={date.toISOString()}
                            onClick={() => onDateSelect(date)}
                            disabled={!available}
                            className={`flex-1 p-4 border-2 rounded-lg text-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed relative ${
                                isSelected
                                    ? 'bg-primary text-white border-primary'
                                    : 'bg-gray-50 dark:bg-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-700'
                            }`}
                        >
                            {available && <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-secondary"></span>}
                            <p className="font-bold text-lg">{date.toLocaleDateString('en-US', { weekday: 'short' }) === today.toLocaleDateString('en-US', { weekday: 'short' }) ? 'Today' : 'Tomorrow'}</p>
                            <p className="text-sm">{date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</p>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};


const HomeView = ({ setView, screenings, moods, onLogMood, resources, goals, currentUser }) => {
    const latestScreening = screenings && screenings.length > 0 ? screenings[0] : null;

    const riskMap = {
        severe: { label: "Severe", color: "bg-red-100 text-red-800" },
        moderately_severe: { label: "Moderately Severe", color: "bg-orange-100 text-orange-800" },
        moderate: { label: "Moderate", color: "bg-yellow-100 text-yellow-800" },
        mild: { label: "Mild", color: "bg-blue-100 text-blue-800" },
        minimal: { label: "Minimal", color: "bg-green-100 text-green-800" },
    };
    
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">{getGreeting()}, {currentUser.name || 'Student'}!</h2>
            <p className="text-gray-600 dark:text-slate-400 mb-6">Your mental well-being is our priority. Here are some resources to help you.</p>
            
            <DailyQuote />
            <MoodTracker moods={moods} onLogMood={onLogMood} />
            <GoalsToday goals={goals} setView={setView} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <GuidedBreathingExercise />
                <SoundscapesPlayer resources={resources} />
            </div>

            {latestScreening && (
                <Card className="mb-6 bg-teal-50/70 dark:bg-slate-800 border border-teal-200 dark:border-slate-700">
                    <h3 className="font-bold text-lg mb-3">Your Latest Screening Result</h3>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                        <p className="text-sm">Taken on: <span className="font-semibold">{new Date(latestScreening.createdAt).toLocaleDateString()}</span></p>
                        <p className="text-sm">Score: <span className="font-semibold">{latestScreening.score}</span></p>
                        <p className="text-sm flex items-center gap-2">Risk Level: <Badge color={riskMap[latestScreening.risk].color}>{riskMap[latestScreening.risk].label}</Badge></p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-3">This is not a diagnosis. For a formal assessment, please book an appointment with a counselor.</p>
                    <div className="mt-4"><Button onClick={() => setView('screening')} variant="secondary">Take a New Screening</Button></div>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                 <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-teal-50/70 dark:bg-slate-800/80 border border-teal-200 dark:border-slate-700" onClick={() => setView('screening')}>
                    <div className="flex items-start gap-4">
                        <div className="bg-teal-100 dark:bg-teal-900/40 p-3 rounded-xl"><Bell style={{color: colors.primary}} size={24} /></div>
                        <div>
                            <h3 className="font-bold text-lg mb-1">Mental Health Screening</h3>
                            <p className="text-sm text-gray-600 dark:text-slate-400">Take a confidential screening to check on your mental well-being.</p>
                        </div>
                    </div>
                </Card>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-green-50/70 dark:bg-slate-800/80 border-green-200 dark:border-slate-700" onClick={() => setView('bookings')}>
                    <div className="flex items-start gap-4">
                        <div className="bg-green-100 dark:bg-green-900/40 p-3 rounded-xl"><CalendarDays style={{color: colors.secondary}} size={24} /></div>
                        <div>
                            <h3 className="font-bold text-lg mb-1">Book an Appointment</h3>
                            <p className="text-sm text-gray-600 dark:text-slate-400">Schedule a one-on-one session with a professional counselor.</p>
                        </div>
                    </div>
                </Card>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-yellow-50/70 dark:bg-slate-800/80 border-yellow-200 dark:border-slate-700" onClick={() => setView('forum')}>
                     <div className="flex items-start gap-4">
                        <div className="bg-yellow-100 dark:bg-yellow-900/40 p-3 rounded-xl"><MessageSquare style={{color: colors.accent}} size={24} /></div>
                        <div>
                            <h3 className="font-bold text-lg mb-1">Peer Support Forum</h3>
                            <p className="text-sm text-gray-600 dark:text-slate-400">Connect with fellow students in a safe, anonymous space.</p>
                        </div>
                    </div>
                </Card>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-blue-50/70 dark:bg-slate-800/80 border-blue-200 dark:border-slate-700" onClick={() => setView('videos')}>
                    <div className="flex items-start gap-4">
                        <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-xl"><Film className="text-blue-500" size={24} /></div>
                        <div>
                            <h3 className="font-bold text-lg mb-1">Health Videos</h3>
                            <p className="text-sm text-gray-600 dark:text-slate-400">Watch curated videos on mental health and wellness topics.</p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

const ScreeningView = ({ onSubmit, loading, setModalContent, currentUser }) => {
    const phq9Questions = ["Little interest or pleasure in doing things", "Feeling down, depressed, or hopeless", "Trouble falling or staying asleep, or sleeping too much", "Feeling tired or having little energy", "Poor appetite or overeating", "Feeling bad about yourself - or that you are a failure or have let yourself or your family down", "Trouble concentrating on things, such as reading the newspaper or watching television", "Moving or speaking so slowly that other people could have noticed. Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual", "Thoughts that you would be better off dead, or of hurting yourself"];
    const options = ["Not at all (0)", "Several days (1)", "More than half the days (2)", "Nearly every day (3)"];
    const [responses, setResponses] = useState(Array(phq9Questions.length).fill(null));

    const handleResponseChange = (qIndex, oIndex) => {
        const newResponses = [...responses];
        newResponses[qIndex] = oIndex;
        setResponses(newResponses);
    };

    const isComplete = responses.every(r => r !== null);

    const handleSubmit = async () => {
        if (!isComplete) return;
        
        const score = responses.reduce((a, b) => a + b, 0);
        const riskMap = {
            severe: { label: "Severe", color: "bg-red-100 text-red-800" },
            moderately_severe: { label: "Moderately Severe", color: "bg-orange-100 text-orange-800" },
            moderate: { label: "Moderate", color: "bg-yellow-100 text-yellow-800" },
            mild: { label: "Mild", color: "bg-blue-100 text-blue-800" },
            minimal: { label: "Minimal", color: "bg-green-100 text-green-800" },
        };
        const riskKey = score >= 20 ? "severe" : score >= 15 ? "moderately_severe" : score >= 10 ? "moderate" : score >= 5 ? "mild" : "minimal";
        
        onSubmit({ tool: 'PHQ-9', responses, score, risk: riskKey }, (res) => {
            setModalContent({
                title: 'Screening Result',
                body: (
                    <div>
                        <p className="mb-2">Your PHQ-9 score is <strong>{score}</strong>.</p>
                        <p className="mb-4">This suggests a <Badge color={riskMap[riskKey].color}>{riskMap[riskKey].label}</Badge> level of depressive symptoms.</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400"><strong>Disclaimer:</strong> This is not a diagnosis. Please consult a healthcare professional for a formal assessment.</p>
                    </div>
                )
            });
            setResponses(Array(phq9Questions.length).fill(null));
        });
    };

    return (
        <Card>
            <h2 className="text-2xl font-bold mb-2">PHQ-9 Depression Screening</h2>
            <p className="text-text-main dark:text-slate-400 mb-6">Over the last 2 weeks, how often have you been bothered by any of the following problems?</p>
            <div className="space-y-6">
                {phq9Questions.map((q, qIndex) => (
                    <div key={qIndex}>
                        <p className="font-semibold mb-3">{qIndex + 1}. {q}</p>
                        <div className="flex flex-wrap gap-3">
                            {options.map((opt, oIndex) => (
                                <button key={oIndex} onClick={() => handleResponseChange(qIndex, oIndex)} className={`px-3 py-2 text-sm rounded-lg border-2 ${responses[qIndex] === oIndex ? 'bg-primary text-white border-primary' : 'bg-transparent border-gray-300 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-700'}`}>
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-8 border-t dark:border-slate-700 pt-6 flex justify-end">
                <Button onClick={handleSubmit} disabled={!isComplete} loading={loading}>Submit Screening</Button>
            </div>
        </Card>
    );
};

const BookingView = ({ bookings, onBook, loading, setModalContent, currentUser }) => {
    const [counselors, setCounselors] = useState([]);
    const [selectedCounselorId, setSelectedCounselorId] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedSlot, setSelectedSlot] = useState('');

    useEffect(() => {
        const allUsers = getStoredUsers();
        const availableCounselors = allUsers.filter(user => 
            user.role === 'counselor' &&
            user.availabilityCalendar &&
            Object.keys(user.availabilityCalendar).length > 0
        );
        setCounselors(availableCounselors);
        if (availableCounselors.length > 0) {
            setSelectedCounselorId(availableCounselors[0].id);
        }
    }, []);
    
    const selectedCounselor = counselors.find(c => c.id === selectedCounselorId);

    const isDateAvailable = useCallback((date) => {
        if (!selectedCounselor?.availabilityCalendar) return false;
        const dateString = date.toISOString().split('T')[0];
        return selectedCounselor.availabilityCalendar[dateString]?.length > 0;
    }, [selectedCounselor]);

    const handleDateClick = (date) => {
        setSelectedDate(date);
        setSelectedSlot('');
    };

    const handleBooking = () => {
        if(!selectedCounselor || !selectedDate || !selectedSlot) {
            setModalContent({ title: 'Error', body: 'Please select a counselor, date, and time slot.'});
            return;
        }
        const slot = `${selectedDate.toLocaleDateString()} at ${selectedSlot}`;
        onBook({ counselor: selectedCounselor, slot }, (res) => {
             setModalContent({ title: 'Booking Confirmed!', body: <p>Your appointment with {res.counselorName} is confirmed for {res.slot}.</p> });
        });
    };

    return (
        <div className="space-y-6">
            <Card>
                <h2 className="text-2xl font-bold mb-4">Book an Appointment</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium mb-2">1. Select Counselor</label>
                        <select value={selectedCounselorId} onChange={e => {setSelectedCounselorId(e.target.value); setSelectedDate(null); setSelectedSlot('')}} className="w-full p-2 rounded-lg bg-gray-100 dark:bg-slate-700 border border-transparent focus:ring-2 focus:ring-primary">
                           {counselors.length > 0 ? (
                               counselors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)
                           ) : (
                               <option disabled>No counselors currently available</option>
                           )}
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium mb-2">2. Select an Available Day</label>
                        {selectedCounselor ? (
                            <SimpleBookingCalendar 
                                onDateSelect={handleDateClick} 
                                selectedDate={selectedDate} 
                                isDateAvailable={isDateAvailable}
                            />
                        ) : (
                             <div className="p-4 text-center bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                                <p className="text-gray-500 dark:text-slate-400">
                                    {counselors.length > 0 ? "Please select a counselor." : "No counselors have set their availability."}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
                 {selectedDate && (
                    <div className="mt-6">
                        <label className="block text-sm font-medium mb-2">3. Select a Time Slot for {selectedDate.toLocaleDateString()}</label>
                        <div className="flex flex-wrap gap-2">
                             {(selectedCounselor?.availabilityCalendar?.[selectedDate.toISOString().split('T')[0]] || []).map(slot => (
                                 <button 
                                     key={slot}
                                     onClick={() => setSelectedSlot(slot)}
                                     className={`px-3 py-2 text-sm rounded-lg border-2 ${selectedSlot === slot ? 'bg-primary text-white border-primary' : 'bg-transparent border-gray-300 dark:border-slate-600 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
                                 >
                                     {slot}
                                 </button>
                             ))}
                        </div>
                    </div>
                )}
                <div className="mt-6 flex justify-end"><Button onClick={handleBooking} disabled={!selectedCounselor || !selectedDate || !selectedSlot} loading={loading}>Book Session</Button></div>
            </Card>
            
            <Card>
                <h2 className="text-2xl font-bold mb-4">Your Upcoming Appointments</h2>
                {bookings.length > 0 ? (
                    <ul className="space-y-4">
                        {bookings.map(b => (
                            <li key={b._id} className="p-4 rounded-lg bg-gray-100 dark:bg-slate-700 flex justify-between items-center">
                                <div>
                                    <p className="font-semibold">{b.counselorName}</p>
                                    <p className="text-sm text-gray-600 dark:text-slate-400">{b.slot}</p>
                                </div>
                                <Badge color="bg-green-100 text-green-800">{b.status}</Badge>
                            </li>
                        ))}
                    </ul>
                ) : <p className="text-gray-500 dark:text-slate-400">No upcoming appointments.</p>}
            </Card>
        </div>
    );
};

const ForumView = ({ forum, onPost, loading, setModalContent, currentUser }) => {
    const [anonHandle, setAnonHandle] = useState('AnonymousPanda');
    const [content, setContent] = useState('');
    
    const handlePost = () => {
        if (!content.trim()) return;
        onPost({ anonHandle, content }, () => {
            setModalContent({ title: 'Success', body: 'Your post has been submitted.' });
            setContent('');
        });
    };
    
    const timeAgo = (dateString) => {
        const date = new Date(dateString);
        const seconds = Math.floor((new Date() - date) / 1000);
        let interval = seconds / 31536000; if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000; if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400; if (interval > 1) return Math.floor(interval) + " days ago";
        interval = seconds / 3600; if (interval > 1) return Math.floor(interval) + " hours ago";
        interval = seconds / 60; if (interval > 1) return Math.floor(interval) + " minutes ago";
        return "Just now";
    };

    return (
        <div className="space-y-6">
            <Card>
                <h2 className="text-2xl font-bold mb-4">Peer Support Forum</h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Anonymous Handle</label>
                        <input type="text" value={anonHandle} onChange={e => setAnonHandle(e.target.value)} placeholder="e.g. BraveBadger" className="w-full p-2 rounded-lg bg-gray-100 dark:bg-slate-700 border border-transparent focus:ring-2 focus:ring-primary" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Your Message</label>
                        <textarea value={content} onChange={e => setContent(e.target.value)} rows="4" placeholder="Share your thoughts..." className="w-full p-2 rounded-lg bg-gray-100 dark:bg-slate-700 border border-transparent focus:ring-2 focus:ring-primary"></textarea>
                    </div>
                    <div className="flex justify-end"><Button onClick={handlePost} loading={loading} icon={Send}>Post Anonymously</Button></div>
                </div>
            </Card>
            
            <div className="space-y-4">
                <h3 className="text-xl font-bold">Recent Posts</h3>
                {forum.length > 0 ? forum.map(p => (
                    <Card key={p._id}>
                        <div className="flex justify-between items-start">
                            <p className="font-bold text-primary">{p.anonHandle}</p>
                            <p className="text-xs text-gray-500 dark:text-slate-400">{timeAgo(p.createdAt)}</p>
                        </div>
                        <p className="mt-2 text-text-main dark:text-slate-300">{p.content}</p>
                    </Card>
                )) : <p className="text-gray-500 dark:text-slate-400">No posts yet. Be the first to share!</p>}
            </div>
        </div>
    );
};

const GoalsView = ({ goals, onCreate, onToggle, onDelete, loading, currentUser }) => {
    const [content, setContent] = useState('');

    const handleCreate = () => {
        if (!content.trim()) return;
        onCreate({ content }, () => {
            setContent('');
        });
    };

    return (
        <div className="space-y-6">
            <Card>
                <h2 className="text-2xl font-bold mb-4">Personal Goals</h2>
                <p className="text-text-main dark:text-slate-400 mb-4">Set small, achievable goals for your well-being. What's one positive thing you can do today?</p>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        placeholder="e.g., Go for a 15-minute walk"
                        className="flex-grow p-2 rounded-lg bg-gray-100 dark:bg-slate-700 border border-transparent focus:ring-2 focus:ring-primary"
                    />
                    <Button onClick={handleCreate} loading={loading} icon={Plus}>Add</Button>
                </div>
            </Card>
            
            <div className="space-y-4">
                <h3 className="text-xl font-bold">Your Goals</h3>
                {goals.length > 0 ? goals.map(goal => (
                     <Card key={goal._id} className={`flex items-center justify-between transition-opacity ${goal.completed ? 'opacity-60' : 'opacity-100'}`}>
                        <div className="flex items-center gap-4">
                            <button onClick={() => onToggle({goalId: goal._id})} className="flex-shrink-0">
                                <CheckSquare size={24} className={goal.completed ? 'text-secondary' : 'text-gray-400 dark:text-slate-500'} />
                            </button>
                            <p className={`text-text-main dark:text-slate-300 ${goal.completed ? 'line-through' : ''}`}>{goal.content}</p>
                        </div>
                         <button onClick={() => onDelete({goalId: goal._id})} className="p-1 text-gray-400 dark:text-slate-500 hover:text-red-500 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50">
                             <Trash2 size={18} />
                         </button>
                    </Card>
                )) : (
                    <Card>
                        <p className="text-gray-500 dark:text-slate-400">No goals set yet. Add one above to get started!</p>
                    </Card>
                )}
            </div>
        </div>
    );
};

const JournalView = ({ journal, onEntry, loading, setModalContent, currentUser }) => {
    const [content, setContent] = useState('');

    const handleSubmit = () => {
        if (!content.trim()) return;
        onEntry({ content }, () => {
            setModalContent({ title: 'Success', body: 'Your journal entry has been saved.' });
            setContent('');
        });
    };

    return (
        <div className="space-y-6">
            <Card>
                <h2 className="text-2xl font-bold mb-4">Gratitude Journal</h2>
                <p className="text-text-main dark:text-slate-400 mb-4">Take a moment to write down something you're grateful for today. It can be big or small.</p>
                <div>
                    <textarea
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        rows="5"
                        placeholder="Today, I am grateful for..."
                        className="w-full p-2 rounded-lg bg-gray-100 dark:bg-slate-700 border border-transparent focus:ring-2 focus:ring-primary"
                    />
                </div>
                <div className="flex justify-end mt-4">
                    <Button onClick={handleSubmit} loading={loading} icon={Send}>Save Entry</Button>
                </div>
            </Card>

            <div className="space-y-4">
                <h3 className="text-xl font-bold">Past Entries</h3>
                {journal.length > 0 ? journal.slice(0, 10).map(entry => (
                    <Card key={entry._id}>
                        <p className="text-xs text-gray-500 dark:text-slate-400 mb-2">{new Date(entry.createdAt).toLocaleString()}</p>
                        <p className="text-text-main dark:text-slate-300 whitespace-pre-wrap">{entry.content}</p>
                    </Card>
                )) : (
                    <Card>
                        <p className="text-gray-500 dark:text-slate-400">You haven't written any journal entries yet.</p>
                    </Card>
                )}
            </div>
        </div>
    );
};

const VideosView = ({ videos, onPlayVideo }) => (
    <Card>
        <h2 className="text-2xl font-bold mb-4">Health & Wellness Videos</h2>
        <p className="text-text-main dark:text-slate-400 mb-6">Watch these short videos to learn more about managing your mental well-being.</p>
        {videos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {videos.map(video => (
                    <div key={video._id} className="cursor-pointer group" onClick={() => onPlayVideo(video)}>
                        <div className="overflow-hidden rounded-lg mb-3 shadow-md">
                            <img src={video.thumbnailUrl} alt={video.title} className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300" 
                                 onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x400/ef4444/ffffff?text=Image+Not+Found'; }}
                            />
                        </div>
                        <h3 className="font-semibold text-lg group-hover:text-primary">{video.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-slate-400">{video.description}</p>
                    </div>
                ))}
            </div>
        ) : <p className="text-gray-500 dark:text-slate-400">No videos available at the moment.</p>}
    </Card>
);

const ResourcesView = ({ resources, onArticleClick }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredArticles = useMemo(() =>
        resources.articles.filter(article =>
            article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            article.snippet.toLowerCase().includes(searchTerm.toLowerCase())
        ), [searchTerm, resources.articles]);

    return (
        <div className="space-y-6">
            <Card>
                <h2 className="text-2xl font-bold mb-4">Resource Library</h2>
                <p className="text-text-main dark:text-slate-400 mb-6">Find helpful articles, contacts, and links for mental health support.</p>
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search articles..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 pl-10 rounded-lg bg-gray-100 dark:bg-slate-700 border border-transparent focus:ring-2 focus:ring-primary"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={18} className="text-gray-400" />
                    </div>
                </div>
            </Card>
            <Card>
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><BookOpen size={20}/> Articles & Guides</h3>
                <div className="space-y-4">
                    {filteredArticles.length > 0 ? (
                        filteredArticles.map(article => (
                            <button onClick={() => onArticleClick(article)} key={article._id} className="w-full text-left block p-4 rounded-lg bg-gray-50 dark:bg-slate-700/50 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                                <p className="font-semibold">{article.title}</p>
                                <p className="text-sm text-gray-600 dark:text-slate-400">{article.snippet}</p>
                            </button>
                        ))
                    ) : (
                        <p className="text-gray-500 dark:text-slate-400 text-center py-4">No articles found matching your search.</p>
                    )}
                </div>
            </Card>
             <Card>
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Phone size={20}/> Support Hotlines</h3>
                <ul className="space-y-3">
                    {resources.hotlines.map(hotline => (
                        <li key={hotline._id} className="flex justify-between items-center">
                            <div>
                                <p className="font-semibold">{hotline.name}</p>
                                <p className="text-sm text-primary">{hotline.phone}</p>
                            </div>
                            <Badge color="bg-secondary/20 text-secondary">{hotline.available}</Badge>
                        </li>
                    ))}
                </ul>
            </Card>
        </div>
    );
};

const CounselorDashboardView = ({ allData }) => {
    const stats = useMemo(() => ({
        total: allData.screenings.length,
        highRisk: allData.screenings.filter(s => s.risk === "severe" || s.risk === "moderately_severe").length,
        bookings: allData.bookings.length,
        forum: allData.forum.length,
    }), [allData]);

    const riskMap = {
        severe: { label: "Severe", color: "bg-red-100 text-red-800" },
        moderately_severe: { label: "Moderately Severe", color: "bg-orange-100 text-orange-800" },
        moderate: { label: "Moderate", color: "bg-yellow-100 text-yellow-800" },
        mild: { label: "Mild", color: "bg-blue-100 text-blue-800" },
        minimal: { label: "Minimal", color: "bg-green-100 text-green-800" },
    };

    return (
         <div className="space-y-6">
            <h2 className="text-2xl font-bold">Counselor Dashboard</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card><p className="font-bold text-2xl">{stats.total}</p><p className="text-sm">Total Screenings</p></Card>
                <Card><p className="font-bold text-2xl">{stats.highRisk}</p><p className="text-sm">High-Risk Cases</p></Card>
                <Card><p className="font-bold text-2xl">{stats.bookings}</p><p className="text-sm">Appointments</p></Card>
                <Card><p className="font-bold text-2xl">{stats.forum}</p><p className="text-sm">Forum Posts</p></Card>
            </div>
            
            <CounselorAppointmentsView bookings={allData.bookings} />

            <Card>
                <h3 className="font-bold text-lg mb-4">Recent Screenings (Anonymous)</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-slate-700"><tr><th className="p-2">Date</th><th className="p-2">Tool</th><th className="p-2">Score</th><th className="p-2">Risk Level</th></tr></thead>
                        <tbody>
                            {allData.screenings.slice(0, 5).map(s => (
                                <tr key={s._id} className="border-b dark:border-slate-600">
                                    <td className="p-2">{new Date(s.createdAt).toLocaleDateString()}</td><td className="p-2">{s.tool}</td><td className="p-2">{s.score}</td><td className="p-2"><Badge color={riskMap[s.risk].color}>{riskMap[s.risk].label}</Badge></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    )
};

const CounselorProfileView = ({ onUpdateProfile, loading, currentUser }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [availability, setAvailability] = useState(currentUser.availabilityCalendar || {});

    const allSlots = ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"];

    const toggleSlotForDate = (slot) => {
        const dateString = selectedDate.toISOString().split('T')[0];
        setAvailability(prev => {
            const newAvail = { ...prev };
            const slotsForDay = newAvail[dateString] || [];
            if (slotsForDay.includes(slot)) {
                newAvail[dateString] = slotsForDay.filter(s => s !== slot);
            } else {
                newAvail[dateString] = [...slotsForDay, slot].sort();
            }
            if (newAvail[dateString].length === 0) {
                delete newAvail[dateString];
            }
            return newAvail;
        });
    };

    const handleSave = () => {
        onUpdateProfile({ availabilityCalendar: availability });
    };

    const isDateAvailable = useCallback((date) => {
        const dateString = date.toISOString().split('T')[0];
        return availability[dateString]?.length > 0;
    }, [availability]);


    return (
        <Card>
            <h2 className="text-2xl font-bold mb-4">Set Your Availability</h2>
            <p className="text-sm text-gray-500 dark:text-slate-400 mb-6">Select a day, then choose the time slots you are available for. You can only set availability for today and tomorrow.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <SimpleBookingCalendar 
                        onDateSelect={setSelectedDate}
                        selectedDate={selectedDate}
                        isDateAvailable={isDateAvailable}
                    />
                </div>
                <div>
                    <h3 className="font-bold text-lg mb-4">Available Slots for {selectedDate.toLocaleDateString()}</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {allSlots.map(slot => {
                            const dateString = selectedDate.toISOString().split('T')[0];
                            const isAvailable = availability[dateString]?.includes(slot);
                            return (
                                <button
                                    key={slot}
                                    onClick={() => toggleSlotForDate(slot)}
                                    className={`p-3 border rounded-lg text-sm transition-colors ${isAvailable ? 'bg-primary text-white border-primary' : 'bg-gray-50 dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-600'}`}
                                >
                                    {slot}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>
             <div className="flex justify-end pt-6 mt-6 border-t dark:border-slate-700">
                <Button onClick={handleSave} loading={loading}>Save Changes</Button>
            </div>
        </Card>
    );
};

const CounselorAppointmentsView = ({ bookings }) => (
    <Card>
        <h2 className="text-2xl font-bold mb-4">Upcoming Appointments</h2>
        {bookings.length > 0 ? (
            <ul className="space-y-4">
                {bookings.map(b => (
                    <li key={b._id} className="p-4 rounded-lg bg-gray-100 dark:bg-slate-700 flex justify-between items-center">
                        <div>
                            <p className="font-semibold">With Student</p>
                            <p className="text-sm text-gray-600 dark:text-slate-400">{b.slot}</p>
                        </div>
                        <Badge color="bg-green-100 text-green-800">{b.status}</Badge>
                    </li>
                ))}
            </ul>
        ) : <p className="text-gray-500 dark:text-slate-400">No upcoming appointments.</p>}
    </Card>
);

const CounselorVideoUploadView = ({ onUploadVideo, loading, setModalContent }) => {
    const [newVideo, setNewVideo] = useState({ title: '', description: '', thumbnailUrl: '', videoUrl: '' });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewVideo(prev => ({ ...prev, [name]: value }));
    };

    const handleUpload = () => {
        if (!newVideo.title || !newVideo.videoUrl) {
            setModalContent({ title: 'Error', body: 'Video Title and YouTube URL are required.' });
            return;
        }
        onUploadVideo(newVideo, () => {
             setModalContent({ title: 'Success', body: 'Video has been uploaded successfully!' });
             setNewVideo({ title: '', description: '', thumbnailUrl: '', videoUrl: '' });
        });
    };

    return (
        <Card>
            <h2 className="text-2xl font-bold mb-4">Upload New Health Video</h2>
            <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium mb-1">Video Title</label>
                    <input type="text" name="title" value={newVideo.title} onChange={handleInputChange} placeholder="e.g., Mindfulness for Students" className="w-full p-2 rounded-lg bg-gray-100 dark:bg-slate-700" />
                </div>
                 <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea name="description" value={newVideo.description} onChange={handleInputChange} rows="2" placeholder="A short description of the video..." className="w-full p-2 rounded-lg bg-gray-100 dark:bg-slate-700"></textarea>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Thumbnail Image URL</label>
                    <input type="text" name="thumbnailUrl" value={newVideo.thumbnailUrl} onChange={handleInputChange} placeholder="https://placehold.co/600x400" className="w-full p-2 rounded-lg bg-gray-100 dark:bg-slate-700" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">YouTube Video URL</label>
                    <input type="text" name="videoUrl" value={newVideo.videoUrl} onChange={handleInputChange} placeholder="https://www.youtube.com/watch?v=..." className="w-full p-2 rounded-lg bg-gray-100 dark:bg-slate-700" />
                </div>
                <div className="flex justify-end pt-2"><Button onClick={handleUpload} loading={loading} icon={Upload}>Upload Video</Button></div>
            </div>
        </Card>
    );
};

const GuidedBreathingExercise = () => {
    const [isBreathing, setIsBreathing] = useState(false);
    const [text, setText] = useState('Begin');

    useEffect(() => {
        let interval;
        if (isBreathing) {
            const cycle = () => {
                setText('Breathe In...');
                setTimeout(() => setText('Hold...'), 4000);
                setTimeout(() => setText('Breathe Out...'), 5500);
            };
            cycle();
            interval = setInterval(cycle, 9500);
        } else {
            setText('Begin');
        }
        return () => clearInterval(interval);
    }, [isBreathing]);

    return (
        <Card>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Wind size={20}/> Guided Breathing</h3>
            <div className="flex flex-col items-center justify-center p-4">
                <div className="relative w-48 h-48 flex items-center justify-center">
                    <div className={`absolute w-full h-full bg-teal-200/50 dark:bg-teal-500/10 rounded-full ${isBreathing ? 'animate-pulse-slow' : ''}`} />
                    <div className={`absolute w-3/4 h-3/4 bg-teal-300/50 dark:bg-teal-500/20 rounded-full ${isBreathing ? 'animate-pulse-medium' : ''}`} />
                    <p className="z-10 font-semibold text-xl text-primary">{text}</p>
                </div>
                <Button onClick={() => setIsBreathing(!isBreathing)} variant="secondary" className="mt-6">
                    {isBreathing ? 'Stop' : 'Start Exercise'}
                </Button>
            </div>
        </Card>
    );
};

const SoundscapesPlayer = ({ resources }) => {
    const [playingSound, setPlayingSound] = useState(null);
    const [isReady, setIsReady] = useState(false);
    const players = useRef({});

    useEffect(() => {
        const setup = async () => {
            if (window.Tone && !isReady) {
                await window.Tone.start();
                const rainGain = new window.Tone.Gain(0.1).toDestination();
                const rainNoise = new window.Tone.Noise("pink").connect(rainGain);
                rainNoise.volume.value = -10;
                const rainFilter = new window.Tone.AutoFilter({frequency: '2n', baseFrequency: 200, octaves: 4}).connect(rainGain).start();
                rainNoise.connect(rainFilter);
                players.current.sound1 = { node: rainNoise, parts: [rainFilter, rainGain] };
                
                const forestGain = new window.Tone.Gain(0.15).toDestination();
                const wind = new window.Tone.Noise("brown").connect(forestGain);
                wind.volume.value = -20;
                const windFilter = new window.Tone.AutoFilter("0.2n", 100).connect(forestGain).start();
                wind.connect(windFilter);
                const cricketSynth = new window.Tone.MetalSynth({ frequency: 400, envelope: { attack: 0.001, decay: 0.2, release: 0.2 }, harmonicity: 5.1, modulationIndex: 32, resonance: 4000, octaves: 1.5 }).connect(forestGain);
                cricketSynth.volume.value = -35;
                const cricketLoop = new window.Tone.Loop((time) => { cricketSynth.triggerAttackRelease(time, "64n"); }, "2n").start(0);
                cricketLoop.probability = 0.3;
                players.current.sound2 = { node: wind, parts: [windFilter, cricketSynth, cricketLoop, forestGain] };

                const oceanGain = new window.Tone.Gain(0.2).toDestination();
                const oceanNoise = new window.Tone.Noise("pink").toDestination();
                oceanNoise.volume.value = -12;
                const oceanFilter = new window.Tone.AutoFilter({ frequency: "1m", baseFrequency: 400, octaves: 8 }).connect(oceanGain).start();
                const volumeLFO = new window.Tone.LFO("0.2Hz", -20, -8).start();
                oceanNoise.connect(oceanFilter);
                volumeLFO.connect(oceanNoise.volume);
                players.current.sound3 = { node: oceanNoise, parts: [oceanFilter, volumeLFO, oceanGain] };

                setIsReady(true);
            }
        };

        if (window.Tone) { setup(); } 
        else {
            const intervalId = setInterval(() => { if (window.Tone) { setup(); clearInterval(intervalId); } }, 100);
            return () => clearInterval(intervalId);
        }

        return () => {
            if (window.Tone && players.current) {
                Object.values(players.current).forEach(player => { player.node.stop?.(); player.parts.forEach(part => part.dispose?.()); });
                players.current = {};
            }
        };
    }, [isReady]);

    const toggleSound = async (soundId) => {
        if (!isReady) return;
        await window.Tone.start();

        const isCurrentlyPlaying = playingSound === soundId;
        
        if (playingSound && players.current[playingSound]) {
            players.current[playingSound].node.stop();
        }

        if (isCurrentlyPlaying) {
            setPlayingSound(null);
        } else {
            if (players.current[soundId]) {
              players.current[soundId].node.start();
              setPlayingSound(soundId);
            }
        }
    };

    return (
        <Card>
            <h3 className="font-bold text-lg mb-4">Soothing Soundscapes</h3>
            <div className="space-y-3">
                {resources.soundscapes.map(sound => (
                    <div key={sound.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
                        <p className="font-semibold">{sound.title}</p>
                        <button onClick={() => toggleSound(sound.id)} disabled={!isReady} className="p-1 disabled:opacity-50">
                            {playingSound === sound.id ? <PauseCircle className="text-primary" /> : <PlayCircle className={isReady ? "text-gray-500 dark:text-slate-400" : "text-gray-300 dark:text-slate-600"} />}
                        </button>
                    </div>
                ))}
            </div>
        </Card>
    );
};

const MoodTracker = ({ moods, onLogMood }) => {
    const today = new Date().toISOString().split('T')[0];
    const todaysMood = moods.find(m => m.date === today)?.mood;

    const moodOptions = [
        { mood: 'Happy', icon: Smile, color: 'text-green-500' },
        { mood: 'Neutral', icon: Meh, color: 'text-yellow-500' },
        { mood: 'Sad', icon: Frown, color: 'text-blue-500' }
    ];

    return (
        <Card className="mb-6">
            <h3 className="font-bold text-lg mb-3">How are you feeling today?</h3>
            {todaysMood ? (
                <p>Today you're feeling: <span className="font-semibold">{todaysMood}</span>. Thanks for checking in!</p>
            ) : (
                <div className="flex items-center gap-4">
                    {moodOptions.map(({ mood, icon: Icon, color }) => (
                        <button key={mood} onClick={() => onLogMood({ mood })} className={`flex flex-col items-center gap-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 ${color}`}>
                            <Icon size={28} />
                            <span className="text-xs font-medium">{mood}</span>
                        </button>
                    ))}
                </div>
            )}
        </Card>
    );
};

const GoalsToday = ({ goals, setView }) => {
    const completed = goals.filter(g => g.completed).length;
    const total = goals.length;
    const progress = total > 0 ? (completed / total) * 100 : 0;
    
    return (
        <Card className="mb-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setView('goals')}>
             <h3 className="font-bold text-lg mb-3 flex items-center gap-2"><CheckSquare size={20} className="text-secondary"/> Today's Goals</h3>
             {total > 0 ? (
                 <>
                     <div className="flex justify-between items-center mb-2">
                         <p className="text-sm text-gray-600 dark:text-slate-400">You've completed {completed} of {total} goals.</p>
                         <span className="font-semibold text-secondary">{Math.round(progress)}%</span>
                     </div>
                     <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2.5">
                         <div className="bg-secondary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                     </div>
                 </>
             ) : (
                 <p className="text-gray-500 dark:text-slate-400">No goals set for today. Click here to add one!</p>
             )}
        </Card>
    )
};

const SOSButton = ({ onClick }) => (
    <button 
        onClick={onClick}
        className="fixed bottom-8 right-8 bg-red-600 text-white rounded-full p-4 shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 z-50 animate-pulse"
        aria-label="Emergency SOS"
    >
        <Siren size={32} />
    </button>
);

const EmergencyModal = ({ isOpen, onClose, currentUser }) => {
    const [step, setStep] = useState('confirm'); // confirm -> sending -> sent
    const [location, setLocation] = useState(null);
    const [error, setError] = useState('');

    const emergencyNumbers = [
        { name: 'National Emergency Number', number: '112' },
        { name: 'Police', number: '100' },
        { name: 'Fire', number: '101' },
        { name: 'Ambulance', number: '108' },
    ];

    const handleConfirm = () => {
        setStep('sending');
        setError('');
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
                // Simulate sending alerts
                setTimeout(() => setStep('sent'), 2000);
            },
            (err) => {
                setError('Could not get your location. Please allow location access. Alerts will be sent without location data.');
                // Still proceed after a delay
                setTimeout(() => setStep('sent'), 2000);
            },
            { enableHighAccuracy: true }
        );
    };

    const reset = () => {
        setStep('confirm');
        setLocation(null);
        setError('');
        onClose();
    };

    const renderContent = () => {
        switch (step) {
            case 'confirm':
                return (
                    <div>
                        <h3 className="text-lg font-bold text-center text-red-600">Confirm Emergency</h3>
                        <p className="text-center my-4">Are you sure you want to trigger an emergency alert? This will (simulate) notifying emergency services and your emergency contact: {currentUser.emergencyContact || 'Not provided'}.</p>
                        <div className="flex justify-center gap-4">
                            <Button onClick={onClose} variant="secondary">Cancel</Button>
                            <Button onClick={handleConfirm} variant="danger">Yes, I Need Help</Button>
                        </div>
                    </div>
                );
            case 'sending':
                 return (
                    <div className="text-center">
                        <Loader2 size={48} className="mx-auto animate-spin text-primary" />
                        <p className="mt-4 font-semibold">Sending Emergency Alerts...</p>
                        <p className="text-sm text-gray-500 dark:text-slate-400">Stay calm. Help is on the way.</p>
                        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
                    </div>
                 );
            case 'sent':
                return (
                     <div>
                        <h3 className="text-lg font-bold text-secondary">Alerts Sent!</h3>
                        <p className="my-2">Emergency services and your contact have been notified (simulation).</p>
                        
                        {location && (
                             <div className="my-4">
                                <h4 className="font-semibold">Your Location:</h4>
                                <p className="text-sm">Nearby help has been notified of this location.</p>
                                <div className="aspect-w-16 aspect-h-9 mt-2 rounded-lg overflow-hidden">
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0 }}
                                        loading="lazy"
                                        allowFullScreen
                                        src={`https://www.google.com/maps?q=${location.lat},${location.lng}&z=15&output=embed`}>
                                    </iframe>
                                </div>
                             </div>
                        )}

                        <div>
                            <h4 className="font-semibold">Local Emergency Numbers:</h4>
                            <ul className="space-y-2 mt-2">
                                {emergencyNumbers.map(e => (
                                    <li key={e.name} className="flex justify-between items-center p-2 bg-gray-100 dark:bg-slate-700 rounded-md">
                                        <span>{e.name}</span>
                                        <a href={`tel:${e.number}`} className="font-bold text-primary">{e.number}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                         <div className="mt-6 flex justify-end">
                             <Button onClick={reset} variant="secondary">Close</Button>
                         </div>
                    </div>
                );
        }
    }

    return (
        <Modal title="Emergency SOS" isOpen={isOpen} onClose={reset}>
            {renderContent()}
        </Modal>
    );
};

const PermissionsGate = ({ isOpen, onClose }) => {
    const handleAllow = async () => {
        try {
            if (navigator.geolocation) {
                 await new Promise((resolve, reject) => {
                    navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
                });
            }
        } catch (error) {
            console.warn("Geolocation permission was not granted:", error.message);
        }

        try {
            if (Notification && Notification.requestPermission) {
                await Notification.requestPermission();
            }
        } catch (error) {
            console.warn("Notification permission was not granted:", error.message);
        }
        
        try {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                stream.getTracks().forEach(track => track.stop());
            }
        } catch (error) {
            console.warn("Camera/Microphone permission was not granted:", error.message);
        }
        
        localStorage.setItem(permissionsKey, 'true');
        onClose();
    };
    
    return (
        <Modal title="App Permissions" isOpen={isOpen} onClose={onClose}>
            <div>
                <p className="mb-4">To provide you with the best experience and ensure your safety, Vitanova needs some permissions.</p>
                <ul className="space-y-3 mb-6">
                    <li className="flex items-start gap-3"><MapPin className="text-primary mt-1 flex-shrink-0" /><div><h4 className="font-semibold">Location</h4><p className="text-sm text-gray-500 dark:text-slate-400">To help you find nearby counselors and for emergency services.</p></div></li>
                    <li className="flex items-start gap-3"><Bell className="text-primary mt-1 flex-shrink-0" /><div><h4 className="font-semibold">Notifications</h4><p className="text-sm text-gray-500 dark:text-slate-400">For appointment reminders and important alerts.</p></div></li>
                    <li className="flex items-start gap-3"><Video className="text-primary mt-1 flex-shrink-0" /><div><h4 className="font-semibold">Camera & Microphone</h4><p className="text-sm text-gray-500 dark:text-slate-400">For video sessions with your counselor.</p></div></li>
                </ul>
                <div className="flex justify-end gap-4">
                    <Button onClick={onClose} variant="secondary">Later</Button>
                    <Button onClick={handleAllow}>Allow Permissions</Button>
                </div>
            </div>
        </Modal>
    );
};

const DailyCheckinModal = ({ isOpen, onClose, onLogMood, onScreening }) => {
    return (
        <Modal title="Daily Check-in" isOpen={isOpen} onClose={onClose}>
            <div>
                <h3 className="text-lg font-bold text-center">Welcome Back!</h3>
                <p className="text-center my-4">How are you feeling today? Let's quickly log your mood. Or, if it's been a week, maybe it's time for a screening.</p>
                <div className="flex justify-center gap-4">
                    <Button onClick={onLogMood} variant="primary">Log Today's Mood</Button>
                    <Button onClick={onScreening} variant="secondary">Take Screening</Button>
                </div>
                 <div className="mt-4 text-center">
                    <button onClick={onClose} className="text-sm text-gray-500 dark:text-slate-400 hover:underline">Maybe Later</button>
                </div>
            </div>
        </Modal>
    );
};

const NeuraChatbot = ({ setView, setIsEmergencyModalOpen }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hi! I'm Neura, your friendly guide. How can I help you today? You can ask me about the app's features or tell me how you're feeling.", sender: 'bot' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef(null);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = { text: input, sender: 'user' };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const lowerInput = input.toLowerCase();
        const emergencyKeywords = ['emergency', 'help me', 'sos', 'danger', 'hurting myself', 'suicide'];

        if (emergencyKeywords.some(keyword => lowerInput.includes(keyword))) {
            setMessages(prev => [...prev, { text: "It sounds like you're in distress. I'm initiating the emergency protocol for you. Please confirm on the next screen.", sender: 'bot' }]);
            setIsEmergencyModalOpen(true);
            setIsLoading(false);
            return;
        }

        try {
            const systemPrompt = "You are Neura, a warm, empathetic, and supportive AI companion for the Vitanova mental health app. Your goal is to provide helpful, comforting, and safe information. You are not a therapist, but a friendly guide. Your tone should be gentle and encouraging. If a user expresses distress, gently guide them towards the app's resources like screenings ('I can take you to the screening page if you like.') or booking an appointment. If they mention an emergency or self-harm, immediately respond with a JSON object where the 'action' is 'EMERGENCY_SOS'. Based on the user's message, determine if you should take an action. Your response must be a JSON object with two keys: 'responseText' (your conversational reply) and 'action' (either 'none', 'goToScreening', 'goToBooking', or 'EMERGENCY_SOS').";
            const apiKey = "";
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

            const payload = {
                contents: [{ parts: [{ text: `User message: "${input}"` }] }],
                systemInstruction: {
                    parts: [{ text: systemPrompt }]
                },
                 generationConfig: {
                    responseMimeType: "application/json",
                 }
            };

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`API call failed with status: ${response.status}`);
            }

            const result = await response.json();
            const botResponseRaw = result.candidates?.[0]?.content?.parts?.[0]?.text;

            if (botResponseRaw) {
                const botResponse = JSON.parse(botResponseRaw);
                
                if (botResponse.action === 'EMERGENCY_SOS') {
                     setMessages(prev => [...prev, { text: "It sounds like you're in distress. I'm initiating the emergency protocol for you. Please confirm on the next screen.", sender: 'bot' }]);
                     setIsEmergencyModalOpen(true);
                } else {
                    setMessages(prev => [...prev, { text: botResponse.responseText, sender: 'bot' }]);
                    if (botResponse.action === 'goToScreening') setView('screening');
                    if (botResponse.action === 'goToBooking') setView('bookings');
                }
            } else {
                 setMessages(prev => [...prev, { text: "I'm sorry, I'm having a little trouble connecting right now. Please know that your feelings are valid.", sender: 'bot' }]);
            }
        } catch (error) {
            console.error("Chatbot API error:", error);
            setMessages(prev => [...prev, { text: "I'm having some trouble thinking right now, but I'm still here to listen. Remember, it's okay to not be okay.", sender: 'bot' }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <>
            <div className={`fixed bottom-24 right-8 z-40 w-80 h-96 bg-background dark:bg-slate-800 rounded-2xl shadow-2xl flex flex-col transition-transform duration-300 ${isOpen ? 'transform scale-100 origin-bottom-right' : 'transform scale-0 origin-bottom-right'}`}>
                <div className="p-3 bg-primary text-white rounded-t-2xl flex justify-between items-center">
                    <h3 className="font-bold">Chat with Neura</h3>
                    <button onClick={() => setIsOpen(false)}><X size={20} /></button>
                </div>
                <div className="flex-1 p-4 overflow-y-auto">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} mb-3`}>
                            <div className={`p-2 rounded-lg max-w-[80%] ${msg.sender === 'user' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-slate-600'}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                     {isLoading && <div className="flex justify-start mb-3"><div className="p-2 rounded-lg bg-gray-200 dark:bg-slate-600"><Loader2 size={16} className="animate-spin" /></div></div>}
                    <div ref={chatEndRef} />
                </div>
                <div className="p-2 border-t dark:border-slate-700 flex">
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask something..."
                        className="flex-1 p-2 rounded-lg bg-gray-100 dark:bg-slate-700 border-transparent focus:ring-2 focus:ring-primary"
                    />
                    <Button onClick={handleSend} disabled={isLoading} icon={Send} />
                </div>
            </div>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-8 right-28 bg-primary text-white rounded-full p-4 shadow-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 z-50"
                aria-label="Open Chatbot"
            >
               <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 256 256"><path fill="currentColor" d="M175.28 200.77a4 4 0 0 1-5.46 5.46a44.28 44.28 0 0 0-41.9-28.18a44.28 44.28 0 0 0-41.9 28.18a4 4 0 0 1-5.46-5.46a52.29 52.29 0 0 1 47.36-33.19a52.29 52.29 0 0 1 47.36 33.19ZM208.73 156a4 4 0 1 1-5.46-5.46a76.47 76.47 0 0 0-70.19-49.81a76.47 76.47 0 0 0-70.19 49.81a4 4 0 1 1-5.46 5.46A84.46 84.46 0 0 1 128 92a84.46 84.46 0 0 1 80.73 64ZM128 52a12 12 0 1 1-12-12a12 12 0 0 1 12 12Zm40 40a12 12 0 1 1-12-12a12 12 0 0 1 12 12Zm-92-12a12 12 0 1 0 12 12a12 12 0 0 0-12-12Z"/></svg>
            </button>
        </>
    );
}

const GlobalStyles = () => (
    <style>
        {`
          body.light-theme {
            background: linear-gradient(270deg, #FFF8E7, #e9f5f5, #f1f8e9, #FFF8E7);
            background-size: 800% 800%;
            animation: moveGradient 25s ease infinite;
            color: #4A4A4A;
          }
          body.dark-theme {
            background-color: #0f172a;
            color: #e2e8f0;
          }
          @keyframes moveGradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          .dark .fill-background { fill: #0f172a; }
          .dark .stroke-text-main { stroke: #cbd5e1; }
        `}
    </style>
);

// -- Main App Component -----------------------------------------------------------
export default function VitanovaApp() {
    const [theme, setTheme] = useState(() => localStorage.getItem('vitanova_theme') || 'light');
    const [view, setView] = useState("home");
    const [loading, setLoading] = useState(true);
    const [modalContent, setModalContent] = useState({ title: '', body: null });
    const [currentUser, setCurrentUser] = useState(null);
    const [authView, setAuthView] = useState('login'); // 'login', 'signup', or 'forgotPassword'
    const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
    const [showPermissionsGate, setShowPermissionsGate] = useState(false);
    const [isNavCollapsed, setIsNavCollapsed] = useState(false);
    const [showCheckIn, setShowCheckIn] = useState(false);

    const [allData, setAllData] = useState({screenings: [], bookings: [], forum: [], videos: [], moods: [], journal: [], goals: [], resources: {}});
    
    const userData = useMemo(() => {
        if (!currentUser) return {};
        if (currentUser.role === 'counselor') return allData;
        return {
             screenings: allData.screenings.filter(d => d.user === currentUser.id),
             bookings: allData.bookings.filter(d => d.user === currentUser.id),
             moods: allData.moods.filter(d => d.user === currentUser.id),
             journal: allData.journal.filter(d => d.user === currentUser.id),
             goals: allData.goals.filter(d => d.user === currentUser.id),
             forum: allData.forum,
             videos: allData.videos,
             resources: allData.resources
        }
    }, [currentUser, allData]);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem(userStorageKey));
        if (user) {
            setCurrentUser(user);
            const permissions = localStorage.getItem(permissionsKey);
            if (!permissions) {
                setShowPermissionsGate(true);
            }
            const lastCheckIn = localStorage.getItem(lastCheckInKey);
            const today = new Date().toISOString().split('T')[0];
            if (lastCheckIn !== today) {
                setShowCheckIn(true);
            }
        }
        setAllData(getAllData());
        setLoading(false);
    }, []);
    
    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
        if (theme === 'light') {
            document.body.className = 'light-theme';
        } else {
            document.body.className = 'dark-theme';
        }
    }, [theme]);

    useEffect(() => {
        if (view !== 'home') {
            setIsNavCollapsed(true);
        }
    }, [view]);

    const handleLogin = async (role, email, password) => {
        setLoading(true);
        await mockDelay();
        const allUsers = getStoredUsers();
        let foundUser = allUsers.find(u => u.email === email && u.role === role);

        if (!foundUser && email === 'counselor@campus.edu' && role === 'counselor') {
             foundUser = { id: 'counselor123', email, role, name: 'Dr. Emily Carter', availabilityCalendar: {} };
        } else if (!foundUser && email === 'student@campus.edu' && role === 'student') {
             foundUser = { id: 'student123', email, role, name: 'Alex Johnson' };
        }

        if (foundUser) {
            setCurrentUser(foundUser);
            localStorage.setItem(userStorageKey, JSON.stringify(foundUser));
            const permissions = localStorage.getItem(permissionsKey);
            if (!permissions) setShowPermissionsGate(true);
            const lastCheckIn = localStorage.getItem(lastCheckInKey);
            const today = new Date().toISOString().split('T')[0];
            if (lastCheckIn !== today) setShowCheckIn(true);
            
            setView('home');
        } else {
            setModalContent({title: "Login Failed", body: "Invalid credentials or user does not exist."});
        }
        setLoading(false);
    };

    const handleSignUp = async (formData, role) => {
        setLoading(true);
        try {
            const newUser = await apiSignUpUser({ ...formData, role });
            setModalContent({ title: "Success!", body: "Your account has been created. You are now logged in." });
            setCurrentUser(newUser);
            localStorage.setItem(userStorageKey, JSON.stringify(newUser));
            setShowPermissionsGate(true);
            setView('home');
        } catch (error) {
             if (error.message.includes("User already exists")) {
                setModalContent({ 
                    title: "Registration Failed", 
                    body: "An account with this email already exists. Please try logging in or use a different email address." 
                });
            } else {
                setModalContent({ title: "Registration Failed", body: error.message });
            }
        } finally {
            setLoading(false);
        }
    };
    
    const handleResetPassword = async ({ email, newPassword }) => {
        setLoading(true);
        try {
            await apiResetPassword({ email, newPassword });
            setModalContent({ title: "Success!", body: "Your password has been reset successfully. Please log in with your new password." });
            setAuthView('login');
        } catch (error) {
            setModalContent({ title: "Password Reset Failed", body: error.message });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        setCurrentUser(null);
        localStorage.removeItem(userStorageKey);
        setView('home');
        setAuthView('login');
    };

    const studentNavItems = useMemo(() => [ { view: 'home', title: 'Home', description: 'Your personal dashboard.', icon: Home, color: '#2AB3B3' }, { view: 'screening', title: 'Screening', description: 'Take a confidential check-up.', icon: Bell, color: '#2AB3B3' }, { view: 'bookings', title: 'Bookings', description: 'Schedule with counselors.', icon: CalendarDays, color: '#7BC950'}, { view: 'forum', title: 'Peer Forum', description: 'Connect in a safe space.', icon: MessageSquare, color: '#FDD835'}, { view: 'goals', title: 'Goals', description: 'Set personal wellness goals.', icon: CheckSquare, color: '#7BC950'}, { view: 'journal', title: 'Journal', description: 'Practice gratitude daily.', icon: PenSquare, color: '#2AB3B3'}, { view: 'videos', title: 'Health Videos', description: 'Watch wellness content.', icon: Film, color: '#2AB3B3'}, { view: 'resources', title: 'Resources', description: 'Find helpful articles.', icon: BookOpen, color: '#FDD835'},], []);
    const counselorNavItems = useMemo(() => [ { view: 'home', title: 'Dashboard', description: 'View student wellness stats.', icon: BarChart2, color: '#2AB3B3' }, { view: 'profile', title: 'Profile', description: 'Manage availability.', icon: UserCog, color: '#4A4A4A' }, { view: 'bookings', title: 'Appointments', description: 'Manage your schedule.', icon: CalendarDays, color: '#7BC950'}, { view: 'videos', title: 'View Content', description: 'Watch wellness videos.', icon: Film, color: '#2AB3B3'}, { view: 'upload', title: 'Upload Video', description: 'Add new health content.', icon: Upload, color: '#FDD835'},], []);

    const createApiHandler = (apiFunc) => async (...args) => {
        const onDone = typeof args[args.length - 1] === 'function' ? args.pop() : null;
        setLoading(true);
        let result = null;
        try {
            const payload = { ...args[0], user: currentUser };
            result = await apiFunc(payload);
            const updatedData = getAllData();
            setAllData(updatedData);
            if (onDone) onDone(result);
        } catch (error) {
            console.error("API call failed:", error);
            setModalContent({ title: 'Error', body: 'An unexpected error occurred. Please try again.' });
        } finally {
            setLoading(false);
        }
        return result;
    };
    
    const handleUpdateCounselorProfile = useCallback(async (profileData) => {
        setLoading(true);
        try {
            const updatedUser = await apiUpdateCounselorProfile({ userId: currentUser.id, ...profileData });
            setCurrentUser(updatedUser);
            localStorage.setItem(userStorageKey, JSON.stringify(updatedUser));
            setModalContent({ title: "Success", body: "Your profile has been updated." });
        } catch (error) {
            setModalContent({ title: 'Error', body: 'Could not update your profile.' });
        } finally {
            setLoading(false);
        }
    }, [currentUser]);

    const handleSubmitScreening = useCallback(createApiHandler(apiSubmitScreening), [currentUser]);
    const handleBooking = useCallback(createApiHandler(apiCreateBooking), [currentUser]);
    const handleForumPost = useCallback(createApiHandler(apiPostForum), [currentUser]);
    const handleUploadVideo = useCallback(createApiHandler(apiUploadVideo), [currentUser]);
    const handleLogMood = useCallback(createApiHandler(apiLogMood), [currentUser]);
    const handleJournalEntry = useCallback(createApiHandler(apiSubmitJournalEntry), [currentUser]);
    const handleCreateGoal = useCallback(createApiHandler(apiCreateGoal), [currentUser]);
    const handleToggleGoal = useCallback(createApiHandler(apiToggleGoal), [currentUser]);
    const handleDeleteGoal = useCallback(createApiHandler(apiDeleteGoal), [currentUser]);
    
    const handlePlayVideo = (video) => { setModalContent({ title: video.title, body: (<div className="aspect-w-16 aspect-h-9"><iframe src={video.videoUrl} title={video.title} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full aspect-video"></iframe></div>) }); };
    const handleArticleClick = (article) => { setModalContent({ title: article.title, body: (<div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-text-main dark:text-slate-300" dangerouslySetInnerHTML={{ __html: article.content }} />) }); };
    
    const handleSetView = (newView) => {
        setView(newView);
        if(newView === 'home') setIsNavCollapsed(false);
    }
    
    const renderStudentView = () => {
        const props = { loading, setModalContent, currentUser, onCreate: createApiHandler(apiCreateGoal), onToggle: handleToggleGoal, onDelete: handleDeleteGoal, onBook: handleBooking, onEntry: handleJournalEntry, onPost: handleForumPost, onSubmit: handleSubmitScreening, onLogMood: handleLogMood };
        if (view === 'home' && !isNavCollapsed) {
            return <HomeView setView={handleSetView} screenings={userData.screenings} moods={userData.moods} resources={allData.resources} goals={userData.goals} {...props} />;
        }
        
        switch (view) {
            case "screening": return <ScreeningView {...props} />;
            case "bookings": return <BookingView bookings={userData.bookings} {...props} />;
            case "forum": return <ForumView forum={allData.forum} {...props} />;
            case "goals": return <GoalsView goals={userData.goals} {...props} />;
            case "journal": return <JournalView journal={userData.journal} {...props} />;
            case "videos": return <VideosView videos={allData.videos} onPlayVideo={handlePlayVideo} />;
            case "resources": return <ResourcesView resources={allData.resources} onArticleClick={handleArticleClick} />;
            default: return <HomeView setView={handleSetView} screenings={userData.screenings} moods={userData.moods} resources={allData.resources} goals={userData.goals} {...props}/>;
        }
    };

    const renderCounselorView = () => {
        const props = { loading, setModalContent, currentUser, onUploadVideo: createApiHandler(apiUploadVideo), onUpdateProfile: handleUpdateCounselorProfile };
         switch (view) {
            case "home": return <CounselorDashboardView allData={allData} />;
            case "profile": return <CounselorProfileView {...props} />;
            case "bookings": return <CounselorAppointmentsView bookings={allData.bookings} />;
            case "videos": return <VideosView videos={allData.videos} onPlayVideo={handlePlayVideo} />;
            case "upload": return <CounselorVideoUploadView {...props} />;
            default: setView('home'); return null;
        }
    };

    const renderAuth = () => {
        if (authView === 'login') return <LoginView onLogin={handleLogin} loading={loading} setAuthView={setAuthView} />
        if (authView === 'signup') return <SignUpView onSignUp={handleSignUp} loading={loading} setLoading={setLoading} setAuthView={setAuthView} setModalContent={setModalContent} />
        if (authView === 'forgotPassword') return <ForgotPasswordView onResetPassword={handleResetPassword} loading={loading} setLoading={setLoading} setAuthView={setAuthView} setModalContent={setModalContent} />
    };

    if (!currentUser) {
        return (<div className="min-h-screen"><GlobalStyles /><div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">{renderAuth()}</div> <Modal title={modalContent.title} isOpen={!!modalContent.body} onClose={() => setModalContent({ title: '', body: null })}>{modalContent.body}</Modal></div>)
    }

    const navItems = currentUser.role === 'student' ? studentNavItems : counselorNavItems;

    return (
        <div className="min-h-screen">
            <GlobalStyles />
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                <Header theme={theme} onToggleTheme={() => setTheme(t => (t === "light" ? "dark" : "light"))} currentUser={currentUser} onLogout={handleLogout}/>
                <main className={`grid grid-cols-1 ${isNavCollapsed ? 'lg:grid-cols-[auto_1fr]' : 'lg:grid-cols-4'} gap-8 transition-all duration-300`}>
                    <nav className={`lg:sticky lg:top-8 self-start transition-all duration-300 ${isNavCollapsed ? 'lg:w-24' : 'lg:w-full'}`}>
                        <Card className="p-3">
                            <button onClick={() => setIsNavCollapsed(!isNavCollapsed)} className="w-full flex justify-center lg:justify-end mb-2 p-1 text-gray-500 dark:text-slate-400 hover:text-primary">
                                <Menu size={20} />
                            </button>
                            <div className="flex flex-col gap-2">
                                {navItems.map(item => (<NavItem key={item.view} {...item} isCollapsed={isNavCollapsed} active={view === item.view} onClick={() => handleSetView(item.view)} />))}
                            </div>
                        </Card>
                    </nav>
                    <section className={isNavCollapsed ? 'col-span-1' : 'col-span-1 lg:col-span-3'}>
                        {view !== 'home' && !isNavCollapsed && (<button onClick={() => handleSetView('home')} className="flex items-center gap-2 mb-6 text-sm font-semibold text-gray-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors"><ArrowLeft size={16} />Back to Dashboard</button>)}
                        {currentUser.role === 'student' ? renderStudentView() : renderCounselorView()}
                    </section>
                </main>
                <footer className="mt-12 text-center text-sm text-gray-500 dark:text-slate-400">Vitanova — Demo Application • Not a replacement for clinical care</footer>
            </div>
            <Modal title={modalContent.title} isOpen={!!modalContent.body} onClose={() => setModalContent({ title: '', body: null })}>{modalContent.body}</Modal>
            <SOSButton onClick={() => setIsEmergencyModalOpen(true)} />
            <EmergencyModal isOpen={isEmergencyModalOpen} onClose={() => setIsEmergencyModalOpen(false)} currentUser={currentUser} />
            <PermissionsGate isOpen={showPermissionsGate} onClose={() => setShowPermissionsGate(false)} />
            {currentUser.role === 'student' && <NeuraChatbot setView={handleSetView} setIsEmergencyModalOpen={setIsEmergencyModalOpen} />}
            <DailyCheckinModal 
                isOpen={showCheckIn} 
                onClose={() => {
                    setShowCheckIn(false);
                    localStorage.setItem(lastCheckInKey, new Date().toISOString().split('T')[0]);
                }} 
                onLogMood={() => {
                    setShowCheckIn(false);
                    createApiHandler(apiLogMood)({ mood: 'Happy' });
                    localStorage.setItem(lastCheckInKey, new Date().toISOString().split('T')[0]);
                }}
                onScreening={() => {
                    setShowCheckIn(false);
                    handleSetView('screening');
                    localStorage.setItem(lastCheckInKey, new Date().toISOString().split('T')[0]);
                }}
            />
        </div>
    );
}
export default function VitanovaApp() { ... }


// export default function VitanovaApp() { ... }


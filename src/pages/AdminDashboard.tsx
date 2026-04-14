import React, { useState, useEffect, useMemo } from 'react';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, getDocs, updateDoc, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Users, Calendar, Image as ImageIcon, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { notify } from '../lib/toast';
import { Loader } from '../components/Loader';
import { StatsCard } from '../components/admin/StatsCard';
import { UsersTable } from '../components/admin/UsersTable';
import { EventsTable } from '../components/admin/EventsTable';
import { ImagesTable } from '../components/admin/ImagesTable';

export function AdminDashboard() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  
  const [users, setUsers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState<'users' | 'events' | 'images'>('users');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isAdmin) return;

    // Fetch Users
    const fetchUsers = async () => {
      try {
        const usersSnap = await getDocs(collection(db, 'users'));
        const usersData = usersSnap.docs.map(doc => ({
          uid: doc.id,
          ...doc.data()
        }));
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();

    // Fetch Events real-time
    const q = query(collection(db, 'events'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEvents(eventsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching events:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, [isAdmin]);

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) return;
    try {
      await deleteDoc(doc(db, 'events', id));
    } catch (error) {
      console.error("Error deleting event:", error);
      notify.error("Failed to delete event.");
    }
  };

  const handleDeleteUser = async (uid: string) => {
    if (!confirm('Are you sure you want to delete this user record from Firestore? Note: This does not delete their Firebase Auth account.')) return;
    try {
      await deleteDoc(doc(db, 'users', uid));
      setUsers(users.filter(u => u.uid !== uid));
    } catch (error) {
      console.error("Error deleting user:", error);
      notify.error("Failed to delete user.");
    }
  };

  const handleDeleteImage = async (eventId: string, image: any) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    try {
      await updateDoc(doc(db, 'events', eventId), {
        images: arrayRemove(image)
      });
    } catch (error) {
      console.error("Error deleting image:", error);
      notify.error("Failed to delete image.");
    }
  };

  const allImages = useMemo(() => {
    const images: any[] = [];
    events.forEach(event => {
      if (event.images && Array.isArray(event.images)) {
        event.images.forEach((img: any) => {
          images.push({
            ...img,
            eventId: event.id,
            eventTitle: event.title
          });
        });
      }
    });
    return images.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  }, [events]);

  const totalImages = allImages.length;

  const filteredUsers = useMemo(() => {
    if (!searchQuery) return users;
    const lowerQuery = searchQuery.toLowerCase();
    return users.filter(u => 
      u.email?.toLowerCase().includes(lowerQuery) || 
      u.uid.toLowerCase().includes(lowerQuery)
    );
  }, [users, searchQuery]);

  const filteredEvents = useMemo(() => {
    if (!searchQuery) return events;
    const lowerQuery = searchQuery.toLowerCase();
    return events.filter(e => 
      e.title?.toLowerCase().includes(lowerQuery) || 
      e.id.toLowerCase().includes(lowerQuery) ||
      e.createdBy?.toLowerCase().includes(lowerQuery)
    );
  }, [events, searchQuery]);

  const filteredImages = useMemo(() => {
    if (!searchQuery) return allImages;
    const lowerQuery = searchQuery.toLowerCase();
    return allImages.filter(img => 
      img.name?.toLowerCase().includes(lowerQuery) || 
      img.eventTitle?.toLowerCase().includes(lowerQuery)
    );
  }, [allImages, searchQuery]);

  if (authLoading) return <Loader />;
  if (!user || !isAdmin) return <Navigate to="/" replace />;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-gray-600 dark:text-slate-400 mt-1">Manage users, events, and platform data.</p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatsCard 
          title="Total Users" 
          value={users.length} 
          icon={Users} 
          color="bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400" 
          delay={0.1} 
        />
        <StatsCard 
          title="Total Events" 
          value={events.length} 
          icon={Calendar} 
          color="bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400" 
          delay={0.2} 
        />
        <StatsCard 
          title="Total Images" 
          value={totalImages} 
          icon={ImageIcon} 
          color="bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400" 
          delay={0.3} 
        />
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex bg-gray-100 dark:bg-slate-800/50 p-1 rounded-xl overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'users' 
                ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm' 
                : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'events' 
                ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm' 
                : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'
            }`}
          >
            Events
          </button>
          <button
            onClick={() => setActiveTab('images')}
            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === 'images' 
                ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm' 
                : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'
            }`}
          >
            Images
          </button>
        </div>

        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-64 pl-10 pr-4 py-2 bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm text-gray-900 dark:text-white transition-all"
          />
        </div>
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'users' && <UsersTable users={filteredUsers} onDeleteUser={handleDeleteUser} />}
        {activeTab === 'events' && <EventsTable events={filteredEvents} onDeleteEvent={handleDeleteEvent} />}
        {activeTab === 'images' && <ImagesTable images={filteredImages} onDeleteImage={handleDeleteImage} />}
      </motion.div>
    </motion.div>
  );
}

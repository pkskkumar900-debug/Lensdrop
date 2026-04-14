import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Image as ImageIcon, Calendar, ChevronRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';
import { notify } from '../lib/toast';
import { Loader } from '../components/Loader';

import { UserProfile } from '../components/UserProfile';
import { SettingsModal, ModalView } from '../components/SettingsModal';

interface Event {
  id: string;
  title: string;
  createdAt: any;
}

export function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [modalView, setModalView] = useState<ModalView>(null);

  const handleDownloadQR = (e: React.MouseEvent, eventId: string, eventTitle: string) => {
    e.preventDefault();
    e.stopPropagation();
    const svg = document.getElementById(`qr-${eventId}`);
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `${eventTitle.replace(/\s+/g, '_')}_QR.png`;
        downloadLink.href = `${pngFile}`;
        downloadLink.click();
        notify.success('QR Code downloaded!');
      }
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'events'),
      where('createdBy', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Event[];
      setEvents(eventsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching events:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    if (!newEventTitle.trim()) {
      notify.error("Please enter an event name");
      return;
    }

    setIsCreating(true);
    try {
      const docRef = await addDoc(collection(db, 'events'), {
        createdBy: user.uid,
        title: newEventTitle.trim(),
        images: [],
        createdAt: serverTimestamp(),
      });
      setNewEventTitle('');
      notify.success("Event Created Successfully!");
      navigate(`/upload/${docRef.id}`);
    } catch (error) {
      console.error("Error creating event:", error);
      notify.error("Failed to create event. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleCreateDemoEvent = async () => {
    if (!user) return;
    setIsCreating(true);
    try {
      const demoImages = [
        {
          url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
          public_id: "demo_1",
          name: "wedding_kiss.jpg",
          size: 102400,
          uploadedAt: new Date().toISOString()
        },
        {
          url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80",
          public_id: "demo_2",
          name: "wedding_details.jpg",
          size: 102400,
          uploadedAt: new Date().toISOString()
        },
        {
          url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80",
          public_id: "demo_3",
          name: "wedding_walk.jpg",
          size: 102400,
          uploadedAt: new Date().toISOString()
        },
        {
          url: "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=800&q=80",
          public_id: "demo_4",
          name: "wedding_rings.jpg",
          size: 102400,
          uploadedAt: new Date().toISOString()
        },
        {
          url: "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=800&q=80",
          public_id: "demo_5",
          name: "wedding_pose.jpg",
          size: 102400,
          uploadedAt: new Date().toISOString()
        }
      ];

      const docRef = await addDoc(collection(db, 'events'), {
        createdBy: user.uid,
        title: "Demo: Rahul & Priya's Wedding",
        images: demoImages,
        createdAt: serverTimestamp(),
      });
      notify.success("Demo Event Created Successfully!");
      navigate(`/upload/${docRef.id}`);
    } catch (error) {
      console.error("Error creating demo event:", error);
      notify.error("Failed to create demo event.");
    } finally {
      setIsCreating(false);
    }
  };

  if (authLoading) {
    return <Loader />;
  }

  if (!user) {
    return <div className="text-center py-12 text-gray-500 dark:text-slate-400">Please log in to view your dashboard.</div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto relative z-10"
    >
      <UserProfile onOpenSettings={setModalView} />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 mt-12">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Events</h1>
          <p className="text-gray-600 dark:text-slate-400 mt-1">Manage your photo galleries and QR codes.</p>
        </motion.div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto mt-4 md:mt-0 relative z-50">
          <button
            type="button"
            onClick={handleCreateDemoEvent}
            disabled={isCreating}
            className="bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 px-4 py-3 sm:py-2 rounded-xl sm:rounded-lg font-medium hover:bg-purple-200 dark:hover:bg-purple-500/30 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap shadow-sm relative z-50 touch-manipulation"
            title="Create a demo event with sample photos"
          >
            <Sparkles className="w-5 h-5 sm:w-4 sm:h-4" /> Demo
          </button>
          <motion.form 
            initial={{ opacity: 0, x: 20 }} 
            animate={{ opacity: 1, x: 0 }}
            onSubmit={handleCreateEvent} 
            className="flex flex-col sm:flex-row gap-3 w-full"
          >
            <input
              id="newEventInput"
              type="text"
              placeholder="New Event Name (e.g. Smith Wedding)"
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              className="px-4 py-3 sm:py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl sm:rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none w-full sm:w-64 placeholder-gray-400 dark:placeholder-slate-500 shadow-sm relative z-50"
            />
            <button
              type="submit"
              disabled={isCreating}
              className="bg-indigo-600 dark:bg-indigo-500 text-white px-6 py-3 sm:py-2 rounded-xl sm:rounded-lg font-medium hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap w-full sm:w-auto shadow-sm relative z-50 touch-manipulation"
            >
              {isCreating ? 'Creating...' : <><Plus className="w-5 h-5 sm:w-4 sm:h-4" /> Create</>}
            </button>
          </motion.form>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 h-48 flex flex-col">
                  <div className="flex justify-between items-start gap-4 flex-1">
                    <div className="flex-1 space-y-3 w-full">
                      <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-3/4 animate-pulse"></div>
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/2 animate-pulse"></div>
                    </div>
                    <div className="w-[78px] h-[78px] bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse shrink-0"></div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-800">
                    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/3 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : events.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 bg-white dark:bg-slate-900/50 rounded-2xl border border-gray-200 dark:border-slate-800 border-dashed"
            >
              <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No events yet</h3>
              <p className="text-gray-500 dark:text-slate-400 mb-6">Create your first event to start uploading and sharing memories</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button 
                  onClick={() => document.getElementById('newEventInput')?.focus()}
                  className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-sm w-full sm:w-auto"
                >
                  <Plus className="w-5 h-5" /> Create Event
                </button>
                <button 
                  onClick={handleCreateDemoEvent}
                  disabled={isCreating}
                  className="inline-flex items-center justify-center gap-2 bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 px-6 py-3 rounded-xl font-medium hover:bg-purple-200 dark:hover:bg-purple-500/30 transition-colors shadow-sm w-full sm:w-auto disabled:opacity-50"
                >
                  <Sparkles className="w-5 h-5" /> Load Demo Event
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link 
                    to={`/upload/${event.id}`}
                    className="group bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-2xl p-6 hover:shadow-lg hover:shadow-indigo-500/5 hover:border-indigo-400 dark:hover:border-indigo-500/50 transition-all flex flex-col h-full"
                  >
                    <div className="flex justify-between items-start gap-4 flex-1">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors break-words line-clamp-2">
                          {event.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400">
                          <Calendar className="w-4 h-4 shrink-0" />
                          <span className="truncate">
                            {event.createdAt?.toDate ? new Date(event.createdAt.toDate()).toLocaleDateString() : 'Just now'}
                          </span>
                        </div>
                      </div>
                      <div className="shrink-0 bg-white p-2 rounded-xl border border-gray-100 dark:border-slate-700 shadow-sm group-hover:border-indigo-200 transition-colors flex flex-col items-center gap-2">
                        <QRCodeSVG 
                          id={`qr-${event.id}`}
                          value={`${window.location.origin}/event/${event.id}`} 
                          size={60} 
                          level="L" 
                        />
                        <button
                          onClick={(e) => handleDownloadQR(e, event.id, event.title)}
                          className="text-[10px] font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded w-full text-center transition-colors"
                        >
                          Download
                        </button>
                      </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-indigo-600 dark:text-indigo-400 font-medium text-sm">
                      <span>Manage Gallery & QR</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
        
        <div className="lg:col-span-1">
          <UserProfile onOpenSettings={setModalView} />
        </div>
      </div>
      
      <SettingsModal view={modalView} onClose={() => setModalView(null)} />
    </motion.div>
  );
}

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Search, Eye, ShieldBan, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { notify } from '../../lib/toast';
import { ConfirmModal } from '../../components/ConfirmModal';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Loader } from '../../components/Loader';

export function AdminUsers() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  
  const [users, setUsers] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userToDelete, setUserToDelete] = useState<any>(null);

  useEffect(() => {
    if (!isAdmin) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const usersSnap = await getDocs(collection(db, 'users'));
        const usersData = usersSnap.docs.map(doc => ({ uid: doc.id, ...doc.data() }));
        setUsers(usersData);

        const eventsSnap = await getDocs(collection(db, 'events'));
        const eventsData = eventsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEvents(eventsData);
      } catch (error) {
        console.error("Error fetching admin data:", error);
        notify.error("Failed to load users data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAdmin]);

  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      (u.displayName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (u.email?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  const handleBanUser = async (uid: string) => {
    const userToUpdate = users.find(u => u.uid === uid);
    if (!userToUpdate) return;
    
    const newStatus = userToUpdate.status === 'Banned' ? 'Active' : 'Banned';
    
    try {
      await updateDoc(doc(db, 'users', uid), { status: newStatus });
      
      const updatedUsers = users.map(u => {
        if (u.uid === uid) {
          return { ...u, status: newStatus };
        }
        return u;
      });
      setUsers(updatedUsers);
      notify.success(`User ${newStatus === 'Banned' ? 'banned' : 'unbanned'} successfully.`);
    } catch (error) {
      console.error("Error updating user status:", error);
      notify.error("Failed to update user status.");
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      await deleteDoc(doc(db, 'users', userToDelete.uid));
      
      const updatedUsers = users.filter(u => u.uid !== userToDelete.uid);
      setUsers(updatedUsers);
      notify.success("User deleted successfully.");
    } catch (error) {
      console.error("Error deleting user:", error);
      notify.error("Failed to delete user.");
    } finally {
      setUserToDelete(null);
    }
  };

  if (authLoading || loading) return <Loader />;
  if (!user || !isAdmin) return <Navigate to="/dashboard" replace />;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 text-slate-200"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">User Management</h1>
          <p className="text-slate-400 mt-1">Manage platform users and account statuses.</p>
        </div>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-white">All Users</h2>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-500" />
            </div>
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full sm:w-64 pl-10 pr-3 py-2 border border-slate-700 rounded-xl leading-5 bg-slate-800/50 text-slate-300 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-colors"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800">
            <thead className="bg-slate-900/80">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">User</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Events Hosted</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Storage Used</th>
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-slate-900/30 divide-y divide-slate-800">
              {filteredUsers.map((u) => {
                const userEvents = events.filter(e => e.createdBy === u.uid);
                let userImages = 0;
                userEvents.forEach(e => {
                  if (e.images) userImages += e.images.length;
                });
                const userStorage = (userImages * 2.5).toFixed(1);

                return (
                  <tr key={u.uid} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {u.photoURL ? (
                            <img className="h-10 w-10 rounded-full object-cover" src={u.photoURL} alt="" />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
                              {(u.displayName || u.email || '?')[0].toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{u.displayName || 'Unknown User'}</div>
                          <div className="text-sm text-slate-400">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-300">{userEvents.length}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-300">{userStorage} MB</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        u.status === 'Banned' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {u.status || 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-3">
                        <button className="text-slate-400 hover:text-emerald-400 transition-colors" title="View Details">
                          <Eye className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleBanUser(u.uid)}
                          className={`${u.status === 'Banned' ? 'text-emerald-400 hover:text-emerald-300' : 'text-slate-400 hover:text-red-400'} transition-colors`} 
                          title={u.status === 'Banned' ? 'Unban User' : 'Ban User'}
                        >
                          <ShieldBan className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => setUserToDelete(u)}
                          className="text-slate-400 hover:text-red-400 transition-colors" 
                          title="Delete User"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        isOpen={!!userToDelete}
        title="Delete User"
        message={`Are you sure you want to permanently delete ${userToDelete?.displayName || userToDelete?.email}? This action cannot be undone.`}
        confirmText="Delete Permanently"
        onConfirm={handleDeleteUser}
        onCancel={() => setUserToDelete(null)}
      />
    </motion.div>
  );
}

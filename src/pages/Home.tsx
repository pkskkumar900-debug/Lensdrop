import React, { useEffect, useRef } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Camera, QrCode, Download, Zap, Sparkles, LayoutDashboard, Users, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { motion, useMotionValue, useTransform, animate, useInView } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';

function AnimatedCounter({ from, to, suffix = "", duration = 2 }: { from: number, to: number, suffix?: string, duration?: number }) {
  const count = useMotionValue(from);
  const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString() + suffix);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView) {
      animate(count, to, { duration, ease: "easeOut" });
    }
  }, [count, inView, to, duration]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
}

export function Home() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;

  const demoUrl = `${window.location.origin}/event/demo`;

  const listContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.6
      }
    }
  };

  const listItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 py-12 overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20 text-sm font-medium mb-8"
      >
        <Zap className="w-4 h-4" />
        <span>Instant Wedding Photo Delivery</span>
      </motion.div>
      
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6 max-w-4xl leading-tight"
      >
        Share your wedding photos with a simple scan.
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-xl text-gray-600 dark:text-slate-400 mb-10 max-w-2xl"
      >
        LensDrop lets photographers upload event photos and generate a unique QR code. 
        Guests scan it to instantly view and download their favorite memories.
      </motion.p>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
      >
        <Link
          to="/signup"
          className="w-full sm:w-auto bg-indigo-600 dark:bg-indigo-500 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] hover:-translate-y-0.5 flex items-center justify-center gap-2"
        >
          <Sparkles className="w-5 h-5" />
          Create Event & Get QR
        </Link>
        <Link
          to="/login"
          className="w-full sm:w-auto bg-white dark:bg-slate-800/80 text-gray-900 dark:text-white border border-gray-200 dark:border-slate-700 px-8 py-4 rounded-full text-lg font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-all shadow-sm hover:-translate-y-0.5 flex items-center justify-center gap-2 backdrop-blur-sm"
        >
          <LayoutDashboard className="w-5 h-5" />
          Photographer Dashboard
        </Link>
      </motion.div>

      {/* Trust Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-16 w-full max-w-3xl"
      >
        <p className="text-sm font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-6">Trusted by Photographers</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white/50 dark:bg-slate-900/40 backdrop-blur-sm border border-gray-200 dark:border-slate-800 rounded-2xl p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-500/20 rounded-full flex items-center justify-center shrink-0">
              <ImageIcon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="text-left">
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
                <AnimatedCounter from={0} to={10000} suffix="+" duration={2.5} />
              </h4>
              <p className="text-sm text-gray-600 dark:text-slate-400">Photos Delivered</p>
            </div>
          </motion.div>
          <motion.div 
            whileHover={{ y: -5 }}
            className="bg-white/50 dark:bg-slate-900/40 backdrop-blur-sm border border-gray-200 dark:border-slate-800 rounded-2xl p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-500/20 rounded-full flex items-center justify-center shrink-0">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-left">
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
                <AnimatedCounter from={0} to={50} suffix="+" duration={2} />
              </h4>
              <p className="text-sm text-gray-600 dark:text-slate-400">Photographers Using Platform</p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Live Demo QR Section */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.7 }}
        className="mt-24 w-full max-w-5xl bg-white dark:bg-slate-900/60 backdrop-blur-md rounded-3xl border border-gray-200 dark:border-slate-800 p-8 md:p-12 flex flex-col md:flex-row items-center gap-12 shadow-2xl relative overflow-hidden text-left"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 dark:bg-indigo-500/20 blur-[80px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 dark:bg-purple-500/20 blur-[80px] rounded-full pointer-events-none" />
        
        <div className="flex-1 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-500/20 text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Live Demo
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Try it yourself right now</h2>
          <p className="text-lg text-gray-600 dark:text-slate-400 mb-8">
            See how guests instantly access and download photos. Scan the QR code with your phone camera to experience the guest gallery.
          </p>
          <motion.ul 
            variants={listContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-4 text-gray-700 dark:text-slate-300"
          >
            <motion.li variants={listItemVariants} className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" /> 
              <span>No app download required for guests</span>
            </motion.li>
            <motion.li variants={listItemVariants} className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" /> 
              <span>Instant high-resolution downloads</span>
            </motion.li>
            <motion.li variants={listItemVariants} className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-indigo-500 shrink-0" /> 
              <span>Beautiful mobile-first masonry grid</span>
            </motion.li>
          </motion.ul>
        </div>
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
          className="relative z-10 shrink-0 flex flex-col items-center"
        >
          <div className="absolute inset-0 bg-indigo-500 rounded-3xl blur-xl animate-pulse opacity-30 dark:opacity-40"></div>
          <motion.div 
            whileHover={{ scale: 1.05, rotate: -2 }}
            className="relative bg-white p-4 rounded-3xl shadow-xl border border-gray-100 cursor-pointer"
          >
            <QRCodeSVG 
              value={demoUrl} 
              size={220} 
              level="H" 
              includeMargin={true}
              className="rounded-xl"
            />
          </motion.div>
          <motion.p 
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="mt-6 text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2"
          >
            <Camera className="w-4 h-4" /> Scan to View Demo
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Features Grid */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.7 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-5xl w-full text-left"
      >
        <FeatureCard 
          icon={<Camera className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />}
          title="1. Upload Photos"
          description="Drag and drop high-quality photos into your event dashboard. We handle the compression."
        />
        <FeatureCard 
          icon={<QrCode className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />}
          title="2. Generate QR"
          description="Get a unique QR code for your event. Print it or display it on a tablet at the venue."
        />
        <FeatureCard 
          icon={<Download className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />}
          title="3. Guests Download"
          description="Guests scan the code, view the beautiful gallery, and download photos instantly."
        />
      </motion.div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="p-8 rounded-3xl bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-indigo-500/30 transition-all duration-300 group"
    >
      <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
      <p className="text-gray-600 dark:text-slate-400 leading-relaxed">{description}</p>
    </motion.div>
  );
}

import { motion } from 'motion/react';
import { Mail, MessageCircle, Github, Linkedin, ExternalLink } from 'lucide-react';

export function SupportSettings() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto"
    >
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Support & About</h1>
      <p className="text-gray-600 dark:text-slate-400 mb-8">Get help and learn more about the developer.</p>

      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Contact Support</h2>
          <p className="text-gray-600 dark:text-slate-400 mb-6">
            Need help with your account or have a feature request? Reach out to us directly.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a 
              href="mailto:founder@imprince.me"
              className="flex items-center gap-3 p-4 rounded-2xl border border-gray-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors group"
            >
              <div className="bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 p-3 rounded-xl group-hover:scale-110 transition-transform">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Email Us</p>
                <p className="text-sm text-gray-500 dark:text-slate-400">founder@imprince.me</p>
              </div>
            </a>
            
            <a 
              href="https://wa.me/918252995548"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-2xl border border-gray-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors group"
            >
              <div className="bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 p-3 rounded-xl group-hover:scale-110 transition-transform">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white">WhatsApp</p>
                <p className="text-sm text-gray-500 dark:text-slate-400">Quick chat</p>
              </div>
            </a>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">About the Developer</h2>
          
          <div className="flex items-start gap-6 mb-8">
            <img 
              src="https://ui-avatars.com/api/?name=Prince+Raj&background=6366f1&color=fff" 
              alt="Prince Raj" 
              className="w-20 h-20 rounded-full border-4 border-white dark:border-slate-800 shadow-md"
            />
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Prince Raj</h3>
              <p className="text-indigo-600 dark:text-indigo-400 font-medium mb-2">Full Stack Developer</p>
              <p className="text-gray-600 dark:text-slate-400 text-sm">
                Passionate about building beautiful, functional, and user-centric web applications. LensDrop was created to make event photo sharing seamless and elegant.
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <a 
              href="https://github.com/pkskkumar900-debug"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-slate-300 rounded-lg hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors text-sm font-medium"
            >
              <Github className="w-4 h-4" /> GitHub <ExternalLink className="w-3 h-3 ml-1 opacity-50" />
            </a>
            <a 
              href="https://www.linkedin.com/in/prince-raj-ba4b973b3"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors text-sm font-medium"
            >
              <Linkedin className="w-4 h-4" /> LinkedIn <ExternalLink className="w-3 h-3 ml-1 opacity-50" />
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

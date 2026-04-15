import { motion } from 'motion/react';

export function LegalSettings() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Legal Information</h1>
      <p className="text-gray-600 dark:text-slate-400 mb-8">Terms of service and privacy policy.</p>

      <div className="space-y-8">
        <div className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm prose prose-indigo dark:prose-invert max-w-none">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Privacy Policy</h2>
          <p className="text-gray-600 dark:text-slate-400 mb-4">
            At LensDrop, we take your privacy seriously. We only collect the information necessary to provide you with our photo-sharing services.
          </p>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mt-6 mb-2">Data Collection</h3>
          <p className="text-gray-600 dark:text-slate-400 mb-4">
            We collect your email address for authentication purposes and the photos you choose to upload to your events.
          </p>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mt-6 mb-2">Data Usage</h3>
          <p className="text-gray-600 dark:text-slate-400">
            Your photos are stored securely and are only accessible to those with the unique event link or QR code. We do not use your photos for any other purpose.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm prose prose-indigo dark:prose-invert max-w-none">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Terms & Conditions</h2>
          <p className="text-gray-600 dark:text-slate-400 mb-4">
            By using LensDrop, you agree to these terms and conditions.
          </p>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mt-6 mb-2">Acceptable Use</h3>
          <p className="text-gray-600 dark:text-slate-400 mb-4">
            You agree not to upload any illegal, offensive, or copyrighted material that you do not have the right to share.
          </p>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mt-6 mb-2">Service Availability</h3>
          <p className="text-gray-600 dark:text-slate-400">
            While we strive for 100% uptime, LensDrop is provided "as is" and we cannot guarantee uninterrupted access to the service.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

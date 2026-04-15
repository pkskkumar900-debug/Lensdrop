import { motion } from 'motion/react';

export function LegalSettings() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto pb-12"
    >
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Legal Information</h1>
      <p className="text-gray-600 dark:text-slate-400 mb-8">Comprehensive terms of service and privacy policy for LensDrop.</p>

      <div className="space-y-8">
        <div className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm prose prose-indigo dark:prose-invert max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Privacy Policy</h2>
          <p className="text-gray-600 dark:text-slate-400 leading-relaxed mb-6">
            At LensDrop, we take your privacy seriously. This Privacy Policy outlines how we collect, use, disclose, and safeguard your information when you visit our website or use our application. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">1. Information We Collect</h3>
          <p className="text-gray-600 dark:text-slate-400 leading-relaxed mb-4">
            <strong>Personal Data:</strong> We may collect personally identifiable information, such as your name, email address, and profile picture when you register for an account.
          </p>
          <p className="text-gray-600 dark:text-slate-400 leading-relaxed mb-4">
            <strong>Media Data:</strong> We collect the photos and images you upload to your events. These are stored securely and associated with your account and specific events.
          </p>
          <p className="text-gray-600 dark:text-slate-400 leading-relaxed mb-4">
            <strong>Usage Data:</strong> We automatically collect certain information when you visit, use, or navigate the application. This information does not reveal your specific identity but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, and information about how and when you use our application.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">2. How We Use Your Data</h3>
          <p className="text-gray-600 dark:text-slate-400 leading-relaxed mb-4">
            We use personal information collected via our application for a variety of business purposes described below:
          </p>
          <ul className="list-disc pl-6 text-gray-600 dark:text-slate-400 leading-relaxed mb-4 space-y-2">
            <li>To facilitate account creation and logon process.</li>
            <li>To manage user accounts and provide you with the requested services.</li>
            <li>To send administrative information to you, such as product, service, and new feature information.</li>
            <li>To protect our services and ensure security.</li>
            <li>To enforce our terms, conditions, and policies for business purposes, to comply with legal and regulatory requirements.</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">3. Cookies & Tracking</h3>
          <p className="text-gray-600 dark:text-slate-400 leading-relaxed mb-4">
            We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Notice.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">4. Data Retention & Security</h3>
          <p className="text-gray-600 dark:text-slate-400 leading-relaxed mb-4">
            We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required or permitted by law. We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">5. User Privacy Rights</h3>
          <p className="text-gray-600 dark:text-slate-400 leading-relaxed mb-4">
            Depending on your location, you may have certain rights regarding your personal information, such as the right to request access to the personal information we collect from you, change that information, or delete it in some circumstances. To request to review, update, or delete your personal information, please contact our support team.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900/50 border border-gray-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm prose prose-indigo dark:prose-invert max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Terms & Conditions</h2>
          <p className="text-gray-600 dark:text-slate-400 leading-relaxed mb-6">
            These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and LensDrop ("we," "us" or "our"), concerning your access to and use of the LensDrop application as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">1. Account Registration</h3>
          <p className="text-gray-600 dark:text-slate-400 leading-relaxed mb-4">
            You may be required to register with the application. You agree to keep your password confidential and will be responsible for all use of your account and password. We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">2. User Conduct & Acceptable Use</h3>
          <p className="text-gray-600 dark:text-slate-400 leading-relaxed mb-4">
            You may not access or use the application for any purpose other than that for which we make the application available. The application may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
          </p>
          <p className="text-gray-600 dark:text-slate-400 leading-relaxed mb-4">
            As a user of the application, you agree not to:
          </p>
          <ul className="list-disc pl-6 text-gray-600 dark:text-slate-400 leading-relaxed mb-4 space-y-2">
            <li>Systematically retrieve data or other content from the application to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.</li>
            <li>Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information such as user passwords.</li>
            <li>Circumvent, disable, or otherwise interfere with security-related features of the application.</li>
            <li>Upload or transmit viruses, Trojan horses, or other material that interferes with any party's uninterrupted use and enjoyment of the application.</li>
            <li>Upload any illegal, offensive, or copyrighted material that you do not have the right to share.</li>
          </ul>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">3. Intellectual Property Rights</h3>
          <p className="text-gray-600 dark:text-slate-400 leading-relaxed mb-4">
            Unless otherwise indicated, the application is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the application (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us.
          </p>
          <p className="text-gray-600 dark:text-slate-400 leading-relaxed mb-4">
            You retain full ownership of all photos and media you upload to LensDrop. By uploading content, you grant us a limited license to store, display, and distribute your content solely for the purpose of providing the LensDrop service to you and your designated event attendees.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">4. Limitation of Liability</h3>
          <p className="text-gray-600 dark:text-slate-400 leading-relaxed mb-4">
            In no event will we or our directors, employees, or agents be liable to you or any third party for any direct, indirect, consequential, exemplary, incidental, special, or punitive damages, including lost profit, lost revenue, loss of data, or other damages arising from your use of the application, even if we have been advised of the possibility of such damages.
          </p>

          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">5. Termination of Service</h3>
          <p className="text-gray-600 dark:text-slate-400 leading-relaxed mb-4">
            These Terms and Conditions shall remain in full force and effect while you use the application. Without limiting any other provision of these Terms and Conditions, we reserve the right to, in our sole discretion and without notice or liability, deny access to and use of the application (including blocking certain IP addresses), to any person for any reason or for no reason, including without limitation for breach of any representation, warranty, or covenant contained in these Terms and Conditions or of any applicable law or regulation.
          </p>
        </div>
      </div>
    </motion.div>
  );
}

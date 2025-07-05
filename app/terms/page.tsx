export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Navbar */}
        <nav className="bg-white/90 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50 mb-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <a href="/" className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-indigo-900 bg-clip-text text-transparent">
                  📱 FlipPhoneFinder
                </a>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <a href="/" className="text-slate-700 hover:text-indigo-600 transition-colors font-medium">Browse Phones</a>
                <a href="/compare" className="text-slate-700 hover:text-indigo-600 transition-colors font-medium">Compare</a>
                <a href="/guides" className="text-slate-700 hover:text-indigo-600 transition-colors font-medium">Buying Guides</a>
                <a href="/blog" className="text-slate-700 hover:text-indigo-600 transition-colors font-medium">Blog</a>
                <a href="/contact" className="text-slate-700 hover:text-indigo-600 transition-colors font-medium">Contact</a>
              </div>
            </div>
          </div>
        </nav>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8 lg:p-12">
            <h1 className="text-4xl font-bold text-slate-800 mb-6">Terms of Service</h1>
            <p className="text-slate-600 mb-8">Last updated: December {new Date().getFullYear()}</p>

            <div className="prose prose-slate max-w-none">
              <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">1. Acceptance of Terms</h2>
              <p className="text-slate-600 mb-6">
                By accessing and using FlipPhoneFinder, operated by Broad Publications LLC, you accept and agree to be bound by the terms and provision of this agreement. These terms apply to the entire website and any email or other type of communication between you and FlipPhoneFinder.
              </p>

              <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">2. Use License</h2>
              <p className="text-slate-600 mb-4">
                Permission is granted to temporarily download one copy of FlipPhoneFinder materials for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc pl-6 text-slate-600 mb-6">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to reverse engineer any software contained on the website</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
              </ul>

              <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">3. Disclaimer</h2>
              <p className="text-slate-600 mb-6">
                The materials on FlipPhoneFinder are provided on an 'as is' basis. Broad Publications LLC makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>

              <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">4. Product Information</h2>
              <p className="text-slate-600 mb-6">
                FlipPhoneFinder provides information about digital wellness devices for educational and comparison purposes. We strive for accuracy but do not guarantee that product information, prices, or availability are error-free. We are not responsible for decisions made based on our content.
              </p>

              <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">5. Affiliate Links</h2>
              <p className="text-slate-600 mb-6">
                Our website may contain affiliate links to third-party retailers. We may earn a commission when you make a purchase through these links, at no additional cost to you. This does not influence our product recommendations or reviews.
              </p>

              <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">6. Limitations</h2>
              <p className="text-slate-600 mb-6">
                In no event shall Broad Publications LLC or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use FlipPhoneFinder materials, even if Broad Publications LLC or its authorized representative has been notified orally or in writing of the possibility of such damage.
              </p>

              <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">7. User Conduct</h2>
              <p className="text-slate-600 mb-4">You agree not to:</p>
              <ul className="list-disc pl-6 text-slate-600 mb-6">
                <li>Use the service for any unlawful purpose</li>
                <li>Spam, harass, or abuse other users</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Scrape or copy content without permission</li>
                <li>Post malicious code or viruses</li>
              </ul>

              <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">8. Privacy</h2>
              <p className="text-slate-600 mb-6">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service, to understand our practices.
              </p>

              <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">9. Termination</h2>
              <p className="text-slate-600 mb-6">
                We may terminate or suspend your access to our service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
              </p>

              <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">10. Governing Law</h2>
              <p className="text-slate-600 mb-6">
                These terms and conditions are governed by and construed in accordance with the laws of California, United States, and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.
              </p>

              <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">11. Changes to Terms</h2>
              <p className="text-slate-600 mb-6">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
              </p>

              <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">12. Contact Information</h2>
              <p className="text-slate-600 mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-slate-50 rounded-lg p-4 mb-6">
                <p className="text-slate-700"><strong>Broad Publications LLC</strong></p>
                <p className="text-slate-600">201 N US Highway 1</p>
                <p className="text-slate-600">STE D10 #1129</p>
                <p className="text-slate-600">Jupiter, FL 33477</p>
                <p className="text-slate-600">United States</p>
                <p className="text-slate-600">Email: hello@broadpublications.com</p>
                <p className="text-slate-600">Phone: (555) 123-4567</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
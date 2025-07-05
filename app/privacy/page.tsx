export default function Privacy() {
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
            <h1 className="text-4xl font-bold text-slate-800 mb-6">Privacy Policy</h1>
            <p className="text-slate-600 mb-8">Last updated: December {new Date().getFullYear()}</p>

            <div className="prose prose-slate max-w-none">
              <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">1. Information We Collect</h2>
              <p className="text-slate-600 mb-4">
                At FlipPhoneFinder, operated by Broad Publications LLC, we are committed to protecting your privacy. We collect minimal information necessary to provide our services:
              </p>
              <ul className="list-disc pl-6 text-slate-600 mb-6">
                <li>Usage data (pages visited, search queries, device type)</li>
                <li>Contact information when you reach out to us</li>
                <li>Cookies for site functionality and analytics</li>
              </ul>

              <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">2. How We Use Your Information</h2>
              <p className="text-slate-600 mb-4">We use collected information to:</p>
              <ul className="list-disc pl-6 text-slate-600 mb-6">
                <li>Improve our website and user experience</li>
                <li>Respond to your inquiries and provide support</li>
                <li>Analyze site usage to enhance our content</li>
                <li>Send occasional updates about new features (with your consent)</li>
              </ul>

              <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">3. Information Sharing</h2>
              <p className="text-slate-600 mb-6">
                We do not sell, trade, or rent your personal information to third parties. We may share information only in these limited circumstances:
              </p>
              <ul className="list-disc pl-6 text-slate-600 mb-6">
                <li>With your explicit consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and safety</li>
                <li>With service providers who assist in operating our website (under strict confidentiality agreements)</li>
              </ul>

              <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">4. Cookies and Tracking</h2>
              <p className="text-slate-600 mb-6">
                We use cookies and similar technologies to enhance your browsing experience. You can control cookie settings through your browser preferences. Some site functionality may be limited if you disable cookies.
              </p>

              <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">5. Data Security</h2>
              <p className="text-slate-600 mb-6">
                We implement appropriate security measures to protect your information against unauthorized access, alteration, disclosure, or destruction. However, no internet transmission is 100% secure.
              </p>

              <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">6. Your Rights</h2>
              <p className="text-slate-600 mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 text-slate-600 mb-6">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of communications</li>
                <li>File a complaint with supervisory authorities</li>
              </ul>

              <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">7. Children's Privacy</h2>
              <p className="text-slate-600 mb-6">
                Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13. If you believe we have collected such information, please contact us immediately.
              </p>

              <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">8. Changes to This Policy</h2>
              <p className="text-slate-600 mb-6">
                We may update this privacy policy periodically. We will notify you of any material changes by posting the new policy on this page with an updated "Last updated" date.
              </p>

              <h2 className="text-2xl font-bold text-slate-800 mt-8 mb-4">9. Contact Us</h2>
              <p className="text-slate-600 mb-4">
                If you have questions about this privacy policy or our data practices, please contact us:
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
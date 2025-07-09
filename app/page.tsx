import { db, phone } from '@/lib/db'
import PhoneList from '@/components/PhoneList'
import { Phone } from '@/lib/db'

export default async function Home() {
  // Fetch phones on the server side
  const phones: Phone[] = await db.select().from(phone)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">
            Find Your Perfect Digital Wellness Device
          </h2>
          <p className="text-lg text-slate-600">
            Compare flip phones, dumbphones, and minimalist devices designed for mindful living
          </p>
        </div>

        {/* Getting Started Section */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-slate-800 mb-2">🚀 Getting Started</h3>
              <p className="text-slate-600 text-sm">New to flip phones? Start with these essential guides</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a href="/guides/buyers-guide" className="group bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200">
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-200">📘</div>
                <h4 className="text-base font-bold text-slate-800 mb-2 group-hover:text-indigo-700 transition-colors">{`Complete Buyer's Guide`}</h4>
                <p className="text-slate-600 text-xs mb-2">Everything you need to know before buying your first flip phone</p>
                <div className="flex items-center text-xs text-slate-500">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full mr-2">Beginner</span>
                  <span>15 min read</span>
                </div>
              </a>

              <a href="/guides/digital-detox" className="group bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200">
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-200">🧘</div>
                <h4 className="text-base font-bold text-slate-800 mb-2 group-hover:text-emerald-700 transition-colors">Digital Detox Guide</h4>
                <p className="text-slate-600 text-xs mb-2">Step-by-step plan to reduce screen time and digital dependency</p>
                <div className="flex items-center text-xs text-slate-500">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full mr-2">Beginner</span>
                  <span>12 min read</span>
                </div>
              </a>

              <a href="/guides/switching-guide" className="group bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 hover:shadow-lg transition-all duration-200">
                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-200">🔄</div>
                <h4 className="text-base font-bold text-slate-800 mb-2 group-hover:text-purple-700 transition-colors">Switching Made Easy</h4>
                <p className="text-slate-600 text-xs mb-2">Practical tips for transitioning from smartphone to flip phone</p>
                <div className="flex items-center text-xs text-slate-500">
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full mr-2">Intermediate</span>
                  <span>10 min read</span>
                </div>
              </a>
            </div>

            <div className="text-center mt-6">
              <a href="/guides" className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 text-sm">
                View All Guides
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* PhoneList Component with SSR data */}
        <PhoneList initialPhones={phones} />

        {/* Footer */}
        <footer className="mt-20 bg-white/90 backdrop-blur-lg border-t border-white/20">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Company Info */}
              <div className="md:col-span-2">
                <h3 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-indigo-900 bg-clip-text text-transparent mb-4">
                  📱 FlipPhoneFinder
                </h3>
                <p className="text-slate-600 mb-4 leading-relaxed">
                  Your trusted source for discovering the best flip phones and digital wellness devices. Curated to help you find the perfect balance between connectivity and mindful technology use.
                </p>
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-100">
                  <p className="text-sm font-semibold text-slate-800 mb-1">Powered by</p>
                  <p className="text-lg font-bold text-indigo-700">Broad Publications LLC</p>
                  <p className="text-sm text-slate-600">Digital Wellness & Technology Curation</p>
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <h4 className="text-lg font-bold text-slate-800 mb-4">Contact Us</h4>
                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-start space-x-3">
                    <svg className="w-4 h-4 mt-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="font-medium">Broad Publications LLC</p>
                      <p>201 N US Highway 1</p>
                      <p>STE D10 #1129</p>
                      <p>Jupiter, FL 33477</p>
                      <p>United States</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <p>hello@broadpublications.com</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <p>(555) 123-4567</p>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-lg font-bold text-slate-800 mb-4">Resources</h4>
                <div className="space-y-2 text-sm">
                  <a href="/guides" className="block text-slate-600 hover:text-indigo-600 transition-colors">Digital Wellness Guide</a>
                  <a href="/compare" className="block text-slate-600 hover:text-indigo-600 transition-colors">Phone Comparison Tool</a>
                  <a href="/guides/buyers-guide" className="block text-slate-600 hover:text-indigo-600 transition-colors">{`Buyer's Guide`}</a>
                  <a href="/blog" className="block text-slate-600 hover:text-indigo-600 transition-colors">{`Blog & Reviews`}</a>
                  <a href="/contact" className="block text-slate-600 hover:text-indigo-600 transition-colors">Support Center</a>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-slate-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-slate-600 mb-4 md:mb-0">
                © {new Date().getFullYear()} Broad Publications LLC. All rights reserved. |
                <a href="/privacy" className="ml-1 hover:text-indigo-600 transition-colors">Privacy Policy</a> |
                <a href="/terms" className="ml-1 hover:text-indigo-600 transition-colors">Terms of Service</a>
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                  </svg>
                </a>
                <a href="#" className="text-slate-400 hover:text-indigo-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
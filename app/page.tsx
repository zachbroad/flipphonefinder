import PhoneList from '@/components/PhoneList'
import { db, phone, Phone } from '@/lib/db'
import Link from 'next/link'

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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <p>Jupiter, FL 33477</p>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-lg font-bold text-slate-800 mb-4">Resources</h4>
                <div className="space-y-2 text-sm">
                  <Link href="/guides" className="block text-slate-600 hover:text-indigo-600 transition-colors">Digital Wellness Guide</Link>
                  <Link href="/compare" className="block text-slate-600 hover:text-indigo-600 transition-colors">Phone Comparison Tool</Link>
                  <Link href="/guides/buyers-guide" className="block text-slate-600 hover:text-indigo-600 transition-colors">{`Buyer's Guide`}</Link>
                  <Link href="/blog" className="block text-slate-600 hover:text-indigo-600 transition-colors">{`Blog & Reviews`}</Link>
                  <Link href="/contact" className="block text-slate-600 hover:text-indigo-600 transition-colors">Support Center</Link>
                </div>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-slate-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-sm text-slate-600 mb-4 md:mb-0">
                © {new Date().getFullYear()} Broad Publications LLC. All rights reserved. |
                <Link href="/privacy" className="ml-1 hover:text-indigo-600 transition-colors">Privacy Policy</Link> |
                <Link href="/terms" className="ml-1 hover:text-indigo-600 transition-colors">Terms of Service</Link>
              </p>
              <div className="flex space-x-4 text-sm text-slate-500">
                <span>Curated with care for digital wellness</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
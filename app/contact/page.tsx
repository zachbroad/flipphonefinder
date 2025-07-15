
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Contact Us | Flip Phone Finder - Expert Digital Wellness Advice",
  description: "Get expert advice on flip phones and digital wellness devices. Contact our team for personalized recommendations and support with your dumbphone journey.",
  keywords: "flip phone support, digital wellness advice, dumbphone help, flip phone contact, expert recommendations",
  openGraph: {
    title: "Contact Us | Flip Phone Finder - Expert Digital Wellness Advice",
    description: "Get expert advice on flip phones and digital wellness devices. Contact our team for personalized recommendations and support with your dumbphone journey.",
    url: "https://flipphonefinder.com/contact",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Flip Phone Finder - Expert Digital Wellness Advice",
    description: "Get expert advice on flip phones and digital wellness devices. Contact our team for personalized recommendations and support with your dumbphone journey.",
  },
  alternates: {
    canonical: "https://flipphonefinder.com/contact",
  },
}

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Contact Us
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Have questions about digital wellness devices? We&apos;re here to help you find the perfect flip phone or dumbphone.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Get in Touch</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-indigo-100 rounded-full p-3">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Address</h3>
                    <p className="text-slate-600">Broad Publications LLC</p>
                    <p className="text-slate-600">201 N US Highway 1</p>
                    <p className="text-slate-600">STE D10 #1129</p>
                    <p className="text-slate-600">Jupiter, FL 33477</p>
                    <p className="text-slate-600">United States</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-indigo-100 rounded-full p-3">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Email</h3>
                    <p className="text-slate-600">hello@broadpublications.com</p>
                    <p className="text-sm text-slate-500">We typically respond within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-4">FAQ</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-slate-800">How do you choose which phones to feature?</h3>
                  <p className="text-sm text-slate-600">We carefully curate devices based on digital wellness principles, user reviews, and our hands-on testing.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Do you sell phones directly?</h3>
                  <p className="text-sm text-slate-600">No, we&apos;re an information resource. We provide links to trusted retailers where you can purchase devices.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Can you recommend a specific phone for me?</h3>
                  <p className="text-sm text-slate-600">Absolutely! Contact us with your needs and we&apos;ll provide personalized recommendations.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
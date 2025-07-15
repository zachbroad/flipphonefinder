import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Digital Detox Guide 2024 | Reduce Screen Time with Flip Phones",
  description: "Step-by-step guide to digital detox using flip phones. Learn how to reduce smartphone addiction, improve mental health, and embrace digital minimalism.",
  keywords: "digital detox guide, screen time reduction, smartphone addiction, flip phone detox, digital minimalism, mental health, digital wellness",
  openGraph: {
    title: "Digital Detox Guide 2024 | Reduce Screen Time with Flip Phones",
    description: "Step-by-step guide to digital detox using flip phones. Learn how to reduce smartphone addiction, improve mental health, and embrace digital minimalism.",
    url: "https://flipphonefinder.com/guides/digital-detox",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital Detox Guide 2024 | Reduce Screen Time with Flip Phones",
    description: "Step-by-step guide to digital detox using flip phones. Learn how to reduce smartphone addiction, improve mental health, and embrace digital minimalism.",
  },
  alternates: {
    canonical: "https://flipphonefinder.com/guides/digital-detox",
  },
}

export default function DigitalDetoxGuide() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">

        {/* Back to Guides */}
        <div className="mb-8">
          <Link
            href="/guides"
            className="inline-flex items-center text-slate-600 hover:text-indigo-600 transition-colors font-medium"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Guides
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-6">🧘</div>
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Digital Detox: A Step-by-Step Guide
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Learn how to gradually reduce your smartphone dependency and embrace digital minimalism
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-slate-500 mt-4">
            <span>📖 12 min read</span>
            <span>•</span>
            <span>🏷️ Beginner Friendly</span>
            <span>•</span>
            <span>📅 Updated {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8 lg:p-12">

            {/* Quick Assessment */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-bold text-red-800 mb-4">📊 Quick Assessment: Do You Need a Digital Detox?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-red-700 mb-2">Check all that apply:</h4>
                  <div className="space-y-2 text-sm text-red-600">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      You check your phone within 15 minutes of waking up
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      You feel anxious when your phone battery is low
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      You scroll social media for hours without realizing
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      You&apos;ve missed real-world moments while on your phone
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      You struggle to focus on one task for 30+ minutes
                    </label>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-red-700 mb-2">More signs:</h4>
                  <div className="space-y-2 text-sm text-red-600">
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Your sleep quality has decreased
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      You feel FOMO when not connected
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Face-to-face conversations feel awkward
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      You reach for your phone when bored for even 30 seconds
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      Your screen time is 4+ hours daily
                    </label>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-4 bg-white/50 rounded-lg">
                <p className="text-sm text-red-700">
                  <strong>If you checked 3+ boxes:</strong> A digital detox could significantly improve your well-being and relationships.
                </p>
              </div>
            </div>

            {/* 30-Day Plan */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-slate-800 mb-6">📅 Your 30-Day Digital Detox Plan</h2>

              <div className="space-y-8">
                {/* Week 1 */}
                <div className="border border-slate-200 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">1</div>
                    <h3 className="text-2xl font-bold text-slate-800">Week 1: Assessment & Preparation</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-slate-700 mb-3">📱 Days 1-3: Baseline Measurement</h4>
                      <ul className="text-slate-600 space-y-2 text-sm">
                        <li>• Track current screen time using built-in tools</li>
                        <li>• Note when and why you reach for your phone</li>
                        <li>• Count daily phone pickups</li>
                        <li>• Identify your trigger apps and times</li>
                        <li>• Document sleep quality and mood</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-700 mb-3">🎯 Days 4-7: Goal Setting</h4>
                      <ul className="text-slate-600 space-y-2 text-sm">
                        <li>• Set realistic screen time reduction goals</li>
                        <li>• Choose your flip phone or digital wellness device</li>
                        <li>• Inform family/friends about your detox plan</li>
                        <li>• Create phone-free zones in your home</li>
                        <li>• Plan alternative activities for boredom</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 bg-blue-50 rounded-lg p-4">
                    <h5 className="font-semibold text-blue-800 mb-2">🎯 Week 1 Goal:</h5>
                    <p className="text-blue-700 text-sm">Reduce daily screen time by 30 minutes and establish awareness of usage patterns.</p>
                  </div>
                </div>

                {/* Week 2 */}
                <div className="border border-slate-200 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">2</div>
                    <h3 className="text-2xl font-bold text-slate-800">Week 2: Gradual Transition</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-slate-700 mb-3">🔄 Days 8-10: Smartphone Limits</h4>
                      <ul className="text-slate-600 space-y-2 text-sm">
                        <li>• Use flip phone for 4 hours daily</li>
                        <li>• Delete most addictive apps from smartphone</li>
                        <li>• Turn off all non-essential notifications</li>
                        <li>• Charge phone outside bedroom at night</li>
                        <li>• Practice phone-free meals</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-700 mb-3">📱 Days 11-14: Flip Phone Integration</h4>
                      <ul className="text-slate-600 space-y-2 text-sm">
                        <li>• Extend flip phone use to 8 hours daily</li>
                        <li>• Learn T9 texting efficiently</li>
                        <li>• Set up important contacts and speed dial</li>
                        <li>• Practice navigation without GPS apps</li>
                        <li>• Use flip phone for all calls and texts</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 bg-emerald-50 rounded-lg p-4">
                    <h5 className="font-semibold text-emerald-800 mb-2">🎯 Week 2 Goal:</h5>
                    <p className="text-emerald-700 text-sm">Successfully use flip phone for basic communication 8+ hours daily.</p>
                  </div>
                </div>

                {/* Week 3 */}
                <div className="border border-slate-200 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">3</div>
                    <h3 className="text-2xl font-bold text-slate-800">Week 3: Full Commitment</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-slate-700 mb-3">📵 Days 15-18: Flip Phone Primary</h4>
                      <ul className="text-slate-600 space-y-2 text-sm">
                        <li>• Use only flip phone during weekdays</li>
                        <li>• Keep smartphone for emergencies only</li>
                        <li>• Develop new morning and evening routines</li>
                        <li>• Practice mindful eating without distractions</li>
                        <li>• Engage in phone-free social activities</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-700 mb-3">🔋 Days 19-21: Habit Formation</h4>
                      <ul className="text-slate-600 space-y-2 text-sm">
                        <li>• Extend to full weekend without smartphone</li>
                        <li>• Notice and journal mental/emotional changes</li>
                        <li>• Strengthen face-to-face relationships</li>
                        <li>• Rediscover offline hobbies and interests</li>
                        <li>• Practice being present in conversations</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 bg-amber-50 rounded-lg p-4">
                    <h5 className="font-semibold text-amber-800 mb-2">🎯 Week 3 Goal:</h5>
                    <p className="text-amber-700 text-sm">Complete entire days using only flip phone while maintaining productivity.</p>
                  </div>
                </div>

                {/* Week 4 */}
                <div className="border border-slate-200 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-sm mr-3">4</div>
                    <h3 className="text-2xl font-bold text-slate-800">Week 4: Integration & Long-term Planning</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-slate-700 mb-3">🌱 Days 22-25: Lifestyle Integration</h4>
                      <ul className="text-slate-600 space-y-2 text-sm">
                        <li>• Establish sustainable daily routines</li>
                        <li>• Define clear smartphone usage boundaries</li>
                        <li>• Create work-life digital balance</li>
                        <li>• Develop stress management without screens</li>
                        <li>• Build accountability with friends/family</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-700 mb-3">🏆 Days 26-30: Future Planning</h4>
                      <ul className="text-slate-600 space-y-2 text-sm">
                        <li>• Evaluate progress and celebrate wins</li>
                        <li>• Plan for challenging situations</li>
                        <li>• Decide on long-term phone setup</li>
                        <li>• Create relapse prevention strategies</li>
                        <li>• Set goals for continued digital wellness</li>
                      </ul>
                    </div>
                  </div>

                  <div className="mt-6 bg-purple-50 rounded-lg p-4">
                    <h5 className="font-semibold text-purple-800 mb-2">🎯 Week 4 Goal:</h5>
                    <p className="text-purple-700 text-sm">Develop sustainable long-term digital wellness habits and routines.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Challenges & Solutions */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-slate-800 mb-6">🚧 Common Challenges & Solutions</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-red-200 rounded-xl p-6 bg-red-50">
                  <h4 className="text-lg font-bold text-red-800 mb-3">{`😰 "I feel anxious without my phone"`}</h4>
                  <div className="text-sm text-red-700 space-y-2">
                    <p><strong>Solution:</strong> Start with short 30-minute periods without your phone. Gradually increase duration.</p>
                    <p><strong>Practice:</strong> Deep breathing exercises when feeling phone withdrawal.</p>
                    <p><strong>Remember:</strong> This anxiety is temporary and will fade as you adapt.</p>
                  </div>
                </div>

                <div className="border border-blue-200 rounded-xl p-6 bg-blue-50">
                  <h4 className="text-lg font-bold text-blue-800 mb-3">{`📍 "I need GPS everywhere I go"`}</h4>
                  <div className="text-sm text-blue-700 space-y-2">
                    <p><strong>Solution:</strong> Write down directions before leaving. Use a dedicated GPS device.</p>
                    <p><strong>Practice:</strong> Ask for directions - it&apos;s a great conversation starter!</p>
                    <p><strong>Remember:</strong> People navigated for thousands of years without GPS.</p>
                  </div>
                </div>

                <div className="border border-green-200 rounded-xl p-6 bg-green-50">
                  <h4 className="text-lg font-bold text-green-800 mb-3">{`💬 "My friends think I'm weird"`}</h4>
                  <div className="text-sm text-green-700 space-y-2">
                    <p><strong>Solution:</strong> Explain your goals and invite them to try it too.</p>
                    <p><strong>Practice:</strong> Show them the benefits you&apos;re experiencing.</p>
                    <p><strong>Remember:</strong> True friends will support your wellness journey.</p>
                  </div>
                </div>

                <div className="border border-purple-200 rounded-xl p-6 bg-purple-50">
                  <h4 className="text-lg font-bold text-purple-800 mb-3">{`💼 "I need it for work"`}</h4>
                  <div className="text-sm text-purple-700 space-y-2">
                    <p><strong>Solution:</strong> Designate specific work hours for smartphone use.</p>
                    <p><strong>Practice:</strong> Use flip phone for personal time, smartphone for work only.</p>
                    <p><strong>Remember:</strong> Clear boundaries improve work-life balance.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Tracking */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-slate-800 mb-6">📊 Track Your Progress</h2>

              <div className="bg-slate-50 rounded-xl p-6">
                <h4 className="text-lg font-bold text-slate-800 mb-4">📝 Weekly Check-In Questions</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold text-slate-700 mb-2">Wellness Metrics:</h5>
                    <ul className="space-y-1 text-sm text-slate-600">
                      <li>• How is your sleep quality? (1-10)</li>
                      <li>• Stress levels compared to last week?</li>
                      <li>• Quality of face-to-face interactions?</li>
                      <li>• Focus and productivity levels?</li>
                      <li>• Overall mood and mental clarity?</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-700 mb-2">Usage Metrics:</h5>
                    <ul className="space-y-1 text-sm text-slate-600">
                      <li>• Daily smartphone screen time</li>
                      <li>• Number of phone pickups per day</li>
                      <li>• Longest period without checking phone</li>
                      <li>• Percentage of day using flip phone</li>
                      <li>• Apps/features you miss most</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Success Metrics */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-slate-800 mb-6">🏆 Signs of Success</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-green-50 border border-green-200 rounded-xl">
                  <div className="text-4xl mb-3">😴</div>
                  <h4 className="font-bold text-green-800 mb-2">Better Sleep</h4>
                  <p className="text-sm text-green-700">Falling asleep faster, sleeping deeper, waking up more refreshed</p>
                </div>

                <div className="text-center p-6 bg-blue-50 border border-blue-200 rounded-xl">
                  <div className="text-4xl mb-3">🎯</div>
                  <h4 className="font-bold text-blue-800 mb-2">Improved Focus</h4>
                  <p className="text-sm text-blue-700">Ability to concentrate for longer periods without digital distractions</p>
                </div>

                <div className="text-center p-6 bg-purple-50 border border-purple-200 rounded-xl">
                  <div className="text-4xl mb-3">❤️</div>
                  <h4 className="font-bold text-purple-800 mb-2">Stronger Relationships</h4>
                  <p className="text-sm text-purple-700">More meaningful conversations and present-moment connections</p>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-center text-white">
              <h3 className="text-2xl font-bold mb-4">🚀 Ready to Start Your Digital Detox?</h3>
              <p className="text-indigo-100 mb-6">Take the first step towards digital wellness today.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/guides/buyers-guide"
                  className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Choose Your Flip Phone
                </Link>
                <Link
                  href="/guides/switching-guide"
                  className="px-6 py-3 bg-indigo-500 text-white font-semibold rounded-xl hover:bg-indigo-400 transition-colors"
                >
                  Learn How to Switch
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
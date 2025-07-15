import Link from "next/link"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Flip Phone Buying Guides | Digital Wellness & Minimalist Phone Guides",
  description: "Comprehensive guides for choosing flip phones, digital detox strategies, and minimalist living. Expert advice for finding your perfect dumbphone.",
  keywords: "flip phone buying guide, dumbphone guide, digital detox guide, minimalist phone guide, feature phone comparison, digital wellness",
  openGraph: {
    title: "Flip Phone Buying Guides | Digital Wellness & Minimalist Phone Guides",
    description: "Comprehensive guides for choosing flip phones, digital detox strategies, and minimalist living. Expert advice for finding your perfect dumbphone.",
    url: "https://flipphonefinder.com/guides",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Flip Phone Buying Guides | Digital Wellness & Minimalist Phone Guides",
    description: "Comprehensive guides for choosing flip phones, digital detox strategies, and minimalist living. Expert advice for finding your perfect dumbphone.",
  },
  alternates: {
    canonical: "https://flipphonefinder.com/guides",
  },
}

export default function Guides() {
  const guides = [
    {
      title: "Complete Buyer's Guide to Flip Phones in 2024",
      description: "Everything you need to know before buying your first flip phone or dumbphone.",
      icon: "📘",
      difficulty: "Beginner",
      readTime: "15 min read",
      topics: ["Phone Selection", "Features", "Carriers", "Pricing"]
    },
    {
      title: "Digital Detox: A Step-by-Step Guide",
      description: "Learn how to gradually reduce your smartphone dependency and embrace digital minimalism.",
      icon: "🧘",
      difficulty: "Beginner",
      readTime: "12 min read",
      topics: ["Digital Wellness", "Habit Formation", "Mental Health", "Productivity"]
    },
    {
      title: "Switching from Smartphone to Flip Phone",
      description: "A comprehensive guide to making the transition smooth and successful.",
      icon: "🔄",
      difficulty: "Intermediate",
      readTime: "20 min read",
      topics: ["Data Transfer", "App Alternatives", "Workflow Changes", "Social Considerations"]
    },
    {
      title: "Best Flip Phones for Different Lifestyles",
      description: "Find the perfect flip phone based on your specific needs and daily routine.",
      icon: "🎯",
      difficulty: "Beginner",
      readTime: "10 min read",
      topics: ["Lifestyle Matching", "Use Cases", "Feature Comparison", "Recommendations"]
    },
    {
      title: "Network Compatibility Guide",
      description: "Understanding 2G, 3G, 4G, and VoLTE support for flip phones across carriers.",
      icon: "📡",
      difficulty: "Advanced",
      readTime: "18 min read",
      topics: ["Network Technologies", "Carrier Support", "Coverage Maps", "Technical Specs"]
    },
    {
      title: "Parental Controls and Family Plans",
      description: "How to set up flip phones for children and manage family digital wellness.",
      icon: "👨‍👩‍👧‍👦",
      difficulty: "Intermediate",
      readTime: "14 min read",
      topics: ["Parental Controls", "Family Plans", "Child Safety", "Screen Time Management"]
    },
    {
      title: "Business Use Cases for Basic Phones",
      description: "Maintaining productivity and professionalism with minimalist devices.",
      icon: "💼",
      difficulty: "Intermediate",
      readTime: "16 min read",
      topics: ["Business Features", "Professional Communication", "Productivity Tools", "Enterprise Solutions"]
    },
    {
      title: "Troubleshooting Common Issues",
      description: "Solutions to the most common problems flip phone users encounter.",
      icon: "🔧",
      difficulty: "Intermediate",
      readTime: "8 min read",
      topics: ["Technical Issues", "Troubleshooting", "Maintenance", "Support"]
    }
  ]

  const categories = ["All", "Getting Started", "Digital Wellness", "Technical", "Business", "Family"]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Navbar */}
        <nav className="bg-white/90 backdrop-blur-lg border-b border-white/20 sticky top-0 z-50 mb-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-indigo-900 bg-clip-text text-transparent">
                  📱 FlipPhoneFinder
                </Link>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <Link href="/" className="text-slate-700 hover:text-indigo-600 transition-colors font-medium">Browse Phones</Link>
                <Link href="/compare" className="text-slate-700 hover:text-indigo-600 transition-colors font-medium">Compare</Link>
                <Link href="/guides" className="text-slate-700 hover:text-indigo-600 transition-colors font-medium text-indigo-600">Buying Guides</Link>
                <Link href="/blog" className="text-slate-700 hover:text-indigo-600 transition-colors font-medium">Blog</Link>
                <Link href="/contact" className="text-slate-700 hover:text-indigo-600 transition-colors font-medium">Contact</Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Digital Wellness Guides
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Comprehensive guides to help you navigate the world of flip phones, digital minimalism, and mindful technology use
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map(category => (
              <button
                key={category}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 bg-white/80 text-slate-700 hover:bg-white border border-slate-200 hover:shadow-md"
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Guide */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8 lg:p-12 text-white">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 text-white mb-4">
                Most Popular Guide
              </span>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-4">
                    {guides[0].title}
                  </h2>
                  <p className="text-lg text-indigo-100 mb-6">
                    {guides[0].description}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-indigo-200 mb-6">
                    <span>{guides[0].readTime}</span>
                    <span>•</span>
                    <span>{guides[0].difficulty}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {guides[0].topics.map((topic, index) => (
                      <span key={index} className="px-2 py-1 rounded-md bg-white/10 text-white text-sm">
                        {topic}
                      </span>
                    ))}
                  </div>
                  <button className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors">
                    Read Guide
                  </button>
                </div>
                <div className="text-6xl ml-8 opacity-50">
                  {guides[0].icon}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guides.slice(1).map((guide, index) => (
            <div key={index} className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-200 group">
              <div className="p-6">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">
                  {guide.icon}
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${guide.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                    guide.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                    {guide.difficulty}
                  </span>
                  <span className="text-sm text-slate-500">{guide.readTime}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-indigo-700 transition-colors">
                  {guide.title}
                </h3>
                <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                  {guide.description}
                </p>
                <div className="flex flex-wrap gap-1 mb-4">
                  {guide.topics.map((topic, topicIndex) => (
                    <span key={topicIndex} className="px-2 py-1 rounded-md bg-slate-100 text-slate-700 text-xs">
                      {topic}
                    </span>
                  ))}
                </div>
                <button className="w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200">
                  Read Guide
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Start Section */}
        <div className="mt-16">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8 lg:p-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-6 text-center">
              Quick Start: Your Digital Wellness Journey
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-5xl mb-4">1️⃣</div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Assess Your Needs</h3>
                <p className="text-slate-600 text-sm">
                  Evaluate your current phone usage and determine what features you actually need for daily life.
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">2️⃣</div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Choose Your Device</h3>
                <p className="text-slate-600 text-sm">
                  Browse our comprehensive database and use our guides to find the perfect flip phone for your lifestyle.
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-4">3️⃣</div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Make the Switch</h3>
                <p className="text-slate-600 text-sm">
                  Follow our step-by-step transition guide to smoothly move from smartphone to flip phone.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Support Section */}
        <div className="mt-16">
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-xl p-8 lg:p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Need Personalized Guidance?
            </h2>
            <p className="text-emerald-100 mb-8 text-lg">
              Our experts are here to help you find the perfect digital wellness solution for your unique situation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="px-6 py-3 bg-white text-emerald-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors">
                Get Expert Advice
              </a>
              <Link href="/blog" className="px-6 py-3 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-400 transition-colors">
                Read Our Blog
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
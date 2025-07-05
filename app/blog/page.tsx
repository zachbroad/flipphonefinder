export default function Blog() {
  const posts = [
    {
      title: "The Complete Guide to Digital Detox in 2024",
      excerpt: "Learn how flip phones and dumbphones can help you reclaim your time and mental health from smartphone addiction.",
      date: "Dec 15, 2024",
      readTime: "8 min read",
      category: "Digital Wellness",
      image: "📱",
      slug: "digital-detox-guide-2024"
    },
    {
      title: "Tips for Switching to a Flip Phone: Lessons from Real Users",
      excerpt: "Practical advice and hard-learned lessons from people who made the switch to flip phones, including common challenges and solutions.",
      date: "Dec 13, 2024",
      readTime: "10 min read",
      category: "Guides",
      image: "🔄",
      slug: "tips-for-switching-to-flip-phone"
    },
    {
      title: "Light Phone 3 vs AGM M8: Which Minimalist Phone is Right for You?",
      excerpt: "An in-depth comparison of two popular digital wellness devices, covering features, battery life, and real-world usage.",
      date: "Dec 12, 2024",
      readTime: "12 min read",
      category: "Reviews",
      image: "⚖️",
      slug: "light-phone-3-vs-agm-m8-comparison"
    },
    {
      title: "Why Gen Z is Embracing Flip Phones",
      excerpt: "Exploring the growing trend of young people switching to basic phones for better mental health and productivity.",
      date: "Dec 10, 2024",
      readTime: "6 min read",
      category: "Trends",
      image: "👥",
      slug: "gen-z-flip-phones"
    },
    {
      title: "Setting Up Your First Dumbphone: A Beginner's Guide",
      excerpt: "Everything you need to know about transitioning from a smartphone to a basic phone, including apps and services.",
      date: "Dec 8, 2024",
      readTime: "10 min read",
      category: "Guides",
      image: "🚀",
      slug: "setting-up-first-dumbphone"
    },
    {
      title: "The Science Behind Digital Minimalism",
      excerpt: "Research-backed insights into how reducing screen time and digital distractions can improve focus and well-being.",
      date: "Dec 5, 2024",
      readTime: "7 min read",
      category: "Research",
      image: "🧠",
      slug: "science-digital-minimalism"
    },
    {
      title: "Best Flip Phones for Business Professionals",
      excerpt: "Professional-grade basic phones that maintain essential business functionality while reducing digital distractions.",
      date: "Dec 3, 2024",
      readTime: "9 min read",
      category: "Business",
      image: "💼",
      slug: "best-flip-phones-business"
    }
  ]

  const categories = ["All", "Digital Wellness", "Reviews", "Guides", "Trends", "Research", "Business"]

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
                <a href="/blog" className="text-slate-700 hover:text-indigo-600 transition-colors font-medium text-indigo-600">Blog</a>
                <a href="/contact" className="text-slate-700 hover:text-indigo-600 transition-colors font-medium">Contact</a>
              </div>
            </div>
          </div>
        </nav>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            Digital Wellness Blog
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Insights, reviews, and guides for living mindfully in the digital age
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

        {/* Featured Post */}
        <div className="mb-12">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="p-8 lg:p-12">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 mb-4">
                Featured Article
              </span>
              <h2 className="text-3xl font-bold text-slate-800 mb-4">
                {posts[0].title}
              </h2>
              <p className="text-lg text-slate-600 mb-6">
                {posts[0].excerpt}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-slate-500">
                  <span>{posts[0].date}</span>
                  <span>•</span>
                  <span>{posts[0].readTime}</span>
                  <span>•</span>
                  <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-700">
                    {posts[0].category}
                  </span>
                </div>
                <a href={`/blog/${posts[0].slug}`} className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200">
                  Read Article
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.slice(1).map((post, index) => (
            <a key={index} href={`/blog/${post.slug}`} className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-200 group block">
              <article className="p-6">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">
                  {post.image}
                </div>
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 mb-3">
                  {post.category}
                </span>
                <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-indigo-700 transition-colors">
                  {post.title}
                </h3>
                <p className="text-slate-600 mb-4 text-sm leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
              </article>
            </a>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 lg:p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Stay Updated on Digital Wellness
            </h2>
            <p className="text-indigo-100 mb-8 text-lg">
              Get weekly insights on digital minimalism, phone reviews, and mindful technology use.
            </p>
            <div className="max-w-md mx-auto flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl border-0 focus:ring-4 focus:ring-white/20 bg-white/90"
              />
              <button className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-xl hover:bg-slate-50 transition-colors">
                Subscribe
              </button>
            </div>
            <p className="text-xs text-indigo-200 mt-4">
              No spam, unsubscribe anytime. Read our <a href="/privacy" className="underline">privacy policy</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
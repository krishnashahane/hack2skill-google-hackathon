import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Leaf, Search, ChevronLeft, ChevronRight, ArrowRight, BookOpen, Download, Eye, ExternalLink, FileText, Play } from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const categories = ['All Resources', 'Volunteer Management', 'Fundraising', 'Impact Reporting', 'Legal & Compliance', 'Digital Marketing'];

const featuredInsights = [
  { type: 'GUIDE', badge: 'Must Read', readTime: '12 min read', title: 'The 2024 Global NGO Impact Framework', desc: 'Learn how top-tier organizations are redefining transparency and measurement in the digital age.', action: 'Read the Guide', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop', large: true },
  { type: 'Whitepaper', icon: FileText, title: 'Fundraising in the AI Era', desc: 'Exploring the ethical use of machine learning in donor engagement.', action: 'Download PDF', actionIcon: Download },
  { type: 'Masterclass', icon: Play, title: 'Sustainable Scaling for Startups', desc: 'A 4-part video series on transitioning from local to regional impact.', action: 'Watch Now', actionIcon: Play },
];

const resources = [
  { tag: 'ARTICLE', tagColor: 'bg-emerald-600', readTime: '5 min read', title: 'Volunteering in the Remote Age', desc: 'How to effectively manage and motivate virtual teams while maintaining a strong organizational culture across borders.', date: 'May 12, 2024', action: 'Read More', actionIcon: ArrowRight, image: 'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=400&h=250&fit=crop' },
  { tag: 'PDF TOOLKIT', tagColor: 'bg-blue-600', size: '4.2 MB', title: 'Financial Accountability 101', desc: 'A complete toolkit for setting up transparent accounting systems that build trust with your donors and stakeholders.', date: 'Apr 28, 2024', action: 'Download', actionIcon: Download, image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop' },
  { tag: 'CASE STUDY', tagColor: 'bg-amber-600', readTime: '8 min read', title: 'Impact at Scale: The Hub Story', desc: 'How a local grassroots initiative transformed into a national network through strategic partnerships and tech adoption.', date: 'Apr 15, 2024', action: 'View Story', actionIcon: Eye, image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=250&fit=crop' },
  { tag: 'ARTICLE', tagColor: 'bg-emerald-600', readTime: '6 min read', title: 'Ethical Storytelling for Non-Profits', desc: "Sharing your mission's impact without compromising the dignity and privacy of those you serve.", date: 'Mar 30, 2024', action: 'Read More', actionIcon: ArrowRight, image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=250&fit=crop' },
  { tag: 'REPORT', tagColor: 'bg-violet-600', pages: '24 pages', title: 'The State of Philanthropy 2024', desc: 'Our annual deep dive into global giving trends, donor demographics, and emerging fundraising technologies.', date: 'Mar 12, 2024', action: 'Get Report', actionIcon: Download, image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop' },
  { tag: 'TOOLKIT', tagColor: 'bg-teal-600', extra: 'Interactive', title: 'Digital Transition Workbook', desc: 'A step-by-step interactive workbook to help your organization move operations to the cloud securely.', date: 'Feb 25, 2024', action: 'Start Now', actionIcon: ExternalLink, image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&h=250&fit=crop' },
];

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center"><Leaf className="w-3.5 h-3.5 text-white" /></div>
          <span className="text-lg font-bold text-gray-900">NGO Hub</span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link to="/find-opportunities" className="hover:text-emerald-600 transition">Find Opportunities</Link>
          <Link to="/resources" className="text-emerald-600 border-b-2 border-emerald-600 pb-0.5">Resources</Link>
          <Link to="/organizations" className="hover:text-emerald-600 transition">Organizations</Link>
          <Link to="/about" className="hover:text-emerald-600 transition">About Us</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-emerald-600 px-3 py-1.5">Login</Link>
          <Link to="/signup" className="text-sm font-medium bg-emerald-600 text-white px-4 py-1.5 rounded-full hover:bg-emerald-700">Sign Up</Link>
        </div>
      </div>
    </nav>
  );
}

export default function Resources() {
  const [activeCategory, setActiveCategory] = useState('All Resources');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <section className="bg-gradient-to-b from-emerald-50/60 to-white py-14 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 text-sm text-gray-600 mb-6 shadow-sm"><BookOpen className="w-4 h-4 text-emerald-600" />Learning Library</div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">Empower Your Mission with<br />Expert <span className="text-emerald-600 italic">Knowledge</span></h1>
          <p className="mt-4 text-gray-500 max-w-xl mx-auto">Access a curated collection of toolkits, guides, and reports designed to help non-profits scale their social impact efficiently.</p>
          <div className="mt-6 flex items-center max-w-lg mx-auto bg-white rounded-xl border border-gray-200 shadow-sm px-4 py-2.5">
            <Search className="w-5 h-5 text-gray-400 mr-3" />
            <input type="text" placeholder="Search for guides, PDFs, or case studies..." className="flex-1 text-sm outline-none bg-transparent placeholder-gray-400" />
            <button className="bg-emerald-600 text-white text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-emerald-700 transition">Search</button>
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (<button key={cat} onClick={() => setActiveCategory(cat)} className={`text-sm font-medium px-4 py-2 rounded-full border transition ${activeCategory === cat ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300'}`}>{cat}</button>))}
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Featured Insights</h2>
          <div className="flex gap-2"><button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><ChevronLeft className="w-5 h-5" /></button><button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"><ChevronRight className="w-5 h-5" /></button></div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col sm:flex-row">
            <div className="sm:w-2/5 h-48 sm:h-auto bg-gradient-to-br from-emerald-100 to-teal-50 relative overflow-hidden">
              <img src={featuredInsights[0].image} alt="" className="w-full h-full object-cover" />
              <span className="absolute top-3 left-3 text-[10px] font-bold px-2 py-1 rounded bg-rose-500 text-white">{featuredInsights[0].badge}</span>
            </div>
            <div className="flex-1 p-5 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-xs text-gray-400 mb-2"><span className="font-semibold text-emerald-600">{featuredInsights[0].type}</span><span>{featuredInsights[0].readTime}</span></div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{featuredInsights[0].title}</h3>
              <p className="text-sm text-gray-500 mb-3">{featuredInsights[0].desc}</p>
              <button className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700">{featuredInsights[0].action} <ArrowRight className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="space-y-4">
            {featuredInsights.slice(1).map(fi => (
              <div key={fi.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">{fi.icon && <fi.icon className="w-6 h-6 text-emerald-600" />}</div>
                <div className="flex-1">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">{fi.type}</p>
                  <h4 className="text-sm font-bold text-gray-900 mb-1">{fi.title}</h4>
                  <p className="text-xs text-gray-500 mb-2">{fi.desc}</p>
                  <button className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">{fi.action} {fi.actionIcon && <fi.actionIcon className="w-3 h-3" />}</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-6"><h2 className="text-2xl font-bold text-gray-900">Latest Resources</h2></div>
        <motion.div variants={stagger} initial="hidden" animate="show" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map(r => (
            <motion.div key={r.title} variants={fadeUp} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-all group cursor-pointer">
              <div className="h-44 bg-gray-100 relative overflow-hidden">
                <img src={r.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <span className={`absolute bottom-3 left-3 text-[10px] font-bold px-2 py-1 rounded text-white ${r.tagColor}`}>{r.tag}</span>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">{r.readTime && <span>{r.readTime}</span>}{r.size && <span>{r.size}</span>}{r.pages && <span>{r.pages}</span>}{r.extra && <span>{r.extra}</span>}</div>
                <h3 className="text-sm font-bold text-gray-900 mb-1.5">{r.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-3">{r.desc}</p>
                <div className="flex items-center justify-between"><span className="text-xs text-gray-400">{r.date}</span><button className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">{r.action} {r.actionIcon && <r.actionIcon className="w-3 h-3" />}</button></div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        <div className="flex items-center justify-center gap-2 mt-10">
          <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"><ChevronLeft className="w-5 h-5" /></button>
          <button className="w-9 h-9 rounded-lg bg-emerald-600 text-white text-sm font-semibold">1</button>
          <button className="w-9 h-9 rounded-lg hover:bg-gray-100 text-sm text-gray-600">2</button>
          <button className="w-9 h-9 rounded-lg hover:bg-gray-100 text-sm text-gray-600">3</button>
          <span className="text-gray-400 text-sm">...</span>
          <button className="w-9 h-9 rounded-lg hover:bg-gray-100 text-sm text-gray-600">12</button>
          <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"><ChevronRight className="w-5 h-5" /></button>
        </div>
      </section>
      <section className="bg-emerald-50 py-12 px-4">
        <div className="max-w-xl mx-auto text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Never miss an update</h3>
          <p className="text-sm text-gray-500 mb-5">Sign up for our monthly digest of the best new resources, toolkits, and case studies curated specifically for NGO leaders.</p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input type="email" placeholder="your@email.com" className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-emerald-400" />
            <button className="bg-emerald-600 text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-emerald-700 transition">Subscribe</button>
          </div>
        </div>
      </section>
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2"><div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center"><Leaf className="w-3.5 h-3.5 text-white" /></div><span className="text-base font-bold text-white">NGO Hub</span></div>
          <p className="text-xs">&copy; 2024 NGO Hub. Empathetic Efficiency for Social Impact.</p>
          <div className="flex gap-4 text-xs"><Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link><Link to="/terms" className="hover:text-white transition">Terms of Service</Link><Link to="/about" className="hover:text-white transition">Contact Us</Link></div>
        </div>
      </footer>
    </div>
  );
}

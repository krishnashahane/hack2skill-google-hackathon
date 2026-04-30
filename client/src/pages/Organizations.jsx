import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Leaf, Search, MapPin, ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

const orgs = [
  { name: 'GreenPath Global', badge: 'Active', badgeColor: 'bg-emerald-100 text-emerald-700', icon: '\u{1F331}', iconBg: 'bg-emerald-50', desc: 'Pioneering sustainable agriculture and reforestation projects across East Africa to combat food insecurity and climate change.', stats: [{ value: '48+', label: 'PROJECTS' }, { value: '3.2k+', label: 'VOLUNTEERS' }] },
  { name: 'HealthLink Foundation', badge: 'High Impact', badgeColor: 'bg-blue-100 text-blue-700', icon: '\u{1F4A7}', iconBg: 'bg-blue-50', desc: 'Providing essential medical supplies and tele-health infrastructure to remote communities in South America.', stats: [{ value: '112+', label: 'CLINICS' }, { value: '15k+', label: 'BENEFICIARIES' }] },
  { name: 'EduFuture Collective', badge: 'Top Rated', badgeColor: 'bg-amber-100 text-amber-700', icon: '\u{2600}\u{FE0F}', iconBg: 'bg-orange-50', desc: 'Bridging the digital divide by distributing solar-powered laptops and training local educators in Southeast Asia.', stats: [{ value: '250+', label: 'SCHOOLS' }, { value: '12k+', label: 'DEVICES' }] },
  { name: 'Urban Canopy Initiative', badge: 'New', badgeColor: 'bg-gray-200 text-gray-700', icon: '\u{1F333}', iconBg: 'bg-green-50', desc: 'Transforming urban heat islands into cool, breathable spaces through vertical gardening and smart water management.', stats: [{ value: '12+', label: 'CITIES' }, { value: '850k', label: 'TREES' }] },
  { name: 'Rise & Lead Network', badge: 'Active', badgeColor: 'bg-emerald-100 text-emerald-700', icon: '\u{1F91D}', iconBg: 'bg-amber-50', desc: 'Empowering women entrepreneurs in developing economies through micro-grants, mentorship, and business training.', stats: [{ value: '$2.4M', label: 'GRANTS' }, { value: '5k+', label: 'LEADERS' }] },
  { name: 'PureAqua Solutions', badge: 'Active', badgeColor: 'bg-emerald-100 text-emerald-700', icon: '\u{1F4A7}', iconBg: 'bg-cyan-50', desc: 'Deploying innovative water purification technology to regions facing severe scarcity and contamination challenges.', stats: [{ value: '800+', label: 'SYSTEMS' }, { value: '99%', label: 'PURITY' }] },
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
          <Link to="/resources" className="hover:text-emerald-600 transition">Resources</Link>
          <Link to="/organizations" className="text-emerald-600 border-b-2 border-emerald-600 pb-0.5">Organizations</Link>
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

export default function Organizations() {
  const [search, setSearch] = useState('');
  const filtered = orgs.filter(o => o.name.toLowerCase().includes(search.toLowerCase()) || o.desc.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <section className="bg-gradient-to-b from-emerald-50/60 to-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900">Partner Organizations</h1>
          <p className="mt-3 text-gray-500 max-w-xl">Connect with high-impact NGOs dedicated to solving the world's most pressing challenges. Find your cause and join the movement.</p>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-2 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 px-4 py-3 shadow-sm">
            <Search className="w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Search by name or keywords..." value={search} onChange={e => setSearch(e.target.value)} className="flex-1 text-sm outline-none bg-transparent placeholder-gray-400" />
          </div>
          <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 px-4 py-3 shadow-sm">
            <span className="text-gray-400 text-sm">Category</span>
            <select className="flex-1 text-sm outline-none bg-transparent text-gray-700 appearance-none"><option>All Cause Areas</option><option>Environment</option><option>Healthcare</option><option>Education</option></select>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
          <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 px-4 py-3 shadow-sm">
            <MapPin className="w-5 h-5 text-gray-400" />
            <select className="flex-1 text-sm outline-none bg-transparent text-gray-700 appearance-none"><option>Global Reach</option><option>Africa</option><option>Asia</option><option>South America</option></select>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <motion.div variants={stagger} initial="hidden" animate="show" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(org => (
            <motion.div key={org.name} variants={fadeUp} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-all">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 rounded-xl ${org.iconBg} flex items-center justify-center text-2xl`}>{org.icon}</div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${org.badgeColor}`}>{org.badge}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{org.name}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-5">{org.desc}</p>
                <div className="flex gap-3 mb-5">
                  {org.stats.map(s => (<div key={s.label} className="flex-1 bg-gray-50 rounded-xl px-3 py-2.5 text-center"><p className="text-sm font-bold text-emerald-600">{s.value}</p><p className="text-[10px] text-gray-400 font-medium tracking-wide">{s.label}</p></div>))}
                </div>
                <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold py-2.5 rounded-xl transition">View Profile</button>
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

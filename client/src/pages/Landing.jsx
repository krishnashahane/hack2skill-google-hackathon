import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, MapPin, ArrowRight, Heart, Users, BarChart3,
  Leaf, Globe, Shield, Sparkles, BookOpen, Handshake, Target,
  CheckCircle2, Star, TrendingUp, Clock, Award, Zap, X,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

function LocationMapPopup({ onClose }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [locationName, setLocationName] = useState('Detecting location...');
  const [nearbyPlaces, setNearbyPlaces] = useState([]);

  useEffect(() => {
    const defaultLoc = { lat: 18.5204, lng: 73.8567 };

    const initMap = (center) => {
      if (!mapRef.current || mapInstanceRef.current) return;
      const map = L.map(mapRef.current, { zoomControl: true, attributionControl: false }).setView([center.lat, center.lng], 14);
      mapInstanceRef.current = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);

      L.circleMarker([center.lat, center.lng], { radius: 10, color: '#059669', fillColor: '#059669', fillOpacity: 1, weight: 3 }).addTo(map);
      L.circle([center.lat, center.lng], { radius: 3000, color: '#059669', fillColor: '#10b981', fillOpacity: 0.1, weight: 2 }).addTo(map);

      // Reverse geocode via Nominatim
      fetch(`https://nominatim.openstreetmap.org/reverse?lat=${center.lat}&lon=${center.lng}&format=json`)
        .then(r => r.json())
        .then(d => { if (d?.display_name) setLocationName(d.display_name.split(',').slice(0, 3).join(',')); })
        .catch(() => setLocationName(`${center.lat.toFixed(4)}, ${center.lng.toFixed(4)}`));

      // Nearby POIs via Overpass
      const bbox = `${center.lat - 0.027},${center.lng - 0.027},${center.lat + 0.027},${center.lng + 0.027}`;
      fetch(`https://overpass-api.de/api/interpreter?data=[out:json];node["amenity"](${bbox});out%208;`)
        .then(r => r.json())
        .then(d => {
          const pois = (d.elements || []).filter(e => e.tags?.name).slice(0, 8).map(e => ({
            name: e.tags.name,
            vicinity: e.tags.amenity?.replace(/_/g, ' ') || 'Place',
            lat: e.lat, lng: e.lon,
            dist: haversineKm(center.lat, center.lng, e.lat, e.lon),
          }));
          pois.sort((a, b) => a.dist - b.dist);
          setNearbyPlaces(pois);
          pois.forEach(p => {
            L.circleMarker([p.lat, p.lng], { radius: 6, color: '#6366f1', fillColor: '#6366f1', fillOpacity: 0.8, weight: 2 })
              .bindTooltip(p.name).addTo(map);
          });
        })
        .catch(() => {});

      setTimeout(() => map.invalidateSize(), 100);
    };

    navigator.geolocation?.getCurrentPosition(
      (pos) => initMap({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => { setLocationName('Pune, Maharashtra'); initMap(defaultLoc); }
    );

    return () => { if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; } };
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}>
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="font-bold text-gray-900">Nearby within 3 km</h3>
            <p className="text-xs text-gray-500">{locationName}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100"><X className="w-4 h-4" /></button>
        </div>
        <div ref={mapRef} className="w-full h-[300px]" />
        <div className="p-4 max-h-[200px] overflow-y-auto">
          <p className="text-xs font-semibold text-gray-500 mb-2">LOCATIONS WITHIN 3 KM RADIUS</p>
          {nearbyPlaces.length === 0 && <p className="text-sm text-gray-400">Loading nearby places...</p>}
          <div className="space-y-2">
            {nearbyPlaces.map((p, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                  <p className="text-xs text-gray-400 truncate">{p.vicinity}</p>
                </div>
                <span className="text-xs text-emerald-600 font-medium flex-shrink-0">{p.dist.toFixed(1)} km</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [locationLabel, setLocationLabel] = useState('Detecting...');

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
          .then(r => r.json())
          .then(d => { if (d?.display_name) setLocationLabel(d.display_name.split(',').slice(0, 2).join(',').trim()); else setLocationLabel(`${lat.toFixed(2)}, ${lng.toFixed(2)}`); })
          .catch(() => setLocationLabel(`${lat.toFixed(2)}, ${lng.toFixed(2)}`));
      },
      () => setLocationLabel('Pune, Maharashtra')
    );
  }, []);

  return (
    <>
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-gray-900">NGO Hub</span>
              <span className="hidden sm:block text-[10px] text-gray-400 -mt-1">Smarter Impact, Together</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link to="/find-opportunities" className="hover:text-emerald-600 transition">Find Opportunities</Link>
            <Link to="/resources" className="hover:text-emerald-600 transition">Resources</Link>
            <Link to="/organizations" className="hover:text-emerald-600 transition">Organizations</Link>
            <Link to="/about" className="hover:text-emerald-600 transition">About Us</Link>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <button onClick={() => setShowMap(true)} className="flex items-center gap-2 text-sm text-gray-500 border border-gray-200 rounded-full px-3 py-1.5 hover:border-emerald-300 hover:text-emerald-700 transition">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
              <span className="max-w-[180px] truncate">{locationLabel}</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-medium">3 km</span>
            </button>
            <button className="flex items-center gap-1.5 bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-emerald-700 transition">
              <Search className="w-3.5 h-3.5" /> Search
            </button>
            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition px-3 py-2">Log In</Link>
            <Link to="/signup" className="text-sm font-medium bg-amber-400 text-gray-900 px-4 py-2 rounded-full hover:bg-amber-500 transition">Sign Up</Link>
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
            <div className="space-y-1.5">
              <div className={`w-5 h-0.5 bg-gray-600 transition-all ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <div className={`w-5 h-0.5 bg-gray-600 transition-all ${mobileOpen ? 'opacity-0' : ''}`} />
              <div className={`w-5 h-0.5 bg-gray-600 transition-all ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </div>
          </button>
        </div>

        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="lg:hidden pb-4 space-y-2">
            <Link to="/find-opportunities" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Find Opportunities</Link>
            <Link to="/resources" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Resources</Link>
            <Link to="/organizations" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Organizations</Link>
            <Link to="/about" className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">About Us</Link>
            <button onClick={() => setShowMap(true)} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
              <MapPin className="w-4 h-4 text-emerald-600" /> Nearby (3 km)
            </button>
            <div className="flex gap-2 pt-2">
              <Link to="/login" className="flex-1 text-center text-sm font-medium text-gray-600 border border-gray-200 px-4 py-2 rounded-full">Log In</Link>
              <Link to="/signup" className="flex-1 text-center text-sm font-medium bg-amber-400 text-gray-900 px-4 py-2 rounded-full">Sign Up</Link>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
    {showMap && <LocationMapPopup onClose={() => setShowMap(false)} />}
    </>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      {/* Decorative leaves */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
        <Leaf className="w-full h-full text-emerald-600" />
      </div>
      <div className="absolute bottom-0 left-0 w-24 h-24 opacity-10 rotate-45">
        <Leaf className="w-full h-full text-emerald-600" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div variants={stagger} initial="hidden" animate="show">
            <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold text-gray-900 leading-tight">
              Smart Resource Allocation{' '}
              <br />
              for <span className="text-emerald-600">Stronger Social Impact</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-5 text-lg text-gray-500 max-w-lg leading-relaxed">
              Empowering NGOs to use resources wisely, maximize impact, and create sustainable change.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
              <Link to="/signup" className="inline-flex items-center gap-2 bg-emerald-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-emerald-700 transition shadow-lg shadow-emerald-200">
                Find Opportunities
              </Link>
              <a href="#how-it-works" className="inline-flex items-center gap-2 bg-white text-gray-700 font-semibold px-6 py-3 rounded-full border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition">
                Learn How It Works
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative"
          >
            {/* Illustration replacement - stylized community scene */}
            <div className="relative bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 rounded-3xl p-8 overflow-hidden">
              <div className="absolute top-4 right-4 w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 bg-white rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Volunteer Coordination</p>
                      <p className="text-xs text-gray-400">12 active tasks</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      <div className="flex-1 h-2 bg-emerald-100 rounded-full"><div className="h-full w-4/5 bg-emerald-500 rounded-full" /></div>
                      <span className="text-xs text-gray-500">85%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      <div className="flex-1 h-2 bg-amber-100 rounded-full"><div className="h-full w-3/5 bg-amber-500 rounded-full" /></div>
                      <span className="text-xs text-gray-500">62%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <div className="flex-1 h-2 bg-blue-100 rounded-full"><div className="h-full w-[90%] bg-blue-500 rounded-full" /></div>
                      <span className="text-xs text-gray-500">91%</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl p-3 shadow-sm text-center">
                    <p className="text-2xl font-bold text-emerald-600">247</p>
                    <p className="text-[10px] text-gray-400">Volunteers</p>
                  </div>
                  <div className="bg-white rounded-2xl p-3 shadow-sm text-center">
                    <p className="text-2xl font-bold text-amber-500">58</p>
                    <p className="text-[10px] text-gray-400">NGOs</p>
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-3">
                {[
                  { icon: Heart, label: 'Health', color: 'rose' },
                  { icon: BookOpen, label: 'Education', color: 'blue' },
                  { icon: Globe, label: 'Environment', color: 'emerald' },
                  { icon: Handshake, label: 'Community', color: 'violet' },
                ].map(({ icon: I, label, color }) => (
                  <div key={label} className={`bg-${color}-50 rounded-xl p-3 text-center`}>
                    <I className={`w-5 h-5 text-${color}-500 mx-auto mb-1`} />
                    <p className="text-[10px] font-medium text-gray-600">{label}</p>
                  </div>
                ))}
              </div>
              {/* Decorative plant elements */}
              <div className="absolute -bottom-2 -left-2 w-16 h-16 opacity-20">
                <Leaf className="w-full h-full text-emerald-600 rotate-45" />
              </div>
              <div className="absolute -top-2 -right-2 w-12 h-12 opacity-15">
                <Leaf className="w-full h-full text-emerald-600 -rotate-12" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FeatureCards() {
  const features = [
    {
      icon: Search,
      title: 'Discover Opportunities',
      desc: 'Find cause-driven opportunities that need your skills and support.',
      color: 'emerald',
    },
    {
      icon: Handshake,
      title: 'Support Organizations',
      desc: 'Help NGOs optimize resources and maximize their impact.',
      color: 'blue',
    },
    {
      icon: BarChart3,
      title: 'Track Real Impact',
      desc: 'Transparent insights on how resources create change.',
      color: 'violet',
    },
  ];

  return (
    <section id="features" className="py-6 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
              <div className={`w-12 h-12 rounded-xl bg-${f.color}-50 flex items-center justify-center flex-shrink-0`}>
                <f.icon className={`w-6 h-6 text-${f.color}-600`} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-gray-900">{f.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{f.desc}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-emerald-600 transition flex-shrink-0" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function InsightsSection() {
  const articles = [
    {
      title: '5 Ways Data Helps NGOs Allocate Resources Smarter',
      desc: 'Learn how data-driven decisions can maximize every donation.',
      color: 'from-emerald-400 to-teal-500',
      icon: BarChart3,
    },
    {
      title: 'Balancing Needs & Impact: A Practical Guide',
      desc: 'Tips to prioritize resources for both urgent needs and long-term change.',
      color: 'from-blue-400 to-indigo-500',
      icon: Target,
    },
    {
      title: 'Measuring Impact Beyond Numbers',
      desc: 'Explore ways to measure the real change your organization creates.',
      color: 'from-amber-400 to-orange-500',
      icon: TrendingUp,
    },
    {
      title: 'Collaborate Better, Achieve More',
      desc: 'Build partnerships that bring together resources, skills, and communities.',
      color: 'from-violet-400 to-purple-500',
      icon: Handshake,
    },
  ];

  return (
    <section id="resources" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900">Insights & Resources for Smarter Action</h2>
          <p className="mt-3 text-gray-500 max-w-2xl mx-auto">
            Practical guides, inspiring stories, and expert tips to help NGOs allocate resources better and create greater impact.
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {articles.map((a) => (
            <motion.div
              key={a.title}
              variants={fadeUp}
              whileHover={{ y: -6, boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer group"
            >
              <div className={`h-40 bg-gradient-to-br ${a.color} flex items-center justify-center relative overflow-hidden`}>
                <a.icon className="w-16 h-16 text-white/30" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />
              </div>
              <div className="p-4">
                <h3 className="text-sm font-bold text-gray-900 leading-snug">{a.title}</h3>
                <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{a.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-10">
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white font-semibold px-6 py-3 rounded-full hover:bg-emerald-700 transition"
          >
            Explore All Resources
          </Link>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { icon: Users, title: 'Create Profile', desc: 'Sign up and add your skills, location, and availability.' },
    { icon: Sparkles, title: 'AI Matching', desc: 'Our engine finds the best task-volunteer matches instantly.' },
    { icon: Target, title: 'Get Assigned', desc: 'Accept tasks and start making a difference in your community.' },
    { icon: Award, title: 'Track Impact', desc: 'See your contributions, ratings, and cumulative impact.' },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
          <p className="mt-3 text-gray-500">Four simple steps from signup to social impact</p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {steps.map((s, i) => (
            <motion.div key={s.title} variants={fadeUp} className="text-center relative">
              {i < 3 && <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-emerald-100" />}
              <div className="w-20 h-20 rounded-2xl bg-emerald-50 flex items-center justify-center mx-auto mb-4 relative">
                <s.icon className="w-9 h-9 text-emerald-600" />
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">{i + 1}</span>
              </div>
              <h3 className="text-base font-bold text-gray-900">{s.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{s.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function StatsSection() {
  const stats = [
    { value: '10,000+', label: 'Volunteers Matched', icon: Users },
    { value: '500+', label: 'NGOs Supported', icon: Globe },
    { value: '95%', label: 'Match Accuracy', icon: Zap },
    { value: '2,400+', label: 'Tasks Completed', icon: CheckCircle2 },
  ];

  return (
    <section className="py-16 bg-emerald-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((s) => (
            <motion.div key={s.label} variants={fadeUp} className="text-center text-white">
              <s.icon className="w-8 h-8 mx-auto mb-3 text-emerald-200" />
              <p className="text-3xl font-bold">{s.value}</p>
              <p className="text-sm text-emerald-100 mt-1">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const testimonials = [
    { name: 'Priya Sharma', role: 'Volunteer, Mumbai', text: 'NGO Hub matched me to a medical camp where my nursing skills were exactly what was needed. The AI matching is incredible!', rating: 5 },
    { name: 'Rajesh Kumar', role: 'NGO Director, Pune', text: 'We reduced coordination time by 70%. The real-time tracking means no more confusion about who\'s doing what.', rating: 5 },
    { name: 'Ananya Iyer', role: 'Community Organizer', text: 'The analytics dashboard gives us clear insight into our impact. We can show donors exactly where resources go.', rating: 5 },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Trusted by Communities</h2>
          <p className="mt-3 text-gray-500">What volunteers and organizations say about NGO Hub</p>
        </motion.div>
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <motion.div key={t.name} variants={fadeUp} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex gap-1 mb-3">{Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}</div>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
                  {t.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <Heart className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Ready to Make a Difference?</h2>
          <p className="mt-4 text-lg text-gray-500 max-w-xl mx-auto">
            Join thousands of volunteers and organizations building stronger communities through smart coordination.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/signup" className="inline-flex items-center gap-2 bg-emerald-600 text-white font-semibold px-8 py-3.5 rounded-full hover:bg-emerald-700 transition shadow-lg shadow-emerald-200">
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/login" className="inline-flex items-center gap-2 bg-white text-gray-700 font-semibold px-8 py-3.5 rounded-full border border-gray-200 hover:bg-gray-50 transition">
              Sign In to Dashboard
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white">NGO Hub</span>
            </div>
            <p className="text-sm leading-relaxed">
              Smart Resource Allocation for Social Impact. Data-driven volunteer coordination powered by AI.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/find-opportunities" className="hover:text-white transition">Find Opportunities</Link></li>
              <li><Link to="/for-organizations" className="hover:text-white transition">For Organizations</Link></li>
              <li><Link to="/ai-matching" className="hover:text-white transition">AI Matching</Link></li>
              <li><Link to="/analytics-info" className="hover:text-white transition">Analytics</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/docs" className="hover:text-white transition">Documentation</Link></li>
              <li><Link to="/resources" className="hover:text-white transition">Resources</Link></li>
              <li><Link to="/blog" className="hover:text-white transition">Blog</Link></li>
              <li><Link to="/community" className="hover:text-white transition">Community</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-white transition">About</Link></li>
              <li><Link to="/careers" className="hover:text-white transition">Careers</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm">© 2026 NGO Hub. Built by Team Rising Lion.</p>
          <p className="text-xs text-gray-500">Aditya Makurwar & Krishna Shahane</p>
        </div>
      </div>
    </footer>
  );
}

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <FeatureCards />
      <InsightsSection />
      <HowItWorks />
      <StatsSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
}

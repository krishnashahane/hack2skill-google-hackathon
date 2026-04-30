import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Leaf, Search, Users, Building2, Sparkles, BarChart3, BookOpen, Code2,
  FileText, MessageCircle, Heart, Briefcase, Shield, Scale, ArrowRight,
  CheckCircle2, Globe, Target, Zap, Award, TrendingUp, Clock,
} from 'lucide-react';

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

function PageShell({ children }) {
  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center">
              <Leaf className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">NGO Hub</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-emerald-600 px-3 py-1.5">Log In</Link>
            <Link to="/signup" className="text-sm font-medium bg-emerald-600 text-white px-4 py-1.5 rounded-full hover:bg-emerald-700">Sign Up</Link>
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
}

function SectionHero({ icon: Icon, title, subtitle, color = 'emerald' }) {
  return (
    <section className={`py-16 bg-gradient-to-br from-${color}-50 to-${color}-100/30`}>
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className={`w-14 h-14 rounded-2xl bg-${color}-100 flex items-center justify-center mx-auto mb-4`}>
            <Icon className={`w-7 h-7 text-${color}-600`} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">{title}</h1>
          <p className="mt-3 text-lg text-gray-500 max-w-2xl mx-auto">{subtitle}</p>
        </motion.div>
      </div>
    </section>
  );
}

export function FindOpportunities() {
  const categories = [
    { icon: Heart, title: 'Healthcare', count: 24, desc: 'Medical camps, nursing support, mental health counseling' },
    { icon: BookOpen, title: 'Education', count: 18, desc: 'Tutoring, skill workshops, literacy programs' },
    { icon: Globe, title: 'Environment', count: 12, desc: 'Tree planting, clean-up drives, sustainability awareness' },
    { icon: Building2, title: 'Community', count: 31, desc: 'Shelter repair, food distribution, disaster relief' },
    { icon: Code2, title: 'Technology', count: 8, desc: 'IT support, website building, digital literacy' },
    { icon: Sparkles, title: 'Special Events', count: 15, desc: 'Fundraising galas, awareness campaigns, community festivals' },
  ];
  return (
    <PageShell>
      <SectionHero icon={Search} title="Find Opportunities" subtitle="Discover volunteering opportunities matched to your skills and location." />
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div variants={stagger} initial="hidden" animate="show" className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map(c => (
              <motion.div key={c.title} variants={fadeUp} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition group cursor-pointer">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <c.icon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{c.title}</h3>
                    <p className="text-xs text-emerald-600 font-medium">{c.count} opportunities</p>
                  </div>
                </div>
                <p className="text-sm text-gray-500">{c.desc}</p>
                <Link to="/signup" className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600 mt-3 group-hover:gap-2 transition-all">
                  Browse <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
          <div className="text-center mt-12">
            <Link to="/signup" className="inline-flex items-center gap-2 bg-emerald-600 text-white font-semibold px-8 py-3 rounded-full hover:bg-emerald-700 transition">
              Sign Up to Get Matched <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

export function ForOrganizations() {
  const benefits = [
    { icon: Sparkles, title: 'AI-Powered Matching', desc: 'Automatically find the best volunteers for each task based on skills, proximity, and availability.' },
    { icon: BarChart3, title: 'Real-Time Analytics', desc: 'Track volunteer engagement, task completion rates, and operational efficiency.' },
    { icon: Users, title: 'Volunteer Management', desc: 'Manage your entire volunteer base with profiles, availability tracking, and skill mapping.' },
    { icon: Target, title: 'Impact Measurement', desc: 'Quantify and report your organization\'s social impact with data-driven metrics.' },
  ];
  return (
    <PageShell>
      <SectionHero icon={Building2} title="For Organizations" subtitle="Streamline your volunteer coordination with AI-powered tools." color="blue" />
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map(b => (
              <motion.div key={b.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="flex gap-4 p-6 rounded-2xl bg-gray-50">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <b.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{b.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{b.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/signup" className="inline-flex items-center gap-2 bg-blue-600 text-white font-semibold px-8 py-3 rounded-full hover:bg-blue-700 transition">
              Register Your Organization <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

export function AIMatching() {
  const steps = [
    { num: '01', title: 'Skill Analysis', desc: 'Engine scans volunteer skill profiles against task requirements. Each matched skill contributes up to 50 points.', score: '50 pts' },
    { num: '02', title: 'Proximity Calculation', desc: 'Haversine formula calculates real-world distance. Within 1km = 30 points, linear decay to 100km.', score: '30 pts' },
    { num: '03', title: 'Availability Check', desc: 'Currently available volunteers receive full availability points.', score: '20 pts' },
    { num: '04', title: 'Ranking & Assignment', desc: 'Volunteers are ranked by total score. Top 3 matches are presented for assignment.', score: '100 max' },
  ];
  return (
    <PageShell>
      <SectionHero icon={Sparkles} title="AI Matching Engine" subtitle="Score = Skill (50) + Proximity (30) + Availability (20)" color="violet" />
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-6">
            {steps.map(s => (
              <motion.div key={s.num} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                className="flex gap-5 items-start p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-violet-600">{s.num}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-gray-900">{s.title}</h3>
                    <span className="text-sm font-bold text-violet-600 bg-violet-50 px-2.5 py-0.5 rounded-full">{s.score}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-100">
            <h3 className="font-bold text-gray-900 mb-2">Powered by Google Gemini</h3>
            <p className="text-sm text-gray-500">Our AI assistant uses Google Gemini API to provide intelligent summaries, skill gap analysis, and optimization recommendations for your volunteer coordination.</p>
          </div>
          <div className="text-center mt-10">
            <Link to="/signup" className="inline-flex items-center gap-2 bg-violet-600 text-white font-semibold px-8 py-3 rounded-full hover:bg-violet-700 transition">
              Try AI Matching <Sparkles className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

export function AnalyticsInfo() {
  const metrics = [
    { icon: Users, label: 'Total Volunteers', value: 'Real-time count' },
    { icon: CheckCircle2, label: 'Task Completion', value: 'Percentage tracking' },
    { icon: Zap, label: 'Efficiency Score', value: 'Assignment ratio' },
    { icon: TrendingUp, label: 'Weekly Trends', value: 'Activity charts' },
    { icon: Award, label: 'Skill Coverage', value: 'Gap analysis' },
    { icon: Clock, label: 'Response Time', value: 'Average metrics' },
  ];
  return (
    <PageShell>
      <SectionHero icon={BarChart3} title="Analytics Dashboard" subtitle="Data-driven insights for smarter volunteer coordination." color="amber" />
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {metrics.map(m => (
              <motion.div key={m.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className="p-5 rounded-2xl bg-white border border-gray-100 shadow-sm text-center">
                <m.icon className="w-8 h-8 text-amber-500 mx-auto mb-3" />
                <h3 className="font-bold text-gray-900">{m.label}</h3>
                <p className="text-sm text-gray-400 mt-1">{m.value}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/login" className="inline-flex items-center gap-2 bg-amber-500 text-white font-semibold px-8 py-3 rounded-full hover:bg-amber-600 transition">
              View Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

export function Documentation() {
  const sections = [
    { title: 'Getting Started', desc: 'Create an account, set up your organization profile, and add your first volunteers.', icon: BookOpen },
    { title: 'Volunteer Management', desc: 'Add volunteers with skills, location, and availability. Track their assignments and impact.', icon: Users },
    { title: 'Task Creation', desc: 'Create tasks with required skills, urgency levels, and locations for AI matching.', icon: Target },
    { title: 'AI Matching', desc: 'Run the matching engine to find optimal volunteer-task pairs based on our scoring algorithm.', icon: Sparkles },
    { title: 'Analytics & Reports', desc: 'Access dashboards for task status, urgency distribution, skill coverage, and weekly trends.', icon: BarChart3 },
    { title: 'Real-Time Updates', desc: 'Socket.io powered notifications for task assignments, completions, and new volunteer registrations.', icon: Zap },
  ];
  return (
    <PageShell>
      <SectionHero icon={BookOpen} title="Documentation" subtitle="Everything you need to get started with NGO Hub." />
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          {sections.map(s => (
            <motion.div key={s.title} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="flex gap-4 p-5 rounded-xl bg-white border border-gray-100 hover:shadow-md transition">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                <s.icon className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{s.title}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </PageShell>
  );
}

export function APIReference() {
  const endpoints = [
    { method: 'GET', path: '/api/volunteers', desc: 'List all volunteers' },
    { method: 'POST', path: '/api/volunteers', desc: 'Create a volunteer' },
    { method: 'GET', path: '/api/tasks', desc: 'List all tasks (sorted by urgency)' },
    { method: 'POST', path: '/api/tasks', desc: 'Create a task' },
    { method: 'GET', path: '/api/match/:taskId', desc: 'Get top 3 volunteer matches for a task' },
    { method: 'POST', path: '/api/tasks/:taskId/assign', desc: 'Assign volunteer to task' },
    { method: 'POST', path: '/api/tasks/:taskId/complete', desc: 'Mark task as completed' },
    { method: 'GET', path: '/api/stats', desc: 'Get platform statistics' },
    { method: 'POST', path: '/api/ai/summary', desc: 'Get AI-powered analysis (Gemini)' },
    { method: 'GET', path: '/api/feedback', desc: 'List all feedback entries' },
    { method: 'POST', path: '/api/seed', desc: 'Seed database with demo data' },
    { method: 'GET', path: '/api/health', desc: 'Health check endpoint' },
  ];
  const methodColors = { GET: 'bg-emerald-100 text-emerald-700', POST: 'bg-blue-100 text-blue-700', PUT: 'bg-amber-100 text-amber-700' };
  return (
    <PageShell>
      <SectionHero icon={Code2} title="API Reference" subtitle="RESTful API endpoints for integrating with NGO Hub." color="blue" />
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-white">
              <p className="text-sm font-mono text-gray-500">Base URL: <span className="text-gray-900 font-semibold">https://your-server.com/api</span></p>
            </div>
            <div className="divide-y divide-gray-200">
              {endpoints.map(e => (
                <div key={e.path + e.method} className="flex items-center gap-4 px-4 py-3 hover:bg-white transition">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${methodColors[e.method]}`}>{e.method}</span>
                  <code className="text-sm font-mono text-gray-900 flex-1">{e.path}</code>
                  <span className="text-sm text-gray-400">{e.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

export function Blog() {
  const posts = [
    { title: 'How AI Transforms Volunteer Coordination', date: 'Apr 25, 2026', tag: 'AI', desc: 'Explore how machine learning and smart algorithms are revolutionizing how NGOs match volunteers to tasks.' },
    { title: 'Building Resilient Communities Through Data', date: 'Apr 18, 2026', tag: 'Impact', desc: 'Data-driven approaches to community building and disaster response coordination.' },
    { title: 'The Future of Social Impact Technology', date: 'Apr 10, 2026', tag: 'Technology', desc: 'Emerging trends in NGO tech: from real-time dashboards to predictive resource allocation.' },
    { title: 'Volunteer Retention: What the Numbers Tell Us', date: 'Apr 02, 2026', tag: 'Research', desc: 'Insights from analyzing 10,000+ volunteer engagements on what keeps volunteers coming back.' },
    { title: 'Smart Matching: Skill + Proximity + Availability', date: 'Mar 28, 2026', tag: 'Feature', desc: 'Deep dive into our scoring algorithm: how we calculate the best volunteer-task matches.' },
    { title: 'Launching NGO Hub: Our Mission & Vision', date: 'Mar 20, 2026', tag: 'Company', desc: 'Why we built NGO Hub and our vision for the future of volunteer coordination technology.' },
  ];
  const tagColors = { AI: 'bg-violet-100 text-violet-700', Impact: 'bg-emerald-100 text-emerald-700', Technology: 'bg-blue-100 text-blue-700', Research: 'bg-amber-100 text-amber-700', Feature: 'bg-rose-100 text-rose-700', Company: 'bg-gray-100 text-gray-700' };
  return (
    <PageShell>
      <SectionHero icon={FileText} title="Blog" subtitle="Insights, updates, and stories from the NGO Hub team." />
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          {posts.map(p => (
            <motion.article key={p.title} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="p-6 rounded-2xl bg-white border border-gray-100 hover:shadow-lg transition cursor-pointer">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tagColors[p.tag]}`}>{p.tag}</span>
                <span className="text-xs text-gray-400">{p.date}</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900">{p.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{p.desc}</p>
            </motion.article>
          ))}
        </div>
      </section>
    </PageShell>
  );
}

export function Community() {
  return (
    <PageShell>
      <SectionHero icon={MessageCircle} title="Community" subtitle="Connect with volunteers, organizers, and NGO leaders worldwide." />
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100">
              <h3 className="font-bold text-gray-900 mb-2">Discussion Forum</h3>
              <p className="text-sm text-gray-500 mb-4">Share experiences, ask questions, and learn from other organizations using NGO Hub.</p>
              <p className="text-xs text-emerald-600 font-medium">2,400+ active members</p>
            </div>
            <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100">
              <h3 className="font-bold text-gray-900 mb-2">Monthly Meetups</h3>
              <p className="text-sm text-gray-500 mb-4">Join our virtual meetups to network, share best practices, and hear from industry experts.</p>
              <p className="text-xs text-blue-600 font-medium">Next: May 15, 2026</p>
            </div>
            <div className="p-6 rounded-2xl bg-violet-50 border border-violet-100">
              <h3 className="font-bold text-gray-900 mb-2">Open Source</h3>
              <p className="text-sm text-gray-500 mb-4">Contribute to NGO Hub on GitHub. We welcome PRs, bug reports, and feature suggestions.</p>
              <p className="text-xs text-violet-600 font-medium">github.com/krishnashahane/hack2skill-google-hackathon</p>
            </div>
            <div className="p-6 rounded-2xl bg-amber-50 border border-amber-100">
              <h3 className="font-bold text-gray-900 mb-2">Volunteer Stories</h3>
              <p className="text-sm text-gray-500 mb-4">Read inspiring stories from volunteers who have made a real impact through NGO Hub.</p>
              <p className="text-xs text-amber-600 font-medium">100+ stories shared</p>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

export function About() {
  return (
    <PageShell>
      <SectionHero icon={Heart} title="About NGO Hub" subtitle="Smart Resource Allocation for Social Impact." />
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 space-y-8">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Our Mission</h2>
            <p className="text-gray-500 leading-relaxed">NGO Hub empowers non-profit organizations to coordinate volunteers efficiently using AI-powered matching. We believe technology can bridge the gap between willing volunteers and the communities that need them most.</p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">How We Started</h2>
            <p className="text-gray-500 leading-relaxed">Built during a hackathon by Team Rising Lion (Krishna Shahane & Aditya Makurwar), NGO Hub was born from the real-world challenge of coordinating disaster relief volunteers in Mumbai. Manual processes caused delays; our AI matching engine eliminates them.</p>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-3">Technology</h2>
            <p className="text-gray-500 leading-relaxed">React + Vite frontend, Express.js backend, Google Gemini AI integration, Haversine-based proximity matching, Socket.io real-time updates, and Recharts analytics. Deployed on Vercel for instant global access.</p>
          </div>
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100">
            <h3 className="font-bold text-gray-900 mb-2">Team Rising Lion</h3>
            <div className="grid sm:grid-cols-2 gap-4 mt-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">KS</div>
                <div>
                  <p className="font-semibold text-gray-900">Krishna Shahane</p>
                  <p className="text-xs text-gray-500">Full-Stack Developer</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">AM</div>
                <div>
                  <p className="font-semibold text-gray-900">Aditya Makurwar</p>
                  <p className="text-xs text-gray-500">Product & Design</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

export function Careers() {
  const roles = [
    { title: 'Full-Stack Developer', type: 'Remote', desc: 'Build and scale our volunteer coordination platform.' },
    { title: 'ML Engineer', type: 'Remote', desc: 'Improve our matching algorithm and build predictive models.' },
    { title: 'Community Manager', type: 'Hybrid', desc: 'Grow our community of volunteers and organizations.' },
    { title: 'Product Designer', type: 'Remote', desc: 'Design intuitive experiences for NGOs and volunteers.' },
  ];
  return (
    <PageShell>
      <SectionHero icon={Briefcase} title="Careers" subtitle="Join us in building technology for social impact." color="blue" />
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 space-y-4">
          {roles.map(r => (
            <div key={r.title} className="p-5 rounded-2xl bg-white border border-gray-100 hover:shadow-md transition flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900">{r.title}</h3>
                <p className="text-sm text-gray-500 mt-0.5">{r.desc}</p>
              </div>
              <span className="text-xs font-medium bg-blue-50 text-blue-600 px-3 py-1 rounded-full flex-shrink-0">{r.type}</span>
            </div>
          ))}
          <p className="text-center text-sm text-gray-400 pt-6">Send your resume to <span className="font-medium text-gray-700">careers@ngohub.org</span></p>
        </div>
      </section>
    </PageShell>
  );
}

export function Privacy() {
  return (
    <PageShell>
      <SectionHero icon={Shield} title="Privacy Policy" subtitle="How we collect, use, and protect your data." />
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 prose prose-gray prose-sm">
          <div className="space-y-6 text-gray-500 text-sm leading-relaxed">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Data Collection</h3>
              <p>We collect only the information necessary to provide our volunteer coordination service: name, email, skills, location, and availability. All data is stored securely and encrypted in transit.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">How We Use Your Data</h3>
              <p>Your data is used exclusively for volunteer-task matching, analytics, and platform improvement. We never sell your data to third parties.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Location Data</h3>
              <p>Location data is used for proximity-based matching. You control whether to share your location. We use the Haversine formula for distance calculations without storing continuous location tracking.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">AI Processing</h3>
              <p>When using our AI assistant (powered by Google Gemini), your queries and anonymized platform data may be processed by Google's API. No personally identifiable information is sent to external AI services.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Your Rights</h3>
              <p>You can request data deletion, export your data, or modify your information at any time through your profile settings or by contacting us.</p>
            </div>
            <p className="text-xs text-gray-400">Last updated: April 29, 2026</p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

export function Terms() {
  return (
    <PageShell>
      <SectionHero icon={Scale} title="Terms of Service" subtitle="Terms governing your use of NGO Hub." />
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <div className="space-y-6 text-gray-500 text-sm leading-relaxed">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Acceptance of Terms</h3>
              <p>By accessing NGO Hub, you agree to these terms. If you represent an organization, you confirm authority to bind that organization.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Account Responsibilities</h3>
              <p>You are responsible for maintaining the security of your account credentials. Provide accurate information in your profile to ensure optimal matching.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Acceptable Use</h3>
              <p>NGO Hub is for legitimate volunteer coordination. Do not use the platform for spam, fraud, or any activity that harms the community.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Intellectual Property</h3>
              <p>NGO Hub's matching algorithms, UI design, and platform code are protected. The platform is open source under the MIT license for educational and non-commercial use.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Limitation of Liability</h3>
              <p>NGO Hub provides tools for coordination but does not guarantee volunteer availability or task outcomes. Organizations remain responsible for their operations.</p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Changes to Terms</h3>
              <p>We may update these terms. Continued use after changes constitutes acceptance. Material changes will be notified via email.</p>
            </div>
            <p className="text-xs text-gray-400">Last updated: April 29, 2026</p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

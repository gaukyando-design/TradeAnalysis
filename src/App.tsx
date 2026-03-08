import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  ChevronRight, 
  Menu, 
  X, 
  LogOut, 
  User, 
  BarChart3, 
  Globe, 
  Lock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- Utility ---
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Types ---
interface UserData {
  email: string;
  subscription_type: 'none' | 'weekly' | 'monthly' | 'trial';
  subscription_expiry: string | null;
  has_used_trial: number;
}

interface AnalysisResult {
  direction: 'Bullish' | 'Bearish' | 'Neutral';
  entry: string;
  tp: string;
  sl: string;
  reasoning: string;
  symbol: string;
}

// --- Components ---

const Navbar = ({ user, onLogout }: { user: UserData | null, onLogout: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
              <TrendingUp className="text-zinc-950 w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">TradeVision <span className="text-emerald-500">AI</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/#pricing" className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors">Pricing</Link>
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/dashboard" className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors">Dashboard</Link>
                <div className="h-4 w-px bg-zinc-800" />
                <button onClick={onLogout} className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-red-400 transition-colors">
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors">Login</Link>
                <Link to="/signup" className="btn-primary py-2 px-4 text-sm">Get Started</Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2 text-zinc-400" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-16 left-0 right-0 bg-zinc-900 border-b border-zinc-800 p-4 flex flex-col gap-4"
          >
            <Link to="/#pricing" onClick={() => setIsOpen(false)} className="text-lg font-medium">Pricing</Link>
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setIsOpen(false)} className="text-lg font-medium">Dashboard</Link>
                <button onClick={() => { onLogout(); setIsOpen(false); }} className="text-lg font-medium text-red-400 flex items-center gap-2">
                  <LogOut className="w-5 h-5" /> Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)} className="text-lg font-medium">Login</Link>
                <Link to="/signup" onClick={() => setIsOpen(false)} className="btn-primary text-center">Get Started</Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => (
  <section className="pt-32 pb-20 px-4">
    <div className="max-w-4xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-6"
      >
        <Zap className="w-3 h-3" />
        AI-Powered Market Intelligence
      </motion.div>
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
      >
        Trade with the <span className="gradient-text">Precision</span> of AI
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto"
      >
        Get institutional-grade market analysis, precise entry points, and risk management levels for Forex, Stocks, and Indices.
      </motion.p>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-4 justify-center items-center"
      >
        <Link to="/signup" className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto">
          Start Your Analysis <ChevronRight className="w-4 h-4" />
        </Link>
        <div className="flex gap-3">
          <a href="#" className="transition-transform hover:scale-105 active:scale-95">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" 
              alt="Download on App Store" 
              className="h-10"
              referrerPolicy="no-referrer"
            />
          </a>
          <a href="#" className="transition-transform hover:scale-105 active:scale-95">
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
              alt="Get it on Google Play" 
              className="h-10"
              referrerPolicy="no-referrer"
            />
          </a>
        </div>
      </motion.div>
    </div>
  </section>
);

const Features = () => {
  const features = [
    { icon: Globe, title: "Global Market Data", desc: "Analysis based on real-time global economic data and news." },
    { icon: BarChart3, title: "Precise Levels", desc: "Get exact Entry, Take Profit, and Stop Loss for every trade." },
    { icon: ShieldCheck, title: "Risk Management", desc: "AI-calculated risk levels to protect your capital." },
  ];

  return (
    <section className="py-20 px-4 bg-zinc-900/30">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
        {features.map((f, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card p-8 hover:border-emerald-500/30 transition-colors"
          >
            <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-6">
              <f.icon className="text-emerald-500 w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">{f.title}</h3>
            <p className="text-zinc-400 leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const MobileApp = () => (
  <section className="py-20 px-4">
    <div className="max-w-7xl mx-auto glass-card p-12 overflow-hidden relative">
      <div className="grid md:grid-cols-2 items-center gap-12">
        <div>
          <h2 className="text-4xl font-bold mb-6">Trade Anywhere, <span className="gradient-text">Anytime</span></h2>
          <p className="text-zinc-400 text-lg mb-8">
            Download our mobile app to receive instant trade alerts and analysis directly on your smartphone. Stay ahead of the market even when you're on the move.
          </p>
          <div className="flex flex-wrap gap-4">
            <a href="#" className="transition-transform hover:scale-105 active:scale-95">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" 
                alt="Download on App Store" 
                className="h-12"
                referrerPolicy="no-referrer"
              />
            </a>
            <a href="#" className="transition-transform hover:scale-105 active:scale-95">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
                alt="Get it on Google Play" 
                className="h-12"
                referrerPolicy="no-referrer"
              />
            </a>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-4 bg-emerald-500/20 blur-3xl rounded-full" />
          <div className="relative bg-zinc-950 border border-zinc-800 rounded-[3rem] p-4 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
            <div className="bg-zinc-900 rounded-[2.5rem] aspect-[9/19] flex flex-col items-center justify-center p-6 text-center">
              <TrendingUp className="w-12 h-12 text-emerald-500 mb-4" />
              <div className="w-full h-2 bg-zinc-800 rounded-full mb-2" />
              <div className="w-2/3 h-2 bg-zinc-800 rounded-full mb-8" />
              <div className="w-full space-y-3">
                <div className="h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl" />
                <div className="h-12 bg-zinc-800 rounded-xl" />
                <div className="h-12 bg-zinc-800 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Pricing = ({ onSubscribe, onTrial, hasUsedTrial }: { onSubscribe: (plan: 'weekly' | 'monthly') => void, onTrial: () => void, hasUsedTrial: boolean }) => {
  const plans = [
    { name: "Weekly Pro", price: "29", period: "week", features: ["Full Market Analysis", "Forex & Indices", "Precise Entry/TP/SL", "24/7 AI Support"] },
    { name: "Monthly Elite", price: "89", period: "month", features: ["Everything in Weekly", "Stock Market Analysis", "Priority AI Processing", "Advanced Risk Metrics", "Save 25% Yearly"], popular: true },
  ];

  return (
    <section id="pricing" className="py-20 px-4">
      <div className="max-w-7xl mx-auto text-center mb-16">
        <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
        <p className="text-zinc-400 mb-8">Choose the plan that fits your trading style.</p>
        {!hasUsedTrial && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-block bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 mb-12"
          >
            <h3 className="text-xl font-bold text-emerald-400 mb-2">New to TradeVision?</h3>
            <p className="text-zinc-400 mb-4">Get 24 hours of full access to test our AI signals for free.</p>
            <button onClick={onTrial} className="btn-primary py-2 px-8">Start 24h Free Trial</button>
          </motion.div>
        )}
      </div>
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        {plans.map((p, i) => (
          <div key={i} className={cn(
            "glass-card p-8 flex flex-col relative overflow-hidden",
            p.popular && "border-emerald-500/50 ring-1 ring-emerald-500/50"
          )}>
            {p.popular && (
              <div className="absolute top-4 right-[-35px] bg-emerald-500 text-zinc-950 text-[10px] font-bold py-1 px-10 rotate-45">
                POPULAR
              </div>
            )}
            <h3 className="text-2xl font-bold mb-2">{p.name}</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold">${p.price}</span>
              <span className="text-zinc-400">/{p.period}</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              {p.features.map((f, fi) => (
                <li key={fi} className="flex items-center gap-3 text-zinc-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <button 
              onClick={() => onSubscribe(p.period as 'weekly' | 'monthly')}
              className={cn("w-full py-3 rounded-xl font-bold transition-all", p.popular ? "bg-emerald-500 text-zinc-950 hover:bg-emerald-600" : "bg-zinc-800 text-zinc-100 hover:bg-zinc-700")}
            >
              Subscribe Now
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

const AuthForm = ({ type, onSubmit }: { type: 'login' | 'signup', onSubmit: (data: any) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/auth/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      onSubmit(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center">{type === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Email Address</label>
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Password</label>
            <input 
              type="password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="••••••••"
            />
          </div>
          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4" /> {error}
            </div>
          )}
          <button disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (type === 'login' ? 'Sign In' : 'Sign Up')}
          </button>
        </form>
        <p className="mt-6 text-center text-zinc-400 text-sm">
          {type === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
          <Link to={type === 'login' ? '/signup' : '/login'} className="text-emerald-500 hover:underline font-medium">
            {type === 'login' ? 'Sign Up' : 'Sign In'}
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

const Dashboard = ({ user, onSubscribe, onTrial }: { user: UserData, onSubscribe: (plan: 'weekly' | 'monthly') => void, onTrial: () => void }) => {
  const [symbol, setSymbol] = useState('EURUSD');
  const [marketType, setMarketType] = useState('Forex');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAnalysis = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/market/analyze', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ symbol, marketType }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAnalysis(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isSubscribed = user.subscription_type !== 'none' && (!user.subscription_expiry || new Date(user.subscription_expiry) > new Date());

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Market Dashboard</h1>
            <p className="text-zinc-400">Welcome back, {user.email}</p>
          </div>
          <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 rounded-xl p-3">
            <div className={cn("w-3 h-3 rounded-full", isSubscribed ? "bg-emerald-500" : "bg-red-500")} />
            <span className="text-sm font-medium">
              {isSubscribed ? `${user.subscription_type.toUpperCase()} ACTIVE` : "NO ACTIVE SUBSCRIPTION"}
            </span>
          </div>
        </div>

        {!isSubscribed ? (
          <div className="glass-card p-12 text-center max-w-2xl mx-auto">
            <Lock className="w-12 h-12 text-zinc-500 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-4">Subscription Required</h2>
            <p className="text-zinc-400 mb-8">You need an active subscription to access AI-powered market analysis and trade signals.</p>
            <div className="flex flex-col gap-6 items-center">
              {!user.has_used_trial && (
                <button onClick={onTrial} className="btn-primary w-full sm:w-auto px-12">Activate 24h Free Trial</button>
              )}
              <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
                <button onClick={() => onSubscribe('weekly')} className="btn-secondary flex-1">Weekly - $29</button>
                <button onClick={() => onSubscribe('monthly')} className="btn-secondary flex-1">Monthly - $89</button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Controls */}
            <div className="lg:col-span-1 space-y-6">
              <div className="glass-card p-6">
                <h3 className="text-lg font-bold mb-4">Analysis Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Market Type</label>
                    <select 
                      value={marketType}
                      onChange={(e) => setMarketType(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500"
                    >
                      <option>Forex</option>
                      <option>Indices</option>
                      <option>Stocks</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Symbol</label>
                    <input 
                      type="text"
                      value={symbol}
                      onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500"
                      placeholder="e.g. EURUSD, NAS100, AAPL"
                    />
                  </div>
                  <button 
                    onClick={fetchAnalysis}
                    disabled={loading}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Generate Analysis"}
                  </button>
                  {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="lg:col-span-2">
              {analysis ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card overflow-hidden"
                >
                  <div className="p-6 border-b border-zinc-800 flex justify-between items-center">
                    <div>
                      <h3 className="text-2xl font-bold">{analysis.symbol}</h3>
                      <p className="text-zinc-400 text-sm">{marketType} Analysis</p>
                    </div>
                    <div className={cn(
                      "px-4 py-1 rounded-full text-xs font-bold uppercase",
                      analysis.direction === 'Bullish' ? "bg-emerald-500/10 text-emerald-500" : 
                      analysis.direction === 'Bearish' ? "bg-red-500/10 text-red-500" : "bg-zinc-500/10 text-zinc-500"
                    )}>
                      {analysis.direction}
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-zinc-800">
                    <div className="p-6">
                      <p className="text-xs font-bold text-zinc-500 uppercase mb-2">Entry Price</p>
                      <p className="text-2xl font-mono font-bold text-emerald-400">{analysis.entry}</p>
                    </div>
                    <div className="p-6">
                      <p className="text-xs font-bold text-zinc-500 uppercase mb-2">Take Profit</p>
                      <p className="text-2xl font-mono font-bold text-cyan-400">{analysis.tp}</p>
                    </div>
                    <div className="p-6">
                      <p className="text-xs font-bold text-zinc-500 uppercase mb-2">Stop Loss</p>
                      <p className="text-2xl font-mono font-bold text-red-400">{analysis.sl}</p>
                    </div>
                  </div>
                  <div className="p-6 bg-zinc-900/50">
                    <h4 className="text-sm font-bold text-zinc-300 mb-3 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-emerald-500" />
                      AI Reasoning & Outlook
                    </h4>
                    <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap">
                      {analysis.reasoning}
                    </p>
                  </div>
                </motion.div>
              ) : (
                <div className="glass-card h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8">
                  <BarChart3 className="w-16 h-16 text-zinc-800 mb-4" />
                  <h3 className="text-xl font-bold mb-2">No Analysis Generated</h3>
                  <p className="text-zinc-500 max-w-sm">Select a symbol and click "Generate Analysis" to get AI-powered trade insights.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('/api/user/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          localStorage.removeItem('token');
          setUser(null);
        } else {
          setUser(data);
        }
      })
      .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleAuth = (data: any) => {
    localStorage.setItem('token', data.token);
    setUser(data.user);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const handleSubscribe = async (plan: 'weekly' | 'monthly') => {
    if (!user) {
      window.location.href = '/signup';
      return;
    }

    const paymentUrl = plan === 'weekly' 
      ? import.meta.env.VITE_WEEKLY_PAYMENT_URL 
      : import.meta.env.VITE_MONTHLY_PAYMENT_URL;

    if (paymentUrl && paymentUrl !== "https://buy.stripe.com/your-weekly-link" && paymentUrl !== "https://buy.stripe.com/your-monthly-link") {
      // Open payment link in new tab
      window.open(paymentUrl, '_blank');
      
      // Show confirmation dialog
      const confirmed = window.confirm(`You've been redirected to the ${plan} payment page. Once you've completed the payment, click OK to activate your subscription. (Note: In production, this would be handled automatically via webhooks)`);
      
      if (!confirmed) return;
    }

    try {
      const res = await fetch('/api/user/subscribe', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser({ ...user, subscription_type: data.plan, subscription_expiry: data.expiry });
        alert(`Successfully subscribed to ${plan} plan!`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTrial = async () => {
    if (!user) {
      window.location.href = '/signup';
      return;
    }

    try {
      const res = await fetch('/api/user/trial', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setUser({ ...user, subscription_type: 'trial', subscription_expiry: data.expiry, has_used_trial: 1 });
        alert("Free trial activated! You have 24 hours of full access.");
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-zinc-950 text-zinc-100">
        <Navbar user={user} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={
            <main>
              <Hero />
              <Features />
              <MobileApp />
              <Pricing onSubscribe={handleSubscribe} onTrial={handleTrial} hasUsedTrial={user?.has_used_trial === 1} />
            </main>
          } />
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <AuthForm type="login" onSubmit={handleAuth} />} />
          <Route path="/signup" element={user ? <Navigate to="/dashboard" /> : <AuthForm type="signup" onSubmit={handleAuth} />} />
          <Route path="/dashboard" element={user ? <Dashboard user={user} onSubscribe={handleSubscribe} onTrial={handleTrial} /> : <Navigate to="/login" />} />
        </Routes>
        
        <footer className="py-12 border-t border-zinc-900 bg-zinc-950">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <TrendingUp className="text-emerald-500 w-6 h-6" />
              <span className="text-lg font-bold">TradeVision AI</span>
            </div>
            <div className="flex justify-center gap-4 mb-8">
              <a href="#" className="opacity-60 hover:opacity-100 transition-opacity">
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg" alt="App Store" className="h-8" referrerPolicy="no-referrer" />
              </a>
              <a href="#" className="opacity-60 hover:opacity-100 transition-opacity">
                <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Play Store" className="h-8" referrerPolicy="no-referrer" />
              </a>
            </div>
            <p className="text-zinc-500 text-sm mb-4">© 2026 TradeVision AI. All rights reserved.</p>
            <p className="text-zinc-600 text-[10px] max-w-2xl mx-auto uppercase tracking-widest leading-relaxed">
              Trading involves significant risk. Our AI analysis is for informational purposes only and does not constitute financial advice. Always trade responsibly.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

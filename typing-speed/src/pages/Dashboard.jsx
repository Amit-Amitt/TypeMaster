import { useState, useEffect } from "react";
import axios from "axios";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { 
  Trophy, 
  History, 
  TrendingUp, 
  Target, 
  Zap, 
  Calendar,
  ChevronRight,
  Medal,
  Award
} from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [results, setResults] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const [resultsRes, userRes] = await Promise.all([
        axios.get("http://localhost:5000/api/results/my-results", {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setResults(resultsRes.data);
      setUser(userRes.data.user);
    } catch (err) {
      console.error("Failed to fetch dashboard data", err);
    } finally {
      setIsLoading(false);
    }
  };

  const stats = {
    bestWpm: user?.bestWpm || (results.length > 0 ? Math.max(...results.map(r => r.speed)) : 0),
    avgAccuracy: user?.avgAccuracy || (results.length > 0 ? Math.round(results.reduce((acc, curr) => acc + curr.accuracy, 0) / results.length) : 0),
    totalTests: user?.totalTests || results.length,
    recentWpm: results.length > 0 ? results[0].speed : 0,
    streak: user?.streak || 0,
    xp: user?.xp || 0,
    level: user?.level || 1
  };

  const chartData = [...results].reverse().map((r, i) => ({
    name: `Test ${i + 1}`,
    wpm: r.speed,
    accuracy: r.accuracy
  }));

  if (isLoading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center bg-bg-main">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-text-muted font-medium animate-pulse">Syncing performance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-bg-main selection:bg-primary/30">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <div className="flex items-center gap-3 text-primary font-bold text-sm mb-4 uppercase tracking-[0.2em]">
              <div className="w-8 h-px bg-primary/30"></div>
              Performance Portfolio
            </div>
            <h1 className="text-5xl font-black text-text-main mb-2 tracking-tight">
              Hello, {user?.name || "Trailblazer"}
            </h1>
            <div className="flex items-center gap-6 mt-4">
               <div className="flex flex-col">
                  <span className="text-text-muted text-[10px] font-black uppercase tracking-widest mb-1">Rank Status</span>
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1 bg-primary rounded-lg text-text-main font-black text-xs">Level {stats.level}</div>
                    <span className="text-text-main font-bold text-sm">{stats.xp % 1000} / 1000 XP</span>
                  </div>
                  <div className="w-48 h-1.5 bg-bg-main/50 rounded-full mt-2 overflow-hidden border border-white/5">
                    <div className="h-full bg-primary" style={{ width: `${(stats.xp % 1000) / 10}%` }}></div>
                  </div>
               </div>
               <div className="h-10 w-px bg-bg-main/50 hidden md:block"></div>
               <div className="flex flex-col">
                  <span className="text-text-muted text-[10px] font-black uppercase tracking-widest mb-1">Activity Streak</span>
                  <div className="flex items-center gap-2 text-orange-500 font-black">
                    <Zap size={18} fill="currentColor" />
                    <span>{stats.streak} Days</span>
                  </div>
               </div>
            </div>
          </div>
          <Button onClick={() => window.location.href = "/test"}>
            Start New Test Session
            <ChevronRight className="ml-2" size={18} />
          </Button>
        </header>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: "Personal Best", val: `${stats.bestWpm} WPM`, icon: <Trophy />, color: "text-amber-500", bg: "bg-amber-500/10" },
            { label: "Avg Accuracy", val: `${stats.avgAccuracy}%`, icon: <Target />, color: "text-emerald-500", bg: "bg-emerald-500/10" },
            { label: "Total Sessions", val: stats.totalTests, icon: <History />, color: "text-primary", bg: "bg-primary/10" },
            { label: "Global Ranking", val: stats.level > 5 ? "Elite" : "Novice", icon: <Medal />, color: "text-indigo-400", bg: "bg-indigo-400/10" },
          ].map((stat, i) => (
            <Card key={i} className="bg-bg-card border-border-subtle relative overflow-hidden group">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110 duration-500`}>
                  {stat.icon}
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest text-text-muted/60 bg-bg-main/50 px-2 py-1 rounded">Metrics</div>
              </div>
              <div className="text-text-muted text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</div>
              <div className="text-4xl font-black text-text-main">{stat.val}</div>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Main Chart */}
          <Card className="lg:col-span-2 bg-bg-card border-border-subtle p-8 min-h-[450px]">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-2xl font-black text-text-main flex items-center gap-3">
                <Zap className="text-primary" /> Velocity Trends
              </h3>
              <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-primary"></div> Speed</div>
                <div className="flex items-center gap-1.5 text-text-muted"><div className="w-2 h-2 rounded-full bg-text-muted/20"></div> Accuracy</div>
              </div>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorWpm" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} cursor="pointer" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '12px' }}
                    itemStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="wpm" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorWpm)" />
                  <Line type="monotone" dataKey="accuracy" stroke="rgba(255,255,255,0.2)" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Achievements / Ranking */}
          <Card className="bg-gradient-to-br from-indigo-500/10 to-transparent border-white/5 p-8">
            <h3 className="text-2xl font-black text-text-main flex items-center gap-3 mb-8">
               <Award className="text-amber-500" /> Milestone Tracking
            </h3>
            
            <div className="space-y-6">
              {[
                { title: "The Apprentice", goal: 20, current: stats.bestWpm, icon: "🧘" },
                { title: "Rapid Professional", goal: 40, current: stats.bestWpm, icon: "🔥" },
                { title: "Master Class", goal: 60, current: stats.bestWpm, icon: "⚡" },
                { title: "Elite Velocity", goal: 80, current: stats.bestWpm, icon: "✨" },
              ].map((m, i) => (
                <div key={i} className={`p-4 rounded-2xl border transition-all ${m.current >= m.goal ? 'bg-emerald-500/10 border-emerald-500/20 shadow-lg shadow-emerald-500/5' : 'bg-bg-main/50 border-border-subtle grayscale opacity-40'}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                       <span className="text-2xl">{m.icon}</span>
                       <span className="font-bold text-sm text-text-main">{m.title}</span>
                    </div>
                    <span className="text-[10px] font-black uppercase text-text-muted">Goal: {m.goal} WPM</span>
                  </div>
                  <div className="h-1.5 bg-bg-main shadow-inner border border-border-subtle">
                    <div 
                      className={`h-full transition-all duration-1000 ${m.current >= m.goal ? 'bg-emerald-500' : 'bg-primary'}`}
                      style={{ width: `${Math.min(100, (m.current / m.goal) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* History Table */}
        <Card className="bg-bg-card border-border-subtle p-8 overflow-hidden">
          <h3 className="text-2xl font-black text-text-main flex items-center gap-3 mb-8">
            <History className="text-text-muted" /> Session History
          </h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 text-text-muted text-xs font-bold uppercase tracking-widest">
                  <th className="pb-4 pl-4">Date</th>
                  <th className="pb-4">Velocity</th>
                  <th className="pb-4">Precision</th>
                  <th className="pb-4">Duration</th>
                  <th className="pb-4 text-right pr-4">Trend</th>
                </tr>
              </thead>
              <tbody className="text-text-main/90">
                {results.length > 0 ? results.map((r, i) => (
                  <tr key={i} className="group hover:bg-bg-main/50 border-border-subtle">
                    <td className="py-5 pl-4 flex items-center gap-3">
                       <div className="bg-white/5 p-2 rounded-lg text-text-muted">
                         <Calendar size={14} />
                       </div>
                       <span className="font-semibold text-sm">{new Date(r.createdAt).toLocaleDateString()}</span>
                    </td>
                    <td className="py-5 font-black text-text-main text-lg">{r.speed} <span className="text-xs text-text-muted">WPM</span></td>
                    <td className="py-5">
                       <div className="flex items-center gap-3">
                          <span className="font-bold">{r.accuracy}%</span>
                          <div className="h-1 w-12 bg-bg-main/50 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: `${r.accuracy}%` }}></div>
                          </div>
                       </div>
                    </td>
                    <td className="py-5 text-text-muted font-medium">{r.timeTaken}s</td>
                    <td className="py-5 text-right pr-4">
                       <div className={`inline-flex p-1.5 rounded-full ${r.speed >= results[i+1]?.speed || i === results.length-1 ? 'text-emerald-500 bg-emerald-500/10' : 'text-rose-500 bg-rose-500/10'}`}>
                          <Medal size={16} />
                       </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="py-20 text-center text-text-muted font-medium italic">
                       No training sessions recorded yet. Start your first test to see analytics.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

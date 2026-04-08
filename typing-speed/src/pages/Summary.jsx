import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Trophy, 
  RotateCcw, 
  BarChart2, 
  Target, 
  Clock, 
  Share2, 
  Award,
  Zap,
  ChevronRight,
  TrendingUp,
  AlertTriangle
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { toPng } from "html-to-image";
import { useRef } from "react";

export default function Summary() {
  const location = useLocation();
  const navigate = useNavigate();
  const summaryRef = useRef(null);
  
  const { result, updates } = location.state || {};

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-main">
        <Button onClick={() => navigate("/test")}>Back toArena</Button>
      </div>
    );
  }

  const exportImage = () => {
    if (summaryRef.current === null) return;
    toPng(summaryRef.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = 'typemaster-result.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => console.log(err));
  };

  const performance = result.speed > 80 ? "Grandmaster" : result.speed > 50 ? "Specialist" : "Practitioner";

  return (
    <div className="min-h-screen bg-bg-main pt-32 pb-20 selection:bg-primary/30">
      <div className="container mx-auto px-6 max-w-5xl" ref={summaryRef}>
        {/* Header Summary */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-4 mb-4">
               <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-amber-500">
                 <Trophy size={32} />
               </div>
               <div>
                 <h1 className="text-4xl font-black text-text-main">Session Analysis</h1>
                 <p className="text-text-muted font-medium">Exceptional performance in {result.difficulty} mode.</p>
               </div>
            </div>
          </motion.div>

          {updates?.leveledUp && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-primary px-6 py-3 rounded-2xl shadow-xl shadow-primary/20 text-text-main font-black flex items-center gap-3 animate-bounce"
            >
              <Award size={24} />
              LEVEL UP: {updates.currentLevel}
            </motion.div>
          )}
        </div>

        {/* Big Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
           {[
             { label: "WPM", val: result.speed, icon: <Zap size={16} />, color: "text-primary" },
             { label: "Accuracy", val: `${result.accuracy}%`, icon: <Target size={16} />, color: "text-emerald-400" },
             { label: "XP Gained", val: `+${updates?.gainedXp || 0}`, icon: <TrendingUp size={16} />, color: "text-indigo-400" },
             { label: "Duration", val: `${result.timeTaken}s`, icon: <Clock size={16} />, color: "text-text-muted" },
           ].map((stat, i) => (
             <Card key={i} className="bg-bg-card border-border-subtle shadow-lg">
                <div className="flex items-center gap-2 text-text-muted text-[10px] font-black uppercase tracking-widest mb-2">
                  {stat.icon} {stat.label}
                </div>
                <div className={`text-4xl font-black ${stat.color}`}>{stat.val}</div>
             </Card>
           ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
           {/* Chart */}
           <Card className="lg:col-span-2 bg-bg-card border-border-subtle shadow-xl h-[400px]">
              <h3 className="text-xl font-bold text-text-main mb-8 flex items-center gap-3">
                <BarChart2 className="text-primary" size={20} /> Velocity Timeline
              </h3>
              <div className="h-full w-full">
                <ResponsiveContainer width="100%" height="80%">
                  <AreaChart data={result.wpmHistory}>
                    <defs>
                      <linearGradient id="colorWpm" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="time" stroke="#475569" fontSize={12} cursor="pointer" />
                    <YAxis stroke="#475569" fontSize={12} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}
                      itemStyle={{ color: 'var(--text-main)' }}
                    />
                    <Area type="monotone" dataKey="wpm" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorWpm)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
           </Card>

           {/* Weak Keys */}
           <Card className="bg-bg-card border-border-subtle shadow-xl overflow-hidden relative">
              <h3 className="text-xl font-bold text-text-main mb-8 flex items-center gap-3">
                <AlertTriangle className="text-rose-500" size={20} /> Weak Keys
              </h3>
              <div className="space-y-4">
                {Object.entries(result.weakKeys).length > 0 ? (
                  Object.entries(result.weakKeys).map(([key, count], i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-bg-main/50 border border-border-subtle transition-all hover:bg-bg-main/70">
                      <div className="flex items-center gap-4">
                        <span className="w-8 h-8 flex items-center justify-center bg-primary/20 text-primary border border-primary/20 shadow-sm rounded-lg font-bold uppercase">{key}</span>
                        <span className="text-text-muted text-sm">Mistyped {count} times</span>
                      </div>
                      <div className="w-12 h-1 bg-rose-500/20 rounded-full overflow-hidden">
                        <div className="h-full bg-rose-500" style={{ width: `${Math.min(100, count * 20)}%` }}></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center">
                    <Zap className="mx-auto text-emerald-500 mb-4" size={32} />
                    <p className="text-text-muted font-medium italic">Perfect session! No weak keys detected.</p>
                  </div>
                )}
              </div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-rose-500/5 blur-3xl"></div>
           </Card>
        </div>

        {/* Global Achievements Earned */}
        {updates?.newAchievements?.length > 0 && (
          <div className="mt-12">
            <h3 className="text-lg font-black text-text-muted uppercase tracking-widest mb-6 px-1">Unlocked Milestones</h3>
            <div className="grid md:grid-cols-3 gap-4">
               {updates.newAchievements.map((ach, i) => (
                 <motion.div 
                    key={i}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-5 bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/20 rounded-2xl flex items-center gap-4"
                 >
                    <div className="p-3 bg-amber-500 rounded-xl text-text-main">
                      <Award size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-text-main">{ach.title}</h4>
                      <p className="text-xs text-amber-500 font-medium">{ach.description}</p>
                    </div>
                 </motion.div>
               ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-16 flex flex-wrap gap-6 justify-center">
           <Button className="px-10" size="lg" onClick={() => navigate("/test")}>
             <RotateCcw className="mr-3" /> Practice Again
           </Button>
           <Button variant="secondary" className="px-10" size="lg" onClick={exportImage}>
             <Share2 className="mr-3" /> Save Share Card
           </Button>
           <Button variant="ghost" className="text-text-muted hover:text-text-main transition-colors" onClick={() => navigate("/dashboard")}>
             View Full History <ChevronRight className="ml-2" />
           </Button>
        </div>
      </div>
    </div>
  );
}

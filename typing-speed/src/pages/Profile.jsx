import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  MapPin, 
  Calendar, 
  Edit3, 
  Check, 
  Award, 
  Zap, 
  Target,
  BarChart,
  ShieldCheck,
  Smartphone,
  Info
} from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

const KEYBOARD_LAYOUT = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m"]
];

export default function Profile() {
  const [user, setUser] = useState(null);
  const [results, setResults] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      const [userRes, resultsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/auth/me", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("http://localhost:5000/api/results/my-results", { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setUser(userRes.data.user);
      setBio(userRes.data.user.bio || "");
      setResults(resultsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateBio = async () => {
    // Mock update logic for now or implement if backend supports it
    // user.bio = bio; 
    setIsEditing(false);
  };

  // Aggregate mistakes across all results for the heatmap
  const mistakeCounts = results.reduce((acc, curr) => {
    if (curr.weakKeys) {
      Object.entries(curr.weakKeys).forEach(([key, count]) => {
        acc[key.toLowerCase()] = (acc[key.toLowerCase()] || 0) + count;
      });
    }
    return acc;
  }, {});

  const getHeatColor = (count) => {
    if (!count) return "bg-bg-main/50 border-border-subtle";
    if (count < 5) return "bg-rose-500/20";
    if (count < 10) return "bg-rose-500/40";
    if (count < 20) return "bg-rose-500/60";
    return "bg-rose-500 border-rose-400";
  };

  if (isLoading) return <div className="min-h-screen bg-bg-main" />;

  return (
    <div className="min-h-screen bg-bg-main pt-32 pb-20 selection:bg-primary/30">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid lg:grid-cols-4 gap-8">
           {/* Sidebar: Profile Info */}
           <div className="lg:col-span-1 space-y-6">
              <Card className="bg-bg-card border-border-subtle shadow-lg">
                 <div className="relative inline-block mb-6">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-primary to-indigo-400 p-1">
                       <div className="w-full h-full rounded-full bg-bg-main flex items-center justify-center text-4xl font-black text-text-main border-4 border-bg-main">
                          {user.name.charAt(0).toUpperCase()}
                       </div>
                    </div>
                    <div className="absolute bottom-1 right-1 p-2 bg-emerald-500 rounded-full border-4 border-bg-main shadow-lg text-text-main">
                       <ShieldCheck size={16} />
                    </div>
                 </div>
                 <h2 className="text-2xl font-black text-text-main mb-1">{user.name}</h2>
                 <p className="text-text-muted text-sm font-medium mb-6">{user.email}</p>
                 
                 <div className="text-left space-y-4 pt-6 bg-bg-main/50 border-border-subtle">
                    <div className="flex items-center gap-3 text-text-muted text-sm italic">
                       {isEditing ? (
                         <textarea 
                           className="w-full bg-bg-main/50 border border-border-subtle rounded-xl p-3 text-text-main text-sm focus:border-primary outline-none"
                           value={bio}
                           onChange={(e) => setBio(e.target.value)}
                           placeholder="Write a short bio..."
                         />
                       ) : (
                         <p>"{bio || "No bio set yet. Click edit to add personality!"}"</p>
                       )}
                    </div>
                    <Button 
                      variant="ghost" 
                      className="w-full border border-white/5 bg-white/5 text-xs font-black uppercase tracking-widest py-3"
                      onClick={() => isEditing ? handleUpdateBio() : setIsEditing(true)}
                    >
                       {isEditing ? <><Check size={14} className="mr-2" /> Save Profile</> : <><Edit3 size={14} className="mr-2" /> Edit Bio</>}
                    </Button>
                 </div>
              </Card>

              <Card className="bg-bg-card border-border-subtle shadow-sm">
                 <h3 className="text-xs font-black uppercase tracking-[0.2em] text-text-muted mb-6 flex items-center gap-2">
                    <Info size={14} /> Quick Stats
                 </h3>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center">
                       <span className="text-text-muted text-sm">Best Speed</span>
                       <span className="text-text-main font-bold">{user.bestWpm} WPM</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-text-muted text-sm">Avg Accuracy</span>
                       <span className="text-text-main font-bold">{user.avgAccuracy}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-text-muted text-sm">XP Points</span>
                       <span className="text-text-main font-bold">{user.xp}</span>
                    </div>
                    <div className="flex justify-between items-center">
                       <span className="text-text-muted text-sm">Rank</span>
                       <span className="text-primary font-black uppercase text-xs">Level {user.level}</span>
                    </div>
                 </div>
              </Card>
           </div>

           {/* Main Content: Heatmap & Achievements */}
           <div className="lg:col-span-3 space-y-8">
              {/* Heatmap */}
              <Card className="bg-bg-card border-border-subtle shadow-xl">
                 <div className="flex items-center justify-between mb-10">
                    <div>
                       <h3 className="text-2xl font-black text-text-main flex items-center gap-3">
                          <BarChart className="text-rose-500" /> Accuracy Heatmap
                       </h3>
                       <p className="text-text-muted text-sm mt-1">Visualizing letters frequent in your performance gaps.</p>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="flex items-center gap-1.5 text-xs text-text-muted">
                          <div className="w-3 h-3 bg-slate-800 rounded"></div> Good
                       </div>
                       <div className="flex items-center gap-1.5 text-xs text-text-muted">
                          <div className="w-3 h-3 bg-rose-500 rounded"></div> Critical
                       </div>
                    </div>
                 </div>

                 <div className="space-y-3 max-w-2xl mx-auto">
                    {KEYBOARD_LAYOUT.map((row, i) => (
                      <div key={i} className="flex justify-center gap-2">
                        {row.map(key => {
                          const count = mistakeCounts[key] || 0;
                          return (
                            <div 
                              key={key}
                              className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl border border-white/5 text-text-main font-black uppercase text-sm transition-all hover:scale-110 cursor-help ${getHeatColor(count)}`}
                              title={`${count} mistakes on '${key}'`}
                            >
                              {key}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                 </div>
                 <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/5 blur-[100px] -z-10"></div>
              </Card>

              {/* Achievements Showcase */}
              <div className="grid md:grid-cols-2 gap-8">
                 <Card className="bg-bg-card border-border-subtle shadow-lg">
                    <h3 className="text-xl font-black text-text-main flex items-center gap-3 mb-8">
                       <Award className="text-amber-500" /> Milestones Earned
                    </h3>
                    <div className="space-y-4">
                       {user.achievements?.length > 0 ? user.achievements.map((ach, i) => (
                         <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                            <div className="p-3 bg-amber-500/20 text-amber-500 rounded-xl">
                               <Award size={20} />
                            </div>
                            <div>
                               <h4 className="font-bold text-text-main text-sm">{ach.title}</h4>
                               <p className="text-[10px] text-text-muted font-medium uppercase">{new Date(ach.unlockedAt).toLocaleDateString()}</p>
                            </div>
                         </div>
                       )) : (
                         <div className="py-10 text-center text-text-muted italic">No achievements unlocked yet. Keep training!</div>
                       )}
                    </div>
                 </Card>

                 <Card className="bg-bg-card border-border-subtle shadow-lg">
                    <h3 className="text-xl font-black text-text-main flex items-center gap-3 mb-8">
                       <Zap className="text-orange-500" /> Active Progress
                    </h3>
                    <div className="space-y-8">
                       <div className="space-y-3">
                          <div className="flex justify-between text-xs font-black uppercase tracking-widest text-text-muted">
                             <span>Skill Mastery</span>
                             <span className="text-text-main">{Math.round((user.level / 10) * 100)}%</span>
                          </div>
                          <div className="h-2 bg-bg-main shadow-inner border border-border-subtle">
                             <div className="h-full bg-primary" style={{ width: `${Math.min(100, (user.level / 10) * 100)}%` }}></div>
                          </div>
                       </div>
                       
                       <div className="space-y-3">
                          <div className="flex justify-between text-xs font-black uppercase tracking-widest text-text-muted">
                             <span>Streak Consistency</span>
                             <span className="text-text-main">{Math.round((user.streak / 7) * 100)}%</span>
                          </div>
                          <div className="h-2 bg-bg-main shadow-inner border border-border-subtle">
                             <div className="h-full bg-orange-500" style={{ width: `${Math.min(100, (user.streak / 7) * 100)}%` }}></div>
                          </div>
                          <p className="text-[10px] text-text-muted font-medium italic">Current Streak: {user.streak} days. Target: 7 days.</p>
                       </div>
                    </div>
                 </Card>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

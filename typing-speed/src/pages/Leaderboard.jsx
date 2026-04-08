import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Trophy, 
  Target, 
  Zap, 
  Calendar, 
  Globe, 
  ChevronRight,
  TrendingUp,
  Medal,
  Award,
  Filter
} from "lucide-react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";

export default function Leaderboard() {
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("all-time");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [filter]);

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/results/leaderboard?filter=${filter}`);
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch leaderboard", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getRankBadge = (rank) => {
    if (rank === 0) return <Medal className="text-amber-400" size={24} />;
    if (rank === 1) return <Medal className="text-text-muted" size={24} />;
    if (rank === 2) return <Medal className="text-amber-700" size={24} />;
    return <span className="text-text-muted font-bold">{rank + 1}</span>;
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-bg-main selection:bg-primary/30">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <header className="mb-12 text-center">
            <motion.div 
               initial={{ opacity: 0, y: -10 }}
               animate={{ opacity: 1, y: 0 }}
               className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-bg-main/50 border border-border-subtle text-primary text-xs font-black uppercase tracking-widest mb-6"
            >
               <Globe size={14} />
               Global Rankings
            </motion.div>
            <h1 className="text-5xl font-black text-text-main mb-4 tracking-tight">World of Velocities</h1>
            <p className="text-text-muted text-lg">Comparing the fastest typists across the community.</p>
        </header>

        {/* Filter Toggle */}
        <div className="flex justify-center mb-12">
           <div className="bg-bg-main/50 p-1.5 rounded-2xl flex items-center gap-1 border border-border-subtle shadow-inner">
              {[
                { id: "all-time", label: "Peak Performance", icon: <Award size={14} /> },
                { id: "weekly", label: "Weekly Trending", icon: <TrendingUp size={14} /> }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${
                    filter === f.id ? "bg-primary text-text-main shadow-lg" : "text-text-muted hover:text-text-main"
                  }`}
                >
                  {f.icon}
                  {f.label}
                </button>
              ))}
           </div>
        </div>

        {/* Leaderboard Table */}
        <Card className="bg-bg-card border-border-subtle shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-bg-main/50 border-b border-border-subtle text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">
                  <th className="py-5 pl-8 uppercase">Rank</th>
                  <th className="py-5">Typist</th>
                  <th className="py-5">Velocity</th>
                  <th className="py-5">Precision</th>
                  <th className="py-5 hidden md:table-cell text-right pr-8">Date</th>
                </tr>
              </thead>
              <tbody className="text-text-main/90">
                <AnimatePresence mode="wait">
                  {isLoading ? (
                    <tr>
                      <td colSpan="5" className="py-32 text-center">
                        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-text-muted font-medium">Calculating global statistics...</p>
                      </td>
                    </tr>
                  ) : data.length > 0 ? data.map((entry, i) => (
                    <motion.tr 
                      key={entry._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`group hover:bg-bg-main/50 border-b last:border-0 border-border-subtle transition-colors cursor-default`}
                    >
                      <td className="py-6 pl-8">
                         <div className="flex items-center justify-center w-10 h-10 bg-bg-main/50 rounded-xl border border-border-subtle group-hover:border-primary/20 transition-all">
                            {getRankBadge(i)}
                         </div>
                      </td>
                      <td className="py-6">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black border border-primary/10">
                              {entry.name.charAt(0).toUpperCase()}
                           </div>
                           <div>
                             <p className="font-bold text-text-main group-hover:text-primary transition-colors">{entry.name}</p>
                             <p className="text-[10px] text-text-muted font-medium uppercase tracking-widest">{i < 3 ? "Elite Rank" : "Challenger"}</p>
                           </div>
                        </div>
                      </td>
                      <td className="py-6">
                        <div className="flex items-center gap-2">
                           <Zap size={14} className="text-primary" />
                           <span className="text-2xl font-black text-text-main">{entry.speed}</span>
                           <span className="text-xs text-text-muted font-bold">WPM</span>
                        </div>
                      </td>
                      <td className="py-6">
                        <div className="flex items-center gap-3">
                           <Target size={14} className="text-emerald-500" />
                           <span className="font-bold">{entry.accuracy}%</span>
                        </div>
                      </td>
                      <td className="py-6 hidden md:table-cell text-right pr-8">
                        <span className="text-xs text-text-muted font-medium font-mono">{new Date(entry.createdAt).toLocaleDateString()}</span>
                      </td>
                    </motion.tr>
                  )) : (
                    <tr>
                      <td colSpan="5" className="py-32 text-center text-text-muted italic">No records found for this period. Be the first!</td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </Card>

        {/* Footer CTA */}
        <div className="mt-12 text-center text-text-muted font-medium text-sm flex flex-col items-center gap-4">
           <p>Ready to climb the ranks?</p>
           <Button variant="outline" className="px-8 border-white/10 text-text-muted hover:text-text-main" onClick={() => window.location.href="/test"}>
             Start Session <ChevronRight className="ml-2" size={16} />
           </Button>
        </div>
      </div>
    </div>
  );
}

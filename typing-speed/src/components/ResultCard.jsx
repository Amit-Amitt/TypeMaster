import { useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Save, RotateCcw, BarChart, Target, AlertCircle, Clock, ChevronRight, Share2 } from "lucide-react";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import confetti from "canvas-confetti";

export default function ResultCard({
  name,
  speed,
  accuracy,
  mistakes,
  timeTaken,
  performance,
  onSave,
  onLeaderboard,
  onRestart,
}) {
  useEffect(() => {
    if (speed >= 30) {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min, max) => Math.random() * (max - min) + min;

      const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);
    }
  }, [speed]);

  const container = {
    hidden: { opacity: 0, y: 50 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        type: "spring",
        stiffness: 100
      }
    }
  };

  const item = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="fixed inset-0 z-[60] flex items-center justify-center p-6 bg-bg-main/95 backdrop-blur-md overflow-y-auto"
    >
      <Card className="w-full max-w-2xl bg-bg-card p-0 border-border-subtle shadow-2xl shadow-primary/10 overflow-hidden">
        {/* Header Decal */}
        <div className="h-2 bg-gradient-to-r from-primary via-indigo-400 to-violet-500"></div>
        
        <div className="p-10">
          <motion.div variants={item} className="flex justify-center mb-8">
            <div className="relative">
               <div className="absolute inset-0 bg-amber-500 blur-2xl opacity-20 animate-pulse"></div>
               <div className="relative bg-amber-500/10 p-5 rounded-3xl border border-amber-500/20">
                 <Trophy size={56} className="text-amber-500" />
               </div>
            </div>
          </motion.div>
          
          <div className="text-center mb-10">
            <motion.h2 variants={item} className="text-4xl font-black text-text-main mb-3">Great Session!</motion.h2>
            <motion.p variants={item} className="text-text-muted font-medium">Session analysis for {name}</motion.p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              { label: "Velocity", val: `${speed} WPM`, icon: <BarChart size={16} />, color: "text-primary" },
              { label: "Accuracy", val: `${accuracy}%`, icon: <Target size={16} />, color: "text-emerald-400" },
              { label: "Errors", val: mistakes, icon: <AlertCircle size={16} />, color: "text-rose-400" },
              { label: "Duration", val: `${timeTaken}s`, icon: <Clock size={16} />, color: "text-text-muted" },
            ].map((stat, i) => (
              <motion.div key={i} variants={item} className="bg-bg-main/50 border border-border-subtle p-5 rounded-2xl group hover:border-primary/20 transition-all">
                <div className="flex items-center gap-2 text-text-muted text-xs font-bold uppercase tracking-widest mb-3">
                  {stat.icon} {stat.label}
                </div>
                <div className={`text-2xl font-black ${stat.color}`}>{stat.val}</div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            variants={item}
            className="mb-10 p-6 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-between"
          >
            <div>
              <span className="text-xs uppercase tracking-widest text-text-muted font-bold block mb-1">Rank Status</span>
              <div className="text-2xl font-black text-primary">{performance}</div>
            </div>
            <div className="hidden sm:block">
               <Button variant="ghost" size="sm" className="bg-white/5">
                 <Share2 size={16} className="mr-2" /> Share Result
               </Button>
            </div>
          </motion.div>

          <motion.div variants={item} className="flex flex-col sm:flex-row gap-4">
            <Button className="flex-1 shadow-lg" onClick={onSave} size="lg">
              <Save size={20} className="mr-2" /> Save to Cloud
            </Button>
            <Button variant="secondary" className="flex-1" onClick={onRestart} size="lg">
              <RotateCcw size={20} className="mr-2" /> Restart Practice
            </Button>
          </motion.div>

          <motion.button 
            variants={item}
            onClick={onLeaderboard}
            className="w-full mt-6 text-text-muted hover:text-text-main text-sm font-bold flex items-center justify-center gap-2 transition-colors py-2"
          >
            <BarChart size={16} /> View Global Leaderboard <ChevronRight size={16} />
          </motion.button>
        </div>
      </Card>
    </motion.div>
  );
}
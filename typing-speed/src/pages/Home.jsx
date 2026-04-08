import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Zap, Target, Trophy, ChevronRight, Activity, Keyboard, Sparkles } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

export default function Home() {
  const navigate = useNavigate();

  const features = [
    {
      title: "Gamified Progress",
      desc: "Earn XP, unlock achievements, and climb through 100 levels from Beginner to Supersonic Master.",
      icon: <Sparkles className="text-primary" size={24} />,
      gradient: "from-indigo-500/20 to-blue-500/20",
    },
    {
      title: "Global Competitive Play",
      desc: "Compare your peak velocities with the world on our real-time global and weekly leaderboards.",
      icon: <Trophy className="text-amber-500" size={24} />,
      gradient: "from-amber-500/20 to-orange-500/20",
    },
    {
      title: "AI Precision Heatmap",
      desc: "Our analytics engine tracks every mistyped key to visualize your growth gaps and weak spots.",
      icon: <Zap className="text-rose-500" size={24} />,
      gradient: "from-rose-500/20 to-rose-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-bg-main selection:bg-primary/30 selection:text-text-main">
      {/* Hero Section */}
      <section className="relative pt-40 pb-24 lg:pt-56 lg:pb-40 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-bg-main/50 border border-border-subtle text-primary text-sm font-semibold mb-8 backdrop-blur-sm shadow-sm">
              <Sparkles size={16} />
              <span>The Next Generation of Typing Practice</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-text-main mb-8 leading-[1.1]">
              Improve Your <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-400 to-violet-500">
                Typing Speed.
              </span>
            </h1>
            
            <p className="max-w-3xl mx-auto text-lg sm:text-xl text-text-muted mb-12 leading-relaxed">
              Master the art of high-velocity typing with our clean, distraction-free environment. 
              Track your growth, analyze your mistakes, and reach elite speeds.
            </p>

            <div className="flex flex-wrap justify-center gap-6">
              <Button size="lg" onClick={() => navigate("/test")}>
                Start Training Now
                <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="secondary" size="lg" onClick={() => navigate("/signup")}>
                Create Free Account
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Dynamic Background Elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/20 blur-[120px] rounded-full opacity-30 -z-10 animate-pulse"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/10 blur-[100px] rounded-full -z-10"></div>
        <div className="absolute top-1/2 -left-24 w-96 h-96 bg-violet-500/10 blur-[100px] rounded-full -z-10"></div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-bg-card border-t border-border-subtle">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4 text-text-main">Engineered for Performance</h2>
            <p className="text-text-muted text-lg">Every feature built to help you type faster and smarter.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <Card key={i} hover className="border-border-subtle bg-bg-main/50">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-8 border border-white/10 shadow-inner`}>
                  {f.icon}
                </div>
                <h3 className="text-2xl font-bold text-text-main mb-4">{f.title}</h3>
                <p className="text-text-muted leading-relaxed text-lg">
                  {f.desc}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 overflow-hidden relative">
        <div className="container mx-auto px-6 text-center">
          <Card className="max-w-5xl mx-auto py-20 bg-gradient-to-br from-primary/10 via-bg-card to-bg-card border-primary/20 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black text-text-main mb-6">Ready to reach 100+ WPM?</h2>
              <p className="text-text-muted text-xl mb-12 max-w-2xl mx-auto">
                Join thousands of students and professionals sharpening their typing skills daily.
              </p>
              <Button size="lg" onClick={() => navigate("/signup")} className="px-12">
                Get Started for Free
              </Button>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-3xl -z-0"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 blur-3xl -z-0"></div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-border-subtle bg-bg-card">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between h-minus items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-1.5 rounded-lg">
                <Keyboard size={20} className="text-text-main" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-text-main">
                Type<span className="text-primary">Master</span> Pro
              </span>
            </div>
            
            <div className="flex gap-10">
              {["Product", "Features", "Company", "Terms"].map((l) => (
                <a key={l} href="#" className="text-text-muted/80 hover:text-primary transition-colors font-medium">
                  {l}
                </a>
              ))}
            </div>

            <p className="text-text-muted/60 italic">
              Built for speed. Optimized for growth.
            </p>
          </div>
          <div className="mt-12 text-center text-text-muted/40 text-xs border-t border-border-subtle pt-8">
            © {new Date().getFullYear()} TypeMaster Pro. Designed for professional typists.
          </div>
        </div>
      </footer>
    </div>
  );
}

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Palette, Type, Check, Monitor, Sparkles } from "lucide-react";
import { Button } from "./ui/Button";

const THEMES = [
  { id: "indigo", color: "#6366f1", label: "Midnight Indigo" },
  { id: "emerald", color: "#10b981", label: "Forest Emerald" },
  { id: "rose", color: "#f43f5e", label: "Velvet Rose" },
  { id: "amber", color: "#f59e0b", label: "Solar Amber" },
];

const FONTS = [
  { id: "sans", label: "Inter (Modern Sans)" },
  { id: "mono", label: "IBM Plex (Technical Mono)" },
  { id: "serif", label: "Georgia (Classic Serif)" },
];

export default function SettingsModal({ isOpen, onClose }) {
  const [theme, setInternalTheme] = useState(localStorage.getItem("app-theme") || "indigo");
  const [font, setInternalFont] = useState(localStorage.getItem("app-font") || "sans");
  const [mode, setInternalMode] = useState(localStorage.getItem("app-mode") || "dark");

  const setTheme = (newTheme) => {
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("app-theme", newTheme);
    setInternalTheme(newTheme);
  };

  const setFont = (newFont) => {
    document.documentElement.setAttribute("data-font", newFont);
    localStorage.setItem("app-font", newFont);
    setInternalFont(newFont);
  };

  const setMode = (newMode) => {
    document.documentElement.setAttribute("data-mode", newMode);
    localStorage.setItem("app-mode", newMode);
    setInternalMode(newMode);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-md bg-bg-card border border-border-subtle rounded-[2rem] overflow-hidden shadow-2xl relative z-10"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                 <h2 className="text-2xl font-black text-text-main flex items-center gap-3">
                   <Palette size={24} className="text-primary" /> Visual Identity
                 </h2>
                 <button onClick={onClose} className="p-2 text-text-muted hover:text-text-main transition-colors">
                   <X size={20} />
                 </button>
              </div>

              <div className="space-y-8 max-h-[60vh] overflow-y-auto no-scrollbar pr-2">
                 {/* Mode Selection */}
                 <div>
                    <label className="text-xs font-black uppercase tracking-widest text-text-muted mb-4 block">Theme Mode</label>
                    <div className="grid grid-cols-2 gap-3">
                       {[
                         { id: "dark", label: "Midnight", icon: <Monitor size={14} /> },
                         { id: "light", label: "Daylight", icon: <Sparkles size={14} /> }
                       ].map((m) => (
                         <button
                           key={m.id}
                           onClick={() => setMode(m.id)}
                           className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                             mode === m.id ? 'bg-primary/20 border-primary shadow-lg shadow-primary/10' : 'bg-bg-main/50 border-border-subtle hover:border-text-muted/30'
                           }`}
                         >
                            <div className={`p-1.5 rounded-lg ${mode === m.id ? 'bg-primary text-text-main' : 'bg-bg-main text-text-muted'}`}>
                               {m.icon}
                            </div>
                            <span className={`text-sm font-bold ${mode === m.id ? 'text-text-main' : 'text-text-muted'}`}>{m.label}</span>
                         </button>
                       ))}
                    </div>
                 </div>

                 {/* Theme Selection */}
                 <div>
                    <label className="text-xs font-black uppercase tracking-widest text-text-muted mb-4 block">Primary Hue</label>
                    <div className="grid grid-cols-2 gap-3">
                       {THEMES.map((t) => (
                         <button
                           key={t.id}
                           onClick={() => setTheme(t.id)}
                           className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                             theme === t.id ? 'bg-primary/20 border-primary shadow-lg shadow-primary/10' : 'bg-bg-main/50 border-border-subtle hover:border-text-muted/30'
                           }`}
                         >
                            <div className="w-6 h-6 rounded-full" style={{ backgroundColor: t.color }}></div>
                            <span className={`text-sm font-bold ${theme === t.id ? 'text-text-main' : 'text-text-muted'}`}>{t.label}</span>
                         </button>
                       ))}
                    </div>
                 </div>

                 {/* Font Selection */}
                 <div>
                    <label className="text-xs font-black uppercase tracking-widest text-text-muted mb-4 block">Typography System</label>
                    <div className="space-y-2">
                       {FONTS.map((f) => (
                         <button
                           key={f.id}
                           onClick={() => setFont(f.id)}
                           className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all ${
                             font === f.id ? 'bg-primary/20 border-primary shadow-lg shadow-primary/10' : 'bg-bg-main/50 border-border-subtle hover:border-text-muted/30'
                           }`}
                         >
                            <span className={`text-sm font-bold ${font === f.id ? 'text-text-main' : 'text-text-muted'}`}>{f.label}</span>
                            {font === f.id && <Check size={16} className="text-primary" />}
                         </button>
                       ))}
                    </div>
                 </div>
              </div>

              <div className="mt-10">
                 <Button className="w-full py-4 rounded-2xl shadow-xl shadow-primary/20" onClick={onClose}>
                   Confirm Aesthetics
                 </Button>
              </div>
            </div>
            
            <div className="p-4 bg-bg-main/50 border-t border-border-subtle text-center">
               <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                 <Monitor size={12} /> Syncs with cloud profile
               </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

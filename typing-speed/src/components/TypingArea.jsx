import { motion } from "framer-motion";
import { Keyboard, MousePointer2 } from "lucide-react";

export default function TypingArea({ input, handleTyping, disabled, isActive }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative w-full max-w-4xl mx-auto group transition-all duration-500 ${
        isActive ? "scale-[1.02]" : "scale-100 opacity-80"
      }`}
    >
      <div className="absolute -top-12 left-0 right-0 flex justify-between items-center px-2">
        <div className="flex items-center gap-2 text-text-muted text-sm font-medium">
          <Keyboard size={16} />
          <span>Interactive Buffer</span>
        </div>
        {!disabled && !isActive && (
          <motion.div 
            animate={{ x: [0, 5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex items-center gap-2 text-primary text-sm font-bold bg-primary/10 px-3 py-1 rounded-full border border-primary/20"
          >
            <MousePointer2 size={14} />
            <span>Click to start typing</span>
          </motion.div>
        )}
      </div>

      <div className={`relative p-8 rounded-3xl border-2 transition-all duration-500 ${
        isActive 
          ? "bg-bg-card border-primary/40 shadow-2xl shadow-primary/10" 
          : "bg-bg-main/50 border-border-subtle shadow-none"
      }`}>
        <textarea
          rows="6"
          value={input}
          onChange={(e) => handleTyping(e.target.value)}
          placeholder="Select difficulty and begin typing above..."
          disabled={disabled}
          className="w-full bg-transparent text-text-main text-2xl md:text-3xl leading-relaxed outline-none resize-none placeholder:text-text-muted/30 font-sans tracking-wide"
          spellCheck="false"
          autoFocus={isActive}
        />
        
        {/* Animated Decor */}
        <div className="absolute bottom-4 right-8 flex items-center gap-4 opacity-40">
           <div className="flex items-center gap-1.5 text-xs text-text-muted">
             <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-bg-main'}`}></div>
             <span>System Ready</span>
           </div>
        </div>
      </div>
    </motion.div>
  );
}
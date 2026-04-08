import { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Zap, 
  Clock, 
  Target, 
  RotateCcw,
  Medal,
  ChevronRight,
  Maximize2,
  Minimize2,
  Settings2,
  Keyboard,
  Volume2,
  VolumeX
} from "lucide-react";
import { Howl } from "howler";
import TypingArea from "../components/TypingArea";
import ResultCard from "../components/ResultCard";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { useNavigate } from "react-router-dom";

// Standard typing sounds
const clickSound = new Howl({
  src: ["https://typing-speed-test.com/sounds/click.mp3"],
  volume: 0.5
});

const paragraphs = {
  easy: [
    "The sun set behind the mountains, casting a warm orange glow across the valley while birds sang their final songs."
  ],
  medium: [
    "Efficient algorithms are fundamental to modern computing, enabling software to process vast amounts of data within milliseconds."
  ],
  hard: [
    "Quantum entanglement, a phenomenon where particles become interconnected regardless of distance, challenges our classical understanding of physics; however, it remains a cornerstone of future communication."
  ]
};

function Test() {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState("easy");
  const [timeLimit, setTimeLimit] = useState(30);
  const [paragraph, setParagraph] = useState("");
  const [input, setInput] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  
  // Advanced Analytics State
  const [stats, setStats] = useState({
    wpm: 0,
    accuracy: 0,
    mistakes: 0,
    rawWpm: 0,
    charactersTyped: 0
  });

  const [weakKeys, setWeakKeys] = useState({});
  const [wpmHistory, setWpmHistory] = useState([]);
  const [lastWpmSnapshot, setLastWpmSnapshot] = useState(0);

  useEffect(() => {
    generateParagraph(difficulty);
  }, [difficulty]);

  useEffect(() => {
    setTimeLeft(timeLimit);
    setStarted(false);
    setFinished(false);
    setInput("");
    setWpmHistory([]);
    setWeakKeys({});
    setStats({ wpm: 0, accuracy: 0, mistakes: 0, rawWpm: 0, charactersTyped: 0 });
  }, [timeLimit, difficulty]);

  // Snapshot timer for WPM trends
  useEffect(() => {
    let snapshotTimer;
    if (started && !finished) {
      snapshotTimer = setInterval(() => {
        setWpmHistory(prev => [
          ...prev, 
          { time: timeLimit - timeLeft, wpm: stats.wpm }
        ]);
      }, 1000);
    }
    return () => clearInterval(snapshotTimer);
  }, [started, finished, timeLeft, stats.wpm]);

  useEffect(() => {
    let timer;
    if (started && timeLeft > 0 && !finished) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [started, finished]);

  const generateParagraph = (level) => {
    const selected = paragraphs[level];
    const randomPara = selected[Math.floor(Math.random() * selected.length)];
    setParagraph(randomPara);
  };

  const handleTyping = (value) => {
    if (finished) return;
    if (!started) setStarted(true);
    
    // Key click sound
    if (isSoundEnabled && value.length > input.length) {
      clickSound.play();
    }

    // Track mistakes per key
    if (value.length > input.length) {
        const lastChar = value[value.length - 1];
        const targetChar = paragraph[value.length - 1];
        if (lastChar !== targetChar) {
            setWeakKeys(prev => ({
                ...prev,
                [targetChar]: (prev[targetChar] || 0) + 1
            }));
        }
    }

    setInput(value);
    
    // Stats calculation
    let correctChars = 0;
    for (let i = 0; i < value.length; i++) {
        if (value[i] === paragraph[i]) {
            correctChars++;
        }
    }

    const timeElapsedInMinutes = (timeLimit - timeLeft) / 60 || 0.01;
    const wordsTyped = (value.length / 5); // Standard WPM calc
    const wpm = Math.max(0, Math.round(wordsTyped / timeElapsedInMinutes));
    const rawWpm = Math.max(0, Math.round((value.length / 5) / timeElapsedInMinutes));
    const accuracy = value.length > 0 ? Math.max(0, Math.min(100, Math.round((correctChars / value.length) * 100))) : 0;
    const mistakes = value.length - correctChars;

    setStats({ wpm, accuracy, mistakes, rawWpm, charactersTyped: value.length });
  };

  const saveResult = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/results/save", // Matches updated server.js
        {
          speed: stats.wpm,
          accuracy: stats.accuracy,
          timeTaken: timeLimit,
          rawWpm: stats.rawWpm,
          charactersTyped: stats.charactersTyped,
          weakKeys,
          wpmHistory,
          difficulty,
          mode: "time"
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Navigate to summary page with result data
      navigate("/summary", { state: { result: res.data.result, updates: res.data.updates } });
    } catch (error) {
      console.error(error);
      alert("❌ Authentication required to save results.");
    }
  };

  const restartTest = () => {
    setInput("");
    setStarted(false);
    setFinished(false);
    setTimeLeft(timeLimit);
    setWpmHistory([]);
    setWeakKeys({});
    setStats({ wpm: 0, accuracy: 0, mistakes: 0, rawWpm: 0, charactersTyped: 0 });
    generateParagraph(difficulty);
  };

  return (
    <div className={`min-h-screen bg-bg-main selection:bg-primary/30 pt-24 ${isFocusMode ? "cursor-none" : "transition-all duration-700"}`}>
      <div className="fixed top-0 left-0 w-full h-[500px] bg-primary/5 blur-[120px] -z-10 rounded-full"></div>
      
      <div className="container mx-auto px-6 max-w-6xl pb-20 relative z-10">
        <AnimatePresence>
          {!isFocusMode && (
            <motion.header 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: -0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6"
            >
              <div>
                <h1 className="text-4xl font-black text-text-main mb-2 flex items-center gap-3">
                  <Medal className="text-primary" /> Training Arena
                </h1>
                <p className="text-text-muted">Precision and velocity training powered by AI analytics.</p>
              </div>
              
              <div className="flex items-center gap-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsSoundEnabled(!isSoundEnabled)}
                  className="border border-border-subtle bg-bg-main/50"
                >
                  {isSoundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsFocusMode(true)}
                  className="border border-border-subtle bg-bg-main/50"
                >
                  <Maximize2 size={16} className="mr-2" /> Focus Mode
                </Button>
                <Button variant="ghost" size="sm" onClick={restartTest} className="border border-border-subtle bg-bg-main/50">
                  <RotateCcw size={16} className="mr-2" /> Restart
                </Button>
              </div>
            </motion.header>
          )}
        </AnimatePresence>

        {/* Focus Mode Tooltip */}
        {isFocusMode && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-bg-card/80 border border-border-subtle px-6 py-3 rounded-full backdrop-blur-xl z-[100]"
          >
            <span className="text-text-muted text-sm font-medium italic">Extreme focus mode active. Hit ESC to exit.</span>
            <div className="h-4 w-px bg-white/10"></div>
            <button onClick={() => setIsFocusMode(false)} className="text-primary font-bold text-sm hover:underline">Exit Mode</button>
          </motion.div>
        )}

        <div className={`transition-all duration-500 ${isFocusMode ? "mt-24" : "mt-0"}`}>
            {/* Configuration Bar */}
            <motion.div 
            layout
            className={`glass rounded-3xl p-2 mb-10 border-border-subtle flex flex-wrap items-center justify-between gap-4 relative z-50`}
            >
            <div className="flex items-center gap-1.5 p-1.5 bg-bg-main/50 rounded-2xl border border-border-subtle">
                {["easy", "medium", "hard"].map((l) => (
                <button
                    key={l}
                    onClick={() => setDifficulty(l)}
                    className={`px-5 py-2 rounded-xl text-sm font-black transition-all uppercase tracking-widest ${
                    difficulty === l ? "bg-primary text-text-main shadow-lg shadow-primary/20" : "text-text-muted hover:text-slate-300"
                    }`}
                >
                    {l}
                </button>
                ))}
            </div>

            <div className="flex items-center gap-1.5 p-1.5 bg-bg-main/50 rounded-2xl border border-border-subtle">
                {[30, 60, 120].map((s) => (
                <button
                    key={s}
                    onClick={() => setTimeLimit(s)}
                    className={`px-5 py-2 rounded-xl text-sm font-black transition-all ${
                    timeLimit === s ? "bg-primary/20 text-primary border border-primary/10 shadow-inner" : "text-text-muted hover:text-slate-300"
                    }`}
                >
                    {s}s
                </button>
                ))}
            </div>
            </motion.div>

            {/* Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
                { label: "Precision", val: `${stats.accuracy}%`, icon: <Target size={16} />, color: "text-emerald-400" },
                { label: "Net Velocity", val: stats.wpm, icon: <Zap size={16} />, color: "text-primary" },
                { label: "Countdown", val: `${timeLeft}s`, icon: <Clock size={16} />, color: timeLeft < 10 ? "text-rose-500" : "text-text-muted" },
                { label: "Raw WPM", val: stats.rawWpm, icon: <Keyboard size={16} />, color: "text-text-muted" },
            ].map((stat, i) => (
                <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-3xl p-6 border-border-subtle relative overflow-hidden group hover:border-primary/30"
                >
                <div className="flex items-center gap-3 text-text-muted text-xs font-bold uppercase tracking-widest mb-3">
                    {stat.icon} {stat.label}
                </div>
                <div className={`text-4xl font-black ${stat.color} transition-transform group-hover:scale-105 duration-500`}>{stat.val}</div>
                {stat.label === "Countdown" && (
                    <div className="absolute bottom-0 left-0 h-1 bg-primary transition-all duration-1000" style={{ width: `${(timeLeft/timeLimit)*100}%` }}></div>
                )}
                </motion.div>
            ))}
            </div>

            {/* Typing Buffer */}
            <Card className="bg-bg-card border-border-subtle p-10 relative mb-12">
                <div className="text-3xl md:text-4xl leading-[1.6] text-text-muted font-sans tracking-wide space-y-2">
                    {paragraph.split("").map((char, index) => {
                    let status = "default";
                    if (index < input.length) {
                        status = char === input[index] ? "correct" : "wrong";
                    }
                    return (
                        <span 
                        key={index} 
                        className={`transition-all duration-150 rounded-md ${
                            status === "correct" ? "text-text-main bg-emerald-500/5" : 
                            status === "wrong" ? "text-rose-500 bg-rose-500/10 underline decoration-rose-500/50" : 
                            "opacity-40"
                        } ${index === input.length ? "bg-primary/20 border-b-2 border-primary animate-pulse text-text-main opacity-100" : ""}`}
                        >
                        {char}
                        </span>
                    );
                    })}
                </div>
            </Card>

            <TypingArea 
                input={input}
                handleTyping={handleTyping}
                disabled={finished}
                isActive={started && !finished}
            />
        </div>
      </div>

      {/* Modern Summary Overlay (Temporary until Summary page built) */}
      {finished && (
        <ResultCard
          name="Training Session"
          speed={stats.wpm}
          accuracy={stats.accuracy}
          mistakes={stats.mistakes}
          timeTaken={timeLimit}
          performance={stats.wpm > 60 ? "Elite" : "Growing"}
          onSave={saveResult}
          onRestart={restartTest}
          onLeaderboard={() => navigate("/leaderboard")}
        />
      )}
    </div>
  );
}

export default Test;
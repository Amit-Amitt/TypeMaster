import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Keyboard, LogOut, Layout, User, Menu, X, Home, Zap, Settings } from "lucide-react";
import { Button } from "./ui/Button";
import SettingsModal from "./SettingsModal";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userName = localStorage.getItem("userName");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    
    // Load persisted theme settings
    const theme = localStorage.getItem("app-theme") || "indigo";
    const font = localStorage.getItem("app-font") || "sans";
    const mode = localStorage.getItem("app-mode") || "dark";
    
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-font", font);
    document.documentElement.setAttribute("data-mode", mode);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navLinks = [
    { name: "Arena", path: "/test", icon: <Keyboard size={18} /> },
    { name: "Leaderboard", path: "/leaderboard", icon: <Zap size={18} /> },
    { name: "Dashboard", path: "/dashboard", icon: <Layout size={18} />, protected: true },
  ];

  return (
    <>
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          isScrolled 
            ? 'glass-nav py-3' 
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group text-text-main">
              <motion.div 
                whileHover={{ rotate: -10, scale: 1.1 }}
                className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20"
              >
                <Keyboard size={24} />
              </motion.div>
              <span className="text-2xl font-black tracking-tight">
                Type<span className="text-primary">Master</span>
              </span>
            </Link>

            {/* Desktop Links */}
            <div className="hidden lg:flex items-center space-x-1 bg-bg-main/50 p-1 rounded-full border border-border-subtle shadow-sm">
              {navLinks.filter(l => !l.protected || token).map((link) => (
                <Link 
                  key={link.name}
                  to={link.path} 
                  className={`flex items-center gap-2 px-5 py-2 rounded-full font-medium transition-all ${
                    location.pathname === link.path 
                      ? 'bg-primary/10 text-primary shadow-inner shadow-primary/5' 
                      : 'text-text-muted hover:text-text-main hover:bg-bg-main/50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* User Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 text-text-muted hover:text-text-main transition-colors"
              >
                <Settings size={20} />
              </button>

              <div className="h-4 w-px bg-white/10 mx-2"></div>

              {token ? (
                <div className="flex items-center gap-6">
                  <Link to="/profile" className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-bg-main/50 border border-border-subtle hover:border-primary/20 transition-all shadow-sm">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-text-main font-bold border border-primary/20">
                      {userName ? userName.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <span className="font-semibold text-text-main">{userName}</span>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleLogout}
                    className="text-text-muted hover:text-rose-500 transition-colors"
                  >
                    <LogOut size={18} className="mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <Link to="/login" className="text-text-muted hover:text-text-main font-medium px-4">
                    Login
                  </Link>
                  <Button onClick={() => navigate("/signup")}>
                    Get Started
                  </Button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-text-muted hover:text-text-main bg-bg-main/50 rounded-lg border border-border-subtle shadow-sm"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden glass-nav absolute top-full left-0 w-full overflow-hidden"
            >
              <div className="px-6 py-8 flex flex-col space-y-4">
                {navLinks.filter(l => !l.protected || token).map((link) => (
                  <Link 
                    key={link.name}
                    to={link.path} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-4 px-4 py-3 rounded-xl text-lg font-semibold text-text-muted hover:text-text-main hover:bg-bg-main/50 transition-all"
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                ))}
                
                <div className="border-t border-border-subtle pt-6 mt-2">
                  <Button 
                    variant="outline"
                    className="w-full mb-3"
                    onClick={() => { setIsSettingsOpen(true); setIsMobileMenuOpen(false); }}
                  >
                    <Settings size={18} className="mr-2" /> Appearance
                  </Button>
                  {token ? (
                    <Button 
                      variant="secondary" 
                      className="w-full text-rose-400 border-rose-500/10"
                      onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                    >
                      Logout
                    </Button>
                  ) : (
                    <div className="flex flex-col space-y-3">
                      <Button variant="secondary" className="w-full" onClick={() => { navigate("/login"); setIsMobileMenuOpen(false); }}>
                        Login
                      </Button>
                      <Button className="w-full" onClick={() => { navigate("/signup"); setIsMobileMenuOpen(false); }}>
                        Get Started
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
}
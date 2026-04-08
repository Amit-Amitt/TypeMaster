import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Mail, Lock, LogIn, ArrowRight, UserPlus } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { motion } from "framer-motion";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userName", res.data.user.name);
      navigate("/test");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center p-6 bg-bg-main selection:bg-primary/30">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <Card className="p-10 border-border-subtle bg-bg-card shadow-2xl shadow-primary/5 backdrop-blur-2xl px">
          <div className="text-center mb-10">
            <motion.div 
              whileHover={{ rotate: 15 }}
              className="inline-flex p-4 rounded-2xl bg-primary/10 text-primary mb-6"
            >
              <LogIn size={32} />
            </motion.div>
            <h2 className="text-3xl font-black text-text-main mb-2">Welcome Back</h2>
            <p className="text-text-muted">Continue your journey to elite typing.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="name@example.com"
              icon={Mail}
              value={formData.email}
              onChange={handleChange}
              required
            />
            
            <div className="space-y-1">
              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="••••••••"
                icon={Lock}
                value={formData.password}
                onChange={handleChange}
                required
              />
              <div className="text-right">
                <a href="#" className="text-xs text-primary hover:text-indigo-400 font-medium transition-colors">Forgot password?</a>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm text-center font-medium"
              >
                {error}
              </motion.div>
            )}

            <Button 
              className="w-full" 
              size="lg" 
              type="submit"
              isLoading={isLoading}
            >
              Sign In <ArrowRight className="ml-2" size={18} />
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-border-subtle text-center">
            <p className="text-text-muted text-sm">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary hover:text-indigo-400 font-bold transition-all ml-1">
                Create one for free
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
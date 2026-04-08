import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { User, Mail, Lock, UserPlus, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { motion } from "framer-motion";

export default function Signup() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
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
      await axios.post("http://localhost:5000/api/auth/signup", formData);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Try again.");
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
        <Card className="p-10 border-border-subtle bg-bg-card shadow-2xl shadow-primary/5 backdrop-blur-2xl">
          <div className="text-center mb-10">
            <motion.div 
              whileHover={{ rotate: -15, scale: 1.1 }}
              className="inline-flex p-4 rounded-2xl bg-emerald-500/10 text-emerald-500 mb-6"
            >
              <UserPlus size={32} />
            </motion.div>
            <h2 className="text-3xl font-black text-text-main mb-2">Create Account</h2>
            <p className="text-text-muted">Join the elite typing community.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Full Name"
              name="name"
              type="text"
              placeholder="John Doe"
              icon={User}
              value={formData.name}
              onChange={handleChange}
              required
            />
            
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
            
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Min. 8 characters"
              icon={Lock}
              value={formData.password}
              onChange={handleChange}
              required
            />

            <div className="flex items-center gap-2 text-xs text-text-muted px-1">
              <Sparkles size={14} className="text-primary" />
              <span>Passwords are encrypted and secured.</span>
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
              Create Account <ArrowRight className="ml-2" size={18} />
            </Button>
          </form>

          <div className="mt-8 pt-8 border-t border-border-subtle text-center">
            <p className="text-text-muted text-sm">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:text-indigo-400 font-bold transition-all ml-1">
                Sign in here
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
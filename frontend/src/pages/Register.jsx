import React, { useContext, useState } from "react";
import { api } from "../api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import Button from "../components/Button";
import { Sprout, Mail, Lock, User, ArrowRight } from "lucide-react";

export default function Register() {
  const { login } = useContext(AuthContext);
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleRegister = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", { ...form, role: "farmer" });
      login({ token: data.token, role: data.role, name: data.name });
      nav("/request");
    } catch (e) {
      setErr(e?.response?.data?.msg || "Register failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-4 sm:p-8 bg-[#fafcff] selection:bg-emerald-200 selection:text-emerald-900 relative overflow-hidden font-sans">
      
      {/* Background Decorative Elements (Matching Landing/Login Vibe) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[10%] w-[40%] h-[50%] rounded-full bg-emerald-200/30 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[40%] h-[50%] rounded-full bg-teal-200/30 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
      </div>

      {/* Main Register Card */}
      <div className="w-full max-w-md bg-white/70 backdrop-blur-2xl p-6 sm:p-8 rounded-3xl shadow-[0_8px_40px_rgb(0,0,0,0.04)] border border-white relative z-10 animate-fade-in-up my-auto">
        
        {/* Header / Logo */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-emerald-100/50">
            <Sprout size={28} strokeWidth={2.5} />
          </div>
          <h2 className="text-3xl font-serif font-bold text-slate-900 mb-2 tracking-tight">Create Account</h2>
          <p className="text-sm text-slate-500 font-medium">Join the future of smart agriculture.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700 ml-1">Full Name</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
              </div>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
                className="w-full pl-11 pr-4 py-3 bg-white/50 border-2 border-slate-100 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-sm text-slate-700 font-medium placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700 ml-1">Email Address</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
              </div>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="name@example.com"
                className="w-full pl-11 pr-4 py-3 bg-white/50 border-2 border-slate-100 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-sm text-slate-700 font-medium placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-slate-700 ml-1">Password</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
              </div>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-white/50 border-2 border-slate-100 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-sm text-slate-700 font-medium placeholder:text-slate-400"
              />
            </div>
          </div>

          {err && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-100 flex items-start gap-2 animate-fade-in-up">
              <div className="p-1 bg-red-100 rounded-full mt-0.5">
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
              </div>
              <p className="text-xs font-medium text-red-600 leading-tight">
                {err}
              </p>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-base rounded-xl shadow-[0_8px_30px_rgb(16,185,129,0.2)] hover:shadow-[0_8px_40px_rgb(16,185,129,0.3)] transition-all bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 border-none group relative overflow-hidden font-semibold flex items-center justify-center gap-2 mt-4"
          >
            <span className="relative z-10 flex items-center">
              {loading ? "Creating Account..." : "Create Account"}
              {!loading && <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />}
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
          </Button>

          <div className="text-center pt-4 mt-2 border-t border-slate-100/50">
            <p className="text-sm font-medium text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="text-emerald-600 font-bold hover:text-emerald-700 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

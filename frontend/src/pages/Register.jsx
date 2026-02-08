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
      setErr(e?.response?.data?.msg || "Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex bg-white">
      {/* Left Side - Image */}
      <div className="hidden lg:flex w-1/2 relative bg-slate-900 overflow-hidden">
        <img
          src="https://images.pexels.com/photos/2132180/pexels-photo-2132180.jpeg"
          alt="Green Fields"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="relative z-10 p-16 flex flex-col justify-end h-full text-white">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center">
              <Sprout size={24} className="text-white" />
            </div>
            <span className="text-2xl font-bold">SmartAgri</span>
          </div>
          <h2 className="text-4xl font-serif font-bold mb-4 leading-tight">
            Join the Future of <br /> Farming
          </h2>
          <p className="text-lg text-slate-300 max-w-md">
            Create an account to access real-time power distribution requests and optimize your farm's efficiency.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-slate-50">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-2 font-serif">Create Account</h2>
            <p className="text-slate-500">Sign up to get started as a farmer</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                />
              </div>
            </div>

            {err && (
              <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-100">
                {err}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-3 flex items-center justify-center gap-2 group bg-emerald-600 hover:bg-emerald-700"
            >
              {loading ? "Creating Account..." : "Create Account"}
              {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </Button>

            <div className="text-center mt-6">
              <p className="text-sm text-slate-600">
                Already have an account?{' '}
                <Link to="/login" className="text-emerald-600 font-semibold hover:text-emerald-700 hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

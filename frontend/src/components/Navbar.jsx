import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Sprout, Menu, X, User } from 'lucide-react';
import Button from "./Button";

export default function Navbar() {
  const { auth, logout } = useContext(AuthContext);
  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    nav("/login");
    setOpen(false);
  };

  const NavLink = ({ to, children, onClick }) => (
    <Link
      to={to}
      onClick={onClick}
      className="text-slate-600 hover:text-green-600 font-medium transition-colors px-3 py-2 rounded-lg hover:bg-green-50"
    >
      {children}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative w-10 h-10 overflow-hidden rounded-xl bg-emerald-100 flex items-center justify-center border border-emerald-200 group-hover:shadow-lg transition-all duration-300">
              <Sprout className="w-6 h-6 text-emerald-600" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-xl leading-tight text-slate-800">
                Smart<span className="text-green-600">Agri</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 leading-none">
                Portal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/schemes">Schemes</NavLink>

            {auth.token && auth.role === "farmer" && (
              <>
                <NavLink to="/request">Request</NavLink>
                <NavLink to="/status">Status</NavLink>
              </>
            )}

            {auth.token && auth.role === "admin" && (
              <NavLink to="/admin/dashboard">Dashboard</NavLink>
            )}

            <div className="h-6 w-px bg-slate-200 mx-2"></div>

            {!auth.token ? (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">Register</Button>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                  <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                    <User size={14} />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{auth.name}</span>
                </div>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-lg"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {open && (
        <div className="md:hidden bg-white border-t border-slate-100 py-4 px-4 shadow-xl absolute w-full left-0 top-16 flex flex-col gap-2">
          <NavLink to="/" onClick={() => setOpen(false)}>Home</NavLink>
          <NavLink to="/about" onClick={() => setOpen(false)}>About</NavLink>
          <NavLink to="/schemes" onClick={() => setOpen(false)}>Schemes</NavLink>

          {auth.token && auth.role === "farmer" && (
            <>
              <NavLink to="/request" onClick={() => setOpen(false)}>Request Services</NavLink>
              <NavLink to="/status" onClick={() => setOpen(false)}>Check Status</NavLink>
            </>
          )}

          {auth.token && auth.role === "admin" && (
            <NavLink to="/admin/dashboard" onClick={() => setOpen(false)}>Admin Dashboard</NavLink>
          )}

          <div className="border-t border-slate-100 my-2 pt-2 flex flex-col gap-3">
            {!auth.token ? (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="w-full">
                  <Button variant="ghost" size="md" className="w-full justify-start">Login</Button>
                </Link>
                <Link to="/register" onClick={() => setOpen(false)} className="w-full">
                  <Button variant="primary" size="md" className="w-full">Register</Button>
                </Link>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 px-3 py-2">
                  <User size={16} className="text-slate-400" />
                  <span className="text-sm font-medium text-slate-700">{auth.name}</span>
                </div>
                <Button variant="danger" size="md" onClick={handleLogout} className="w-full">
                  Logout
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

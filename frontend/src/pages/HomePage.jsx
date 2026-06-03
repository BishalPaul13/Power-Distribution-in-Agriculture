import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import { ArrowRight, Cloud, MapPin, Activity, ShieldCheck, Sprout, Wind, Droplets, Sun } from 'lucide-react';

export default function Home() {
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

  const fetchWeather = async () => {
    if (!location.trim()) return;
    setLoading(true);

    try {
      let weatherUrl = "";
      const isPincode = /^\d{6}$/.test(location);

      if (isPincode) {
        weatherUrl = `https://api.openweathermap.org/data/2.5/weather?zip=${location},IN&units=metric&appid=${API_KEY}`;
      } else {
        const geoRes = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${API_KEY}`
        );
        const geoData = await geoRes.json();

        if (!geoData.length) {
          alert("Location not found. Try nearby town or PIN code.");
          setLoading(false);
          return;
        }

        const { lat, lon } = geoData[0];
        weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;
      }

      const res = await fetch(weatherUrl);
      const data = await res.json();

      if (data.cod !== 200) {
        alert("Weather data unavailable for this location.");
        setLoading(false);
        return;
      }

      setWeather(data);
    } catch (error) {
      console.error("Weather fetch failed:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const FeatureCard = ({ icon: Icon, title, description, className = "", delay = "0" }) => (
    <div 
      className={`group relative p-8 rounded-3xl bg-white/60 backdrop-blur-xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] transition-all duration-500 overflow-hidden ${className}`}
      style={{ animationDelay: delay }}
    >
      <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500 group-hover:scale-150 transform">
        <Icon size={120} />
      </div>
      <div className="relative z-10">
        <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-teal-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-emerald-100/50 group-hover:scale-110 transition-transform duration-500">
          <Icon size={26} strokeWidth={2} />
        </div>
        <h3 className="text-2xl font-bold mb-3 text-slate-800 tracking-tight">{title}</h3>
        <p className="text-slate-500 leading-relaxed font-medium">
          {description}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafcff] font-sans selection:bg-emerald-200 selection:text-emerald-900 overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-200/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-teal-200/20 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
      </div>

      {/* ================= HERO SECTION ================= */}
      <section className="relative z-10 pt-12 pb-20 lg:pt-20 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 mb-8 animate-fade-in-up">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold tracking-wider uppercase">Next Generation Farming</span>
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif font-extrabold text-slate-900 leading-[1.1] mb-8 tracking-tight">
              Smart Power <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">
                Distribution
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
              Empowering farmers with efficient, transparent, and intelligent power allocation systems tailored for modern agriculture.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link to="/register">
                <Button size="lg" className="rounded-2xl px-8 py-4 text-lg shadow-[0_8px_30px_rgb(16,185,129,0.3)] hover:shadow-[0_8px_40px_rgb(16,185,129,0.4)] transition-all bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 border-none group relative overflow-hidden">
                  <span className="relative z-10 flex items-center font-semibold">
                    Get Started 
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg" className="rounded-2xl px-8 py-4 text-lg border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all font-semibold bg-white/50 backdrop-blur-sm">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex-1 relative w-full max-w-lg lg:max-w-none">
            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-[8px] border-white/50 backdrop-blur-xl transform -rotate-2 hover:rotate-0 transition-transform duration-700 ease-out">
              <img
                src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop"
                className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-1000"
                alt="Smart Farming Dashboard"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
              
              {/* Floating Badge */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-xl flex items-center gap-4 transform translate-y-2 hover:translate-y-0 transition-transform duration-300">
                <div className="bg-emerald-100 p-3 rounded-xl">
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">System Active</p>
                  <p className="text-xs text-slate-500 font-medium">Monitoring 24/7</p>
                </div>
              </div>
            </div>
            
            {/* Decorative background blobs for image */}
            <div className="absolute -inset-4 bg-gradient-to-r from-emerald-400 to-teal-300 rounded-[3rem] blur-2xl opacity-20 -z-10" />
          </div>
        </div>
      </section>

      {/* ================= WEATHER SECTION ================= */}
      <section className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 mb-32 max-w-7xl">
        <div className="bg-white/70 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_8px_40px_rgb(0,0,0,0.04)] border border-white p-8 lg:p-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-serif font-bold text-slate-900 mb-6 tracking-tight">
                Smart Weather Intelligence
              </h2>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                Optimize your irrigation and power usage with hyper-local weather insights. Stay ahead of the climate.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1 group">
                  <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-emerald-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Enter city or PIN code..."
                    className="w-full pl-14 pr-4 py-4 bg-white/50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-slate-700 font-medium placeholder:text-slate-400"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && fetchWeather()}
                  />
                </div>
                <Button 
                  onClick={fetchWeather} 
                  disabled={loading} 
                  className="py-4 px-8 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white shadow-xl shadow-slate-900/10 transition-all font-semibold"
                >
                  {loading ? 'Analyzing...' : 'Get Forecast'}
                </Button>
              </div>

              <div className="mt-6 flex items-center gap-2">
                <button
                  onClick={() => {
                    if (navigator.geolocation) {
                      setLoading(true);
                      navigator.geolocation.getCurrentPosition(async (pos) => {
                        const { latitude, longitude } = pos.coords;
                        try {
                          const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`);
                          const data = await res.json();
                          setWeather(data);
                        } catch (e) { console.error(e); } finally { setLoading(false); }
                      }, () => setLoading(false));
                    }
                  }}
                  className="text-sm text-slate-500 hover:text-emerald-600 font-semibold flex items-center gap-2 cursor-pointer transition-colors px-4 py-2 rounded-lg hover:bg-emerald-50"
                >
                  <MapPin size={16} /> Use my current location
                </button>
              </div>
            </div>

            {/* Weather Display */}
            <div className="relative h-full min-h-[340px]">
              {weather ? (
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 rounded-[2rem] p-8 text-white shadow-2xl overflow-hidden transform transition-all hover:scale-[1.02] duration-500">
                  {/* Decorative circles */}
                  <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-64 h-64 bg-teal-900/20 rounded-full blur-3xl" />
                  
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-3xl font-bold tracking-tight mb-1">{weather.name}</h3>
                        <p className="text-emerald-100/90 font-medium capitalize flex items-center gap-2">
                          {weather.weather[0].description}
                        </p>
                      </div>
                      <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                        <Sun className="w-8 h-8 text-yellow-300" />
                      </div>
                    </div>

                    <div className="my-8 flex items-baseline gap-2">
                      <span className="text-7xl font-bold tracking-tighter">{Math.round(weather.main.temp)}°</span>
                      <span className="text-2xl text-emerald-100 font-medium">C</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/20">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-lg">
                          <Droplets className="w-5 h-5 text-emerald-100" />
                        </div>
                        <div>
                          <p className="text-xs text-emerald-100/80 font-medium uppercase tracking-wider mb-0.5">Humidity</p>
                          <p className="text-lg font-bold">{weather.main.humidity}%</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/10 rounded-lg">
                          <Wind className="w-5 h-5 text-emerald-100" />
                        </div>
                        <div>
                          <p className="text-xs text-emerald-100/80 font-medium uppercase tracking-wider mb-0.5">Wind</p>
                          <p className="text-lg font-bold">{weather.wind.speed} m/s</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 bg-slate-50/50 backdrop-blur-sm rounded-[2rem] p-8 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center transition-all hover:bg-slate-50">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <Cloud className="w-10 h-10 text-slate-300" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-700 mb-2">Awaiting Location</h3>
                  <p className="text-slate-500 font-medium max-w-xs">Enter your details to receive personalized weather intelligence.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 pb-32 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900 mb-6 tracking-tight">
            Built for Modern Agriculture
          </h2>
          <p className="text-lg text-slate-600 font-medium leading-relaxed">
            We combine cutting-edge technology with agricultural needs to provide seamless, intelligent power management.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={Activity}
            title="Real-Time Insights"
            description="Track power distribution live with smart usage reports and automated outage alerts to stay ahead of disruptions."
            className="md:col-span-2 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 hover:border-blue-200"
          />
          <FeatureCard
            icon={Sprout}
            title="Farmer-Centric"
            description="Simplified request system designed specifically for farmers to ensure timely electricity access."
            className="bg-gradient-to-br from-emerald-50/50 to-green-50/50 hover:border-emerald-200"
            delay="100ms"
          />
          <FeatureCard
            icon={ShieldCheck}
            title="Fair & Transparent"
            description="Admin-approved allocation schema with immutable logs to ensure complete fairness in distribution."
            className="bg-gradient-to-br from-purple-50/50 to-fuchsia-50/50 hover:border-purple-200"
            delay="200ms"
          />
           <FeatureCard
            icon={Sun}
            title="Energy Optimization"
            description="Leverage data to optimize your energy consumption during peak farming hours, reducing overall costs."
            className="md:col-span-2 bg-gradient-to-br from-orange-50/50 to-amber-50/50 hover:border-orange-200"
            delay="300ms"
          />
        </div>
      </section>
    </div>
  );
}

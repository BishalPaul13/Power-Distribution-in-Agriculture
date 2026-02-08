import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import { ArrowRight, Cloud, MapPin, Activity, ShieldCheck, Sprout } from 'lucide-react';

function Home() {
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

  const FeatureCard = ({ icon: Icon, title, description, colorClass }) => (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
      <div className={`w-14 h-14 ${colorClass} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
        <Icon size={28} />
      </div>
      <h3 className="text-xl font-bold mb-3 text-slate-800">{title}</h3>
      <p className="text-slate-600 leading-relaxed text-sm">
        {description}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-[90vh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.pexels.com/photos/1112080/pexels-photo-1112080.jpeg?auto=compress&cs=tinysrgb&w=1920"
            className="w-full h-full object-cover"
            alt="Smart Farming"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pb-32">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/30 border border-emerald-400/30 backdrop-blur-md mb-8 shadow-lg shadow-emerald-500/20">
              <Sprout size={16} className="text-emerald-300" />
              <span className="text-emerald-50 text-xs font-bold tracking-wide uppercase shadow-sm">
                Next Generation Farming
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white leading-tight mb-6 drop-shadow-xl">
              Smart Power <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 drop-shadow-sm">
                Distribution
              </span>
            </h1>

            <p className="text-lg text-slate-100 mb-10 leading-relaxed max-w-lg font-medium drop-shadow-md">
              Empowering farmers with efficient, transparent, and intelligent power allocation systems tailored for modern agriculture.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/register">
                <Button size="lg" className="rounded-full px-8 shadow-lg shadow-emerald-500/40 hover:shadow-emerald-500/60 transition-all border border-emerald-500/50 bg-emerald-600/90 backdrop-blur-sm group">
                  Get Started <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>

              <Link to="/about">
                <Button variant="outline" size="lg" className="rounded-full px-8 border-white/80 text-white hover:bg-white/20 hover:border-white backdrop-blur-sm shadow-lg shadow-black/10">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================= WEATHER SECTION ================= */}
      <section className="relative z-20 -mt-24 container mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-slate-100">
          <div className="grid md:grid-cols-2 gap-12 items-center">

            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-4 font-serif">
                Smart Weather Integration
              </h2>
              <p className="text-slate-600 mb-8">
                Optimize your irrigation schedule with real-time weather analytics. Enter your location to get instant insights.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Enter city or PIN code..."
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <Button onClick={fetchWeather} disabled={loading} className="py-3">
                  {loading ? 'Checking...' : 'Check Weather'}
                </Button>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={() => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(async (pos) => {
                        const { latitude, longitude } = pos.coords;
                        // Fetch Logic repeated for brevity or better modularized in real app
                        // Simplified for this component
                        try {
                          const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`);
                          const data = await res.json();
                          setWeather(data);
                        } catch (e) { console.error(e); }
                      });
                    }
                  }}
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <MapPin size={14} /> Use my current location
                </button>
              </div>
            </div>

            {/* Weather Display */}
            <div className="relative">
              {weather ? (
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <h3 className="text-2xl font-bold">{weather.name}</h3>
                        <p className="text-emerald-100 capitalize">{weather.weather[0].description}</p>
                      </div>
                      <Cloud className="w-10 h-10 text-emerald-100 opacity-80" />
                    </div>

                    <div className="flex items-end gap-4 mb-8">
                      <span className="text-6xl font-bold">{Math.round(weather.main.temp)}°</span>
                      <span className="text-emerald-100 mb-2 font-medium">Celsius</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
                      <div>
                        <p className="text-sm text-emerald-100 mb-1">Humidity</p>
                        <p className="text-xl font-bold">{weather.main.humidity}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-emerald-100 mb-1">Wind Speed</p>
                        <p className="text-xl font-bold">{weather.wind.speed} m/s</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-50 rounded-2xl p-8 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
                  <Cloud className="w-16 h-16 text-slate-300 mb-4" />
                  <p className="text-slate-500 font-medium">Weather details will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">
            Why Choose Our System?
          </h2>
          <p className="text-slate-600 text-lg">
            We combine cutting-edge technology with agricultural needs to provide seamless power management.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={Activity}
            title="Real-Time Monitoring"
            description="Track power distribution live with smart usage reports and automated outage alerts to stay ahead."
            colorClass="bg-blue-50 text-blue-600"
          />
          <FeatureCard
            icon={Sprout}
            title="Farmer-Centric Design"
            description="Simplified request system designed specifically for farmers to ensure timely electricity access."
            colorClass="bg-green-50 text-green-600"
          />
          <FeatureCard
            icon={ShieldCheck}
            title="Secure & Transparent"
            description="Admin-approved allocation schema with immutable logs to ensure complete fairness in distribution."
            colorClass="bg-purple-50 text-purple-600"
          />
        </div>
      </section>
    </div>
  );
}

export default Home;

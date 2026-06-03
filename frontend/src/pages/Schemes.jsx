import { useState, useEffect } from "react";
import {
    CloudRain,
    Sun,
    Wind,
    AlertTriangle,
    Info,
    ExternalLink,
    ChevronRight,
    Sprout,
    Landmark,
    Droplets
} from "lucide-react";
import Button from "../components/Button";

export default function Schemes() {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [advisory, setAdvisory] = useState(null);

    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

    // Curated list of major Indian Agricultural Schemes
    const schemes = [
        {
            title: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
            description: "Direct income support of ₹6,000 per year to all landholding farmer families, payable in three equal installments of ₹2,000 each.",
            eligibility: "All landholding farmer families",
            link: "https://pmkisan.gov.in/",
            category: "Financial Support",
            color: "text-emerald-600",
            bg: "bg-emerald-50",
            border: "border-emerald-200"
        },
        {
            title: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
            description: "Crop insurance scheme providing financial support to farmers suffering crop loss/damage arising out of unforeseen events.",
            eligibility: "Farmers with insurable interest",
            link: "https://pmfby.gov.in/",
            category: "Insurance",
            color: "text-blue-600",
            bg: "bg-blue-50",
            border: "border-blue-200"
        },
        {
            title: "Soil Health Card Scheme",
            description: "Provides soil health cards to farmers with crop-wise recommendations of nutrients and fertilizers required for individual farms.",
            eligibility: "All farmers",
            link: "https://soilhealth.dac.gov.in/",
            category: "Sustainability",
            color: "text-amber-600",
            bg: "bg-amber-50",
            border: "border-amber-200"
        },
        {
            title: "National Agriculture Market (e-NAM)",
            description: "Pan-India electronic trading portal which networks existing APMC mandis to create a unified national market for agricultural commodities.",
            eligibility: "Farmers, Traders, Buyers",
            link: "https://enam.gov.in/",
            category: "Market Access",
            color: "text-purple-600",
            bg: "bg-purple-50",
            border: "border-purple-200"
        },
        {
            title: "Kisan Credit Card (KCC)",
            description: "Provides adequate and timely credit support from the banking system under a single window with simplified procedures.",
            eligibility: "All farmers, share croppers",
            link: "https://myscheme.gov.in/schemes/kcc",
            category: "Credit",
            color: "text-indigo-600",
            bg: "bg-indigo-50",
            border: "border-indigo-200"
        },
        {
            title: "Paramparagat Krishi Vikas Yojana",
            description: "Promotes organic farming through adoption of organic village by cluster approach and PGS certification.",
            eligibility: "Farmers groups",
            link: "https://pgsindia-ncof.gov.in/pkvy/index.aspx",
            category: "Organic Farming",
            color: "text-teal-600",
            bg: "bg-teal-50",
            border: "border-teal-200"
        }
    ];

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    console.error("Location access denied or error:", error);
                    fetchWeather("Nagpur"); // Fallback
                }
            );
        } else {
            fetchWeather("Nagpur");
        }
    }, []);

    const fetchWeather = async (location) => {
        setLoading(true);
        try {
            const res = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${location},IN&units=metric&appid=${API_KEY}`
            );
            const data = await res.json();
            handleWeatherData(data);
        } catch (error) {
            console.error("Failed to fetch weather", error);
            setLoading(false);
        }
    };

    const fetchWeatherByCoords = async (lat, lon) => {
        setLoading(true);
        try {
            const res = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
            );
            const data = await res.json();
            handleWeatherData(data);
        } catch (error) {
            console.error("Failed to fetch weather", error);
            setLoading(false);
        }
    };

    const handleWeatherData = (data) => {
        if (data.cod === 200) {
            setWeather(data);
            generateAdvisory(data);
        }
        setLoading(false);
    };

    const generateAdvisory = (data) => {
        const temp = data.main.temp;
        const condition = data.weather[0].main.toLowerCase();
        const wind = data.wind.speed;

        let advice = {
            type: "normal",
            title: "Favorable Conditions",
            message: "Current weather is suitable for standard field operations. Continue regular monitoring and optimize water usage.",
            icon: Sprout,
            color: "from-emerald-500 to-teal-600",
            text: "text-emerald-700",
            bg: "bg-emerald-100/50",
            border: "border-emerald-200"
        };

        if (condition.includes("rain") || condition.includes("drizzle")) {
            advice = {
                type: "warning",
                title: "Rain Alert",
                message: "Light to moderate rain expected. Suspend irrigation and spraying of pesticides. Ensure proper drainage in low-lying fields.",
                icon: CloudRain,
                color: "from-blue-500 to-indigo-600",
                text: "text-blue-700",
                bg: "bg-blue-100/50",
                border: "border-blue-200"
            };
        } else if (temp > 35) {
            advice = {
                type: "alert",
                title: "Heat Stress Alert",
                message: `High temperature (${Math.round(temp)}°C). Irrigate frequently during evening hours to prevent moisture stress. Apply mulch to conserve soil moisture.`,
                icon: Sun,
                color: "from-amber-500 to-orange-600",
                text: "text-amber-700",
                bg: "bg-amber-100/50",
                border: "border-amber-200"
            };
        } else if (wind > 15) {
            advice = {
                type: "warning",
                title: "High Wind Alert",
                message: "Strong winds detected. Support tall crops (staking) like banana and sugarcane. Postpone spraying operations to avoid drift.",
                icon: Wind,
                color: "from-slate-600 to-slate-800",
                text: "text-slate-700",
                bg: "bg-slate-100/50",
                border: "border-slate-200"
            };
        }

        setAdvisory(advice);
    };

    const handleFindCenter = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                window.open(`https://www.google.com/maps/search/Common+Service+Centre+near+me/@${latitude},${longitude},12z`, '_blank');
            }, () => {
                window.open('https://www.google.com/maps/search/Common+Service+Centre+near+me', '_blank');
            });
        } else {
            window.open('https://www.google.com/maps/search/Common+Service+Centre+near+me', '_blank');
        }
    };

    return (
        <div className="bg-[#fafcff] min-h-screen pb-24 font-sans selection:bg-emerald-200 selection:text-emerald-900 relative overflow-hidden">
            
            {/* Background Decorative Elements */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-200/20 blur-[120px]" />
                <div className="absolute top-[30%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-200/20 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[20%] w-[40%] h-[40%] rounded-full bg-teal-200/20 blur-[120px]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
            </div>

            {/* Hero Header */}
            <div className="relative z-10 pt-20 pb-24 lg:pt-32 lg:pb-32 px-4 sm:px-6">
                <div className="container mx-auto max-w-4xl text-center animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-50/80 backdrop-blur-md border border-emerald-200/60 text-emerald-700 text-sm font-bold mb-8 shadow-sm">
                        <Landmark className="h-4 w-4" />
                        <span className="uppercase tracking-wider">Resources & Growth</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-serif font-extrabold mb-8 text-slate-900 leading-tight tracking-tight">
                        Schemes & <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">Advisories</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
                        Stay informed with real-time weather-based farming advisories and explore government initiatives designed for your agricultural growth.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-20">

                {/* Real-Time Advisory Section */}
                {weather && advisory && (
                    <div className="bg-white/70 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_8px_40px_rgb(0,0,0,0.04)] border border-white p-8 md:p-12 mb-20 flex flex-col lg:flex-row gap-10 items-center animate-fade-in-up">
                        
                        {/* Weather Card */}
                        <div className={`relative overflow-hidden bg-gradient-to-br ${advisory.color} rounded-[2rem] p-8 min-w-[280px] w-full lg:w-auto text-white shadow-xl`}>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
                            <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-2xl -ml-10 -mb-10" />
                            
                            <div className="relative z-10 text-center">
                                <p className="text-white/80 text-sm font-bold mb-6 uppercase tracking-wider">Current Conditions</p>
                                <div className="flex justify-center mb-6">
                                    <advisory.icon className="text-white drop-shadow-md w-16 h-16" />
                                </div>
                                <p className="text-6xl font-bold tracking-tighter mb-2">{Math.round(weather.main.temp)}°<span className="text-3xl text-white/70">C</span></p>
                                <p className="text-white/90 text-lg font-medium capitalize mb-1">{weather.weather[0].description}</p>
                                <div className="flex items-center justify-center gap-1 text-white/70 text-sm mt-4">
                                    <CloudRain className="w-4 h-4" /> 
                                    <span>Humidity: {weather.main.humidity}%</span>
                                </div>
                            </div>
                        </div>

                        {/* Advisory Content */}
                        <div className="flex-1">
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold mb-6 border backdrop-blur-sm shadow-sm ${advisory.bg} ${advisory.text} ${advisory.border}`}>
                                <AlertTriangle size={18} />
                                {advisory.title}
                            </div>

                            <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4 tracking-tight">Daily Farmer Advisory</h2>
                            <p className="text-lg text-slate-600 leading-relaxed font-medium bg-white/50 p-6 rounded-2xl border border-slate-100">
                                {advisory.message}
                            </p>
                        </div>
                    </div>
                )}

                {/* Government Schemes Grid */}
                <div className="mb-24">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-serif font-bold text-slate-900 tracking-tight">Government Schemes</h2>
                        <p className="text-slate-500 font-medium mt-3">Discover subsidies and support available for your farm.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {schemes.map((scheme, idx) => (
                            <div key={idx} className="group bg-white/60 backdrop-blur-xl rounded-[2rem] border border-white hover:border-emerald-100 p-8 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(16,185,129,0.08)] transition-all duration-500 flex flex-col h-full hover:-translate-y-1">
                                <div className="flex justify-between items-start mb-6">
                                    <span className={`px-4 py-1.5 ${scheme.bg} ${scheme.color} ${scheme.border} border text-xs font-bold rounded-full uppercase tracking-wider shadow-sm`}>
                                        {scheme.category}
                                    </span>
                                    <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-emerald-50 transition-colors">
                                        <ExternalLink size={18} className="text-slate-400 group-hover:text-emerald-600 transition-colors" />
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold text-slate-800 mb-4 leading-tight tracking-tight group-hover:text-emerald-700 transition-colors">
                                    {scheme.title}
                                </h3>

                                <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-1 font-medium">
                                    {scheme.description}
                                </p>

                                <div className="pt-6 border-t border-slate-100/60 mt-auto">
                                    <div className="flex items-center gap-2 mb-6 text-sm">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                                            <Sprout className="w-4 h-4 text-slate-500" />
                                        </div>
                                        <span className="text-slate-600 font-medium line-clamp-1">{scheme.eligibility}</span>
                                    </div>
                                    <a
                                        href={scheme.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-slate-900/10 hover:shadow-emerald-600/30 group/btn"
                                    >
                                        Official Details 
                                        <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* News / Updates Section */}
                <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-[2.5rem] p-10 md:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-20 -mb-20"></div>
                    
                    <div className="flex items-start gap-6 relative z-10 max-w-2xl">
                        <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md border border-white/30 shadow-inner flex-shrink-0">
                            <Info className="text-white w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-3xl font-serif font-bold text-white mb-3">Need help applying?</h3>
                            <p className="text-emerald-50 text-lg font-medium leading-relaxed">
                                Visit your nearest Common Service Centre (CSC) or Krishi Vigyan Kendra (KVK) for assistance with these government schemes.
                            </p>
                        </div>
                    </div>
                    
                    <div className="relative z-10 flex-shrink-0 w-full md:w-auto">
                        <Button 
                            variant="outline" 
                            onClick={handleFindCenter}
                            className="w-full md:w-auto py-4 px-8 bg-white/10 hover:bg-white text-white hover:text-emerald-800 border-2 border-white backdrop-blur-md rounded-2xl font-bold transition-all shadow-lg text-lg"
                        >
                            Find Nearest Center
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    );
}

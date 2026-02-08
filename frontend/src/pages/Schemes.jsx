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
    Landmark
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
            category: "Financial Support"
        },
        {
            title: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
            description: "Crop insurance scheme providing financial support to farmers suffering crop loss/damage arising out of unforeseen events.",
            eligibility: "Farmers with insurable interest in notified crops",
            link: "https://pmfby.gov.in/",
            category: "Insurance"
        },
        {
            title: "Soil Health Card Scheme",
            description: "Provides soil health cards to farmers with crop-wise recommendations of nutrients and fertilizers required for the individual farms.",
            eligibility: "All farmers",
            link: "https://soilhealth.dac.gov.in/",
            category: "Sustainability"
        },
        {
            title: "National Agriculture Market (e-NAM)",
            description: "Pan-India electronic trading portal which networks the existing APMC mandis to create a unified national market for agricultural commodities.",
            eligibility: "Farmers, Traders, Buyers",
            link: "https://enam.gov.in/",
            category: "Market Access"
        },
        {
            title: "Kisan Credit Card (KCC)",
            description: "Provides adequate and timely credit support from the banking system under a single window with flexible and simplified procedure.",
            eligibility: "All farmers, tenant farmers, share croppers",
            link: "https://myscheme.gov.in/schemes/kcc",
            category: "Credit"
        },
        {
            title: "Paramparagat Krishi Vikas Yojana (PKVY)",
            description: "Promotes organic farming through adoption of organic village by cluster approach and PGS certification.",
            eligibility: "Farmers groups",
            link: "https://pgsindia-ncof.gov.in/pkvy/index.aspx",
            category: "Organic Farming"
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
            message: "Current weather is suitable for standard field operations. Continue regular monitoring.",
            icon: Sprout,
            color: "emerald"
        };

        if (condition.includes("rain") || condition.includes("drizzle")) {
            advice = {
                type: "warning",
                title: "Rain Alert",
                message: "Light to moderate rain expected. Suspend irrigation and spraying of pesticides. Ensure proper drainage in low-lying fields.",
                icon: CloudRain,
                color: "blue"
            };
        } else if (temp > 35) {
            advice = {
                type: "alert",
                title: "Heat Stress Alert",
                message: `High temperature (${Math.round(temp)}°C). Irrigate frequently during evening hours to prevent moisture stress. Apply mulch to conserve soil moisture.`,
                icon: Sun,
                color: "amber"
            };
        } else if (wind > 15) { // m/s
            advice = {
                type: "warning",
                title: "High Wind Alert",
                message: "Strong winds detected. Support tall crops (staking) like banana and sugarcane. Postpone spraying operations.",
                icon: Wind,
                color: "slate"
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
        <div className="bg-slate-50 min-h-screen pb-20">

            {/* Header */}
            <div className="bg-emerald-900 text-white py-16 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <h1 className="text-3xl md:text-5xl font-serif font-bold mb-4">Schemes & Advisories</h1>
                    <p className="text-emerald-100 text-lg max-w-2xl">
                        Stay informed with real-time weather-based farming advisories and explore government initiatives designed for your growth.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-6 -mt-8 relative z-20">

                {/* Real-Time Advisory Section */}
                {weather && advisory && (
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 md:p-8 mb-12 flex flex-col md:flex-row gap-8 items-start">

                        {/* Weather Card */}
                        <div className="bg-slate-50 rounded-xl p-6 min-w-[200px] border border-slate-200 text-center">
                            <p className="text-slate-500 text-sm font-medium mb-2 uppercase tracking-wide">Current Weather</p>
                            <div className="flex justify-center mb-2">
                                {advisory.type === 'alert' ? <Sun className="text-amber-500 w-12 h-12" /> :
                                    advisory.type === 'warning' ? <CloudRain className="text-blue-500 w-12 h-12" /> :
                                        <Sprout className="text-emerald-500 w-12 h-12" />}
                            </div>
                            <p className="text-3xl font-bold text-slate-800">{Math.round(weather.main.temp)}°C</p>
                            <p className="text-slate-600 capitalize">{weather.weather[0].description}</p>
                            <p className="text-xs text-slate-400 mt-2">{weather.name}, IN</p>
                        </div>

                        {/* Advisory Content */}
                        <div className="flex-1">
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold mb-4 ${advisory.type === 'alert' ? 'bg-amber-100 text-amber-700' :
                                    advisory.type === 'warning' ? 'bg-blue-100 text-blue-700' :
                                        'bg-emerald-100 text-emerald-700'
                                }`}>
                                <AlertTriangle size={16} />
                                {advisory.title}
                            </div>

                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Farmer Advisory</h2>
                            <p className="text-lg text-slate-600 leading-relaxed mb-6">
                                {advisory.message}
                            </p>

                            <div className="flex gap-4">
                                {/* Placeholder for future action, e.g., 'View Detailed Forecast' */}
                            </div>
                        </div>
                    </div>
                )}

                {/* Government Schemes Grid */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-8">
                        <Landmark className="text-emerald-600 w-8 h-8" />
                        <h2 className="text-3xl font-bold text-slate-900 font-serif">Government Schemes</h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {schemes.map((scheme, idx) => (
                            <div key={idx} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg transition-all duration-300 flex flex-col group">
                                <div className="flex justify-between items-start mb-4">
                                    <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full uppercase tracking-wider">
                                        {scheme.category}
                                    </span>
                                    <ExternalLink size={18} className="text-slate-400 group-hover:text-emerald-600 transition-colors" />
                                </div>

                                <h3 className="text-xl font-bold text-slate-800 mb-3 leading-tight group-hover:text-emerald-700 transition-colors">
                                    {scheme.title}
                                </h3>

                                <p className="text-slate-600 text-sm leading-relaxed mb-6 flex-1">
                                    {scheme.description}
                                </p>

                                <div className="pt-4 border-t border-slate-100 mt-auto">
                                    <p className="text-xs text-slate-500 mb-3">
                                        <span className="font-semibold text-slate-700">Eligibility:</span> {scheme.eligibility}
                                    </p>
                                    <a
                                        href={scheme.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-medium rounded-lg transition-colors border border-slate-200 hover:border-emerald-200"
                                    >
                                        View Official Details <ChevronRight size={16} />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* News / Updates Section */}
                <div className="bg-emerald-50 rounded-2xl p-8 border border-emerald-100">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-start gap-4">
                            <div className="bg-emerald-100 p-3 rounded-full">
                                <Info className="text-emerald-600 w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-emerald-900">Need help applying?</h3>
                                <p className="text-emerald-700">Visit your nearest Common Service Centre (CSC) or Krishi Vigyan Kendra (KVK) for assistance with these schemes.</p>
                            </div>
                        </div>
                        <Button variant="primary" onClick={handleFindCenter}>Find Nearest Center</Button>
                    </div>
                </div>

            </div>
        </div>
    );
}

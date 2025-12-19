import { 
  Info, 
  Leaf, 
  CloudRain, 
  Zap, 
  Landmark, 
  ArrowLeft, 
  Sprout, 
  CheckCircle2 
} from "lucide-react";
import { Link } from "react-router-dom";

export default function About() {
  const sections = [
    {
      icon: <Zap className="h-6 w-6 text-amber-600" />,
      bg: "bg-amber-100",
      title: "Subsidized Electricity",
      content:
        "We help you maximize government electricity subsidies. Our system suggests running pumps only when necessary based on weather, ensuring every unit of free power is used efficiently.",
    },
    {
      icon: <CloudRain className="h-6 w-6 text-blue-600" />,
      bg: "bg-blue-100",
      title: "Weather-Smart Irrigation",
      content:
        "Don't water if it's going to rain. We integrate live weather forecasts to stop you from pumping water when nature provides it, saving electricity and protecting your crops.",
    },
    {
      icon: <Leaf className="h-6 w-6 text-emerald-600" />,
      bg: "bg-emerald-100",
      title: "Water Conservation",
      content:
        "Groundwater is precious. By preventing over-irrigation, we support government initiatives to save water for future planting seasons while maintaining soil health.",
    },
    {
      icon: <Landmark className="h-6 w-6 text-purple-600" />,
      bg: "bg-purple-100",
      title: "Digital Agriculture",
      content:
        "Join the digital revolution. This platform connects farmers directly with power authorities, bringing transparency to power distribution and helping you make data-driven decisions.",
    },
    {
      icon: <Info className="h-6 w-6 text-rose-600" />,
      bg: "bg-rose-100",
      title: "Government Advisories",
      content:
        "Stay aligned with official warnings. During heatwaves or heavy storms, we help you adjust your irrigation plans to match current government safety advisories.",
    },
  ];

  return (
    <div className="min-h-screen bg-stone-50 text-slate-800 font-sans">
      <div className="max-w-6xl mx-auto px-6 py-10">
        
        {/* Hero Section */}
        <div className="mb-12 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-sm font-semibold mb-4">
            <Sprout className="h-4 w-4" />
            <span>Smart Farming Initiative</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Empowering Farmers with <br className="hidden md:block" />
            <span className="text-emerald-600">Smart Data & Energy</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl leading-relaxed">
            A simple platform designed to help you align your irrigation needs with 
            weather forecasts and government benefits—saving you money, water, and time.
          </p>
        </div>

        {/* Why This Matters - Highlight Box */}
        <div className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm mb-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-emerald-50 rounded-full blur-3xl opacity-50"></div>
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Why is this important?</h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              Farming depends on nature. Unplanned irrigation leads to wasted electricity, 
              depleted groundwater, and stressed crops. We help you make the 
              <strong className="text-emerald-700"> right decision at the right time</strong>, 
              ensuring your farm remains sustainable and profitable.
            </p>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {sections.map((item, index) => (
            <div
              key={index}
              className="group bg-white border border-stone-200 rounded-2xl p-6 hover:shadow-xl hover:border-emerald-200 hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`w-12 h-12 ${item.bg} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {item.content}
              </p>
            </div>
          ))}
        </div>

        {/* Two Column Layout: Scenario & Future */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          
          {/* Real World Example */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-blue-900 mb-4 flex items-center gap-2">
              <CloudRain className="h-6 w-6 text-blue-600" />
              Real World Scenario
            </h2>
            <p className="text-blue-800 leading-relaxed">
              Imagine rain is predicted for your district tomorrow. Normally, you might run your pump tonight. 
              <br /><br />
              <strong>With this platform:</strong> We alert you to the forecast. You skip irrigation, 
              saving 4 hours of electricity usage and preventing water-logging in your field.
            </p>
          </div>

          {/* Future Roadmap */}
          <div className="bg-stone-100 border border-stone-200 rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Coming Soon</h2>
            <ul className="space-y-4">
              {[
                "AI-based crop water predictions",
                "Village-level hyper-local weather",
                "Automated power allocation alerts",
                "Mobile app with SMS support"
              ].map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-700">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer / Disclaimer */}
        <div className="border-t border-stone-200 pt-8 text-center md:text-left">
          <p className="text-stone-500 text-sm max-w-4xl">
            <strong>Disclaimer:</strong> This platform serves as a decision-support system. 
            Please always refer to official government policies and local agriculture notifications 
            for critical farming decisions.
          </p>
        </div>
        
      </div>
    </div>
  );
}
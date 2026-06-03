import {
  Info,
  Leaf,
  CloudRain,
  Zap,
  Landmark,
  Sprout,
  CheckCircle2
} from "lucide-react";

export default function About() {
  const sections = [
    {
      icon: <Zap className="h-6 w-6 text-amber-600 group-hover:scale-110 transition-transform duration-300" />,
      bg: "bg-amber-100/50",
      border: "border-amber-200/50",
      title: "Subsidized Electricity",
      content:
        "We help you maximize government electricity subsidies. Our system suggests running pumps only when necessary based on weather, ensuring every unit of free power is used efficiently.",
    },
    {
      icon: <CloudRain className="h-6 w-6 text-blue-600 group-hover:scale-110 transition-transform duration-300" />,
      bg: "bg-blue-100/50",
      border: "border-blue-200/50",
      title: "Weather-Smart Irrigation",
      content:
        "Don't water if it's going to rain. We integrate live weather forecasts to stop you from pumping water when nature provides it, saving electricity and protecting your crops.",
    },
    {
      icon: <Leaf className="h-6 w-6 text-emerald-600 group-hover:scale-110 transition-transform duration-300" />,
      bg: "bg-emerald-100/50",
      border: "border-emerald-200/50",
      title: "Water Conservation",
      content:
        "Groundwater is precious. By preventing over-irrigation, we support government initiatives to save water for future planting seasons while maintaining soil health.",
    },
    {
      icon: <Landmark className="h-6 w-6 text-purple-600 group-hover:scale-110 transition-transform duration-300" />,
      bg: "bg-purple-100/50",
      border: "border-purple-200/50",
      title: "Digital Agriculture",
      content:
        "Join the digital revolution. This platform connects farmers directly with power authorities, bringing transparency to power distribution and helping you make data-driven decisions.",
    },
    {
      icon: <Info className="h-6 w-6 text-rose-600 group-hover:scale-110 transition-transform duration-300" />,
      bg: "bg-rose-100/50",
      border: "border-rose-200/50",
      title: "Government Advisories",
      content:
        "Stay aligned with official warnings. During heatwaves or heavy storms, we help you adjust your irrigation plans to match current government safety advisories.",
    },
  ];

  return (
    <div className="bg-[#fafcff] min-h-screen pb-20 font-sans selection:bg-emerald-200 selection:text-emerald-900 relative overflow-hidden">
      
      {/* Background Decorative Elements (Matching Home/Login Vibe) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[10%] w-[40%] h-[50%] rounded-full bg-emerald-200/20 blur-[120px]" />
        <div className="absolute top-[40%] right-[-10%] w-[30%] h-[40%] rounded-full bg-teal-200/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[30%] rounded-full bg-blue-200/20 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
      </div>

      {/* Hero Header */}
      <div className="relative z-10 pt-20 pb-24 lg:pt-32 lg:pb-40 text-center px-4 sm:px-6">
        <div className="absolute inset-0 z-[-1] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=2072&auto=format&fit=crop"
            alt="About Background"
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#fafcff] via-[#fafcff]/80 to-transparent"></div>
        </div>

        <div className="container mx-auto max-w-4xl animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-50/80 backdrop-blur-md border border-emerald-200/60 text-emerald-700 text-sm font-bold mb-8 shadow-sm">
            <Sprout className="h-4 w-4" />
            <span className="uppercase tracking-wider">Our Mission</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-extrabold mb-8 text-slate-900 leading-tight tracking-tight">
            Empowering Farmers <br /> with <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">Smart Data</span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-medium">
            We bridge the gap between traditional farming and modern technology, ensuring sustainable growth through efficient resource management.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-20 -mt-10 lg:-mt-20">

        {/* Why This Matters - Glassmorphic Card */}
        <div className="bg-white/70 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_8px_40px_rgb(0,0,0,0.04)] border border-white p-10 md:p-16 mb-20 text-center mx-auto max-w-5xl">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 font-serif tracking-tight">Why is this important?</h2>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-medium">
            Farming depends on nature. Unplanned irrigation leads to wasted electricity,
            depleted groundwater, and stressed crops. We help you make the{" "}
            <strong className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">right decision at the right time</strong>,
            ensuring your farm remains sustainable and profitable.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {sections.map((item, index) => (
            <div
              key={index}
              className="group bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-white hover:border-emerald-100 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgb(16,185,129,0.08)] hover:-translate-y-1 transition-all duration-500"
            >
              <div className={`w-14 h-14 ${item.bg} border ${item.border} rounded-2xl flex items-center justify-center mb-6`}>
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3 tracking-tight">{item.title}</h3>
              <p className="text-slate-500 leading-relaxed font-medium text-sm">
                {item.content}
              </p>
            </div>
          ))}
        </div>

        {/* Two Column Layout: Scenario & Future */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">

          {/* Real World Example */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-10 md:p-12 text-white relative overflow-hidden shadow-2xl shadow-blue-900/20 group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-900/30 rounded-full blur-2xl -ml-10 -mb-10"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                  <CloudRain className="h-8 w-8 text-blue-200" />
                </div>
                <h2 className="text-3xl font-serif font-bold tracking-tight">Real World Scenario</h2>
              </div>
              <div className="space-y-6 text-blue-50">
                <p className="text-lg leading-relaxed font-medium">
                  Imagine rain is predicted for your district tomorrow. Normally, you might run your pump tonight.
                </p>
                <div className="p-6 bg-white/10 rounded-2xl border border-white/20 backdrop-blur-md relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-400"></div>
                  <strong className="block text-white mb-2 text-lg">With our platform:</strong>
                  <p className="leading-relaxed text-blue-100 font-medium">
                    We alert you to the forecast. You skip irrigation, saving 4 hours of electricity usage and preventing water-logging.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Future Roadmap */}
          <div className="bg-white/70 backdrop-blur-xl border border-white rounded-[2.5rem] p-10 md:p-12 shadow-[0_8px_40px_rgb(0,0,0,0.04)]">
            <h2 className="text-3xl font-bold text-slate-900 mb-8 font-serif tracking-tight">Coming Soon</h2>
            <ul className="space-y-6">
              {[
                "AI-based crop water predictions",
                "Village-level hyper-local weather",
                "Automated power allocation alerts",
                "Mobile app with SMS support"
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500 transition-colors duration-300 text-emerald-600">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <span className="text-lg text-slate-700 font-medium pt-1.5">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="text-center pt-10 px-4">
          <p className="text-slate-400 text-sm max-w-3xl mx-auto font-medium bg-white/50 backdrop-blur-sm border border-slate-100 rounded-2xl py-4 px-6 inline-block">
            <strong className="text-slate-500 mr-2">Disclaimer:</strong> 
            This platform serves as a decision-support system.
            Please always refer to official government policies and local agriculture notifications
            for critical farming decisions.
          </p>
        </div>

      </div>
    </div>
  );
}
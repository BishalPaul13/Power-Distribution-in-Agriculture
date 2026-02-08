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
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Hero Header */}
      <div className="bg-slate-50 text-slate-900 py-20 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.pexels.com/photos/2132257/pexels-photo-2132257.jpeg"
            alt="About Background"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-white/60 to-transparent"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-700 text-sm font-semibold mb-6">
            <Sprout className="h-4 w-4" />
            <span>Our Mission</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 text-slate-900">
            Empowering Farmers <br /> with <span className="text-emerald-600">Smart Data</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium">
            We bridge the gap between traditional farming and modern technology, ensuring sustainable growth through efficient resource management.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-16 relative z-20">

        {/* Why This Matters */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-16 border border-slate-100">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 font-serif">Why is this important?</h2>
            <p className="text-lg text-slate-600 leading-relaxed">
              Farming depends on nature. Unplanned irrigation leads to wasted electricity,
              depleted groundwater, and stressed crops. We help you make the
              <strong className="text-emerald-600 font-semibold"> right decision at the right time</strong>,
              ensuring your farm remains sustainable and profitable.
            </p>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {sections.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center mb-6`}>
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                {item.content}
              </p>
            </div>
          ))}
        </div>

        {/* Two Column Layout: Scenario & Future */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">

          {/* Real World Example */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-10 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>

            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <CloudRain className="h-8 w-8 text-blue-200" />
                Real World Scenario
              </h2>
              <div className="space-y-6 text-blue-50">
                <p className="text-lg leading-relaxed">
                  Imagine rain is predicted for your district tomorrow. Normally, you might run your pump tonight.
                </p>
                <div className="p-4 bg-white/10 rounded-xl border border-white/20 backdrop-blur-sm">
                  <strong className="block text-white mb-1">With our platform:</strong>
                  We alert you to the forecast. You skip irrigation, saving 4 hours of electricity usage and preventing water-logging.
                </div>
              </div>
            </div>
          </div>

          {/* Future Roadmap */}
          <div className="bg-white border border-slate-200 rounded-3xl p-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-8 font-serif">Coming Soon</h2>
            <ul className="space-y-6">
              {[
                "AI-based crop water predictions",
                "Village-level hyper-local weather",
                "Automated power allocation alerts",
                "Mobile app with SMS support"
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  </div>
                  <span className="text-lg text-slate-700 font-medium">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="text-center border-t border-slate-200 pt-10">
          <p className="text-slate-500 text-sm max-w-3xl mx-auto">
            <strong>Disclaimer:</strong> This platform serves as a decision-support system.
            Please always refer to official government policies and local agriculture notifications
            for critical farming decisions.
          </p>
        </div>

      </div>
    </div>
  );
}
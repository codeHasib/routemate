// app/about/page.jsx
"use client";

import { useTheme } from "@/context/ThemeContext";
import { FiUsers, FiShield, FiCpu, FiTrendingUp } from "react-icons/fi";

export default function AboutPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Mock corporate metrics for layout architecture
  const metrics = [
    {
      value: "45M+",
      label: "Completed Routes",
      description: "Intercity transits logged",
    },
    {
      value: "120+",
      label: "Verified Operators",
      description: "Vetted logistical networks",
    },
    {
      value: "99.9%",
      label: "System Uptime",
      description: "Automated routing pulse",
    },
    {
      value: "24/7",
      label: "Control Desk",
      description: "Live terminal tracking",
    },
  ];

  // Core values aligning with the digital platform's mission
  const coreValues = [
    {
      icon: <FiCpu className="text-xl" />,
      title: "Algorithmic Precision",
      description:
        "We eliminate layout inefficiencies and routing delays using real-time node optimization systems.",
    },
    {
      icon: <FiShield className="text-xl" />,
      title: "Vetted Frameworks",
      description:
        "Every operator undergoes strict verification protocols to guarantee baseline safety across all parameters.",
    },
    {
      icon: <FiUsers className="text-xl" />,
      title: "User-Centric Architecture",
      description:
        "Building responsive, actionable mobile grids that put booking control entirely into the passenger's interface.",
    },
    {
      icon: <FiTrendingUp className="text-xl" />,
      title: "Scalable Infrastructure",
      description:
        "Engineered to effortlessly handle regional scaling and high-volume enterprise account provisions.",
    },
  ];

  return (
    <div
      className={`min-h-screen w-full font-sans relative overflow-hidden py-20 sm:py-28 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
        isDark ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* Absolute Geometric Background Mesh */}
      <div
        className={`absolute inset-0 pointer-events-none transition-all duration-300 ${
          isDark
            ? "bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)]"
            : "bg-[linear-gradient(to_right,rgba(0,0,0,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.015)_1px,transparent_1px)]"
        } bg-[size:4rem_4rem]`}
      />

      {/* Ambient Glow Emitters */}
      <div
        className={`absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] blur-[140px] rounded-full pointer-events-none transition-colors duration-300 ${
          isDark ? "bg-white/[0.015]" : "bg-slate-900/[0.02]"
        }`}
      />

      <div className="relative z-10 max-w-5xl w-full mx-auto space-y-20 sm:space-y-28">
        {/* SECTION 1: HEADER & MISSION PARADIGM */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div
            className={`inline-flex items-center space-x-2 px-3 py-1 rounded-md text-xs font-mono uppercase tracking-widest border transition-all duration-300 ${
              isDark
                ? "bg-white/5 border-white/10 text-zinc-400"
                : "bg-slate-200/60 border-slate-300/80 text-slate-600"
            }`}
          >
            <span>System Manifesto</span>
          </div>
          <h1
            className={`text-4xl sm:text-5xl font-extrabold tracking-tight transition-colors duration-300 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Perfectionizing <br />
            <span className={isDark ? "text-zinc-400" : "text-slate-500"}>
              Transit Routing.
            </span>
          </h1>
          <p
            className={`font-light text-sm sm:text-base leading-relaxed transition-colors duration-300 ${
              isDark ? "text-zinc-400" : "text-slate-600"
            }`}
          >
            RouteMate builds intelligent visual and programmatic pipelines
            connecting transit operators with modern travelers. We replace
            legacy logistics with functional, real-time discovery modules.
          </p>
        </div>

        {/* SECTION 2: METRIC MATRIX GRID */}
        <div
          className={`grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 border-y py-12 transition-colors duration-300 ${
            isDark ? "border-white/5" : "border-slate-200"
          }`}
        >
          {metrics.map((item, idx) => (
            <div key={idx} className="text-center space-y-1">
              <h3
                className={`text-3xl sm:text-4xl font-mono font-bold tracking-tight transition-colors duration-300 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                {item.value}
              </h3>
              <h4
                className={`text-xs font-semibold tracking-wide transition-colors duration-300 ${
                  isDark ? "text-zinc-400" : "text-slate-700"
                }`}
              >
                {item.label}
              </h4>
              <p className="text-[11px] font-mono text-zinc-500">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* SECTION 3: CORE VALUE OBJECTS */}
        <div className="space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-bold tracking-tight">
              Operational Philosophy
            </h2>
            <p
              className={`text-xs font-mono transition-colors duration-300 ${isDark ? "text-zinc-500" : "text-slate-400"}`}
            >
              The utility directives guiding our core design choices
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {coreValues.map((value, idx) => (
              <div
                key={idx}
                className={`p-6 border rounded-2xl space-y-4 shadow-sm transition-all duration-300 ${
                  isDark
                    ? "bg-white/[0.02] border-white/5 hover:border-white/10"
                    : "bg-white border-slate-200/80 hover:border-slate-300"
                }`}
              >
                <div
                  className={`p-3 rounded-xl w-fit border transition-all duration-300 ${
                    isDark
                      ? "bg-white/[0.03] border-white/5 text-zinc-300"
                      : "bg-slate-100 border-slate-200 text-slate-700"
                  }`}
                >
                  {value.icon}
                </div>
                <div className="space-y-1.5">
                  <h3
                    className={`text-sm font-bold tracking-tight transition-colors duration-300 ${
                      isDark ? "text-zinc-200" : "text-slate-800"
                    }`}
                  >
                    {value.title}
                  </h3>
                  <p
                    className={`text-xs sm:text-sm font-light leading-relaxed transition-colors duration-300 ${
                      isDark ? "text-zinc-400" : "text-slate-600"
                    }`}
                  >
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

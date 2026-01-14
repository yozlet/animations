import { Link } from "react-router-dom";
import { Activity, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

interface Animation {
  id: string;
  title: string;
  description: string;
  path: string;
  icon: React.ReactNode;
  gradient: string;
}

const animations: Animation[] = [
  {
    id: "span-metrics",
    title: "The Cardinality Explosion Problem",
    description:
      "Explore how aggregating spans into metrics creates exponential storage challenges. See how each dimension multiplies the number of time series combinations.",
    path: "/span-metrics",
    icon: <Activity className="w-8 h-8" />,
    gradient: "from-blue-400 to-purple-400",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Observability Animations
            </h1>
            <p className="text-xl text-slate-400">
              Interactive visualizations for understanding distributed systems
            </p>
          </motion.div>
        </div>

        {/* Animation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {animations.map((animation, index) => (
            <motion.div
              key={animation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link to={animation.path}>
                <motion.div
                  className="group relative bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-slate-700 hover:border-slate-600 transition-all overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Gradient Overlay */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${animation.gradient} opacity-0 group-hover:opacity-10 transition-opacity`}
                  />

                  {/* Content */}
                  <div className="relative z-10">
                    <div
                      className={`mb-4 inline-block p-3 rounded-xl bg-gradient-to-br ${animation.gradient} bg-opacity-10`}
                    >
                      {animation.icon}
                    </div>

                    <h2 className="text-xl font-semibold mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-400 group-hover:to-purple-400 transition-all">
                      {animation.title}
                    </h2>

                    <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                      {animation.description}
                    </p>

                    <div className="flex items-center text-blue-400 text-sm font-medium group-hover:gap-2 gap-1 transition-all">
                      <span>Explore</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <motion.div
          className="mt-16 text-center text-slate-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p>Built with React, TypeScript, and Framer Motion</p>
        </motion.div>
      </div>
    </div>
  );
}

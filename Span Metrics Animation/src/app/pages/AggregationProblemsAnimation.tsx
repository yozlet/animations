import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  MessageSquareOff,
} from "lucide-react";

interface Span {
  id: string;
  service: string;
  endpoint: string;
  duration: number;
  statusCode: number;
  color: string;
}

const services = [
  { name: "API Gateway", color: "#3b82f6" },
  { name: "Auth Service", color: "#8b5cf6" },
  { name: "User Service", color: "#10b981" },
  { name: "Payment Service", color: "#f59e0b" },
];

const endpoints = ["/users", "/login", "/checkout", "/products"];
const statusCodes = [200, 201, 400, 404, 500];

function generateSpan(id: number): Span {
  const service = services[Math.floor(Math.random() * services.length)];
  return {
    id: `span-${id}`,
    service: service.name,
    endpoint: endpoints[Math.floor(Math.random() * endpoints.length)],
    duration: Math.random() * 400 + 100,
    statusCode: statusCodes[Math.floor(Math.random() * statusCodes.length)],
    color: service.color,
  };
}

const TOTAL_SCENES = 9;

const narrations = [
  "Tracing creates spans - basically records of individual operations happening in your system. Each span has attributes like duration, service name, and operation type. Think of these as the context clues that help you understand the behavior of your software.",
  "When you've got instrumented software running under heavy load, you end up with a ton of spans. We're talking potentially millions per minute for a busy web service.",
  "Now, let's say you want to know the average duration of your spans. If they were sitting in a nice, well-indexed database, you could just run a query like `SELECT AVG(duration) FROM spans;`",
  "However, in practice, spans are usually stored in systems that are built for blazing-fast writes, not fancy queries. Try to query a full day's worth of spans and you'll be waiting... and waiting. Real-time analysis becomes pretty painful.",
  "So what's the solution? Aggregate as you go. Keep running totals and counts for things like span durations per service, and record this data once per minute. That way, you can calculate averages quickly without having to scan through everything.",
  "Of course, there's a tradeoff. When you aggregate, you lose the fine details - you can't zoom in on individual spans anymore. And if you want to subdivide by a dimension like operation type, you have to maintain separate aggregates for each combination, which can get complex fast.",
  "This is fine as long as you know in advance what dimensions you care about. And as long as your software doesn't change too often, because every time you add a new attribute to track, you have to update your aggregation logic.",
  "Plus, every time you realise that you want to investigate a new dimension, you're out of luck unless you've been aggregating it from the start. Retrospective analysis becomes impossible, unless you want to go back and reprocess all your raw spans.",
  "So, you start off with as many dimensions as you think you'll need. If you have too few, you miss out on insights. Too many, and your aggregation tables explode in size - especially if some dimensions have high cardinality, like user IDs or request paths.",
];

function Scene1() {
  const [spans, setSpans] = useState<Span[]>([]);

  useEffect(() => {
    // Generate 4 spans with staggered timing
    const timeouts: NodeJS.Timeout[] = [];
    [0, 1, 2, 3].forEach((i) => {
      const timeout = setTimeout(() => {
        setSpans((prev) => [...prev, generateSpan(i)]);
      }, i * 600);
      timeouts.push(timeout);
    });

    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <div className="flex flex-col gap-8 h-full">
      {/* Span Cards */}
      <div className="flex justify-center gap-4 flex-wrap">
        <AnimatePresence>
          {spans.map((span, index) => (
            <motion.div
              key={span.id}
              initial={{ opacity: 0, y: -20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="p-4 rounded-lg border-2"
              style={{
                borderColor: span.color,
                backgroundColor: `${span.color}20`,
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: span.color }}
                />
                <div className="font-semibold text-sm" style={{ color: span.color }}>
                  {span.service}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                <div className="text-slate-400">Endpoint:</div>
                <div className="text-slate-200">{span.endpoint}</div>
                <div className="text-slate-400">Duration:</div>
                <div className="text-slate-200">{span.duration.toFixed(0)}ms</div>
                <div className="text-slate-400">Status:</div>
                <div className="text-slate-200">{span.statusCode}</div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Bar Graph */}
      <div className="flex-1 flex flex-col justify-end px-12 pb-8">
        <div className="relative h-64">
          {/* Y-axis label */}
          <div className="absolute -left-8 top-0 bottom-0 flex items-center">
            <div className="text-xs text-slate-400 -rotate-90 whitespace-nowrap">
              Duration (ms)
            </div>
          </div>

          {/* Bars */}
          <div className="h-full flex items-end justify-center gap-8">
            <AnimatePresence>
              {spans.map((span) => (
                <motion.div
                  key={span.id}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: `${(span.duration / 500) * 100}%`, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="w-16 rounded-t relative group"
                  style={{ backgroundColor: span.color }}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    {span.duration.toFixed(0)}ms
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* X-axis */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-slate-600" />
          <div className="absolute -bottom-6 left-0 right-0 text-center text-xs text-slate-400">
            Spans
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AggregationProblemsAnimation() {
  const [currentScene, setCurrentScene] = useState(0);
  const [showCaptions, setShowCaptions] = useState(true);

  const handleNext = () => {
    if (currentScene < TOTAL_SCENES - 1) {
      setCurrentScene(currentScene + 1);
    }
  };

  const handlePrevious = () => {
    if (currentScene > 0) {
      setCurrentScene(currentScene - 1);
    }
  };

  const handleCaptionToggle = () => {
    setShowCaptions(!showCaptions);
  };

  useEffect(() => {
    if (!showCaptions) {
      console.log("📝 Presenter Mode: Captions hidden");
      console.log(`Scene ${currentScene + 1}:`, narrations[currentScene]);
    }
  }, [showCaptions, currentScene]);

  const renderScene = () => {
    switch (currentScene) {
      case 0:
        return <Scene1 />;
      default:
        return (
          <div className="flex items-center justify-center h-full text-2xl text-slate-400">
            Scene {currentScene + 1}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Animations</span>
          </Link>

          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            The Aggregation Problem
          </h1>

          <button
            onClick={handleCaptionToggle}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
          >
            {showCaptions ? (
              <MessageSquare className="w-5 h-5" />
            ) : (
              <MessageSquareOff className="w-5 h-5" />
            )}
            <span className="text-sm">
              {showCaptions ? "Hide" : "Show"} Captions
            </span>
          </button>
        </div>

        {/* Main Scene Area */}
        <div className="relative bg-slate-800/30 backdrop-blur rounded-2xl border border-slate-700 p-8 min-h-[600px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScene}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {renderScene()}
            </motion.div>
          </AnimatePresence>

          {/* Caption */}
          {showCaptions && (
            <motion.div
              key={`caption-${currentScene}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="absolute bottom-8 left-8 right-8 bg-slate-900/90 backdrop-blur rounded-xl p-6 border border-slate-700"
            >
              <p className="text-slate-300 leading-relaxed">
                {narrations[currentScene]}
              </p>
            </motion.div>
          )}
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={handlePrevious}
            disabled={currentScene === 0}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: TOTAL_SCENES }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentScene(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentScene
                    ? "bg-blue-500 w-8"
                    : "bg-slate-600 hover:bg-slate-500"
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={currentScene === TOTAL_SCENES - 1}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            Next
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

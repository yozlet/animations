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

function Scene2() {
  const [spans, setSpans] = useState<Span[]>([]);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    let count = 0;
    const interval = setInterval(() => {
      if (count < 50) {
        const newSpan = generateSpan(count);
        setSpans((prev) => [...prev.slice(-49), newSpan]);
        count++;
        setCounter(count);
      }
    }, 80);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-8 h-full justify-center items-center">
      {/* Counter */}
      <div className="text-center">
        <div className="text-6xl font-bold text-blue-400 mb-2">{counter}</div>
        <div className="text-slate-400">spans generated</div>
      </div>

      {/* Span Stream */}
      <div className="relative w-full max-w-4xl h-96 overflow-hidden bg-slate-800/30 rounded-xl border border-slate-700">
        <div className="absolute inset-0 flex flex-wrap gap-2 p-4 content-start overflow-hidden">
          <AnimatePresence mode="popLayout">
            {spans.map((span) => (
              <motion.div
                key={span.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.8, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ duration: 0.2 }}
                className="w-12 h-12 rounded border-2 flex items-center justify-center"
                style={{
                  borderColor: span.color,
                  backgroundColor: `${span.color}15`,
                }}
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: span.color }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Overflow indicator */}
        <div className="absolute bottom-4 right-4 bg-slate-900/90 px-3 py-1 rounded text-xs text-slate-400">
          Millions per minute...
        </div>
      </div>
    </div>
  );
}

function Scene3() {
  const [showQuery, setShowQuery] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowQuery(true), 500);
    const timer2 = setTimeout(() => setShowResult(true), 2000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="flex flex-col gap-8 h-full justify-center items-center">
      {/* Database Icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="text-6xl">🗄️</div>
        <div className="text-slate-400 text-sm">Well-indexed Database</div>
      </motion.div>

      {/* SQL Query */}
      {showQuery && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl bg-slate-800 rounded-lg border border-slate-600 p-6 font-mono"
        >
          <div className="text-purple-400 text-lg">
            SELECT <span className="text-blue-400">AVG</span>(duration)
          </div>
          <div className="text-purple-400 text-lg">
            FROM <span className="text-green-400">spans</span>;
          </div>
        </motion.div>
      )}

      {/* Query Result */}
      {showResult && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl bg-slate-800 rounded-lg border border-green-600 p-6"
        >
          <div className="text-slate-400 text-sm mb-2">Result:</div>
          <div className="text-4xl font-bold text-green-400">247ms</div>
          <div className="text-slate-500 text-xs mt-2">Query executed in 0.03s</div>
        </motion.div>
      )}
    </div>
  );
}

function Scene4() {
  const [elapsed, setElapsed] = useState(0);
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((prev) => prev + 1);
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-8 h-full justify-center items-center">
      {/* Database Icon - less optimized */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-4"
      >
        <div className="text-6xl opacity-50">💾</div>
        <div className="text-slate-400 text-sm">Time-series Database</div>
        <div className="text-slate-500 text-xs">(optimized for writes)</div>
      </motion.div>

      {/* SQL Query */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="w-full max-w-2xl bg-slate-800 rounded-lg border border-slate-600 p-6 font-mono"
      >
        <div className="text-purple-400 text-lg">
          SELECT <span className="text-blue-400">AVG</span>(duration)
        </div>
        <div className="text-purple-400 text-lg">
          FROM <span className="text-green-400">spans</span>
        </div>
        <div className="text-purple-400 text-lg">
          WHERE timestamp &gt; <span className="text-yellow-400">NOW() - 1 DAY</span>;
        </div>
      </motion.div>

      {/* Loading State */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="w-full max-w-2xl bg-slate-800 rounded-lg border border-yellow-600 p-6"
      >
        <div className="flex items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="text-3xl"
          >
            ⏳
          </motion.div>
          <div className="flex-1">
            <div className="text-yellow-400 text-lg mb-2">
              Querying{dots}
            </div>
            <div className="text-slate-400 text-sm">
              Scanning through millions of spans...
            </div>
            <div className="text-slate-500 text-xs mt-2">
              Elapsed: {elapsed}s
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-2 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: "0%" }}
            animate={{ width: "60%" }}
            transition={{ duration: 10, ease: "linear" }}
            className="h-full bg-yellow-500"
          />
        </div>
      </motion.div>
    </div>
  );
}

function Scene5() {
  const [aggregates, setAggregates] = useState(
    services.map((s) => ({ service: s.name, color: s.color, count: 0, total: 0 }))
  );
  const [spansProcessed, setSpansProcessed] = useState(0);

  useEffect(() => {
    let count = 0;
    const interval = setInterval(() => {
      if (count < 20) {
        const span = generateSpan(count);
        setAggregates((prev) =>
          prev.map((agg) =>
            agg.service === span.service
              ? { ...agg, count: agg.count + 1, total: agg.total + span.duration }
              : agg
          )
        );
        setSpansProcessed((prev) => prev + 1);
        count++;
      }
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-8 h-full justify-center">
      <div className="text-center mb-4">
        <div className="text-3xl font-bold text-green-400 mb-2">
          Real-time Aggregation
        </div>
        <div className="text-slate-400 text-sm">
          Spans processed: {spansProcessed}
        </div>
      </div>

      <div className="flex justify-center gap-6">
        {/* Incoming Spans */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col items-center gap-2"
        >
          <div className="text-slate-400 text-sm mb-2">Incoming Spans</div>
          <div className="text-4xl">📊</div>
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 0.6, repeat: Infinity }}
            className="text-xs text-slate-500"
          >
            streaming...
          </motion.div>
        </motion.div>

        {/* Arrow */}
        <div className="flex items-center">
          <motion.div
            animate={{ x: [0, 10, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-4xl text-blue-400"
          >
            →
          </motion.div>
        </div>

        {/* Aggregation Table */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-800 rounded-lg border border-slate-600 p-4 min-w-[300px]"
        >
          <div className="text-slate-400 text-sm mb-3">Aggregates (per minute)</div>
          <div className="space-y-2">
            {aggregates.map((agg) => (
              <div
                key={agg.service}
                className="flex items-center justify-between p-2 rounded"
                style={{ backgroundColor: `${agg.color}10` }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: agg.color }}
                  />
                  <div className="text-sm" style={{ color: agg.color }}>
                    {agg.service}
                  </div>
                </div>
                <div className="text-xs text-slate-300">
                  count: <span className="font-mono">{agg.count}</span> | total:{" "}
                  <span className="font-mono">{agg.total.toFixed(0)}ms</span>
                  {agg.count > 0 && (
                    <span className="text-green-400 ml-2">
                      avg: {(agg.total / agg.count).toFixed(0)}ms
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Scene6() {
  const [showDetail, setShowDetail] = useState(true);
  const [spans] = useState([
    generateSpan(1),
    generateSpan(2),
    generateSpan(3),
    generateSpan(4),
  ]);

  useEffect(() => {
    const timer = setTimeout(() => setShowDetail(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col gap-8 h-full justify-center items-center">
      <div className="text-2xl font-bold text-orange-400 mb-4">The Tradeoff</div>

      <div className="flex gap-8 items-center">
        {/* Before: Detailed Spans */}
        <AnimatePresence mode="wait">
          {showDetail ? (
            <motion.div
              key="detailed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="space-y-2"
            >
              <div className="text-slate-400 text-sm text-center mb-3">
                Individual Spans
              </div>
              {spans.map((span) => (
                <div
                  key={span.id}
                  className="p-3 rounded border-2 w-64"
                  style={{
                    borderColor: span.color,
                    backgroundColor: `${span.color}20`,
                  }}
                >
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Service:</span>
                      <span style={{ color: span.color }}>{span.service}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Endpoint:</span>
                      <span className="text-slate-300">{span.endpoint}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Duration:</span>
                      <span className="text-slate-300">{span.duration.toFixed(0)}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Status:</span>
                      <span className="text-slate-300">{span.statusCode}</span>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="aggregated"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-800 rounded-lg border border-slate-600 p-6"
            >
              <div className="text-slate-400 text-sm text-center mb-3">
                Aggregated Data
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-400 mb-2">247ms</div>
                <div className="text-slate-400 text-sm">Average Duration</div>
                <div className="text-slate-500 text-xs mt-4">
                  ❌ Individual details lost
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Scene7() {
  const [dimensions, setDimensions] = useState(["service"]);

  useEffect(() => {
    const timer1 = setTimeout(() => setDimensions(["service", "endpoint"]), 2000);
    const timer2 = setTimeout(
      () => setDimensions(["service", "endpoint", "status_code"]),
      3500
    );
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const aggregateCount = Math.pow(4, dimensions.length);

  return (
    <div className="flex flex-col gap-8 h-full justify-center items-center">
      <div className="text-2xl font-bold text-yellow-400 mb-4">
        Pre-defined Dimensions
      </div>

      <div className="bg-slate-800 rounded-lg border border-slate-600 p-6 min-w-[400px]">
        <div className="text-slate-400 text-sm mb-4">Tracking dimensions:</div>
        <div className="space-y-2 mb-6">
          <AnimatePresence>
            {dimensions.map((dim, index) => (
              <motion.div
                key={dim}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 p-2 bg-blue-500/20 rounded"
              >
                <div className="text-blue-400">✓</div>
                <div className="text-blue-300">{dim}</div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="border-t border-slate-700 pt-4">
          <div className="text-slate-400 text-sm mb-2">Storage required:</div>
          <motion.div
            key={aggregateCount}
            initial={{ scale: 1.2, color: "#fbbf24" }}
            animate={{ scale: 1, color: "#94a3b8" }}
            className="text-3xl font-bold"
          >
            {aggregateCount} aggregate tables
          </motion.div>
        </div>
      </div>

      <div className="text-slate-500 text-sm text-center max-w-md">
        Want to track a new dimension? Update your aggregation logic first...
      </div>
    </div>
  );
}

function Scene8() {
  const [showQuestion, setShowQuestion] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowQuestion(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col gap-8 h-full justify-center items-center">
      <div className="text-2xl font-bold text-red-400 mb-4">
        Retrospective Analysis
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800 rounded-lg border border-slate-600 p-6 max-w-2xl"
      >
        <div className="text-slate-300 mb-4">
          Yesterday, a user reported slow response times. You want to investigate:
        </div>
        <div className="text-blue-300 font-mono text-sm mb-6">
          "Which user_id experienced the slowest requests?"
        </div>

        {showQuestion && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-900/30 border border-red-600 rounded p-4"
          >
            <div className="text-red-400 text-lg mb-2">❌ Not Possible</div>
            <div className="text-slate-400 text-sm">
              You didn't aggregate by <span className="text-red-300">user_id</span>.
              The raw span data is gone.
            </div>
          </motion.div>
        )}
      </motion.div>

      <div className="text-slate-500 text-sm text-center max-w-md">
        Unless you've been aggregating it from the start, you can't answer new
        questions about historical data.
      </div>
    </div>
  );
}

function Scene9() {
  const [cardinalityLevel, setCardinalityLevel] = useState(1);

  useEffect(() => {
    const timer1 = setTimeout(() => setCardinalityLevel(2), 2000);
    const timer2 = setTimeout(() => setCardinalityLevel(3), 3500);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const getDimensions = () => {
    switch (cardinalityLevel) {
      case 1:
        return [{ name: "service", cardinality: 4 }];
      case 2:
        return [
          { name: "service", cardinality: 4 },
          { name: "endpoint", cardinality: 10 },
        ];
      case 3:
        return [
          { name: "service", cardinality: 4 },
          { name: "endpoint", cardinality: 10 },
          { name: "user_id", cardinality: 10000 },
        ];
      default:
        return [];
    }
  };

  const dimensions = getDimensions();
  const totalCombinations = dimensions.reduce(
    (acc, dim) => acc * dim.cardinality,
    1
  );

  return (
    <div className="flex flex-col gap-8 h-full justify-center items-center">
      <div className="text-2xl font-bold text-red-400 mb-4">
        Cardinality Explosion
      </div>

      <div className="bg-slate-800 rounded-lg border border-slate-600 p-6 min-w-[450px]">
        <div className="text-slate-400 text-sm mb-4">Dimensions tracked:</div>
        <div className="space-y-2 mb-6">
          <AnimatePresence>
            {dimensions.map((dim) => (
              <motion.div
                key={dim.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-2 bg-slate-700 rounded"
              >
                <div className="text-slate-300">{dim.name}</div>
                <div className="text-slate-400 text-sm">
                  cardinality: {dim.cardinality.toLocaleString()}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="border-t border-slate-700 pt-4">
          <div className="text-slate-400 text-sm mb-2">Total combinations:</div>
          <motion.div
            key={totalCombinations}
            initial={{ scale: 1.3, color: "#ef4444" }}
            animate={{
              scale: 1,
              color: totalCombinations > 100 ? "#ef4444" : "#94a3b8",
            }}
            className="text-4xl font-bold mb-2"
          >
            {totalCombinations.toLocaleString()}
          </motion.div>
          {totalCombinations > 100 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-sm"
            >
              ⚠️ Storage and query cost exploding!
            </motion.div>
          )}
        </div>
      </div>

      <div className="text-slate-500 text-sm text-center max-w-md">
        High-cardinality dimensions create exponentially more aggregate data.
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
      case 1:
        return <Scene2 />;
      case 2:
        return <Scene3 />;
      case 3:
        return <Scene4 />;
      case 4:
        return <Scene5 />;
      case 5:
        return <Scene6 />;
      case 6:
        return <Scene7 />;
      case 7:
        return <Scene8 />;
      case 8:
        return <Scene9 />;
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

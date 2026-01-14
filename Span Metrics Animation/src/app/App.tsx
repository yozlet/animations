import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Activity,
  Database,
  BarChart3,
  Play,
  Pause,
  RotateCcw,
  AlertTriangle,
  Layers,
} from "lucide-react";

interface Span {
  id: string;
  service: string;
  endpoint: string;
  httpMethod: string;
  statusCode: number;
  region: string;
  customerTier: string;
  duration: number;
  timestamp: number;
  color: string;
}

interface TimeSeriesKey {
  service: string;
  endpoint: string;
  httpMethod: string;
  statusCode: number;
  region: string;
  customerTier: string;
}

interface TimeSeries {
  key: TimeSeriesKey;
  count: number;
  avgDuration: number;
  p95Duration: number;
}

interface TransitioningSpan extends Span {
  targetKey: string;
  sourceElement: HTMLDivElement | null;
}

const services = [
  { name: "API Gateway", color: "#3b82f6" },
  { name: "Auth Service", color: "#8b5cf6" },
  { name: "User Service", color: "#10b981" },
  { name: "Payment Service", color: "#f59e0b" },
];

const endpoints = [
  "/users",
  "/login",
  "/checkout",
  "/products",
  "/orders",
];
const httpMethods = ["GET", "POST", "PUT", "DELETE"];
const statusCodes = [200, 201, 400, 401, 404, 500];
const regions = ["us-east-1", "us-west-2", "eu-west-1"];
const customerTiers = ["free", "pro", "enterprise"];

function generateSpan(id: number): Span {
  const service =
    services[Math.floor(Math.random() * services.length)];
  return {
    id: `span-${id}`,
    service: service.name,
    endpoint:
      endpoints[Math.floor(Math.random() * endpoints.length)],
    httpMethod:
      httpMethods[
        Math.floor(Math.random() * httpMethods.length)
      ],
    statusCode:
      statusCodes[
        Math.floor(Math.random() * statusCodes.length)
      ],
    region: regions[Math.floor(Math.random() * regions.length)],
    customerTier:
      customerTiers[
        Math.floor(Math.random() * customerTiers.length)
      ],
    duration: Math.random() * 500 + 50,
    timestamp: Date.now(),
    color: service.color,
  };
}

function getTimeSeriesKey(
  span: Span,
  dimensions: string[],
): string {
  const parts: string[] = [];
  if (dimensions.includes("service")) parts.push(span.service);
  if (dimensions.includes("endpoint"))
    parts.push(span.endpoint);
  if (dimensions.includes("httpMethod"))
    parts.push(span.httpMethod);
  if (dimensions.includes("statusCode"))
    parts.push(span.statusCode.toString());
  if (dimensions.includes("region")) parts.push(span.region);
  if (dimensions.includes("customerTier"))
    parts.push(span.customerTier);
  return parts.join("|");
}

export default function App() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [spans, setSpans] = useState<Span[]>([]);
  const [processingSpans, setProcessingSpans] = useState<
    Span[]
  >([]);
  const [transitioningSpans, setTransitioningSpans] = useState<
    TransitioningSpan[]
  >([]);
  const [timeSeries, setTimeSeries] = useState<
    Map<string, TimeSeries>
  >(new Map());
  const [spanCounter, setSpanCounter] = useState(0);
  const [activeDimensions, setActiveDimensions] = useState<
    string[]
  >(["service"]);

  const timeSeriesRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const processingSpanRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const dimensions = [
    { id: "service", label: "Service", cardinality: 4 },
    { id: "endpoint", label: "HTTP Route", cardinality: 5 },
    { id: "httpMethod", label: "HTTP Method", cardinality: 4 },
    { id: "statusCode", label: "Status Code", cardinality: 6 },
    { id: "region", label: "Region", cardinality: 3 },
    {
      id: "customerTier",
      label: "Customer Tier",
      cardinality: 3,
    },
  ];

  const calculateTotalCardinality = () => {
    return activeDimensions.reduce((acc, dimId) => {
      const dim = dimensions.find((d) => d.id === dimId);
      return acc * (dim?.cardinality || 1);
    }, 1);
  };

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setSpanCounter((prev) => prev + 1);
      const newSpan = generateSpan(spanCounter);
      setSpans((prev) => [...prev, newSpan]);

      // Move to processing after 700ms
      setTimeout(() => {
        setSpans((prev) =>
          prev.filter((s) => s.id !== newSpan.id),
        );
        setProcessingSpans((prev) => [...prev, newSpan]);

        // Move to transitioning after another 700ms
        setTimeout(() => {
          const targetKey = getTimeSeriesKey(
            newSpan,
            activeDimensions,
          );

          // Pre-create time series entry if it doesn't exist
          setTimeSeries((prev) => {
            const newMap = new Map(prev);
            if (!newMap.has(targetKey)) {
              const keyObj: TimeSeriesKey = {
                service: activeDimensions.includes("service")
                  ? newSpan.service
                  : "",
                endpoint: activeDimensions.includes("endpoint")
                  ? newSpan.endpoint
                  : "",
                httpMethod: activeDimensions.includes(
                  "httpMethod",
                )
                  ? newSpan.httpMethod
                  : "",
                statusCode: activeDimensions.includes(
                  "statusCode",
                )
                  ? newSpan.statusCode
                  : 0,
                region: activeDimensions.includes("region")
                  ? newSpan.region
                  : "",
                customerTier: activeDimensions.includes(
                  "customerTier",
                )
                  ? newSpan.customerTier
                  : "",
              };
              newMap.set(targetKey, {
                key: keyObj,
                count: 0,
                avgDuration: 0,
                p95Duration: 0,
              });
            }
            return newMap;
          });

          const sourceElement =
            processingSpanRefs.current.get(newSpan.id) || null;

          setProcessingSpans((prev) =>
            prev.filter((s) => s.id !== newSpan.id),
          );

          const transitioningSpan: TransitioningSpan = {
            ...newSpan,
            targetKey,
            sourceElement,
          };
          setTransitioningSpans((prev) => [
            ...prev,
            transitioningSpan,
          ]);

          // Update time series after 600ms (animation duration)
          setTimeout(() => {
            setTransitioningSpans((prev) =>
              prev.filter((s) => s.id !== newSpan.id),
            );

            // Update time series with actual data
            setTimeSeries((prev) => {
              const newMap = new Map(prev);
              const existing = newMap.get(targetKey);

              if (existing) {
                const newCount = existing.count + 1;
                const newAvgDuration =
                  existing.count === 0
                    ? newSpan.duration
                    : (existing.avgDuration * existing.count +
                        newSpan.duration) /
                      newCount;
                newMap.set(targetKey, {
                  ...existing,
                  count: newCount,
                  avgDuration: newAvgDuration,
                  p95Duration: Math.max(
                    existing.p95Duration,
                    newSpan.duration,
                  ),
                });
              }

              return newMap;
            });
          }, 600);
        }, 700);
      }, 700);
    }, 1500);

    return () => clearInterval(interval);
  }, [isPlaying, spanCounter, activeDimensions]);

  const handleReset = () => {
    setSpans([]);
    setProcessingSpans([]);
    setTransitioningSpans([]);
    setTimeSeries(new Map());
    setSpanCounter(0);
  };

  const toggleDimension = (dimId: string) => {
    setActiveDimensions((prev) => {
      if (prev.includes(dimId)) {
        // Don't allow removing all dimensions
        if (prev.length === 1) return prev;
        return prev.filter((d) => d !== dimId);
      } else {
        return [...prev, dimId];
      }
    });
    // Clear time series when dimensions change
    setTimeSeries(new Map());
  };

  const totalCardinality = calculateTotalCardinality();
  const activeTimeSeriesCount = timeSeries.size;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Activity className="w-10 h-10 text-blue-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              The Cardinality Explosion Problem
            </h1>
          </div>
          <p className="text-slate-400 text-lg">
            When you aggregate spans into metrics, you lose
            context. To query by different dimensions, you must
            create a separate time series for each unique
            combination.
          </p>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
            {isPlaying ? "Pause" : "Play"}
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>
        </div>

        {/* Cardinality Explosion Warning */}
        <motion.div
          className="mb-8 bg-gradient-to-r from-orange-900/30 to-red-900/30 backdrop-blur rounded-xl p-6 border-2"
          animate={{
            borderColor:
              totalCardinality > 100
                ? ["#f97316", "#ef4444", "#f97316"]
                : "#f97316",
          }}
          transition={{
            duration: 2,
            repeat: totalCardinality > 100 ? Infinity : 0,
          }}
        >
          <div className="flex items-start gap-4">
            <AlertTriangle
              className={`w-8 h-8 flex-shrink-0 ${totalCardinality > 100 ? "text-red-400" : "text-orange-400"}`}
            />
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2 text-orange-300">
                Potential Time Series:{" "}
                {totalCardinality.toLocaleString()}
              </h3>
              <p className="text-slate-300 mb-3">
                Active Time Series:{" "}
                <span className="font-mono text-green-400">
                  {activeTimeSeriesCount}
                </span>{" "}
                of {totalCardinality.toLocaleString()} possible
                combinations
              </p>
              <div className="text-sm text-slate-400">
                Each dimension multiplies the number of time
                series:{" "}
                {activeDimensions
                  .map((dimId) => {
                    const dim = dimensions.find(
                      (d) => d.id === dimId,
                    );
                    return `${dim?.label}(${dim?.cardinality})`;
                  })
                  .join(" × ")}{" "}
                = {totalCardinality}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Dimension Selector */}
        <div className="mb-8 bg-slate-800/50 backdrop-blur rounded-xl p-6 border border-slate-700">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-semibold">
              Select Dimensions to Track
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {dimensions.map((dim) => (
              <motion.button
                key={dim.id}
                onClick={() => toggleDimension(dim.id)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  activeDimensions.includes(dim.id)
                    ? "bg-purple-500/20 border-purple-500 text-purple-300"
                    : "bg-slate-700/30 border-slate-600 text-slate-400 hover:border-slate-500"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="font-semibold text-sm">
                  {dim.label}
                </div>
                <div className="text-xs opacity-70 mt-1">
                  {dim.cardinality} values
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Animation Pipeline */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 relative">
          {/* Stage 1: Incoming Spans with Full Context */}
          <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-6 h-6 text-blue-400" />
              <div>
                <h2 className="text-lg font-semibold">
                  Incoming Spans
                </h2>
                <p className="text-xs text-slate-400">
                  Full context preserved
                </p>
              </div>
            </div>
            <div className="space-y-2 min-h-[500px] max-h-[500px] overflow-y-auto">
              <AnimatePresence mode="popLayout">
                {spans.map((span) => (
                  <motion.div
                    key={span.id}
                    initial={{ opacity: 0, x: -50, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 100, scale: 0.8 }}
                    className="p-3 rounded-lg border"
                    style={{
                      borderColor: span.color,
                      backgroundColor: `${span.color}15`,
                    }}
                  >
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      <div
                        className="font-semibold col-span-2"
                        style={{ color: span.color }}
                      >
                        {span.service}
                      </div>
                      <div className="text-slate-400">
                        Route:
                      </div>
                      <div className="text-slate-200 truncate">
                        {span.endpoint}
                      </div>
                      <div className="text-slate-400">
                        Method:
                      </div>
                      <div className="text-slate-200">
                        {span.httpMethod}
                      </div>
                      <div className="text-slate-400">
                        Status:
                      </div>
                      <div className="text-slate-200">
                        {span.statusCode}
                      </div>
                      <div className="text-slate-400">
                        Region:
                      </div>
                      <div className="text-slate-200">
                        {span.region}
                      </div>
                      <div className="text-slate-400">
                        Tier:
                      </div>
                      <div className="text-slate-200">
                        {span.customerTier}
                      </div>
                      <div className="text-slate-400">
                        Duration:
                      </div>
                      <div className="text-slate-200">
                        {span.duration.toFixed(0)}ms
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Stage 2: Processing - Losing Context */}
          <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center gap-2 mb-4">
              <Database className="w-6 h-6 text-purple-400" />
              <div>
                <h2 className="text-lg font-semibold">
                  Creating Time Series
                </h2>
                <p className="text-xs text-slate-400">
                  Extracting selected dimensions
                </p>
              </div>
            </div>
            <div className="space-y-2 min-h-[500px] max-h-[500px] overflow-y-auto">
              <AnimatePresence mode="popLayout">
                {processingSpans.map((span) => (
                  <motion.div
                    key={span.id}
                    ref={(el) => {
                      if (el) {
                        processingSpanRefs.current.set(span.id, el);
                      } else {
                        processingSpanRefs.current.delete(span.id);
                      }
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{
                      opacity: 1,
                      scale: [1, 1.05, 1],
                    }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                    className="p-3 rounded-lg border-2 border-purple-500 bg-purple-500/10"
                  >
                    <div className="text-sm font-semibold text-purple-400 mb-2">
                      Extracting dimensions...
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-xs">
                      {activeDimensions.includes("service") && (
                        <>
                          <div className="text-green-400">
                            ✓ Service:
                          </div>
                          <div className="text-slate-200">
                            {span.service}
                          </div>
                        </>
                      )}
                      {activeDimensions.includes(
                        "endpoint",
                      ) && (
                        <>
                          <div className="text-green-400">
                            ✓ Route:
                          </div>
                          <div className="text-slate-200 truncate">
                            {span.endpoint}
                          </div>
                        </>
                      )}
                      {activeDimensions.includes(
                        "httpMethod",
                      ) && (
                        <>
                          <div className="text-green-400">
                            ✓ Method:
                          </div>
                          <div className="text-slate-200">
                            {span.httpMethod}
                          </div>
                        </>
                      )}
                      {activeDimensions.includes(
                        "statusCode",
                      ) && (
                        <>
                          <div className="text-green-400">
                            ✓ Status:
                          </div>
                          <div className="text-slate-200">
                            {span.statusCode}
                          </div>
                        </>
                      )}
                      {activeDimensions.includes("region") && (
                        <>
                          <div className="text-green-400">
                            ✓ Region:
                          </div>
                          <div className="text-slate-200">
                            {span.region}
                          </div>
                        </>
                      )}
                      {activeDimensions.includes(
                        "customerTier",
                      ) && (
                        <>
                          <div className="text-green-400">
                            ✓ Tier:
                          </div>
                          <div className="text-slate-200">
                            {span.customerTier}
                          </div>
                        </>
                      )}
                      {!activeDimensions.includes(
                        "service",
                      ) && (
                        <>
                          <div className="text-slate-600">
                            ✗ Service:
                          </div>
                          <div className="text-slate-600 line-through">
                            {span.service}
                          </div>
                        </>
                      )}
                      {!activeDimensions.includes(
                        "endpoint",
                      ) && (
                        <>
                          <div className="text-slate-600">
                            ✗ Route:
                          </div>
                          <div className="text-slate-600 line-through truncate">
                            {span.endpoint}
                          </div>
                        </>
                      )}
                      {!activeDimensions.includes(
                        "httpMethod",
                      ) && (
                        <>
                          <div className="text-slate-600">
                            ✗ Method:
                          </div>
                          <div className="text-slate-600 line-through">
                            {span.httpMethod}
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Stage 3: Time Series - Context Lost */}
          <div className="bg-slate-800/50 backdrop-blur rounded-2xl p-6 border border-slate-700">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-6 h-6 text-green-400" />
              <div>
                <h2 className="text-lg font-semibold">
                  Active Time Series
                </h2>
                <p className="text-xs text-slate-400">
                  {activeTimeSeriesCount} of {totalCardinality}{" "}
                  possible
                </p>
              </div>
            </div>
            <div className="space-y-2 min-h-[500px] max-h-[500px] overflow-y-auto">
              <AnimatePresence mode="popLayout">
                {Array.from(timeSeries.entries()).map(
                  ([key, ts]) => (
                    <motion.div
                      key={key}
                      ref={(el) => {
                        if (el) {
                          timeSeriesRefs.current.set(key, el);
                        } else {
                          timeSeriesRefs.current.delete(key);
                        }
                      }}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-lg bg-gradient-to-br from-slate-700/50 to-slate-800/50 border border-slate-600 relative"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-xs font-mono text-green-400 truncate">
                          {key}
                        </div>
                        <motion.span
                          key={ts.count}
                          initial={{
                            scale: 1.5,
                            color: "#22c55e",
                          }}
                          animate={{
                            scale: 1,
                            color: "#94a3b8",
                          }}
                          className="text-xs font-mono ml-2"
                        >
                          {ts.count}
                        </motion.span>
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-xs">
                        <div className="text-slate-500">
                          Avg:
                        </div>
                        <div className="text-slate-200 font-mono">
                          {ts.avgDuration.toFixed(0)}ms
                        </div>
                        <div className="text-slate-500">
                          P95:
                        </div>
                        <div className="text-slate-200 font-mono">
                          {ts.p95Duration.toFixed(0)}ms
                        </div>
                      </div>
                    </motion.div>
                  ),
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Transitioning spans flying to their time series */}
          <AnimatePresence>
            {transitioningSpans.map((span) => {
              const sourceElement = span.sourceElement;
              const targetElement = timeSeriesRefs.current.get(
                span.targetKey,
              );

              if (!sourceElement || !targetElement) {
                return null;
              }

              const sourceRect = sourceElement.getBoundingClientRect();
              const targetRect = targetElement.getBoundingClientRect();

              // Calculate the movement needed
              const deltaX = targetRect.left - sourceRect.left;
              const deltaY = targetRect.top - sourceRect.top;

              return (
                <motion.div
                  key={`transition-${span.id}`}
                  initial={{
                    position: "fixed",
                    left: sourceRect.left,
                    top: sourceRect.top,
                    width: sourceRect.width,
                    opacity: 1,
                  }}
                  animate={{
                    left: targetRect.left,
                    top: targetRect.top,
                    opacity: [1, 1, 0],
                    scale: [1, 0.95, 0.7],
                  }}
                  transition={{
                    duration: 0.6,
                    ease: "easeInOut",
                  }}
                  className="p-3 rounded-lg border-2 border-purple-500 bg-purple-500/10 pointer-events-none z-50"
                >
                  <div className="text-sm font-semibold text-purple-400 mb-2">
                    → {span.targetKey}
                  </div>
                  <div className="grid grid-cols-2 gap-1 text-xs">
                    {activeDimensions.includes("service") && (
                      <>
                        <div className="text-green-400">
                          ✓ Service:
                        </div>
                        <div className="text-slate-200">
                          {span.service}
                        </div>
                      </>
                    )}
                    {activeDimensions.includes("endpoint") && (
                      <>
                        <div className="text-green-400">
                          ✓ Route:
                        </div>
                        <div className="text-slate-200 truncate">
                          {span.endpoint}
                        </div>
                      </>
                    )}
                    {activeDimensions.includes("httpMethod") && (
                      <>
                        <div className="text-green-400">
                          ✓ Method:
                        </div>
                        <div className="text-slate-200">
                          {span.httpMethod}
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Explanation Section */}
        <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur rounded-xl p-6 border border-blue-500/20">
          <h3 className="text-lg font-semibold mb-4 text-blue-300">
            The Cardinality Problem
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-slate-300">
            <div>
              <div className="font-semibold text-red-400 mb-2">
                ⚠️ Context Loss
              </div>
              <p>
                When you aggregate spans into metrics, you lose
                the raw trace data. To query by specific
                dimensions later (e.g., "show me errors for
                /checkout in eu-west-1"), those dimensions must
                be pre-aggregated.
              </p>
            </div>
            <div>
              <div className="font-semibold text-orange-400 mb-2">
                📊 Cardinality Explosion
              </div>
              <p>
                Each dimension multiplies the total number of
                time series. With 6 dimensions like shown, you
                get 4 × 5 × 4 × 6 × 3 × 3 = 4,320 possible time
                series combinations that must be stored and
                maintained.
              </p>
            </div>
            <div>
              <div className="font-semibold text-yellow-400 mb-2">
                💰 Storage & Cost
              </div>
              <p>
                Each time series requires storage, indexing, and
                compute resources. High-cardinality dimensions
                (like user_id or trace_id) can create millions
                of time series, making metrics prohibitively
                expensive.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
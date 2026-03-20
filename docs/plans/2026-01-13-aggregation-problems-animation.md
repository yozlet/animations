# Aggregation Problems Animation Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a step-by-step animated story (9 scenes) that explains the problems with span aggregation, including the tradeoffs between detail loss and cardinality explosion.

**Architecture:** Scene-based React component using Framer Motion for animations. Each scene is self-contained with enter animations. Navigation controls allow stepping through scenes. Captions are toggleable with console logging for presenter mode.

**Tech Stack:** React, TypeScript, Framer Motion, Tailwind CSS, Lucide React icons

---

## Task 1: Create Main Component Structure

**Files:**
- Create: `Span Metrics Animation/src/app/pages/AggregationProblemsAnimation.tsx`

**Step 1: Create the base component with state management**

Create the main component file with scene navigation state:

```tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  MessageSquareOff,
} from "lucide-react";

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
    if (showCaptions) {
      console.log("📝 Presenter Mode: Captions hidden");
      console.log(`Scene ${currentScene + 1}:`, narrations[currentScene]);
    }
  };

  // Log narration to console when captions are off
  if (!showCaptions) {
    console.log(`Scene ${currentScene + 1}:`, narrations[currentScene]);
  }

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
              {/* Scene content will go here */}
              <div className="flex items-center justify-center h-full text-2xl text-slate-400">
                Scene {currentScene + 1}
              </div>
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
```

**Step 2: Test the component renders**

Manually test by temporarily adding the route (we'll do this properly later).

**Step 3: Commit the base structure**

```bash
git add "Span Metrics Animation/src/app/pages/AggregationProblemsAnimation.tsx"
git commit -m "feat: add base structure for Aggregation Problems animation"
```

---

## Task 2: Implement Scene 1 - Spans and Bar Graph

**Files:**
- Modify: `Span Metrics Animation/src/app/pages/AggregationProblemsAnimation.tsx`

**Step 1: Add span data types and generation**

Add these interfaces and helper functions near the top of the file:

```tsx
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
```

**Step 2: Create Scene1 component**

Replace the placeholder scene content with a switch statement and implement Scene 1:

```tsx
// Inside the motion.div that shows scene content, replace the placeholder with:
{renderScene()}

// Add this method inside the component:
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

// Add Scene1 component before the main component:
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
```

**Step 3: Import useEffect at the top**

Add to imports:
```tsx
import { useState, useEffect } from "react";
```

**Step 4: Test Scene 1 in browser**

Run the dev server and navigate to the animation to verify spans appear with bar graph.

**Step 5: Commit Scene 1**

```bash
git add "Span Metrics Animation/src/app/pages/AggregationProblemsAnimation.tsx"
git commit -m "feat: implement Scene 1 - spans with bar graph"
```

---

## Task 3: Implement Scene 2 - Volume Increase

**Files:**
- Modify: `Span Metrics Animation/src/app/pages/AggregationProblemsAnimation.tsx`

**Step 1: Create Scene2 component**

Add Scene2 to the switch statement:
```tsx
case 1:
  return <Scene2 />;
```

Then add the Scene2 component:

```tsx
function Scene2() {
  const [spans, setSpans] = useState<Span[]>([]);
  const [spansPerMinute, setSpansPerMinute] = useState(0);

  useEffect(() => {
    let counter = 0;
    const interval = setInterval(() => {
      // Generate multiple spans per tick
      const newSpans = Array.from({ length: 5 }, (_, i) =>
        generateSpan(counter + i)
      );
      setSpans((prev) => [...prev, ...newSpans].slice(-200)); // Keep last 200
      counter += 5;

      // Simulate increasing rate
      setSpansPerMinute((prev) => Math.min(prev + 50000, 1247391));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Counter */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <div className="text-sm text-slate-400 mb-1">Spans per minute</div>
        <div className="text-4xl font-bold text-blue-400 font-mono">
          {spansPerMinute.toLocaleString()}
        </div>
      </motion.div>

      {/* Flowing spans */}
      <div className="flex-1 relative overflow-hidden rounded-lg bg-slate-900/50">
        <div className="absolute inset-0 flex flex-wrap gap-1 p-2 content-start">
          {spans.slice(-100).map((span) => (
            <motion.div
              key={span.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 0.7, x: 0 }}
              exit={{ opacity: 0 }}
              className="w-2 h-8 rounded-sm"
              style={{ backgroundColor: span.color }}
            />
          ))}
        </div>
      </div>

      {/* Dense Bar Graph */}
      <div className="h-32 relative px-12">
        <div className="h-full flex items-end gap-px justify-center">
          {spans.slice(-150).map((span) => (
            <motion.div
              key={span.id}
              initial={{ height: 0 }}
              animate={{ height: `${(span.duration / 500) * 100}%` }}
              transition={{ duration: 0.2 }}
              className="w-1"
              style={{ backgroundColor: span.color, opacity: 0.8 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Test Scene 2**

Navigate to Scene 2 and verify the rapid span generation and dense bar graph.

**Step 3: Commit Scene 2**

```bash
git add "Span Metrics Animation/src/app/pages/AggregationProblemsAnimation.tsx"
git commit -m "feat: implement Scene 2 - volume increase animation"
```

---

## Task 4: Implement Scene 3 - Query Scan

**Files:**
- Modify: `Span Metrics Animation/src/app/pages/AggregationProblemsAnimation.tsx`

**Step 1: Create Scene3 component**

Add to switch:
```tsx
case 2:
  return <Scene3 />;
```

Add Scene3:

```tsx
function Scene3() {
  const [spans] = useState<Span[]>(() =>
    Array.from({ length: 120 }, (_, i) => generateSpan(i))
  );
  const [scanPosition, setScanPosition] = useState(0);
  const [isScanning, setIsScanning] = useState(false);

  const handleExecute = () => {
    setIsScanning(true);
    setScanPosition(0);
  };

  useEffect(() => {
    if (!isScanning) return;

    const interval = setInterval(() => {
      setScanPosition((prev) => {
        if (prev >= 100) {
          setIsScanning(false);
          return 100;
        }
        return prev + 0.5;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isScanning]);

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* SQL Query Panel */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 rounded-lg p-4 border border-slate-700"
      >
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs text-slate-400 font-mono">SQL Query</div>
          <button
            onClick={handleExecute}
            disabled={isScanning}
            className="px-4 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-slate-700 disabled:text-slate-500 rounded text-sm transition-colors"
          >
            {isScanning ? "Executing..." : "Execute"}
          </button>
        </div>
        <code className="text-sm text-green-400 font-mono">
          SELECT AVG(duration) FROM spans;
        </code>
      </motion.div>

      {/* Bar Graph with Scan Line */}
      <div className="flex-1 relative px-12 pb-8">
        <div className="h-full flex items-end gap-px relative">
          {spans.map((span, index) => {
            const isScanned = (index / spans.length) * 100 < scanPosition;
            return (
              <motion.div
                key={span.id}
                initial={{ height: 0 }}
                animate={{
                  height: `${(span.duration / 500) * 100}%`,
                  opacity: isScanned ? 1 : 0.3,
                }}
                transition={{ duration: 0.3 }}
                className="flex-1"
                style={{ backgroundColor: span.color }}
              />
            );
          })}

          {/* Scan Line */}
          {isScanning && (
            <motion.div
              className="absolute top-0 bottom-0 w-1 bg-yellow-400 shadow-lg shadow-yellow-400/50"
              style={{ left: `${scanPosition}%` }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Test Scene 3**

Verify the Execute button triggers the scan line animation.

**Step 3: Commit Scene 3**

```bash
git add "Span Metrics Animation/src/app/pages/AggregationProblemsAnimation.tsx"
git commit -m "feat: implement Scene 3 - query scan animation"
```

---

## Task 5: Implement Scene 4 - Slow Query vs Fast Writes

**Files:**
- Modify: `Span Metrics Animation/src/app/pages/AggregationProblemsAnimation.tsx`

**Step 1: Create Scene4 component**

Add to switch:
```tsx
case 3:
  return <Scene4 />;
```

Add Scene4:

```tsx
function Scene4() {
  const [spans, setSpans] = useState<Span[]>(() =>
    Array.from({ length: 100 }, (_, i) => generateSpan(i))
  );
  const [scanPosition, setScanPosition] = useState(0);
  const [queryTime, setQueryTime] = useState(0);
  const [spanCounter, setSpanCounter] = useState(100);

  useEffect(() => {
    // Slow query progress
    const queryInterval = setInterval(() => {
      setScanPosition((prev) => Math.min(prev + 0.3, 25));
      setQueryTime((prev) => prev + 1);
    }, 1000);

    // Fast writes
    const writeInterval = setInterval(() => {
      const newSpan = generateSpan(spanCounter);
      setSpans((prev) => [...prev, newSpan]);
      setSpanCounter((prev) => prev + 1);
    }, 200);

    return () => {
      clearInterval(queryInterval);
      clearInterval(writeInterval);
    };
  }, [spanCounter]);

  return (
    <div className="grid grid-cols-2 gap-6 h-full">
      {/* Left: Fast Writes */}
      <div className="flex flex-col gap-4">
        <div className="text-center">
          <div className="text-sm text-slate-400 mb-1">Fast Writes</div>
          <div className="text-2xl font-bold text-green-400">
            {spans.length} spans
          </div>
        </div>

        <div className="flex-1 relative">
          <div className="absolute inset-0 flex items-end gap-px overflow-hidden">
            {spans.slice(-80).map((span) => (
              <motion.div
                key={span.id}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: `${(span.duration / 500) * 100}%`, opacity: 0.8 }}
                className="flex-1"
                style={{ backgroundColor: span.color }}
              />
            ))}
          </div>

          {/* New spans indicator */}
          <div className="absolute top-4 right-4">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
              className="px-3 py-1 bg-green-500/20 border border-green-500 rounded-full text-xs text-green-400"
            >
              ⚡ Writing...
            </motion.div>
          </div>
        </div>
      </div>

      {/* Right: Slow Query */}
      <div className="flex flex-col gap-4">
        <div className="text-center">
          <div className="text-sm text-slate-400 mb-1">Query Progress</div>
          <div className="text-2xl font-bold text-orange-400 font-mono">
            {queryTime}s
          </div>
        </div>

        <div className="flex-1 relative">
          <div className="absolute inset-0 flex items-end gap-px">
            {spans.slice(0, 100).map((span, index) => {
              const isScanned = (index / 100) * 100 < scanPosition;
              return (
                <motion.div
                  key={span.id}
                  animate={{ opacity: isScanned ? 1 : 0.2 }}
                  className="flex-1"
                  style={{
                    height: `${(span.duration / 500) * 100}%`,
                    backgroundColor: span.color,
                  }}
                />
              );
            })}

            {/* Slow scan line */}
            <motion.div
              className="absolute top-0 bottom-0 w-1 bg-orange-400"
              style={{ left: `${scanPosition}%` }}
            />
          </div>

          {/* Loading indicator */}
          <div className="absolute top-4 right-4">
            <div className="px-3 py-1 bg-orange-500/20 border border-orange-500 rounded-full text-xs text-orange-400 flex items-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-3 h-3 border-2 border-orange-400 border-t-transparent rounded-full"
              />
              Querying...
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Test Scene 4**

Verify the split-screen showing fast writes vs slow query.

**Step 3: Commit Scene 4**

```bash
git add "Span Metrics Animation/src/app/pages/AggregationProblemsAnimation.tsx"
git commit -m "feat: implement Scene 4 - slow query vs fast writes"
```

---

## Task 6: Implement Scene 5 - Aggregation Table

**Files:**
- Modify: `Span Metrics Animation/src/app/pages/AggregationProblemsAnimation.tsx`

**Step 1: Create Scene5 component**

Add to switch:
```tsx
case 4:
  return <Scene5 />;
```

Add Scene5:

```tsx
interface AggregateRow {
  service: string;
  count: number;
  avgDuration: number;
  color: string;
}

function Scene5() {
  const [incomingSpans, setIncomingSpans] = useState<Span[]>([]);
  const [aggregates, setAggregates] = useState<AggregateRow[]>([
    { service: "API Gateway", count: 0, avgDuration: 0, color: "#3b82f6" },
    { service: "Auth Service", count: 0, avgDuration: 0, color: "#8b5cf6" },
    { service: "User Service", count: 0, avgDuration: 0, color: "#10b981" },
    { service: "Payment Service", count: 0, avgDuration: 0, color: "#f59e0b" },
  ]);
  const [spanCounter, setSpanCounter] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const newSpan = generateSpan(spanCounter);
      setIncomingSpans((prev) => [...prev, newSpan].slice(-10));
      setSpanCounter((prev) => prev + 1);

      // Update aggregates
      setTimeout(() => {
        setAggregates((prev) => {
          return prev.map((agg) => {
            if (agg.service === newSpan.service) {
              const newCount = agg.count + 1;
              const newAvg =
                agg.count === 0
                  ? newSpan.duration
                  : (agg.avgDuration * agg.count + newSpan.duration) / newCount;
              return { ...agg, count: newCount, avgDuration: newAvg };
            }
            return agg;
          });
        });
      }, 400);
    }, 800);

    return () => clearInterval(interval);
  }, [spanCounter]);

  return (
    <div className="flex flex-col gap-8 h-full">
      {/* Incoming Spans */}
      <div className="text-center">
        <div className="text-sm text-slate-400 mb-3">Incoming Spans</div>
        <div className="flex justify-center gap-2 min-h-[60px]">
          <AnimatePresence mode="popLayout">
            {incomingSpans.map((span) => (
              <motion.div
                key={span.id}
                initial={{ opacity: 0, x: -20, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                className="w-12 h-12 rounded-lg"
                style={{
                  backgroundColor: span.color,
                  opacity: 0.8,
                }}
              />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Processing Pipeline */}
      <div className="flex justify-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="px-6 py-3 bg-purple-500/20 border border-purple-500 rounded-lg"
        >
          <div className="text-purple-400 font-semibold">Aggregating...</div>
        </motion.div>
      </div>

      {/* Aggregation Table */}
      <div className="flex-1 flex flex-col">
        <div className="text-sm text-slate-400 mb-3 text-center">
          Aggregation Table (Updated every 60s)
        </div>
        <div className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400">
                  Service
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400">
                  Count
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400">
                  Avg Duration
                </th>
              </tr>
            </thead>
            <tbody>
              {aggregates.map((agg) => (
                <motion.tr
                  key={agg.service}
                  animate={
                    agg.count > 0 ? { backgroundColor: [`${agg.color}20`, "transparent"] } : {}
                  }
                  transition={{ duration: 0.5 }}
                  className="border-t border-slate-700"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: agg.color }}
                      />
                      <span className="text-sm text-slate-200">{agg.service}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-mono text-slate-200">
                    {agg.count.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-mono text-slate-200">
                    {agg.avgDuration > 0 ? `${agg.avgDuration.toFixed(0)}ms` : "-"}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Test Scene 5**

Verify spans flow into aggregation table.

**Step 3: Commit Scene 5**

```bash
git add "Span Metrics Animation/src/app/pages/AggregationProblemsAnimation.tsx"
git commit -m "feat: implement Scene 5 - aggregation table"
```

---

## Task 7: Implement Scene 6 - Tradeoff Visualization

**Files:**
- Modify: `Span Metrics Animation/src/app/pages/AggregationProblemsAnimation.tsx`

**Step 1: Create Scene6 component**

Add to switch:
```tsx
case 5:
  return <Scene6 />;
```

Add Scene6:

```tsx
function Scene6() {
  const [selectedDimensions, setSelectedDimensions] = useState<string[]>(["service"]);
  const [showZoom, setShowZoom] = useState(false);

  const span = generateSpan(1);

  const dimensions = [
    { id: "service", label: "Service", cardinality: 4 },
    { id: "endpoint", label: "Endpoint", cardinality: 5 },
    { id: "method", label: "HTTP Method", cardinality: 4 },
  ];

  const calculateRows = () => {
    return dimensions
      .filter((d) => selectedDimensions.includes(d.id))
      .reduce((acc, d) => acc * d.cardinality, 1);
  };

  useEffect(() => {
    const timeout = setTimeout(() => setShowZoom(true), 1000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="grid grid-cols-2 gap-8 h-full">
      {/* Left: Full Detail */}
      <div className="flex flex-col gap-4">
        <div className="text-center text-sm text-slate-400 mb-2">
          Individual Span (Full Detail)
        </div>

        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: showZoom ? 0.5 : 1 }}
          className="p-6 rounded-lg border-2"
          style={{
            borderColor: span.color,
            backgroundColor: `${span.color}20`,
          }}
        >
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="text-slate-400">Service:</div>
            <div className="text-slate-200">{span.service}</div>
            <div className="text-slate-400">Endpoint:</div>
            <div className="text-slate-200">{span.endpoint}</div>
            <div className="text-slate-400">Duration:</div>
            <div className="text-slate-200">{span.duration.toFixed(0)}ms</div>
            <div className="text-slate-400">Status:</div>
            <div className="text-slate-200">{span.statusCode}</div>
          </div>
        </motion.div>

        <div className="flex justify-center">
          <div className="text-3xl text-slate-500">→</div>
        </div>
      </div>

      {/* Right: Aggregated (Lost Detail) */}
      <div className="flex flex-col gap-4">
        <div className="text-center text-sm text-slate-400 mb-2">
          Aggregated Data (Summary Only)
        </div>

        <div className="bg-slate-900 rounded-lg border border-slate-700 p-4">
          <div className="text-xs text-slate-400 mb-3">Group by:</div>
          <div className="flex flex-wrap gap-2 mb-4">
            {dimensions.map((dim) => (
              <button
                key={dim.id}
                onClick={() => {
                  setSelectedDimensions((prev) =>
                    prev.includes(dim.id)
                      ? prev.filter((d) => d !== dim.id)
                      : [...prev, dim.id]
                  );
                }}
                className={`px-3 py-1 rounded text-xs transition-colors ${
                  selectedDimensions.includes(dim.id)
                    ? "bg-purple-500 text-white"
                    : "bg-slate-700 text-slate-400"
                }`}
              >
                {dim.label}
              </button>
            ))}
          </div>

          <div className="text-center py-4 border-t border-slate-700">
            <div className="text-2xl font-bold text-orange-400">
              {calculateRows()} rows
            </div>
            <div className="text-xs text-slate-400 mt-1">
              Summary statistics only
            </div>
          </div>
        </div>

        {showZoom && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-3 p-4 bg-red-900/20 border border-red-500/50 rounded-lg"
          >
            <div className="text-4xl">🔍</div>
            <div className="text-sm text-red-400">
              Cannot zoom into individual spans
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
```

**Step 2: Test Scene 6**

Verify dimension selection and row calculation.

**Step 3: Commit Scene 6**

```bash
git add "Span Metrics Animation/src/app/pages/AggregationProblemsAnimation.tsx"
git commit -m "feat: implement Scene 6 - tradeoff visualization"
```

---

## Task 8: Implement Scene 7 - Timeline/Config Changes

**Files:**
- Modify: `Span Metrics Animation/src/app/pages/AggregationProblemsAnimation.tsx`

**Step 1: Create Scene7 component**

Add to switch:
```tsx
case 6:
  return <Scene7 />;
```

Add Scene7:

```tsx
function Scene7() {
  const [currentDay, setCurrentDay] = useState(1);

  useEffect(() => {
    const days = [1, 30, 30, 60];
    let index = 0;
    const interval = setInterval(() => {
      index++;
      if (index < days.length) {
        setCurrentDay(days[index]);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-8 h-full">
      {/* Timeline */}
      <div className="flex justify-center items-center gap-8">
        {[1, 30, 60].map((day) => (
          <motion.div
            key={day}
            animate={{
              scale: currentDay === day ? 1.2 : 1,
              opacity: currentDay >= day ? 1 : 0.3,
            }}
            className="flex flex-col items-center"
          >
            <div
              className={`w-4 h-4 rounded-full mb-2 ${
                currentDay === day ? "bg-blue-500" : "bg-slate-600"
              }`}
            />
            <div className="text-sm text-slate-400">Day {day}</div>
          </motion.div>
        ))}
      </div>

      {/* Config Display */}
      <div className="flex-1 bg-slate-900 rounded-lg border border-slate-700 p-6">
        <div className="text-xs text-slate-400 mb-3 font-mono">
          aggregation_config.yml
        </div>

        <AnimatePresence mode="wait">
          {currentDay === 1 && (
            <motion.div
              key="day1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="font-mono text-sm"
            >
              <div className="text-green-400">dimensions:</div>
              <div className="text-blue-400 ml-4">- service</div>
              <div className="text-blue-400 ml-4">- endpoint</div>
            </motion.div>
          )}

          {currentDay === 30 && (
            <motion.div
              key="day30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="font-mono text-sm mb-4">
                <div className="text-green-400">dimensions:</div>
                <div className="text-blue-400 ml-4">- service</div>
                <div className="text-blue-400 ml-4">- endpoint</div>
              </div>

              <motion.div
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                className="mt-6 p-4 bg-orange-900/30 border border-orange-500 rounded-lg"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-2xl">⚠️</div>
                  <div className="text-orange-400 font-semibold">
                    New attribute detected
                  </div>
                </div>
                <div className="text-sm text-slate-300 ml-9">
                  Incoming spans contain{" "}
                  <code className="text-orange-300 bg-slate-800 px-2 py-1 rounded">
                    cache_hit
                  </code>{" "}
                  but it's not being aggregated
                </div>
              </motion.div>
            </motion.div>
          )}

          {currentDay === 60 && (
            <motion.div
              key="day60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="font-mono text-sm">
                <div className="text-green-400">dimensions:</div>
                <div className="text-blue-400 ml-4">- service</div>
                <div className="text-blue-400 ml-4">- endpoint</div>
                <motion.div
                  initial={{ backgroundColor: "#22c55e40" }}
                  animate={{ backgroundColor: "transparent" }}
                  transition={{ duration: 1 }}
                  className="text-blue-400 ml-4"
                >
                  - cache_hit
                </motion.div>
              </div>

              <div className="mt-6 p-4 bg-green-900/30 border border-green-500 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">✅</div>
                  <div className="text-green-400 font-semibold">
                    Config updated and deployed
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
```

**Step 2: Test Scene 7**

Verify timeline progression and config updates.

**Step 3: Commit Scene 7**

```bash
git add "Span Metrics Animation/src/app/pages/AggregationProblemsAnimation.tsx"
git commit -m "feat: implement Scene 7 - timeline and config changes"
```

---

## Task 9: Implement Scene 8 - Retrospective Analysis Blocked

**Files:**
- Modify: `Span Metrics Animation/src/app/pages/AggregationProblemsAnimation.tsx`

**Step 1: Create Scene8 component**

Add to switch:
```tsx
case 7:
  return <Scene8 />;
```

Add Scene8:

```tsx
function Scene8() {
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setShowError(true), 1000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="flex flex-col gap-6 h-full">
      {/* Alert */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-red-900/30 border border-red-500 rounded-lg p-4"
      >
        <div className="flex items-center gap-3">
          <div className="text-3xl">🚨</div>
          <div>
            <div className="text-red-400 font-semibold">
              Latency spike detected at 14:35
            </div>
            <div className="text-sm text-slate-400">
              Investigating root cause...
            </div>
          </div>
        </div>
      </motion.div>

      {/* Query Attempt */}
      <div className="bg-slate-900 rounded-lg border border-slate-700 p-6">
        <div className="text-xs text-slate-400 mb-3">Investigation Query</div>
        <div className="font-mono text-sm text-slate-300 mb-4">
          Show me: Service=API, Endpoint=/checkout,{" "}
          <span className="text-red-400 line-through">User_Tier=Premium</span>
        </div>

        <AnimatePresence>
          {showError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg"
            >
              <div className="flex items-center gap-2 text-red-400 mb-2">
                <div className="text-xl">❌</div>
                <div className="font-semibold">Dimension not available</div>
              </div>
              <div className="text-sm text-slate-400">
                User_Tier was not aggregated from the start
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Blocked Paths */}
      <div className="grid grid-cols-2 gap-6 flex-1">
        {/* Path A: Raw Spans Expired */}
        <motion.div
          initial={{ opacity: 0.5 }}
          animate={{ opacity: showError ? 1 : 0.5 }}
          className="flex flex-col items-center justify-center p-6 bg-slate-800/50 rounded-lg border border-slate-600"
        >
          <div className="text-5xl mb-3 opacity-30">🗄️</div>
          <div className="text-slate-400 text-center mb-2">Raw Spans</div>
          <div className="text-red-400 text-sm flex items-center gap-2">
            <span>⏰</span>
            <span>30 day retention - data expired</span>
          </div>
        </motion.div>

        {/* Path B: Expensive Reprocessing */}
        <motion.div
          initial={{ opacity: 0.5 }}
          animate={{ opacity: showError ? 1 : 0.5 }}
          className="flex flex-col items-center justify-center p-6 bg-slate-800/50 rounded-lg border border-slate-600"
        >
          <div className="text-5xl mb-3 opacity-30">♻️</div>
          <div className="text-slate-400 text-center mb-2">Reprocess Data</div>
          <div className="text-orange-400 text-sm space-y-1">
            <div className="flex items-center gap-2 justify-center">
              <span>💰</span>
              <span>Cost: $$$</span>
            </div>
            <div className="flex items-center gap-2 justify-center">
              <span>⏱️</span>
              <span>Time: ~48 hours</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Dead End Message */}
      {showError && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-slate-500 italic"
        >
          Investigation blocked - cannot drill down into past data
        </motion.div>
      )}
    </div>
  );
}
```

**Step 2: Test Scene 8**

Verify error display and blocked paths.

**Step 3: Commit Scene 8**

```bash
git add "Span Metrics Animation/src/app/pages/AggregationProblemsAnimation.tsx"
git commit -m "feat: implement Scene 8 - retrospective analysis blocked"
```

---

## Task 10: Implement Scene 9 - Balance Scale Dilemma

**Files:**
- Modify: `Span Metrics Animation/src/app/pages/AggregationProblemsAnimation.tsx`

**Step 1: Create Scene9 component**

Add to switch:
```tsx
case 8:
  return <Scene9 />;
```

Add Scene9:

```tsx
function Scene9() {
  const [tipped, setTipped] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setTipped(true), 1500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="flex flex-col gap-8 h-full">
      {/* Balance Scale */}
      <div className="flex-1 flex items-center justify-center">
        <div className="relative w-full max-w-4xl">
          {/* Fulcrum */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-32 bg-slate-600" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-16 bg-slate-700 rounded-full border-4 border-slate-600" />

          {/* Scale Arm */}
          <motion.div
            animate={{ rotate: tipped ? 15 : 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute bottom-32 left-1/2 -translate-x-1/2 w-full h-2 bg-slate-600 rounded origin-center"
          />

          {/* Left Side: Too Few */}
          <motion.div
            animate={{ y: tipped ? -40 : 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute bottom-32 left-12 w-64 p-6 bg-slate-800 border border-slate-600 rounded-lg"
          >
            <div className="text-center mb-4">
              <div className="text-xl font-bold text-yellow-400 mb-2">
                Too Few Dimensions
              </div>
              <div className="text-sm text-slate-400 mb-3">
                [service, endpoint]
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-red-400">
                <span>❌</span>
                <span>Can't drill down</span>
              </div>
              <div className="flex items-center gap-2 text-red-400">
                <span>❌</span>
                <span>Missing context</span>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Too Many */}
          <motion.div
            animate={{ y: tipped ? 40 : 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute bottom-32 right-12 w-64 p-6 bg-slate-800 border border-red-500 rounded-lg"
          >
            <div className="text-center mb-4">
              <div className="text-xl font-bold text-red-400 mb-2">
                Too Many Dimensions
              </div>
              <div className="text-xs text-slate-400 mb-1">
                [service, endpoint, method, status, region, tier,{" "}
                <span className="text-red-400 font-semibold">user_id</span>,{" "}
                <span className="text-red-400 font-semibold">request_path</span>]
              </div>
            </div>

            <div className="space-y-2 text-sm mb-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Time series:</span>
                <span className="text-red-400 font-mono font-bold">
                  2.8M
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Storage:</span>
                <span className="text-orange-400 font-mono">94%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Cost:</span>
                <span className="text-red-400 font-mono">$$$$$$</span>
              </div>
            </div>

            {tipped && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="text-4xl text-center"
              >
                💥
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Formula */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center bg-slate-900 rounded-lg border border-slate-700 p-6"
      >
        <div className="text-sm text-slate-400 mb-2">Cardinality Explosion</div>
        <div className="font-mono text-lg text-slate-300">
          4 × 5 × 4 × 6 ×{" "}
          <span className="text-red-400 font-bold">1000 users</span> ×{" "}
          <span className="text-red-400 font-bold">500 paths</span> ={" "}
          <span className="text-red-400 font-bold text-2xl">2,400,000</span>
        </div>
      </motion.div>
    </div>
  );
}
```

**Step 2: Test Scene 9**

Verify balance scale animation and tipping effect.

**Step 3: Commit Scene 9**

```bash
git add "Span Metrics Animation/src/app/pages/AggregationProblemsAnimation.tsx"
git commit -m "feat: implement Scene 9 - balance scale dilemma"
```

---

## Task 11: Add Routing and Home Page Integration

**Files:**
- Modify: `Span Metrics Animation/src/app/App.tsx`
- Modify: `Span Metrics Animation/src/app/pages/Home.tsx`

**Step 1: Add route to App.tsx**

Add the import and route:

```tsx
import AggregationProblemsAnimation from "./pages/AggregationProblemsAnimation";

// In the Routes:
<Route path="/aggregation-problems" element={<AggregationProblemsAnimation />} />
```

**Step 2: Add to Home page animations array**

In Home.tsx, add to the animations array:

```tsx
{
  id: "aggregation-problems",
  title: "The Aggregation Problem",
  description:
    "Step through the story of span aggregation: from raw traces to metrics, understanding the tradeoffs between detail and scalability.",
  path: "/aggregation-problems",
  icon: <Activity className="w-8 h-8" />,
  gradient: "from-orange-400 to-red-400",
},
```

**Step 3: Test navigation**

Navigate to home page and click the new animation card.

**Step 4: Commit routing changes**

```bash
git add "Span Metrics Animation/src/app/App.tsx" "Span Metrics Animation/src/app/pages/Home.tsx"
git commit -m "feat: add routing and home page link for Aggregation Problems"
```

---

## Task 12: Final Testing and Polish

**Files:**
- Modify: `Span Metrics Animation/src/app/pages/AggregationProblemsAnimation.tsx`

**Step 1: Test all scenes**

Go through all 9 scenes and verify:
- Animations trigger on scene entry
- Captions display correctly
- Navigation works (Next/Previous/Scene dots)
- Caption toggle works
- Console logging works in presenter mode

**Step 2: Fix any visual issues**

Adjust spacing, colors, or timing as needed.

**Step 3: Add keyboard navigation (optional enhancement)**

Add keyboard event listener for arrow keys:

```tsx
useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") handleNext();
    if (e.key === "ArrowLeft") handlePrevious();
  };

  window.addEventListener("keydown", handleKeyPress);
  return () => window.removeEventListener("keydown", handleKeyPress);
}, [currentScene]);
```

**Step 4: Final commit**

```bash
git add "Span Metrics Animation/src/app/pages/AggregationProblemsAnimation.tsx"
git commit -m "feat: add keyboard navigation and final polish"
```

---

## Task 13: Build and Verify

**Step 1: Run the build**

```bash
cd "Span Metrics Animation"
npm run build
```

**Step 2: Verify no errors**

Check that build completes successfully.

**Step 3: Test production build**

```bash
npm run preview
```

Navigate through the animation in the production build.

**Step 4: Final commit**

```bash
git add .
git commit -m "chore: verify production build"
```

---

## Notes

- Each scene is self-contained and triggers animations on entry
- Scenes use Framer Motion for smooth animations
- Caption system supports presenter mode with console logging
- Navigation includes Next/Previous buttons and scene indicators
- All visual elements match the existing animation's style (slate/blue/purple theme)
- Keyboard navigation enhances user experience

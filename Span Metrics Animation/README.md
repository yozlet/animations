# Observability Animations

Interactive visualizations for understanding distributed systems and observability concepts.

## Running the Code

### Using mise (recommended)

```bash
mise install
pnpm dev
```

### Using npm/pnpm directly

```bash
pnpm install
pnpm dev
```

Then open http://localhost:5173/ in your browser.

## Available Animations

### The Cardinality Explosion Problem

Demonstrates how aggregating trace spans into metrics creates exponential storage challenges in observability systems.

**Key concepts illustrated:**
- Context loss when aggregating raw traces into metrics
- How dimensions multiply to create unique time series combinations
- The trade-off between query flexibility and storage costs

**Interactive features:**
- Toggle 6 different dimensions (Service, HTTP Route, Method, Status Code, Region, Customer Tier)
- Watch cardinality calculations update in real-time
- See spans flow through processing stages with smooth animations
- Observe how spans transform from detailed traces to aggregated time series

## Project Structure

```
src/
├── app/
│   ├── App.tsx                           # Router configuration
│   ├── pages/
│   │   ├── Home.tsx                      # Landing page with animation gallery
│   │   └── SpanMetricsAnimation.tsx     # Cardinality explosion animation
│   └── components/
│       └── ui/                           # Reusable UI components
├── styles/
│   └── index.css                         # Global styles
└── main.tsx                              # Application entry point
```

## Technology Stack

- React 18 + TypeScript
- Vite (build tool)
- Framer Motion (animations)
- React Router (routing)
- Tailwind CSS (styling)

## Original Design

The original Figma design is available at:
https://www.figma.com/design/CgwItJaHITHo6DvxYvN6Tp/Span-Metrics-Animation

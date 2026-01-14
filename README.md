# Observability Animations

Interactive visualizations for understanding distributed systems and observability concepts.

## Project Structure

```
animations/
└── Span Metrics Animation/    # Interactive animation suite
    ├── src/
    │   └── app/
    │       ├── pages/
    │       │   ├── Home.tsx                    # Landing page
    │       │   └── SpanMetricsAnimation.tsx   # Cardinality explosion animation
    │       └── App.tsx                         # Router configuration
    └── ...
```

## Available Animations

### The Cardinality Explosion Problem
Explore how aggregating spans into metrics creates exponential storage challenges. See how each dimension multiplies the number of time series combinations, demonstrating the fundamental trade-offs in metrics aggregation systems.

**Features:**
- Interactive dimension toggles (Service, HTTP Route, Method, Status Code, Region, Customer Tier)
- Real-time cardinality calculation
- Smooth animations showing spans flowing through processing stages
- Visual demonstration of context loss during aggregation

## Getting Started

### Prerequisites

- [mise](https://mise.jdx.dev/) (or Node.js 22+ and pnpm 9+)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yozlet/animations.git
   cd animations/Span\ Metrics\ Animation
   ```

2. Set up the environment with mise:
   ```bash
   mise install
   ```

   Or manually with:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

4. Open http://localhost:5173/ in your browser

## Technology Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Framer Motion** - Animation library
- **React Router** - Client-side routing
- **Tailwind CSS** - Styling
- **Lucide React** - Icon library

## Adding New Animations

1. Create a new component in `Span Metrics Animation/src/app/pages/`
2. Add the animation to the array in `Home.tsx`:
   ```tsx
   {
     id: "your-animation",
     title: "Your Animation Title",
     description: "Description of what it demonstrates",
     path: "/your-animation",
     icon: <YourIcon className="w-8 h-8" />,
     gradient: "from-color-400 to-color-400",
   }
   ```
3. Add the route in `App.tsx`:
   ```tsx
   <Route path="/your-animation" element={<YourAnimation />} />
   ```

## License

This project demonstrates observability concepts through interactive visualizations.

## Credits

Built with Claude Code.

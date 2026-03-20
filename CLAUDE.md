# Development Notes

## Package Manager

This project uses **pnpm** for package management. The system also uses **mise** for tool version management.

To run commands:
```bash
cd "Span Metrics Animation"
mise exec -- pnpm install
mise exec -- pnpm run dev
mise exec -- pnpm run build
```

## Project Structure

- `Span Metrics Animation/` - Main animation project using React + Vite
  - `src/app/pages/AggregationProblemsAnimation.tsx` - Main animation component with 9 scenes

## Animation Scenes

The Aggregation Problems animation contains 9 scenes:

1. **Scene 1**: Introduction to spans with cards and bar graph
2. **Scene 2**: Massive span flood (50 spans streaming in)
3. **Scene 3**: SQL query on well-indexed database
4. **Scene 4**: Slow query visualization
5. **Scene 5**: Real-time aggregation
6. **Scene 6**: Loss of granularity tradeoff
7. **Scene 7**: Pre-defined dimensions problem
8. **Scene 8**: Retrospective analysis limitation
9. **Scene 9**: Cardinality explosion

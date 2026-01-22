import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SpanMetricsAnimation from "./pages/SpanMetricsAnimation";
import AggregationProblemsAnimation from "./pages/AggregationProblemsAnimation";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/span-metrics" element={<SpanMetricsAnimation />} />
        <Route path="/aggregation-problems" element={<AggregationProblemsAnimation />} />
      </Routes>
    </BrowserRouter>
  );
}

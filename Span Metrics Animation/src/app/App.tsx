import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SpanMetricsAnimation from "./pages/SpanMetricsAnimation";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/span-metrics" element={<SpanMetricsAnimation />} />
      </Routes>
    </BrowserRouter>
  );
}

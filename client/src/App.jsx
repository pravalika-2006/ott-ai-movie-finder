import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import MovieDetails from "./MovieDetails";
import Watchlist from "./Watchlist";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/watchlist" element={<Watchlist />} />

        <Route
          path="*"
          element={<h1 style={{ color: "white" }}>404 Not Found</h1>}
        />
      </Routes>
    </BrowserRouter>
  );
}
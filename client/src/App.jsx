import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { getPopularMovies, searchMovies, getWatchProviders } from "./api/tmdb";
import "./App.css";
import MovieDetails from "./MovieDetails";

function Home() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchMoviesWithProviders = async (apiCall) => {
    const data = await apiCall();

    const moviesWithProviders = await Promise.all(
      (data.results || []).map(async (movie) => {
        try {
          const providerData = await getWatchProviders(movie.id);

          const providers =
            providerData?.results?.IN?.flatrate
              ?.map((p) => p.provider_name)
              .join(", ") || "";

          return { ...movie, providers };
        } catch {
          return { ...movie, providers: "" };
        }
      })
    );

    setMovies(moviesWithProviders);
  };

  useEffect(() => {
    fetchMoviesWithProviders(getPopularMovies);
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      if (search.trim() === "") {
        fetchMoviesWithProviders(getPopularMovies);
      } else {
        fetchMoviesWithProviders(() => searchMovies(search));
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [search]);

  return (
    <div>
      <div className="navbar">🎬 AI OTT Movie Finder</div>

      <div className="banner">
        <h1>Find Movies + Details</h1>

        <input
          placeholder="Search movies..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "10px", width: "60%" }}
        />
      </div>

      <div className="movies">
        {movies.map((movie) => (
          <div
            className="movie-card"
            key={movie.id}
            onClick={() => navigate(`/movie/${movie.id}`)}
            style={{ cursor: "pointer" }}
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            />
            <h3>{movie.title}</h3>

            <p style={{ fontSize: "12px", color: "#aaa" }}>
              {movie.providers || "No OTT info"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
      </Routes>
    </BrowserRouter>
  );
}
import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useParams
} from "react-router-dom";

import {
  getPopularMovies,
  searchMovies,
  getWatchProviders
} from "./api/tmdb";

import "./App.css";


// ================= HOME PAGE =================
function Home() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const moodMap = {
    happy: "comedy fun",
    sad: "drama emotional",
    action: "action fight",
    romance: "love romantic",
    thriller: "mystery crime",
  };

  const addToWatchlist = (movie) => {
    const existing = JSON.parse(localStorage.getItem("watchlist")) || [];

    const alreadyExists = existing.find((m) => m.id === movie.id);

    if (!alreadyExists) {
      const updated = [...existing, movie];
      localStorage.setItem("watchlist", JSON.stringify(updated));
    }
  };

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
      const q = search.toLowerCase();

      if (q.trim() === "") {
        fetchMoviesWithProviders(getPopularMovies);
      } else if (moodMap[q]) {
        fetchMoviesWithProviders(() => searchMovies(moodMap[q]));
      } else {
        fetchMoviesWithProviders(() => searchMovies(search));
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [search]);

  return (
    <div>

      {/* NAVBAR */}
      <div className="navbar">
        🎬 AI OTT Movie Finder
        <button
          onClick={() => navigate("/watchlist")}
          style={{ marginLeft: "20px" }}
        >
          ❤️ Watchlist
        </button>
      </div>

      {/* SEARCH */}
      <div className="banner">
        <h1>Find Movies + Mood Search</h1>

        <input
          type="text"
          placeholder="happy, sad, action OR movie name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: "10px", width: "60%" }}
        />
      </div>

      {/* MOVIES */}
      <div className="movies">
        {movies.map((movie) => (
          <div
            className="movie-card"
            key={movie.id}
          >

            <img
              onClick={() => navigate(`/movie/${movie.id}`)}
              style={{ cursor: "pointer" }}
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
            />

            <h3>{movie.title}</h3>

            <p style={{ fontSize: "12px", color: "#aaa" }}>
              {movie.providers || "No OTT info"}
            </p>

            <button
              onClick={() => addToWatchlist(movie)}
              style={{
                margin: "8px",
                padding: "5px 10px",
                background: "red",
                color: "white",
                border: "none",
                borderRadius: "5px"
              }}
            >
              ❤️ Add
            </button>

          </div>
        ))}
      </div>
    </div>
  );
}


// ================= MOVIE DETAILS PAGE =================
function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${import.meta.env.VITE_TMDB_API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => setMovie(data));
  }, [id]);

  const addToWatchlist = () => {
    const existing = JSON.parse(localStorage.getItem("watchlist")) || [];

    const alreadyExists = existing.find((m) => m.id === movie.id);

    if (!alreadyExists) {
      const updated = [...existing, movie];
      localStorage.setItem("watchlist", JSON.stringify(updated));
    }
  };

  if (!movie) return <p style={{ color: "white" }}>Loading...</p>;

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <button onClick={() => navigate("/")}>⬅ Back</button>

      <h1>{movie.title}</h1>

      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        style={{ width: "300px" }}
      />

      <p>⭐ {movie.vote_average}</p>
      <p>📅 {movie.release_date}</p>
      <p>{movie.overview}</p>

      <button
        onClick={addToWatchlist}
        style={{
          padding: "10px",
          background: "red",
          color: "white",
          border: "none",
          borderRadius: "5px"
        }}
      >
        ❤️ Add to Watchlist
      </button>
    </div>
  );
}


// ================= WATCHLIST PAGE =================
function Watchlist() {
  const [list, setList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("watchlist")) || [];
    setList(saved);
  }, []);

  const removeMovie = (id) => {
    const updated = list.filter((m) => m.id !== id);
    setList(updated);
    localStorage.setItem("watchlist", JSON.stringify(updated));
  };

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <button onClick={() => navigate("/")}>⬅ Back</button>

      <h1>❤️ Watchlist</h1>

      {list.length === 0 ? (
        <p>No movies saved</p>
      ) : (
        list.map((movie) => (
          <div key={movie.id}>
            <h3>{movie.title}</h3>
            <button onClick={() => removeMovie(movie.id)}>
              ❌ Remove
            </button>
          </div>
        ))
      )}
    </div>
  );
}


// ================= MAIN APP =================
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/watchlist" element={<Watchlist />} />
      </Routes>
    </BrowserRouter>
  );
}
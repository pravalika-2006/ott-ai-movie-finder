import { useEffect, useState } from "react";
import { getPopularMovies, searchMovies, getWatchProviders } from "./api/tmdb";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");

  // 🎭 Mood mapping
  const moodMap = {
    happy: "comedy fun",
    sad: "drama emotional",
    action: "action fight",
    romance: "love romantic",
    thriller: "mystery crime",
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

          return {
            ...movie,
            providers,
          };
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
      const query = search.toLowerCase();

      if (query.trim() === "") {
        fetchMoviesWithProviders(getPopularMovies);
      } else if (moodMap[query]) {
        fetchMoviesWithProviders(() =>
          searchMovies(moodMap[query])
        );
      } else {
        fetchMoviesWithProviders(() =>
          searchMovies(search)
        );
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [search]);

  return (
    <div>

      {/* HEADER */}
      <div className="navbar">
        🎬 AI OTT Movie Finder
      </div>

      {/* SEARCH */}
      <div className="banner">
        <h1>Find Movies + Mood Search</h1>

        <input
          type="text"
          placeholder="Try: happy, sad, action, romance, thriller OR movie name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            padding: "10px",
            width: "60%",
            marginTop: "15px"
          }}
        />
      </div>

      {/* MOVIES */}
      <div className="movies">
        {movies.map((movie) => (
          <div className="movie-card" key={movie.id}>
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
            />
            <h3>{movie.title}</h3>

            <p style={{ fontSize: "12px", color: "#aaa" }}>
              {movie.providers
                ? `Available on: ${movie.providers}`
                : "OTT info not available"}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}

export default App;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  // 🎭 MOOD MAP
  const moodMap = {
    happy: "comedy",
    sad: "drama",
    action: "action",
    romance: "romance",
    thriller: "mystery",
  };

  // 🎬 FETCH FUNCTION
  const fetchMovies = (url) => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => setMovies(data.results || []))
      .catch((err) => console.log(err));
  };

  // 🔥 LOAD POPULAR
  useEffect(() => {
    if (!API_KEY) return;

    fetchMovies(
      `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`
    );
  }, []);

  // 🔍 SEARCH + MOOD
  useEffect(() => {
    const delay = setTimeout(() => {
      if (!API_KEY) return;

      const q = search.toLowerCase().trim();

      if (q === "") {
        fetchMovies(
          `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}`
        );
      } else if (moodMap[q]) {
        fetchMovies(
          `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${moodMap[q]}`
        );
      } else {
        fetchMovies(
          `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${q}`
        );
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [search]);

  return (
    <div style={{ padding: "20px", color: "white" }}>

      {/* NAVBAR */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h1>🎬 AI OTT Movie Finder</h1>

        <button
          onClick={() => navigate("/watchlist")}
          style={{
            padding: "10px",
            background: "red",
            color: "white",
            border: "none",
            borderRadius: "5px"
          }}
        >
          ❤️ Watchlist
        </button>
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Try: happy, sad, action OR movie name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          padding: "10px",
          width: "100%",
          marginTop: "15px",
          marginBottom: "20px"
        }}
      />

      {/* MOVIES */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {movies.map((movie) => (
          <div
            key={movie.id}
            style={{ width: "150px", cursor: "pointer" }}
            onClick={() => navigate(`/movie/${movie.id}`)}
          >
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              style={{ width: "100%", borderRadius: "10px" }}
            />
            <p>{movie.title}</p>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Home;
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState("");
  const [showTrailer, setShowTrailer] = useState(false);
  const [providers, setProviders] = useState([]);

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  // 🎬 MOVIE DETAILS
  useEffect(() => {
    if (!API_KEY) return;

    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`)
      .then((res) => res.json())
      .then((data) => setMovie(data))
      .catch((err) => console.log(err));
  }, [id]);

  // 🎥 TRAILER FETCH
  useEffect(() => {
    if (!API_KEY) return;

    fetch(
      `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        const videos = data?.results || [];

        const trailer =
          videos.find((v) => v.site === "YouTube" && v.key) ||
          null;

        setTrailerKey(trailer?.key || "");
      })
      .catch((err) => console.log(err));
  }, [id]);

  // 📺 OTT PROVIDERS FETCH
  useEffect(() => {
    if (!API_KEY) return;

    fetch(
      `https://api.themoviedb.org/3/movie/${id}/watch/providers?api_key=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        const inData = data?.results?.IN;

        const ottList =
          inData?.flatrate?.map((p) => p.provider_name) || [];

        setProviders(ottList);
      })
      .catch((err) => console.log(err));
  }, [id]);

  // ❤️ WATCHLIST
  const addToWatchlist = () => {
    if (!movie) return;

    const list = JSON.parse(localStorage.getItem("watchlist")) || [];

    if (!list.find((m) => m.id === movie.id)) {
      list.push(movie);
      localStorage.setItem("watchlist", JSON.stringify(list));
    }
  };

  if (!movie?.title) {
    return <p style={{ color: "white" }}>Loading...</p>;
  }

  return (
    <div style={{ padding: "20px", color: "white" }}>

      {/* BACK BUTTON */}
      <button onClick={() => navigate("/")}>⬅ Back</button>

      {/* TITLE */}
      <h1>{movie.title}</h1>

      {/* POSTER */}
      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        style={{ width: "300px", borderRadius: "10px" }}
      />

      {/* INFO */}
      <p>⭐ {movie.vote_average}</p>
      <p>📅 {movie.release_date}</p>
      <p>{movie.overview}</p>

      {/* OTT SECTION */}
      <div style={{ marginTop: "15px" }}>
        <h3>📺 Available on OTT:</h3>

        {providers.length > 0 ? (
          <ul>
            {providers.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        ) : (
          <p style={{ color: "gray" }}>
            No OTT data available in India
          </p>
        )}
      </div>

      {/* WATCHLIST BUTTON */}
      <button
        onClick={addToWatchlist}
        style={{
          padding: "10px",
          background: "red",
          color: "white",
          border: "none",
          borderRadius: "5px",
          marginRight: "10px",
          marginTop: "10px"
        }}
      >
        ❤️ Add to Watchlist
      </button>

      {/* TRAILER BUTTON */}
      {trailerKey && (
        <button
          onClick={() => setShowTrailer(true)}
          style={{
            padding: "10px",
            background: "green",
            color: "white",
            border: "none",
            borderRadius: "5px",
            marginTop: "10px"
          }}
        >
          ▶ Play Trailer
        </button>
      )}

      {/* TRAILER POPUP */}
      {showTrailer && trailerKey && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.9)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <div>
            <button onClick={() => setShowTrailer(false)}>
              ❌ Close
            </button>

            <iframe
              width="800"
              height="450"
              src={`https://www.youtube.com/embed/${trailerKey}`}
              allowFullScreen
            />
          </div>
        </div>
      )}

    </div>
  );
}

export default MovieDetails;
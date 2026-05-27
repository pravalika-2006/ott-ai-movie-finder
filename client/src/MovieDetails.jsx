import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}`)
      .then((res) => res.json())
      .then((data) => setMovie(data));
  }, [id]);

  if (!movie) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px", color: "white" }}>
      <button onClick={() => navigate("/")}>⬅ Back</button>

      <h1>{movie.title}</h1>

      <img
        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        style={{ width: "300px", borderRadius: "10px" }}
      />

      <p>⭐ Rating: {movie.vote_average}</p>
      <p>📅 Release: {movie.release_date}</p>
      <p>{movie.overview}</p>
    </div>
  );
}

export default MovieDetails;
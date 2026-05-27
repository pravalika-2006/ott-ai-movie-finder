import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

export default Watchlist;
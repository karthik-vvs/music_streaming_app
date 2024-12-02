import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Favourites = ({ toggleFavourite }) => {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const getFavourites = async () => {
    try {
      const response = await fetch("http://localhost:5000/music");
      if (!response.ok) throw new Error("Failed to fetch favourites");
      const data = await response.json();
      setFavourites(data.filter((song) => song.like)); // Only get favourites where 'like' is true
    } catch (err) {
      console.error(err);
      setError("Unable to load favourites. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Use useEffect to call getFavourites once when the component mounts
  useEffect(() => {
    getFavourites();
  }, [toggleFavourite]); // Runs whenever toggleFavourite changes

  const handleRemoveFavourite = async (song) => {
    const updatedSong = { ...song, like: false };

    try {
      const response = await fetch(`http://localhost:5000/music/${song.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedSong),
      });

      if (!response.ok) throw new Error("Failed to remove from favourites");

      toggleFavourite(updatedSong); // Update the favourites state in the parent component
      getFavourites(); // Refresh favourites after updating
    } catch (err) {
      console.error("Error removing from favourites:", err);
      setError("Unable to remove from favourites. Please try again later.");
    }
  };

  return (
    <div className="screen-container text-center">
      <h2 className="text-light m-2">Favourites</h2>
      {loading ? (
        <p className="text-light">Loading...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : favourites.length === 0 ? (
        <p className="text-danger">No songs in favourites</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Song Name</th>
              <th>Artist</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {favourites.map((song) => (
              <tr key={song.id}>
                <td>{song.name}</td>
                <td>{song.author}</td>
                <td>
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => handleRemoveFavourite(song)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Favourites;

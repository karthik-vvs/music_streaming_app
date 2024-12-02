import React, { useEffect, useState } from "react";
import ReactAudioPlayer from "react-audio-player";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faHeartBroken } from "@fortawesome/free-solid-svg-icons";
import { useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./mP.css";

const Profile = ({toggleFavourite, toggleLibrary}) => {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { id } = useParams();

  // Fetch all songs from the API
  const getSongs = async () => {
    try {
      const response = await fetch("http://localhost:5000/music");
      if (!response.ok) throw new Error("Failed to fetch songs");
      const data = await response.json();
      setSongs(data);
    } catch (err) {
      console.error("Error fetching songs:", err);
      setError("Unable to load songs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSongs();
  }, []);

  const filteredSongs = songs.filter((song) => song.id === id);

  // Handle toggling the favourite status
  const handleFavouriteToggle = async (song) => {
    const updatedSong = { ...song, like: !song.like };

    try {
      const response = await fetch(`http://localhost:5000/music/${song.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedSong),
      });

      if (!response.ok) throw new Error("Failed to update favourites");

      toggleFavourite(updatedSong); // Update the favourites state in the parent component
      getSongs(); // Refresh songs after updating
    } catch (err) {
      console.error("Error updating favourites:", err);
      setError("Unable to update favourites. Please try again later.");
    }
  };

  // Handle toggling the library status
  const handleLibraryToggle = async (song) => {
    const updatedSong = { ...song, lib: !song.lib };

    try {
      const response = await fetch(`http://localhost:5000/music/${song.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedSong),
      });

      if (!response.ok) throw new Error("Failed to update library");

      toggleLibrary(updatedSong); // Update the library state in the parent component
      getSongs(); // Refresh songs after updating
    } catch (err) {
      console.error("Error updating library:", err);
      setError("Unable to update library. Please try again later.");
    }
  };

  return (
    <div className="song-card pt-2 pb-2 bg-dark" id="s-card">
      {loading ? (
        <div className="text-light">Loading...</div>
      ) : error ? (
        <div className="text-danger">{error}</div>
      ) : filteredSongs.length === 0 ? (
        <div className="text-light">Song not found</div>
      ) : (
        filteredSongs.map((song) => (
          <div className="container" key={song.id}>
            <div className="row">
              <div className="col-12 col-sm-6 col-md-4 col-xl-12 mb-4 mr-2">
                <img
                  src={song?.image}
                  alt="album-cover"
                  className="song-image"
                />
              </div>
              <div className="col-12 col-sm-6 col-md-4 col-xl-12 mb-4 mr-2">
                <div className="song-title">{song?.name}</div>
                <div className="song-author">{song?.author}</div>
              </div>
              <div className="col-12 col-sm-6 col-md-4 col-xl-3 mb-4 mr-2">
                <button
                  className="btn btn-outline-danger"
                  onClick={() => handleFavouriteToggle(song)}
                >
                  <FontAwesomeIcon
                    icon={song.like ? faHeartBroken : faHeart}
                  />
                </button>
              </div>
              <div className="text-center">
                <ReactAudioPlayer
                  src={song?.ad || ""}
                  controls
                  className="col-12 col-sm-6 col-md-6 col-xl-8 mb-4 mr-2"
                />
              </div>
              <div className="d-flex justify-content-center col-12">
                <button
                  className="btn btn-primary"
                  onClick={() => handleLibraryToggle(song)}
                >
                  {song.lib ? "Remove from Library" : "Add to Library"}
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Profile;

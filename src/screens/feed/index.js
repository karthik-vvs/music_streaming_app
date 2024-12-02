import React, { useEffect, useState } from "react";
import "./feed.css";
import "bootstrap/dist/css/bootstrap.min.css";
import MusicCard from "./musicCard"; // Assuming MusicCard handles displaying song info
import Profile from "../musicProfile/Profile"; // Assuming this is related to user profile

const Feed = () => {
  const [songs, setSongs] = useState([]); // State to store the list of songs
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error message state
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [editSong, setEditSong] = useState(null); // Track which song is being edited
  const [updatedSong, setUpdatedSong] = useState({
    name: "",
    author: "",
    image: "",
    ad: "", // Assuming `ad` is the audio URL based on your code
  }); // Track changes to song details

  // Fetch songs from the server
  const getSongs = async () => {
    try {
      const response = await fetch("http://localhost:5000/music");
      if (!response.ok) throw new Error("Failed to fetch songs");
      const data = await response.json();
      setSongs(data); // Set songs in state
    } catch (err) {
      console.error(err);
      setError("Unable to load songs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSongs();
  }, []);

  // Handle search functionality (no need to refetch songs)
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm) {
      const filteredSongs = songs.filter(
        (song) =>
          song.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          song.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSongs(filteredSongs); // Set filtered songs in state
    } else {
      getSongs(); // If search term is cleared, fetch all songs
    }
  };

  // Handle delete song
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/music/${id}`, { method: "DELETE" });
      setSongs(songs.filter((song) => song.id !== id)); // Remove song from the list after deletion
    } catch (err) {
      console.error(err);
      setError("Unable to delete song.");
    }
  };

  // Open the Edit Form and set song data
  const handleEdit = (song) => {
    setEditSong(song); // Set the song to be edited
    setUpdatedSong({
      name: song.name,
      author: song.author,
      image: song.image,
      ad: song.ad, // Assuming `ad` is the audio URL
    }); // Pre-fill the form with current data
  };

  // Handle the form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedSong({ ...updatedSong, [name]: value });
  };

  // Handle saving the edited song
  const handleSaveEdit = async () => {
    try {
      await fetch(`http://localhost:5000/music/${editSong.id}`, {
        method: "PUT",
        body: JSON.stringify(updatedSong),
        headers: { "Content-Type": "application/json" },
      });
      setSongs(
        songs.map((song) =>
          song.id === editSong.id ? { ...song, ...updatedSong } : song
        )
      );
      setEditSong(null); // Close the edit form
    } catch (err) {
      console.error(err);
      setError("Unable to save changes.");
    }
  };

  return (
    <div className="screen-container container-fluid overflow-auto">
      {/* Search Bar */}
      <div className="row">
        <div className="mt-4 mb-4 col-9 justify-content-center">
          <input
            type="text"
            className="form-control"
            placeholder="Search songs"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
           </div>
          <div className="col-2">
          <button className="btn btn-outline-primary mt-4" onClick={handleSearch}>
            Search
          </button>
          </div>
      </div>

      {/* Error and Loading States */}
      {loading && <div>Loading songs...</div>}
      {error && <div className="error-message">{error}</div>}
      {!loading && !error && songs.length === 0 && <div className="text-danger text-center">No songs available</div>}

      {/* Song List */}
      <div className="row hello">
        {!loading &&
          !error &&
          songs.map((song) => (
            <div key={song.id} className="col-12 col-sm-6 col-md-4 col-xl-3 mb-4 mr-2">
              <MusicCard song={song} />
              {/* Edit and Delete buttons */}
              <div className="btn-group">
                <button
                  className="btn btn-warning"
                  onClick={() => handleEdit(song)} // Open edit form
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(song.id)} // Delete song
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Edit Form */}
      {editSong && (
        <div className="modal show" style={{ display: "block" }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Song</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setEditSong(null)} // Close form without saving
                ></button>
              </div>
              <div className="modal-body">
                <div>
                  <label>Song Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={updatedSong.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label>Author</label>
                  <input
                    type="text"
                    className="form-control"
                    name="author"
                    value={updatedSong.author}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label>Image URL</label>
                  <input
                    type="text"
                    className="form-control"
                    name="image"
                    value={updatedSong.image}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label>Audio URL</label>
                  <input
                    type="text"
                    className="form-control"
                    name="ad"
                    value={updatedSong.ad}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditSong(null)} // Close form without saving
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSaveEdit} // Save changes
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Feed;

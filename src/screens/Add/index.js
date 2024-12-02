import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Add = () => {
  const [songs, setSongs] = useState([]);
  const [newSong, setNewSong] = useState({
    image: "",
    author: "",
    name: "",
    ad: "",
    lib: false,
    like: false,
  });
  const [alert, setAlert] = useState(""); // New state for the alert

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewSong({ ...newSong, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:5000/music", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newSong),
    })
      .then((response) => response.json())
      .then((data) => {
        setSongs([...songs, data]); // Update local state with the new song
        setNewSong({ image: "", author: "", name: "", ad: "" });
        setAlert("Song added successfully!"); // Set alert message
        setTimeout(() => setAlert(""), 3000); // Clear alert after 3 seconds
      })
      .catch((error) => console.error("Error adding song:", error));
  };

  return (
    <div className="screen-container text-center gp">
      <h2 className="text-light">Add a New Song</h2>
      <div className="bp mt-5">
        {alert && <div className="alert alert-success">{alert}</div>} {/* Display alert */}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="image"
            value={newSong.image}
            placeholder="Image URL"
            onChange={handleChange}
            required
            className="col-10 m-2"
          />
          <input
            type="text"
            name="author"
            value={newSong.author}
            placeholder="Author"
            onChange={handleChange}
            required
            className="col-10 m-2"
          />
          <input
            type="text"
            name="name"
            value={newSong.name}
            placeholder="Song Name"
            onChange={handleChange}
            required
            className="col-10 m-2"
          />
          <input
            type="text"
            name="ad"
            value={newSong.ad}
            placeholder="Ad URL"
            onChange={handleChange}
            required
            className="col-10 m-2"
          />
          <button type="submit" className="btn btn-primary col-3">
            Add Song
          </button>
        </form>
      </div>
    </div>
  );
};

export default Add;

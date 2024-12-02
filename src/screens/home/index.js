import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Favourites from "../favourites";
import Feed from "../feed";
import Library from "../library";
import Add from "../Add";
import "./home.css";
import Sidebar from "../../components/sidebar";
import Profile from "../musicProfile/Profile";

const Home = () => {
  const [favourites, setFavourites] = useState([]);
  const [library, setLibrary] = useState([]);

  const toggleFavourite = (song) => {
    if (favourites.some((fav) => fav.id === song.id)) {
      setFavourites(favourites.filter((fav) => fav.id !== song.id));
    } else {
      setFavourites([...favourites, song]);
    }
  };

  const toggleLibrary = (song) => {
    if (library.some((lib) => lib.id === song.id)) {
      setLibrary(library.filter((lib) => lib.id !== song.id));
    } else {
      setLibrary([...library, song]);
    }
  };

  return (
    <div className="back">
      <Router>
        <div className="main-body">
          <Sidebar />
          <Routes>
            <Route
              path="/"
              element={
                <Library
                  library={library}
                  toggleLibrary={toggleLibrary}
                />
              }
            />
            <Route path="/feed" element={<Feed />} />
            <Route path="/trending" element={<Add />} />
            <Route
              path="/favourites"
              element={
                <Favourites
                  favourites={favourites}
                  toggleFavourite={toggleFavourite}
                />
              }
            />
            <Route
              path="/profile/:id"
              element={
                <Profile
                  favourites={favourites}
                  toggleFavourite={toggleFavourite}
                  toggleLibrary={toggleLibrary}
                  library={library}
                />
              }
            />
          </Routes>
        </div>
      </Router>
    </div>
  );
};

export default Home;

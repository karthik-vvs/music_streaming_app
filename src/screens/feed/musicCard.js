import React from "react";
import ReactAudioPlayer from "react-audio-player";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-regular-svg-icons";
import { Link, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const MusicCard = ({ song }) => {
  return (
    <div className="song-card">
      {/* 🛑 Important--------------------- */}
      <Link to={`/profile/${song.id}`}>
        {/* ---------------------------------- */}
        <img
          src={song?.image }
          alt="album-cover"
          className="song-image"
          style={{width: "100%"}}
        />
        {/* ?? is called as Nullish Coalescing Operator */}
        <div className="song-title">{song?.name}</div>
        <div className="song-author">{song?.author}</div>
      </Link>
    </div>
  );
};

export default MusicCard;

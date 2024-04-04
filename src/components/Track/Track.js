import React, { useCallback } from "react";
import "./Track.css";

// each element of playlistTracks are passed props
// it will show the name of the song, singer of the song, and alumn name of the song.
// it will has a "+" or "-" button based on if this element is render on  the searchResult component or Playlist Component
// different functions will be called based on the which component it is called to.
// if this element is called from the Playlist component, it will have the isremoval attribute set to false
// none if it is called from the SearchResult componment
const Track = (props) => {

  const handleAddTrack = useCallback(
    (event) => {
      props.onAdd(props.track);
    },
    [props.onAdd, props.track]
  );

  const handleRemoveTrack = useCallback(
    (event) => {
      props.onRemove(props.track);
    },
    [props.onRemove, props.track]
  );

  const renderAction = () => {
    if (props.isRemoval) {
      return (
        <button className="Track-action" onClick={handleRemoveTrack}>
          -
        </button>
      );
    }
    return (
      <button className="Track-action" onClick={handleAddTrack}>
        +
      </button>
    );
  };

  return (
    <div className="Track">
      <div className="Track-information">
        <h3>{props.track.name}</h3>
        <p>
          {props.track.artist} | {props.track.album}
        </p>
      </div>
      {renderAction()}
    </div>
  );
};

export default Track;

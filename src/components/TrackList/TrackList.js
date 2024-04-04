import React from "react";
import "./TrackList.css";
import Track from "../Track/Track";

// both <PlayList> and <SearchResult> components use TrackList

// the searchResults state is passed in as parameter - it is an array of objects
const TrackList = (props) => {
  return (
    <div className="TrackList">

      {/* loop through each element in the searchResults */}
      {/* the info of each element will be passed in as parameter to a Track component */}
      {props.tracks.map((track) => {
        return (
          <Track
            track={track}
            key={track.id}
            onAdd={props.onAdd}
            isRemoval={props.isRemoval}
            onRemove={props.onRemove}
          />
        );
      })}
    </div>
  );
};

export default TrackList;

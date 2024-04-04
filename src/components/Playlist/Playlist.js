import React, { useCallback } from "react";
import "./Playlist.css";
import TrackList from "../TrackList/TrackList";

// this component will contain songs user want to created a new playlis
// when the user click the '+' on the SearchResult component, the song will be added to this component by adding it to the playlistTracks state
// playlistTracks is an array of song objects, and it will be passed in as props to the tracklist component

const Playlist = (props) => {
  
  const handleNameChange = useCallback(
    (event) => {
      props.onNameChange(event.target.value);
    },
    [props.onNameChange]
  );

  const handleInputBlur = useCallback(() =>{
    if(props.playlistName.trim()===''){
      props.onNameChange('New Playlist')
    }
  },[props.playlistName])

  return (
    <div className="Playlist">

      {/* on blur is triggered when the cursor click on other element */}
      <input onChange={handleNameChange} value={props.playlistName} onBlur= {handleInputBlur}/>
      <TrackList
        tracks={props.playlistTracks}
        isRemoval={true}
        onRemove={props.onRemove}
      />
      <button className="Playlist-save" onClick={props.onSave}>
        SAVE TO SPOTIFY
      </button>
    </div>
  );
};

export default Playlist;

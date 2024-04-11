import React from "react";
import "./SearchResults.css";
import TrackList from "../TrackList/TrackList";
import SavedPlaylist from '../SavedPlaylist/SavedPlaylist';

// this component take the State of searchResult from App component.
// and pass it to TrackList component as paramemter
// so the songs will be displayed
const SearchResults = (props) => {
  return (
    <div className="SearchResults">
      <h2>Results</h2>
      <TrackList 
        tracks={props.searchResults} 
        onAdd={props.onAdd} />
      <SavedPlaylist 
        currentPlaylist = {props.currentPlaylist}
        onPlaySelect={props.onPlaylistSelect}
        updatePlaylistName= {props.updatePlaylistName}
        updatePlaylistId = {props.updatePlaylistId}/>
    </div>
  );
};

export default SearchResults;

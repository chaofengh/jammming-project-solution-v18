import React, { useState, useCallback, useEffect } from "react";
import "./App.css";
import Playlist from "../Playlist/Playlist";
import SearchBar from "../SearchBar/SearchBar";
import SearchResults from "../SearchResults/SearchResults";
import Spotify from "../../util/Spotify";

const App = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [playlistName, setPlaylistName] = useState("New Playlist");
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [currentPlaylist,setCurrentPlaylist]= useState([]);
  const [PlaylistId,setPlaylistId] = useState('');

  // all the functions are wrapped in useCallback() or useEffect() to avoid unnecessary re-render and for dependency control'

  // this function lookup 'term' that user input in the search box
  // then use the Spotify API to fetch the result
  // then save the result as a State - array of objects
  const search = useCallback(async (term) => {
    try{
      const result = await Spotify.search(term)
      const filteredResult = result.filter((track) =>{
        return !playlistTracks.some((savedtrack) => savedtrack.id === track.id)
      })
      setSearchResults(filteredResult)
    }catch(error){
      console.log(error)
    }
  }, [playlistTracks]);


  const updatePlaylistId = useCallback((joe) =>{
      setPlaylistId(joe)
  },[PlaylistId])

  const handlePlaylistSelect = useCallback(async (songs) => {
    setPlaylistTracks(songs);
  }, [playlistTracks]);

  // this function add the song to the Playist component when the '+' is clicked next to the song on the SearchResult component
  // this function update the state of playlistTracks. and updating playlistTracks will cost the Playlist component to re-render
    // because playListTrack is pass-in as a prop, everytime a prop changes, it cause the component to re-render based on the prop
  const addTrack = useCallback((track) => {
      //avoid adding redunant track to the listTrack
        // the 'some' function return true if the condition of atleast one element in the array match
      if (playlistTracks.some((savedTrack) => savedTrack.id === track.id))
        return;
      // add new track to the listTrack
      setPlaylistTracks((prevTracks) => [...prevTracks, track]);
    },
    // every changes on the playListracks, it will re-render
    [playlistTracks]
  );

  
  // this function remove the song on the Playist component when the '-' is clicked next to the song on the SearchResult component
  // this function update the state of playlistTracks. and updating playlistTracks will cost the Playlist component to re-render
    // because playListTrack is pass-in as a prop, everytime a prop changes, it cause the component to re-render based on the prop
  const removeTrack = useCallback((track) => {
    setPlaylistTracks((prevTracks) =>
      prevTracks.filter((currentTrack) => currentTrack.id !== track.id)
    );
  }, [playlistTracks]);

  const updatePlaylistName = useCallback((name) => {
    setPlaylistName(name);
  }, []);


  const savePlaylist = useCallback( async() => {

    const trackUris = playlistTracks.map((track) => track.uri);
    if(PlaylistId){
      const songs = await Spotify.getsongs(PlaylistId)

      // .filter will return an arrray of element that returned as true in the conditon
      const tracksToAdd = playlistTracks.filter((track) =>{
        // .some will return true of any one of the element return true in the condition
        return !songs.some((song) => song.id === track.id)
      })

      const songsToRemove = songs.filter((song) =>{
        return !playlistTracks.some((track) => track.uri === song.uri)
      })

      if(songsToRemove.length >0){
        const urisToRemove = songsToRemove.map((song) =>{
          return {uri: song.uri}
        })
        await Spotify.removeFromPlaylist(PlaylistId,urisToRemove)
      }

      if(tracksToAdd.length>0){
        // convert the array of song objects to array of track.url
        const trackURIsToAdd = tracksToAdd.map((track)=>track.uri)
        await Spotify.addToPlaylist(PlaylistId,trackURIsToAdd)
      }



    }else if(playlistTracks){
     await Spotify.savePlaylist(playlistName, trackUris)
    }

    setPlaylistName("New Playlist");
    setPlaylistTracks([]);
    setPlaylistId('');
    
  }, [playlistName, playlistTracks,PlaylistId]);


  // wrap the functions that add the accessToken and userId to the Spotify object
  // the getAccessToken and getUserId method will be called every hour to get the latest valid token
  useEffect(() => {
  // Function to fetch access token and user ID
    const fetchAccessTokenAndUserID = async() => {
      Spotify.getAccessToken();
      await Spotify.getUserId();
      setCurrentPlaylist(await Spotify.getSavedPlaylist())
    };



    // Initial call
    fetchAccessTokenAndUserID();

    // Call every hour (in milliseconds)
    const intervalId = setInterval(fetchAccessTokenAndUserID, 3600 * 1000);

    // Cleanup function to clear interval
    return () => clearInterval(intervalId);
  }, []);



  return (
    <div>
      <h1>
        Ja<span className="highlight">mmm</span>ing
      </h1>
      <div className="App">
        <SearchBar onSearch={search} />
        <div className="App-playlist">
          <SearchResults 
            searchResults={searchResults} 
            onAdd={addTrack} 
            currentPlaylist={currentPlaylist}
            onPlaylistSelect={handlePlaylistSelect}
            updatePlaylistName={updatePlaylistName}
            updatePlaylistId={updatePlaylistId}/>
          <Playlist
            playlistName={playlistName}
            playlistTracks={playlistTracks}
            onNameChange={updatePlaylistName}
            onRemove={removeTrack}
            onSave={savePlaylist}
          />
        </div>
      </div>
    </div>
  );
};

export default App;

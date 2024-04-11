import React from "react";
import "./SavedPlaylist.css";
import Spotify from "../../util/Spotify";

const SavedPlaylist = (props)=>{
    const handleClick = async(playlistId,playlistName) =>{
        try{
            const songs = await Spotify.getsongs(playlistId)
            props.onPlaySelect(songs)
            props.updatePlaylistName(playlistName)
            props.updatePlaylistId(playlistId)
        }catch(error){
            console.log(error)
        }
    }
    return (
        <div className="SavedPlaylist">
            <h2>Current Playlist</h2>
            {props.currentPlaylist.map((playlist) =>{
                return(
                    <h3 key = {playlist.id} onClick = {()=>handleClick(playlist.id,playlist.name)}>{playlist.name}</h3>
                )
            })}
        </div>
    )
}

export default SavedPlaylist;
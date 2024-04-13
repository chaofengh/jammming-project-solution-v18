import React, { useCallback, useState } from "react";
import "./Track.css";

const Track = (props) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.createRef();

  const handlePlay = (event) => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

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

  const playButton = () =>{
    if(props.track.previewUrl){
      return(
        <div>
        <div className = 'Track-playButton' onClick = {handlePlay}>
          {isPlaying?
            <span className='material-icons'>
              pause_circle
            </span> : 
            <span className = 'material-icons'>
              play_circle</span>
          }
        </div>
        </div>
      )
    }
  }

  return (
    <div className="Track">
      <div className="Track-information">
        <h3>{props.track.name}</h3>
        <p>
          {props.track.artist} | {props.track.album}
        </p>
      </div>
      {playButton()}
      {renderAction()}
      <audio ref={audioRef} src={props.track.previewUrl}></audio>
    </div>
  );
};

export default Track;

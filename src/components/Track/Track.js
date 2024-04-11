import React, { useCallback, useState } from "react";
import "./Track.css";

const Track = (props) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.createRef();

  const handlePlay = () => {
    if (!audioRef.current) return;

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

  return (
    <div className="Track">
      <div className="Track-information">
        <h3 onClick={handlePlay}>{props.track.name}</h3>
        <p>
          {props.track.artist} | {props.track.album}
        </p>
      </div>
      {renderAction()}
      <audio ref={audioRef} src={props.track.previewUrl}></audio>
    </div>
  );
};

export default Track;

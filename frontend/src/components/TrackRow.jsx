import { useState } from "react";

function Icon({ name, size = 18 }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.9, strokeLinecap: "round", strokeLinejoin: "round" };
  const paths = {
    heart: <path d="M20.8 8.9c0 5.2-8.8 10.2-8.8 10.2S3.2 14.1 3.2 8.9A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.7Z"/>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    x: <><path d="m6 6 12 12M18 6 6 18"/></>,
    play: <path d="m9 5 10 7-10 7z"/>,
  };
  return <svg {...common}>{paths[name]}</svg>;
}

export default function TrackRow({ track, onToggleLike, onAddToPlaylist, onRemove, liked = false, showAddButton = true }) {
  const [hovering, setHovering] = useState(false);
  const artistName = track.artist?.username || "Unknown artist";

  return (
    <div className="track-row" onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
      <div className={`track-art ${hovering ? "is-playing" : ""}`}>
        <div className="art-shape"><span>♪</span></div>
        {hovering && <div className="art-play"><Icon name="play" size={14}/></div>}
      </div>
      <div className="track-meta">
        <p>{track.title}</p>
        <span>{artistName}</span>
      </div>
      <div className="waveform" aria-hidden="true">
        {[3,7,5,9,4,8,6,10,5,7].map((h,i)=><b key={i} style={{height:`${h*1.6}px`}} />)}
      </div>
      <div className="track-actions">
        {onToggleLike && <button onClick={() => onToggleLike(track)} aria-label={liked ? "Unlike" : "Like"} className={liked ? "liked" : ""}><Icon name="heart" /></button>}
        {showAddButton && onAddToPlaylist && <button onClick={() => onAddToPlaylist(track)} aria-label="Add to playlist"><Icon name="plus" /></button>}
        {onRemove && <button onClick={() => onRemove(track)} aria-label="Remove"><Icon name="x" /></button>}
      </div>
    </div>
  );
}

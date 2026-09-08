import { useCallback, useEffect, useState } from "react";
import { musicApi } from "../lib/api";
import { useToast } from "../context/ToastContext";
import TrackRow from "../components/TrackRow";
import AddToPlaylistModal from "../components/AddToPlaylistModal";
import { EmptyState } from "./BrowseView";

export default function LikedView() {
  const [tracks,setTracks]=useState([]); const [loading,setLoading]=useState(true); const [modalTrack,setModalTrack]=useState(null); const showToast=useToast();
  const load=useCallback(async()=>{setLoading(true);try{const data=await musicApi.liked();setTracks(data.music)}catch(err){showToast(err.message,"error")}finally{setLoading(false)}},[showToast]);
  useEffect(()=>{load()},[load]);
  async function handleUnlike(track){try{await musicApi.toggleLike(track._id);setTracks(prev=>prev.filter(t=>t._id!==track._id))}catch(err){showToast(err.message,"error")}}
  return <div className="page">
    <header className="topbar"><div><p className="eyebrow">Your favorites</p><h1>Liked <em>songs.</em></h1></div><div className="stat-pill">♥ {tracks.length} saved</div></header>
    <section className="liked-banner"><div className="liked-heart">♥</div><div><span>YOUR COLLECTION</span><h2>Songs that sound like <em>you.</em></h2><p>Every track you've loved, all in one place.</p></div></section>
    {loading && <div className="skeleton-list">{[1,2,3].map(i=><div className="skeleton" key={i}/>)}</div>}
    {!loading && tracks.length===0 && <EmptyState title="Nothing here yet" body="Tap the heart on a track to save it here."/>}
    <div className="track-list">{tracks.map(track=><TrackRow key={track._id} track={track} liked onToggleLike={handleUnlike} onAddToPlaylist={setModalTrack}/>)}</div>
    {modalTrack && <AddToPlaylistModal track={modalTrack} onClose={()=>setModalTrack(null)}/>}
  </div>
}

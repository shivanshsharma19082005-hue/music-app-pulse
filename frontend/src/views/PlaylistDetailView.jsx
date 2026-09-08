import { useCallback,useEffect,useState } from "react";
import { playlistApi } from "../lib/api";
import { useToast } from "../context/ToastContext";
import TrackRow from "../components/TrackRow";
import { EmptyState } from "./BrowseView";

export default function PlaylistDetailView({playlistId,onBack,onDeleted}){
 const [playlist,setPlaylist]=useState(null);const [loading,setLoading]=useState(true);const showToast=useToast();
 const load=useCallback(async()=>{setLoading(true);try{const data=await playlistApi.get(playlistId);setPlaylist(data.playlist)}catch(err){showToast(err.message,"error")}finally{setLoading(false)}},[playlistId,showToast]);
 useEffect(()=>{load()},[load]);
 async function handleRemoveTrack(track){try{await playlistApi.removeTrack(playlistId,track._id);setPlaylist(p=>({...p,tracks:p.tracks.filter(t=>t._id!==track._id)}))}catch(err){showToast(err.message,"error")}}
 async function handleDelete(){if(!confirm(`Delete "${playlist.name}"? This can't be undone.`))return;try{await playlistApi.remove(playlistId);showToast("Playlist deleted");onDeleted()}catch(err){showToast(err.message,"error")}}
 if(loading)return <div className="loading-screen"><p>Loading playlist…</p></div>; if(!playlist)return null;
 return <div className="page">
   <button onClick={onBack} className="back-btn">← Back to playlists</button>
   <section className="detail-hero"><div className="detail-art"><span>♫</span></div><div className="detail-copy"><span className="eyebrow">PLAYLIST</span><h1>{playlist.name}</h1>{playlist.description&&<p>{playlist.description}</p>}<span className="detail-count">{playlist.tracks.length} track{playlist.tracks.length===1?"":"s"}</span></div><button className="danger-btn" onClick={handleDelete}>Delete</button></section>
   {playlist.tracks.length===0?<EmptyState title="This playlist is empty" body="Add tracks from Discover or Liked songs."/>:<div className="track-list">{playlist.tracks.map(track=><TrackRow key={track._id} track={track} showAddButton={false} onRemove={handleRemoveTrack}/>)}</div>}
 </div>
}

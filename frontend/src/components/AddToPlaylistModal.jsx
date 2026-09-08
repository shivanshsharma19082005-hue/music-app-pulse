import { useEffect,useState } from "react";
import { playlistApi } from "../lib/api";
import { useToast } from "../context/ToastContext";

export default function AddToPlaylistModal({track,onClose}){
 const [playlists,setPlaylists]=useState([]);const [loading,setLoading]=useState(true);const [newName,setNewName]=useState("");const [busyId,setBusyId]=useState(null);const showToast=useToast();
 useEffect(()=>{playlistApi.list().then(d=>setPlaylists(d.playlists)).catch(()=>showToast("Couldn't load your playlists","error")).finally(()=>setLoading(false))},[showToast]);
 async function add(id){setBusyId(id);try{await playlistApi.addTrack(id,track._id);showToast("Added to playlist");onClose()}catch(e){showToast(e.message,"error")}finally{setBusyId(null)}}
 async function create(){if(!newName.trim())return;setBusyId("new");try{const {playlist}=await playlistApi.create({name:newName.trim()});await playlistApi.addTrack(playlist._id,track._id);showToast(`Created "${playlist.name}" and added the track`);onClose()}catch(e){showToast(e.message,"error")}finally{setBusyId(null)}}
 return <div className="modal-backdrop" onClick={onClose}><div className="modal-card" onClick={e=>e.stopPropagation()}><div className="modal-head"><div><span className="eyebrow">SAVE TRACK</span><h2>Add to playlist</h2><p>{track?.title}</p></div><button onClick={onClose} className="modal-close">×</button></div><div className="modal-list">{loading&&<p className="modal-muted">Loading playlists…</p>}{!loading&&playlists.length===0&&<p className="modal-muted">No playlists yet — create one below.</p>}{playlists.map(p=><button key={p._id} onClick={()=>add(p._id)} disabled={busyId===p._id}><span>{p.name}</span><small>{p.tracks?.length??0}</small></button>)}</div><div className="modal-create"><input className="input" value={newName} onChange={e=>setNewName(e.target.value)} placeholder="New playlist name"/><button className="primary-btn" onClick={create} disabled={busyId==="new"||!newName.trim()}>Create</button></div></div></div>
}

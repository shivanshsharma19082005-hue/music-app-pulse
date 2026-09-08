import { useCallback, useEffect, useState, useRef } from "react";
import { playlistApi } from "../lib/api";
import { useToast } from "../context/ToastContext";
import { EmptyState } from "./BrowseView";

const gradients = ["gradient-a","gradient-b","gradient-c","gradient-d","gradient-e","gradient-f"];

export default function PlaylistsView({ onOpenPlaylist }) {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const showToast = useToast();
  const gridRef = useRef(null);

  const load = useCallback(async () => {
    setLoading(true); try { const data = await playlistApi.list(); setPlaylists(data.playlists); }
    catch (err) { showToast(err.message, "error"); } finally { setLoading(false); }
  }, [showToast]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    const gsap = window.gsap;
    if (!gsap || !gridRef.current) return;
    const cards = gridRef.current.querySelectorAll(".playlist-card");
    gsap.fromTo(cards, { opacity: 0, y: 22, rotateX: 5 }, { opacity: 1, y: 0, rotateX: 0, duration: .55, stagger: .08, ease: "power3.out" });
    const cleanups = Array.from(cards).map((card) => {
      const move = (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - .5;
        const y = (event.clientY - rect.top) / rect.height - .5;
        gsap.to(card, { rotateY: x * 7, rotateX: -y * 6, z: 10, duration: .35, ease: "power2.out" });
      };
      const leave = () => gsap.to(card, { rotateY: 0, rotateX: 0, z: 0, duration: .55, ease: "power3.out" });
      card.addEventListener("pointermove", move); card.addEventListener("pointerleave", leave);
      return () => { card.removeEventListener("pointermove", move); card.removeEventListener("pointerleave", leave); };
    });
    return () => cleanups.forEach((cleanup) => cleanup());
  }, [playlists.length]);

  async function handleCreate(e) {
    e.preventDefault(); if (!newName.trim()) return;
    try { await playlistApi.create({ name: newName.trim() }); setNewName(""); setCreating(false); load(); }
    catch (err) { showToast(err.message, "error"); }
  }

  return <div className="page">
    <header className="topbar">
      <div><p className="eyebrow">Your library</p><h1>Your <em>playlists.</em></h1></div>
      <button className="primary-btn" onClick={() => setCreating(c=>!c)}>＋ New playlist</button>
    </header>
    {creating && <form onSubmit={handleCreate} className="create-bar"><input autoFocus className="input" placeholder="Give your playlist a name…" value={newName} onChange={e=>setNewName(e.target.value)}/><button className="primary-btn">Create</button></form>}
    {loading && <div className="playlist-grid">{[1,2,3].map(i=><div className="playlist-skeleton" key={i}/>)}</div>}
    {!loading && playlists.length === 0 && <EmptyState title="Your library is waiting" body="Create your first playlist and start collecting tracks."/>}
    <div className="playlist-grid" ref={gridRef}>{playlists.map((p,i)=><button key={p._id} onClick={()=>onOpenPlaylist(p._id)} className={`playlist-card ${gradients[i%gradients.length]}`}>
      <div className="playlist-art"><span>{i % 2 ? "♫" : "♪"}</span><div className="art-glow"/></div>
      <div className="playlist-card-copy"><span>PLAYLIST</span><h3>{p.name}</h3><p>{p.tracks?.length ?? 0} tracks</p></div>
      <div className="card-arrow">→</div>
    </button>)}</div>
  </div>;
}

import { useEffect, useState, useCallback, useRef } from "react";
import { musicApi } from "../lib/api";
import { useToast } from "../context/ToastContext";
import TrackRow from "../components/TrackRow";
import AddToPlaylistModal from "../components/AddToPlaylistModal";

export default function BrowseView() {
  const [query, setQuery] = useState("");
  const [tracks, setTracks] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [likedIds, setLikedIds] = useState(new Set());
  const [modalTrack, setModalTrack] = useState(null);
  const showToast = useToast();
  const heroRef = useRef(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await musicApi.list({ q: query, page, limit: 10 });
      setTracks(data.music); setPagination(data.pagination);
    } catch (err) { showToast(err.message, "error"); }
    finally { setLoading(false); }
  }, [query, page, showToast]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    const gsap = window.gsap;
    if (!gsap || !heroRef.current) return;
    const q = gsap.utils.selector(heroRef.current);
    gsap.fromTo(q(".hero-tag, h2, p, .hero-pills"), { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .65, stagger: .08, ease: "power3.out" });
    gsap.to(q(".vinyl"), { y: -10, duration: 2.8, repeat: -1, yoyo: true, ease: "sine.inOut" });
    gsap.to(q(".floating-note"), { y: -13, rotation: 8, duration: 2.7, repeat: -1, yoyo: true, stagger: .35, ease: "sine.inOut" });
    const panel = heroRef.current;
    const vinyl = panel.querySelector(".vinyl");
    const move = (event) => {
      const rect = panel.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - .5;
      const y = (event.clientY - rect.top) / rect.height - .5;
      gsap.to(vinyl, { rotateY: x * 12, rotateX: 58 - y * 9, x: x * 10, duration: .5, ease: "power3.out" });
    };
    const leave = () => gsap.to(vinyl, { rotateY: 0, rotateX: 58, x: 0, duration: .7, ease: "power3.out" });
    panel.addEventListener("pointermove", move);
    panel.addEventListener("pointerleave", leave);
    return () => { panel.removeEventListener("pointermove", move); panel.removeEventListener("pointerleave", leave); };
  }, []);
  useEffect(() => { musicApi.liked().then(data => setLikedIds(new Set(data.music.map(m => m._id)))).catch(() => {}); }, []);

  async function handleToggleLike(track) {
    try {
      const data = await musicApi.toggleLike(track._id);
      setLikedIds(prev => { const next = new Set(prev); data.liked ? next.add(track._id) : next.delete(track._id); return next; });
    } catch (err) { showToast(err.message, "error"); }
  }

  return (
    <div className="page">
      <header className="topbar">
        <div>
          <p className="eyebrow">Your daily soundscape</p>
          <h1>Discover something <em>new.</em></h1>
        </div>
        <div className="search-wrap">
          <span>⌕</span>
          <input value={query} onChange={e => { setQuery(e.target.value); setPage(1); }} placeholder="Search tracks…" />
          <kbd>⌘ K</kbd>
        </div>
      </header>

      <section className="hero-panel" ref={heroRef}>
        <div className="hero-copy">
          <span className="hero-tag">CURATED FOR YOU</span>
          <h2>Turn up the<br /><strong>good vibes.</strong></h2>
          <p>Explore your collection, find hidden favorites, and build the soundtrack to your day.</p>
          <div className="hero-pills"><span>✦ Fresh picks</span><span>◉ High energy</span></div>
        </div>
        <div className="hero-3d" aria-hidden="true">
          <div className="vinyl"><div className="vinyl-label">S</div><div className="vinyl-shine"/></div>
          <div className="floating-note note-a">♪</div><div className="floating-note note-b">♫</div>
          <div className="hero-ring ring-a"/><div className="hero-ring ring-b"/>
        </div>
      </section>

      <section className="content-section">
        <div className="section-heading"><div><p className="eyebrow">The collection</p><h2>All tracks</h2></div><span>{pagination?.total ?? tracks.length} songs</span></div>
        {loading && <div className="skeleton-list">{[1,2,3,4].map(i => <div className="skeleton" key={i}/>)}</div>}
        {!loading && tracks.length === 0 && <EmptyState title="No tracks found" body={query ? `Nothing matches "${query}".` : "No tracks have been uploaded yet."} />}
        <div className="track-list">{tracks.map(track => <TrackRow key={track._id} track={track} liked={likedIds.has(track._id)} onToggleLike={handleToggleLike} onAddToPlaylist={setModalTrack} />)}</div>
        {pagination && pagination.totalPages > 1 && <div className="pagination"><button disabled={page <= 1} onClick={() => setPage(p=>p-1)}>← Previous</button><span>{pagination.page} / {pagination.totalPages}</span><button disabled={page >= pagination.totalPages} onClick={() => setPage(p=>p+1)}>Next →</button></div>}
      </section>
      {modalTrack && <AddToPlaylistModal track={modalTrack} onClose={() => setModalTrack(null)} />}
    </div>
  );
}
export function EmptyState({ title, body }) { return <div className="empty-state"><div className="empty-icon">♪</div><h3>{title}</h3><p>{body}</p></div>; }

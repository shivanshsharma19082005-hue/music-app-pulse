import { useEffect, useState } from "react";
import { useAuth } from "./context/AuthContext";
import Sidebar from "./components/Sidebar";
import AuthView from "./views/AuthView";
import BrowseView from "./views/BrowseView";
import PlaylistsView from "./views/PlaylistsView";
import PlaylistDetailView from "./views/PlaylistDetailView";
import LikedView from "./views/LikedView";
import UploadView from "./views/UploadView";

export default function App() {
  const { user, loading } = useAuth();
  const [view, setView] = useState("browse");
  const [activePlaylistId, setActivePlaylistId] = useState(null);

  // All hooks must run on every render, in the same order — so this effect
  // has to stay above the early returns below (Rules of Hooks). Having it
  // after the returns was causing a hook-count mismatch once `user`/`loading`
  // changed, which crashed the app to a blank screen after login/reload.
  useEffect(() => {
    const gsap = window.gsap;
    if (!gsap) return;
    const page = document.querySelector(".main-content .page");
    if (!page) return;
    gsap.fromTo(page, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" });
  }, [view, activePlaylistId]);

  if (loading) return <div className="loading-screen"><div className="loading-orb">♪</div><p>Loading your soundscape…</p></div>;
  if (!user) return <AuthView />;

  function navigate(next) { setActivePlaylistId(null); setView(next); }
  function openPlaylist(id) { setActivePlaylistId(id); setView("playlist-detail"); }

  return (
    <div className="app-shell">
      <Sidebar view={view} onNavigate={navigate} />
      <main className="main-content">
        <div className="ambient ambient-one" />
        <div className="ambient ambient-two" />
        {view === "browse" && <BrowseView />}
        {view === "playlists" && <PlaylistsView onOpenPlaylist={openPlaylist} />}
        {view === "playlist-detail" && activePlaylistId && <PlaylistDetailView playlistId={activePlaylistId} onBack={() => navigate("playlists")} onDeleted={() => navigate("playlists")} />}
        {view === "liked" && <LikedView />}
        {view === "upload" && user.role === "artist" && <UploadView />}
      </main>
    </div>
  );
}

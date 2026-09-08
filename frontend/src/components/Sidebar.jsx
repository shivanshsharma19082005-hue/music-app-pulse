import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { key: "browse", label: "Discover", icon: "compass" },
  { key: "playlists", label: "Playlists", icon: "playlist" },
  { key: "liked", label: "Liked songs", icon: "heart" },
];

function Icon({ name, size = 19 }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };
  const paths = {
    compass: <><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2.1 4.9-4.9 2.1 2.1-4.9z"/></>,
    playlist: <><path d="M4 6h12M4 10h12M4 14h8"/><path d="M16 14v6a2 2 0 1 0 2-2v-4z"/></>,
    heart: <path d="M20.8 8.9c0 5.2-8.8 10.2-8.8 10.2S3.2 14.1 3.2 8.9A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.7Z"/>,
    upload: <><path d="M12 16V4"/><path d="m7 9 5-5 5 5"/><path d="M5 20h14"/></>,
    logout: <><path d="M10 17l5-5-5-5"/><path d="M15 12H3"/><path d="M21 19V5a2 2 0 0 0-2-2h-5"/></>,
  };
  return <svg {...common}>{paths[name]}</svg>;
}

export default function Sidebar({ view, onNavigate }) {
  const { user, logout } = useAuth();
  const isArtist = user?.role === "artist";
  const initial = (user?.username || "?").charAt(0).toUpperCase();

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-orb"><span>♪</span></div>
        <div><strong>PULSE</strong><small>sound in motion</small></div>
      </div>

      <div className="sidebar-label">Menu</div>
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => (
          <button key={item.key} onClick={() => onNavigate(item.key)}
            className={`nav-item ${view === item.key ? "active" : ""}`}>
            <Icon name={item.icon} />
            <span>{item.label}</span>
            {view === item.key && <i />}
          </button>
        ))}
        {isArtist && (
          <button onClick={() => onNavigate("upload")}
            className={`nav-item ${view === "upload" ? "active" : ""}`}>
            <Icon name="upload" /><span>Publish music</span>{view === "upload" && <i />}
          </button>
        )}
      </nav>

      <div className="sidebar-bottom">
        <div className="profile-card">
          <div className="avatar">{initial}</div>
          <div className="min-w-0">
            <p>{user?.username}</p>
            <span>{user?.role === "artist" ? "Artist" : "Listener"}</span>
          </div>
          <span className="status-dot" />
        </div>
        <button onClick={logout} className="logout-btn"><Icon name="logout" size={17} /> Sign out</button>
      </div>
    </aside>
  );
}

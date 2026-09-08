import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";

const MODES = {
  listener: {
    label: "Listener",
    eyebrow: "ENTER THE PULSE",
    title: <>Find your <em>frequency.</em></>,
    body: "Discover new sounds, save the tracks that hit, and build a library that feels like yours.",
    cta: "Enter as Listener",
    register: true,
  },
  artist: {
    label: "Artist",
    eyebrow: "CREATE YOUR PULSE",
    title: <>Put your sound <em>in motion.</em></>,
    body: "Sign in to your artist space and keep your releases moving in front of listeners.",
    cta: "Enter Artist Studio",
    register: true,
  },
};

export default function AuthView() {
  const [tab, setTab] = useState("login");
  const [mode, setMode] = useState("listener");
  const { login, register } = useAuth();
  const visualRef = useRef(null);
  const panelRef = useRef(null);
  const orbRef = useRef(null);
  const modeData = MODES[mode];

  const [loginForm, setLoginForm] = useState({ identifier: "", password: "" });
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginBusy, setLoginBusy] = useState(false);
  const [regForm, setRegForm] = useState({ username: "", email: "", password: "", role: "user" });
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regError, setRegError] = useState("");
  const [regBusy, setRegBusy] = useState(false);

  useEffect(() => {
    const gsap = window.gsap;
    if (!gsap || !visualRef.current || !panelRef.current) return;
    gsap.fromTo(visualRef.current.querySelectorAll(".auth-reveal"), { opacity: 0, y: 28 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.08, ease: "power3.out" });
    gsap.fromTo(panelRef.current, { opacity: 0, x: 35 }, { opacity: 1, x: 0, duration: 0.9, delay: 0.15, ease: "power3.out" });
    if (orbRef.current) {
      gsap.to(orbRef.current, { rotateY: 360, rotateZ: 360, duration: 18, repeat: -1, ease: "none" });
      gsap.to(orbRef.current, { y: -16, duration: 2.6, repeat: -1, yoyo: true, ease: "sine.inOut" });
    }
  }, []);

  function switchMode(next) {
    if (next === mode) return;
    const gsap = window.gsap;
    setMode(next);
    setTab("login");
    setLoginError("");
    if (!gsap || !panelRef.current || !visualRef.current) return;
    const direction = ["listener", "artist"].indexOf(next) > ["listener", "artist"].indexOf(mode) ? 1 : -1;
    const panel = panelRef.current;
    const copy = visualRef.current.querySelector(".auth-copy");
    gsap.timeline()
      .to(panel, { x: direction * 70, opacity: 0, duration: 0.22, ease: "power2.in" })
      .set(panel, { x: direction * -70 })
      .to(panel, { x: 0, opacity: 1, duration: 0.5, ease: "power3.out" });
    if (copy) gsap.fromTo(copy, { x: -direction * 45, opacity: 0 }, { x: 0, opacity: 1, duration: 0.55, ease: "power3.out" });
  }

  async function handleLogin(e) {
    e.preventDefault();
    setLoginError("");
    setLoginBusy(true);
    try {
      const isEmail = loginForm.identifier.includes("@");
      await login({ [isEmail ? "email" : "username"]: loginForm.identifier, password: loginForm.password });
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setLoginBusy(false);
    }
  }

  async function handleRegister(e) {
    e.preventDefault();
    setRegError("");
    setRegBusy(true);
    try {
      await register({ ...regForm, role: mode === "artist" ? "artist" : "user" });
    } catch (err) {
      setRegError(err.message);
    } finally {
      setRegBusy(false);
    }
  }

  return (
    <div className="auth-shell">
      <section className="auth-visual" ref={visualRef}>
        <div className="auth-stars" aria-hidden="true" />
        <div className="auth-orbit orbit-1" />
        <div className="auth-orbit orbit-2" />
        <div className="auth-orbit orbit-3" />
        <div className="auth-vinyl" ref={orbRef}><div>✦</div></div>
        <div className="auth-glass-orb orb-small" />
        <span className="float-glyph g1">✦</span>
        <span className="float-glyph g2">♪</span>
        <div className="auth-copy auth-reveal">
          <span>{modeData.eyebrow}</span>
          <h1>{modeData.title}</h1>
          <p>{modeData.body}</p>
          <div className="auth-mode-caption"><span className="mode-dot" /> {modeData.label} space</div>
        </div>
      </section>

      <section className="auth-panel" ref={panelRef}>
        <div className="auth-panel-inner">
          <div className="auth-brand">
            <div className="brand-orb"><span>✦</span></div>
            <div><strong>PULSE</strong><small>sound in motion</small></div>
          </div>

          <div className="auth-role-switch" aria-label="Choose account space">
            {Object.entries(MODES).map(([key, item]) => (
              <button key={key} type="button" className={mode === key ? "active" : ""} onClick={() => switchMode(key)}>
                {item.label}
              </button>
            ))}
          </div>

          <div className="auth-form-wrap">
            <div className="auth-form-heading">
              <span className="eyebrow">{tab === "login" ? "WELCOME BACK" : "JOIN PULSE"}</span>
              <h2>{tab === "login" ? `Sign in to ${modeData.label.toLowerCase()} space` : `Create your ${modeData.label.toLowerCase()} account`}</h2>
              <p>{tab === "login" ? "Your sound is waiting." : "A few details and you're in."}</p>
            </div>

            {modeData.register && (
              <div className="auth-tabs">
                <button type="button" className={tab === "login" ? "active" : ""} onClick={() => setTab("login")}>Sign in</button>
                <button type="button" className={tab === "register" ? "active" : ""} onClick={() => setTab("register")}>Create account</button>
              </div>
            )}

            {tab === "login" ? (
              <form onSubmit={handleLogin} className="form-stack">
                <Field label="Username or email"><input className="input" required autoComplete="username" value={loginForm.identifier} onChange={e => setLoginForm(f => ({ ...f, identifier: e.target.value }))} placeholder="you@example.com" /></Field>
                <Field label="Password"><div className="password-field"><input className="input" type={showLoginPassword ? "text" : "password"} required autoComplete="current-password" value={loginForm.password} onChange={e => setLoginForm(f => ({ ...f, password: e.target.value }))} placeholder="••••••••" /><button type="button" className="password-toggle" onClick={() => setShowLoginPassword(v => !v)} aria-label={showLoginPassword ? "Hide password" : "Show password"}>{showLoginPassword ? "Hide" : "Show"}</button></div></Field>
                {loginError && <p className="form-error">{loginError}</p>}
                <button className="primary-btn full auth-submit" disabled={loginBusy}>{loginBusy ? "Connecting…" : `${modeData.cta}  →`}</button>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="form-stack">
                <Field label="Username"><input className="input" required autoComplete="username" value={regForm.username} onChange={e => setRegForm(f => ({ ...f, username: e.target.value }))} placeholder="Choose a username" /></Field>
                <Field label="Email"><input className="input" type="email" required autoComplete="email" value={regForm.email} onChange={e => setRegForm(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" /></Field>
                <Field label="Password"><div className="password-field"><input className="input" type={showRegPassword ? "text" : "password"} required autoComplete="new-password" value={regForm.password} onChange={e => setRegForm(f => ({ ...f, password: e.target.value }))} placeholder="Create a strong password" /><button type="button" className="password-toggle" onClick={() => setShowRegPassword(v => !v)} aria-label={showRegPassword ? "Hide password" : "Show password"}>{showRegPassword ? "Hide" : "Show"}</button></div></Field>
                {regError && <p className="form-error">{regError}</p>}
                <button className="primary-btn full auth-submit" disabled={regBusy}>{regBusy ? "Creating…" : "Create account  →"}</button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({ label, children }) {
  return <label className="field"><span>{label}</span>{children}</label>;
}

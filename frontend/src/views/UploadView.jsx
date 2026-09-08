import { useState } from "react";
import { musicApi } from "../lib/api";
import { useToast } from "../context/ToastContext";

export default function UploadView() {
  const [form,setForm]=useState({title:"",uri:""}); const [busy,setBusy]=useState(false); const [error,setError]=useState(""); const showToast=useToast();
  async function handleSubmit(e){e.preventDefault();setError("");setBusy(true);try{await musicApi.create(form);showToast("Track published");setForm({title:"",uri:""})}catch(err){setError(err.message)}finally{setBusy(false)}}
  return <div className="page upload-page">
    <header className="topbar"><div><p className="eyebrow">Artist studio</p><h1>Publish your <em>sound.</em></h1></div></header>
    <div className="upload-layout"><div className="upload-art"><div className="upload-disc">♪</div><div className="upload-copy"><span>ARTIST MODE</span><h2>Put your music<br/>into the world.</h2><p>Share a track with listeners and build your audience one song at a time.</p></div></div>
    <form onSubmit={handleSubmit} className="glass-form"><label>Track title<input className="input" required placeholder="e.g. Midnight Static" value={form.title} onChange={e=>setForm(f=>({...f,title:e.target.value}))}/></label><label>Audio URI<input className="input" required placeholder="https://… or a storage path" value={form.uri} onChange={e=>setForm(f=>({...f,uri:e.target.value}))}/></label>{error&&<p className="form-error">{error}</p>}<button className="primary-btn full" disabled={busy}>{busy?"Publishing…":"Publish track  →"}</button></form></div>
  </div>
}

import React, { useMemo, useState } from "react";
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import {
  Bell, BrainCircuit, ChevronRight, Clock3, FileText, FolderOpen,
  GitBranch, History, Home, Info, LayoutDashboard, Menu, Network,
  Plus, Search, Settings, Sparkles, Upload, UserRound, X, Link2,
  Image as ImageIcon, FileSearch, Filter, MoreHorizontal, ShieldCheck,
  AlertTriangle, CheckCircle2, ArrowUpRight, Trash2, Eye
} from "lucide-react";

const sampleDocuments = [
  { id: 1, name: "AI_Internship_2026.pdf", type: "PDF", topic: "AI Internship", date: "Sep 18, 2026", score: 96, size: "1.8 MB", entities: ["AI", "Internship", "Application"], color: "purple" },
  { id: 2, name: "Internship_Preparation_Notes.docx", type: "DOCX", topic: "AI Internship", date: "Sep 20, 2026", score: 91, size: "42 KB", entities: ["Python", "ML", "DSA"], color: "blue" },
  { id: 3, name: "Eligibility_Screenshot.png", type: "IMAGE", topic: "AI Internship", date: "Sep 21, 2026", score: 87, size: "720 KB", entities: ["Eligibility", "Deadline"], color: "orange" },
  { id: 4, name: "Application_Link.txt", type: "TEXT", topic: "AI Internship", date: "Sep 22, 2026", score: 83, size: "4 KB", entities: ["Application", "Portal"], color: "green" },
];

function Layout({ children, onUpload }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const nav = [
    ["Dashboard", "/", LayoutDashboard],
    ["Search", "/search", Search],
    ["Documents", "/documents", FileText],
    ["Knowledge Graph", "/graph", Network],
    ["Memory Timeline", "/timeline", Clock3],
  ];
  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><BrainCircuit size={23}/></div>
          <div><strong>Context<span>Graph</span></strong><small>Personal memory engine</small></div>
          <button className="icon-btn mobile-close" onClick={()=>setMobileOpen(false)}><X size={19}/></button>
        </div>
        <div className="nav-section">
          <p>WORKSPACE</p>
          {nav.map(([label,path,Icon]) => (
            <NavLink key={path} to={path} onClick={()=>setMobileOpen(false)} className={({isActive})=>`nav-item ${isActive?"active":""}`}>
              <Icon size={18}/><span>{label}</span>
            </NavLink>
          ))}
        </div>
        <div className="nav-section secondary">
          <p>MANAGE</p>
          <NavLink to="/collections" className="nav-item"><FolderOpen size={18}/><span>Collections</span></NavLink>
          <NavLink to="/history" className="nav-item"><History size={18}/><span>Search History</span></NavLink>
          <NavLink to="/settings" className="nav-item"><Settings size={18}/><span>Settings</span></NavLink>
        </div>
        <div className="sidebar-bottom">
          <div className="privacy-card"><ShieldCheck size={17}/><div><b>Your data</b><small>Private by design</small></div></div>
          <div className="profile-mini"><div className="avatar">R</div><div><b>Renuka</b><small>Personal workspace</small></div><MoreHorizontal size={18}/></div>
        </div>
      </aside>
      {mobileOpen && <div className="overlay" onClick={()=>setMobileOpen(false)} />}
      <main className="main">
        <header className="topbar">
          <button className="icon-btn mobile-menu" onClick={()=>setMobileOpen(true)}><Menu size={21}/></button>
          <div className="breadcrumbs"><span>ContextGraph</span><ChevronRight size={14}/><b>Workspace</b></div>
          <div className="top-actions">
            <button className="icon-btn"><Bell size={19}/><i></i></button>
            <button className="avatar top-avatar">R</button>
          </div>
        </header>
        <div className="content">{children}</div>
      </main>
      <button className="floating-upload" onClick={onUpload}><Plus size={20}/> Add information</button>
    </div>
  );
}

function Dashboard({ onUpload }) {
  const navigate = useNavigate();
  const [query,setQuery] = useState("");
  const stats = [
    ["1,284","Information items","↑ 18 this week", FileText],
    ["342","Connected entities","↑ 24 this week", Network],
    ["87","Context groups","↑ 6 this week", FolderOpen],
  ];
  return <div>
    <section className="hero">
      <div>
        <div className="eyebrow"><Sparkles size={15}/> INTELLIGENT MEMORY</div>
        <h1>Remember what you <em>forgot.</em></h1>
        <p>Search your personal information by meaning, time, people, places, and relationships — not just filenames.</p>
      </div>
      <div className="hero-orb"><BrainCircuit size={58}/><div className="orb-dot d1"/><div className="orb-dot d2"/></div>
    </section>
    <section className="search-box large">
      <Search size={22}/>
      <input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==="Enter" && navigate(`/search?q=${encodeURIComponent(query)}`)} placeholder="What are you trying to remember? e.g. “AI internship I saved last month”"/>
      {query && <button className="search-go" onClick={()=>navigate(`/search?q=${encodeURIComponent(query)}`)}>Search</button>}
      <kbd>⌘ K</kbd>
    </section>
    <div className="suggestions">
      <span>Try asking:</span>
      {["Internship information from September","Notes related to my coding event","Documents mentioning React"].map(x=><button key={x} onClick={()=>{setQuery(x);navigate(`/search?q=${encodeURIComponent(x)}`)}}>{x}</button>)}
    </div>
    <div className="stats-grid">{stats.map(([n,l,s,I])=><div className="stat-card" key={l}><div className="stat-icon"><I size={19}/></div><div><strong>{n}</strong><span>{l}</span><small>{s}</small></div></div>)}</div>
    <div className="section-head"><div><h2>Recent context</h2><p>Information connected to your latest activity.</p></div><button className="text-btn" onClick={()=>navigate("/documents")}>View all <ArrowUpRight size={15}/></button></div>
    <div className="recent-grid">{sampleDocuments.slice(0,3).map(d=><DocumentCard d={d} key={d.id}/>)}</div>
    <div className="section-head graph-preview-head"><div><h2>Your knowledge graph</h2><p>See how your information connects.</p></div><button className="text-btn" onClick={()=>navigate("/graph")}>Explore graph <ArrowUpRight size={15}/></button></div>
    <GraphPreview/>
  </div>
}

function DocumentCard({d}) {
  return <div className="doc-card">
    <div className={`file-icon ${d.color}`}><FileText size={20}/></div>
    <div className="doc-main"><div className="doc-title">{d.name}</div><div className="doc-meta">{d.type} · {d.size} · {d.date}</div><div className="chips">{d.entities.map(e=><span key={e}>{e}</span>)}</div></div>
    <div className="score"><b>{d.score}%</b><small>match</small></div>
    <button className="icon-btn"><MoreHorizontal size={18}/></button>
  </div>
}

function SearchPage() {
  const params = new URLSearchParams(location.search);
  const initial = params.get("q") || "";
  const [query,setQuery] = useState(initial || "AI internship I saved last month");
  const [searched,setSearched] = useState(true);
  return <div>
    <div className="page-title"><div><div className="eyebrow"><Search size={14}/> CONTEXT SEARCH</div><h1>Find your information</h1><p>Search by meaning, memory, time, or relationships.</p></div></div>
    <div className="search-box"><Search size={20}/><input value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==="Enter"&&setSearched(true)} placeholder="Describe what you remember..."/><button className="search-go" onClick={()=>setSearched(true)}>Search</button></div>
    <div className="query-understanding">
      <div className="understanding-icon"><Sparkles size={18}/></div>
      <div><b>Context understood</b><div className="intent-tags"><span>Topic: Internship</span><span>Domain: AI</span><span>Time: Last month</span><span>Type: All information</span></div></div>
      <button className="icon-btn"><Info size={17}/></button>
    </div>
    <div className="results-toolbar"><div><b>{searched ? "8" : "0"} results</b><span> · ranked by contextual relevance</span></div><button className="filter-btn"><Filter size={16}/> Filters</button></div>
    <div className="result-list">
      {sampleDocuments.map((d,i)=><div className="result-card" key={d.id}>
        <div className={`result-number ${i===0?"top":""}`}>0{i+1}</div>
        <div className={`file-icon ${d.color}`}><FileText size={20}/></div>
        <div className="result-content">
          <div className="result-top"><h3>{d.name}</h3><span className="match">{d.score}% contextual match</span></div>
          <p>{i===0 ? "Contains internship details, application information and dates that closely match the context in your query." : "Related information detected through semantic similarity and shared entities."}</p>
          <div className="result-meta"><span><Clock3 size={13}/> {d.date}</span><span><Network size={13}/> {d.entities.length} connections</span><span><Link2 size={13}/> {d.topic}</span></div>
          <details><summary>Why this result?</summary><div className="why"><span>✓ Semantic similarity</span><span>✓ Temporal match</span><span>✓ Shared entities</span><span>✓ Graph relationship</span></div></details>
        </div>
        <button className="icon-btn"><Eye size={18}/></button>
      </div>)}
    </div>
  </div>
}

function Documents() {
  const [view,setView]=useState("list");
  return <div>
    <div className="page-title-row"><div><div className="eyebrow"><FileText size={14}/> INFORMATION VAULT</div><h1>Your information</h1><p>Everything you've added to ContextGraph.</p></div><button className="primary-btn"><Upload size={17}/> Upload</button></div>
    <div className="toolbar"><div className="mini-search"><Search size={17}/><input placeholder="Search documents..."/></div><button className="filter-btn"><Filter size={16}/> Filter</button><div className="view-toggle"><button className={view==="list"?"on":""} onClick={()=>setView("list")}><FileText size={16}/></button><button className={view==="grid"?"on":""} onClick={()=>setView("grid")}><LayoutDashboard size={16}/></button></div></div>
    {view==="list" ? <div className="documents-list">{sampleDocuments.map(d=><DocumentCard d={d} key={d.id}/>)}</div> : <div className="doc-grid">{sampleDocuments.map(d=><DocumentCard d={d} key={d.id}/>)}</div>}
  </div>
}

function GraphPreview() {
  return <div className="graph-box">
    <div className="graph-node center">AI<div className="node-label">Topic</div></div>
    <div className="graph-node n1">Internship<div className="node-label">Topic</div></div>
    <div className="graph-node n2">Microsoft<div className="node-label">Organization</div></div>
    <div className="graph-node n3">Python<div className="node-label">Skill</div></div>
    <div className="graph-node n4">Oct 20<div className="node-label">Deadline</div></div>
    <div className="graph-node n5">Preparation<div className="node-label">Context</div></div>
    <svg viewBox="0 0 900 330" preserveAspectRatio="none"><line x1="450" y1="165" x2="210" y2="70"/><line x1="450" y1="165" x2="690" y2="75"/><line x1="450" y1="165" x2="230" y2="265"/><line x1="450" y1="165" x2="690" y2="260"/><line x1="450" y1="165" x2="450" y2="45"/></svg>
  </div>
}

function GraphPage() {
  return <div>
    <div className="page-title-row"><div><div className="eyebrow"><Network size={14}/> KNOWLEDGE GRAPH</div><h1>How your information connects</h1><p>Explore entities, topics, documents, and events as a connected memory.</p></div><button className="filter-btn"><Filter size={16}/> Graph filters</button></div>
    <div className="graph-large"><GraphPreview/><div className="graph-side"><h3>Selected context</h3><div className="context-focus"><div className="focus-icon"><BrainCircuit size={20}/></div><div><b>AI Internship</b><small>Context group · 7 items</small></div></div><div className="connection"><span>Documents</span><b>4</b></div><div className="connection"><span>Entities</span><b>9</b></div><div className="connection"><span>Events</span><b>3</b></div><button className="secondary-btn">Open context <ChevronRight size={16}/></button></div></div>
  </div>
}

function Timeline() {
  const events=[["Sep 18, 2026","AI internship PDF added","AI_Internship_2026.pdf","document"],["Sep 20, 2026","Preparation notes connected","Internship_Preparation_Notes.docx","context"],["Sep 21, 2026","Eligibility screenshot added","Eligibility_Screenshot.png","image"],["Sep 22, 2026","Application portal saved","Application_Link.txt","link"]];
  return <div>
    <div className="page-title"><div><div className="eyebrow"><Clock3 size={14}/> MEMORY TRAIL</div><h1>Your information timeline</h1><p>See how related information evolved over time.</p></div></div>
    <div className="timeline-wrap"><div className="timeline-summary"><Sparkles size={18}/><div><b>AI Internship context</b><span>7 connected items · Sep 18–22, 2026</span></div></div>{events.map(([date,title,file,type],i)=><div className="timeline-item" key={file}><div className="timeline-date">{date}</div><div className="timeline-dot">{i+1}</div><div className="timeline-card"><div className="timeline-icon">{type==="image"?<ImageIcon size={18}/>:type==="link"?<Link2 size={18}/>:<FileText size={18}/>}</div><div><b>{title}</b><span>{file}</span></div><ChevronRight size={17}/></div></div>)}</div>
  </div>
}

function SimplePage({title, subtitle, icon:Icon}) {
  return <div className="empty-page"><div className="empty-icon"><Icon size={30}/></div><h1>{title}</h1><p>{subtitle}</p><div className="coming">Module ready for backend integration</div></div>
}

function UploadModal({close}) {
  return <div className="modal-backdrop" onClick={close}><div className="modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={close}><X size={19}/></button><div className="modal-icon"><Upload size={24}/></div><h2>Add information</h2><p>Upload a document, screenshot, note, or other digital resource.</p><div className="dropzone"><Upload size={28}/><b>Drop files here</b><span>or click to browse · PDF, DOCX, TXT, PNG, JPG</span><button className="secondary-btn">Choose files</button></div><div className="modal-note"><ShieldCheck size={15}/> Your files will be processed locally through the ContextGraph pipeline.</div></div></div>
}

export default function App() {
  const [upload,setUpload]=useState(false);
  return <Layout onUpload={()=>setUpload(true)}>
    <Routes>
      <Route path="/" element={<Dashboard/>}/>
      <Route path="/search" element={<SearchPage/>}/>
      <Route path="/documents" element={<Documents/>}/>
      <Route path="/graph" element={<GraphPage/>}/>
      <Route path="/timeline" element={<Timeline/>}/>
      <Route path="/collections" element={<SimplePage title="Collections" subtitle="Organize connected information into meaningful context groups." icon={FolderOpen}/>}/>
      <Route path="/history" element={<SimplePage title="Search History" subtitle="Your previous memory-recovery searches will appear here." icon={History}/>}/>
      <Route path="/settings" element={<SimplePage title="Settings" subtitle="Manage your workspace, privacy, and retrieval preferences." icon={Settings}/>}/>
    </Routes>
    {upload && <UploadModal close={()=>setUpload(false)}/>}
  </Layout>
}
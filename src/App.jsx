
import React, { useEffect, useState } from "react";
import {
  Routes, Route, NavLink, useNavigate, useLocation, Navigate
} from "react-router-dom";
import {
  BrainCircuit, ChevronRight, Clock3, FileText, FolderOpen,
  History, LayoutDashboard, Menu, Network, Plus, Search, Settings,
  Sparkles, Upload, UserRound, X, Link2, ShieldCheck, ArrowUpRight,
  Trash2, LogOut, Bell, Info
} from "lucide-react";

import {
  login, register, logout, getToken, getDocuments,
  uploadDocument, deleteDocument, searchDocuments,
  getSearchUnderstanding, getGraphNodes
} from "./api";

function getDocumentName(d) {
  return d?.fileName || d?.originalFilename || d?.name ||
    d?.title || `Document ${d?.id ?? ""}`;
}

function getDocumentId(d) {
  return d?.id ?? d?.documentId;
}

function readSavedUser() {
  try {
    return JSON.parse(localStorage.getItem("contextgraph_user") || "null");
  } catch {
    return null;
  }
}

function AuthPage({ onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");

    try {
      const user = mode === "login"
        ? await login(email, password)
        : await register(name, email, password);

      onAuthenticated(user);
    } catch (err) {
      setError(err.message || "Authentication failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="empty-page" style={{ maxWidth: 440, margin: "50px auto" }}>
      <div className="empty-icon"><BrainCircuit size={30} /></div>
      <h1>ContextGraph</h1>
      <p>Your personal memory engine</p>

      <form onSubmit={submit} style={{ display: "grid", gap: 14, textAlign: "left" }}>
        {mode === "register" && (
          <label>
            Name
            <input required value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name" />
          </label>
        )}

        <label>
          Email
          <input required type="email" value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com" />
        </label>

        <label>
          Password
          <input required type="password"
            minLength={mode === "register" ? 8 : undefined}
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter your password" />
        </label>

        {error && <p style={{ color: "crimson", overflowWrap: "anywhere" }}>{error}</p>}

        <button className="primary-btn" type="submit" disabled={busy}>
          {busy ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
        </button>
      </form>

      <p style={{ marginTop: 18 }}>
        {mode === "login" ? "New to ContextGraph?" : "Already have an account?"}{" "}
        <button type="button" className="text-btn"
          onClick={() => {
            setMode(mode === "login" ? "register" : "login");
            setError("");
          }}>
          {mode === "login" ? "Register" : "Login"}
        </button>
      </p>
    </div>
  );
}

function Layout({ children, onUpload, onLogout, user }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const displayName = user?.name || "My workspace";
  const initial = displayName.charAt(0).toUpperCase() || "U";

  const nav = [
    ["Dashboard", "/", LayoutDashboard],
    ["Search", "/search", Search],
    ["Documents", "/documents", FileText],
    ["Knowledge Graph", "/graph", Network],
    ["Memory Timeline", "/timeline", Clock3],
  ];

  function navLink(label, path, Icon) {
    return (
      <NavLink key={path} to={path}
        end={path === "/"}
        onClick={() => setMobileOpen(false)}
        className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
        <Icon size={18} /><span>{label}</span>
      </NavLink>
    );
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><BrainCircuit size={23} /></div>
          <div>
            <strong>Context<span>Graph</span></strong>
            <small>Personal memory engine</small>
          </div>
          <button className="icon-btn mobile-close"
            onClick={() => setMobileOpen(false)}>
            <X size={19} />
          </button>
        </div>

        <div className="nav-section">
          <p>WORKSPACE</p>
          {nav.map(([label, path, Icon]) => navLink(label, path, Icon))}
        </div>

        <div className="nav-section secondary">
          <p>MANAGE</p>
          {navLink("Collections", "/collections", FolderOpen)}
          {navLink("Search History", "/history", History)}
          {navLink("Settings", "/settings", Settings)}
          {navLink("My Profile", "/profile", UserRound)}
        </div>

        <div className="sidebar-bottom">
          <div className="privacy-card">
            <ShieldCheck size={17} />
            <div><b>Your data</b><small>Private by design</small></div>
          </div>

          <button type="button" className="profile-mini"
            onClick={() => {
              navigate("/profile");
              setMobileOpen(false);
            }}
            style={{
              width: "100%", textAlign: "left", cursor: "pointer",
              color: "inherit", font: "inherit"
            }}>
            <div className="avatar">{initial}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <b>{displayName}</b>
              <small>{user?.email || "Personal account"}</small>
            </div>
            <UserRound size={17} />
          </button>

          <button type="button" className="nav-item"
            onClick={onLogout}
            style={{ width: "100%", cursor: "pointer", marginTop: 8 }}>
            <LogOut size={18} /><span>Logout</span>
          </button>
        </div>
      </aside>

      {mobileOpen && (
        <div className="overlay" onClick={() => setMobileOpen(false)} />
      )}

      <main className="main">
        <header className="topbar">
          <button className="icon-btn mobile-menu"
            onClick={() => setMobileOpen(true)}>
            <Menu size={21} />
          </button>
          <div className="breadcrumbs">
            <span>ContextGraph</span><ChevronRight size={14} /><b>Workspace</b>
          </div>
          <div className="top-actions">
            <button className="icon-btn" title="Notifications">
              <Bell size={19} />
            </button>
            <button type="button" className="avatar top-avatar"
              title="Open profile"
              onClick={() => navigate("/profile")}>
              {initial}
            </button>
          </div>
        </header>

        <div className="content">{children}</div>
      </main>

      <button className="floating-upload" onClick={onUpload}>
        <Plus size={20} /> Add information
      </button>
    </div>
  );
}

function ProfilePage({ user, onLogout }) {
  const navigate = useNavigate();

  return (
    <div>
      <div className="page-title">
        <div>
          <div className="eyebrow"><UserRound size={14} /> ACCOUNT</div>
          <h1>My Profile</h1>
          <p>View your ContextGraph account details.</p>
        </div>
      </div>

      <div className="empty-page" style={{ maxWidth: 650, margin: "24px auto" }}>
        <div className="empty-icon">
          <UserRound size={32} />
        </div>
        <h2>{user?.name || "ContextGraph User"}</h2>
        <p>Your personal memory engine account</p>

        <div style={{
          textAlign: "left", width: "100%", maxWidth: 420,
          margin: "20px auto", display: "grid", gap: 18
        }}>
          <div>
            <b>Full name</b>
            <p>{user?.name || "Not available"}</p>
          </div>
          <div>
            <b>Email address</b>
            <p style={{ overflowWrap: "anywhere" }}>
              {user?.email || "Not available"}
            </p>
          </div>
          <div>
            <b>Account ID</b>
            <p>{user?.userId ?? "Not available"}</p>
          </div>
        </div>

        <div style={{
          display: "flex", gap: 12, justifyContent: "center",
          flexWrap: "wrap"
        }}>
          <button className="primary-btn" onClick={() => navigate("/")}>
            <LayoutDashboard size={16} /> Dashboard
          </button>
          <button className="primary-btn"
            style={{ background: "#b42318" }} onClick={onLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ onUpload, refreshKey }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getDocuments()
      .then(data => setDocuments(Array.isArray(data) ? data : []))
      .catch(err => setError(err.message || "Could not load recent documents."));
  }, [refreshKey]);

  function search() {
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query)}`);
  }

  return (
    <div>
      <section className="hero">
        <div>
          <div className="eyebrow"><Sparkles size={15} /> INTELLIGENT MEMORY</div>
          <h1>Remember what you <em>forgot.</em></h1>
          <p>Search your personal information by meaning, time, people, places, and relationships — not just filenames.</p>
        </div>
        <div className="hero-orb">
          <BrainCircuit size={58} />
          <div className="orb-dot d1" /><div className="orb-dot d2" />
        </div>
      </section>

      <section className="search-box large">
        <Search size={22} />
        <input value={query} onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && search()}
          placeholder="What are you trying to remember?" />
        {query && <button className="search-go" onClick={search}>Search</button>}
        <kbd>Enter</kbd>
      </section>

      <div className="suggestions">
        <span>Try asking:</span>
        {[
          "Internship information from September",
          "Notes related to my coding event",
          "Documents mentioning React"
        ].map(x => (
          <button key={x}
            onClick={() => navigate(`/search?q=${encodeURIComponent(x)}`)}>
            {x}
          </button>
        ))}
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon"><FileText size={19} /></div>
          <div><strong>{documents.length}</strong><span>Information items</span>
            <small>Your uploaded documents</small></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><Network size={19} /></div>
          <div><strong>—</strong><span>Connected entities</span>
            <small>From your knowledge graph</small></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><FolderOpen size={19} /></div>
          <div><strong>—</strong><span>Context groups</span>
            <small>Backend statistics not available</small></div>
        </div>
      </div>

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <div className="section-head">
        <div><h2>Recent context</h2><p>Your uploaded information.</p></div>
        <button className="text-btn" onClick={() => navigate("/documents")}>
          View all <ArrowUpRight size={15} />
        </button>
      </div>

      {documents.length === 0 ? (
        <div className="empty-page">
          <FileText size={28} />
          <p>No documents yet. Add a file to get started.</p>
          <button className="primary-btn" onClick={onUpload}>
            <Upload size={16} /> Upload a file
          </button>
        </div>
      ) : (
        <div className="recent-grid">
          {documents.slice(0, 3).map((d, i) => (
            <DocumentCard d={d} key={getDocumentId(d) ?? i} />
          ))}
        </div>
      )}

      <div className="section-head graph-preview-head">
        <div><h2>Your knowledge graph</h2><p>See how your information connects.</p></div>
        <button className="text-btn" onClick={() => navigate("/graph")}>
          Explore graph <ArrowUpRight size={15} />
        </button>
      </div>
      <GraphPreview />
    </div>
  );
}

function DocumentCard({ d, onDelete }) {
  const name = getDocumentName(d);
  const extension = name.includes(".") ? name.split(".").pop().toUpperCase() : "FILE";

  return (
    <div className="doc-card">
      <div className="file-icon blue"><FileText size={20} /></div>
      <div className="doc-main">
        <div className="doc-title">{name}</div>
        <div className="doc-meta">
          {extension}
          {d.createdAt ? ` · ${new Date(d.createdAt).toLocaleDateString()}` : ""}
        </div>
      </div>
      {onDelete && (
        <button className="icon-btn" title="Delete document" onClick={() => onDelete(d)}>
          <Trash2 size={18} />
        </button>
      )}
    </div>
  );
}

function SearchPage() {
  const location = useLocation();
  const [query, setQuery] = useState(
    new URLSearchParams(location.search).get("q") || ""
  );
  const [results, setResults] = useState([]);
  const [understanding, setUnderstanding] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function runSearch(searchText) {
    if (!searchText.trim()) {
      setResults([]);
      setError("Enter something you want to remember.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const [resultData, contextData] = await Promise.all([
        searchDocuments(searchText),
        getSearchUnderstanding(searchText).catch(() => null)
      ]);
      setResults(Array.isArray(resultData) ? resultData : []);
      setUnderstanding(contextData);
    } catch (err) {
      setError(err.message || "Search failed.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const q = new URLSearchParams(location.search).get("q");
    if (q) {
      setQuery(q);
      runSearch(q);
    }
  }, [location.search]);

  return (
    <div>
      <div className="page-title">
        <div>
          <div className="eyebrow"><Search size={14} /> CONTEXT SEARCH</div>
          <h1>Find your information</h1>
          <p>Search by meaning, memory, time, or relationships.</p>
        </div>
      </div>

      <div className="search-box">
        <Search size={20} />
        <input value={query} onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && runSearch(query)}
          placeholder="Describe what you remember..." />
        <button className="search-go" onClick={() => runSearch(query)}>Search</button>
      </div>

      {understanding && (
        <div className="query-understanding">
          <div className="understanding-icon"><Sparkles size={18} /></div>
          <div>
            <b>Context understood</b>
            <div className="intent-tags">
              {understanding.topic && <span>Topic: {understanding.topic}</span>}
              {understanding.time && <span>Time: {understanding.time}</span>}
              {understanding.mode && <span>{understanding.mode}</span>}
            </div>
          </div>
          <Info size={17} />
        </div>
      )}

      {loading && <p>Searching your information...</p>}
      {error && <p style={{ color: "crimson", overflowWrap: "anywhere" }}>{error}</p>}

      {!loading && !error && (
        <>
          <div className="results-toolbar">
            <div><b>{results.length} results</b><span> · from your backend search</span></div>
          </div>
          <div className="result-list">
            {results.map((d, i) => (
              <div className="result-card" key={getDocumentId(d) ?? i}>
                <div className={`result-number ${i === 0 ? "top" : ""}`}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="file-icon blue"><FileText size={20} /></div>
                <div className="result-content">
                  <div className="result-top">
                    <h3>{getDocumentName(d)}</h3>
                    {typeof d.score === "number" &&
                      <span className="match">{Math.round(d.score * 100)}% match</span>}
                  </div>
                  <p>{d.snippet || d.content || d.summary || "Matching information returned by ContextGraph."}</p>
                  <div className="result-meta">
                    {d.createdAt && <span><Clock3 size={13} /> {new Date(d.createdAt).toLocaleDateString()}</span>}
                    {d.topic && <span><Link2 size={13} /> {d.topic}</span>}
                  </div>
                </div>
              </div>
            ))}
            {results.length === 0 && <p>No matching information was found.</p>}
          </div>
        </>
      )}
    </div>
  );
}

function Documents({ refreshKey, onUploaded }) {
  const [view, setView] = useState("list");
  const [documents, setDocuments] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function loadDocuments() {
    setLoading(true);
    setError("");
    try {
      const data = await getDocuments();
      setDocuments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Could not load documents.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadDocuments(); }, [refreshKey]);

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError("");
    try {
      await uploadDocument(file);
      await loadDocuments();
      onUploaded();
    } catch (err) {
      setError(err.message || "Upload failed.");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  }

  async function handleDelete(d) {
    const id = getDocumentId(d);
    if (id == null) {
      setError("This document has no ID, so it cannot be deleted.");
      return;
    }
    if (!window.confirm(`Delete "${getDocumentName(d)}"?`)) return;
    try {
      await deleteDocument(id);
      await loadDocuments();
    } catch (err) {
      setError(err.message || "Could not delete document.");
    }
  }

  const filtered = documents.filter(d =>
    getDocumentName(d).toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <div className="page-title-row">
        <div>
          <div className="eyebrow"><FileText size={14} /> INFORMATION VAULT</div>
          <h1>Your information</h1>
          <p>Everything you've added to ContextGraph.</p>
        </div>
        <label className="primary-btn" style={{ cursor: "pointer" }}>
          <Upload size={17} /> {busy ? "Uploading..." : "Upload"}
          <input type="file" hidden disabled={busy} onChange={handleUpload} />
        </label>
      </div>

      <div className="toolbar">
        <div className="mini-search">
          <Search size={17} />
          <input placeholder="Search documents..." value={query}
            onChange={e => setQuery(e.target.value)} />
        </div>
        <button className="filter-btn" onClick={loadDocuments}>
          <History size={16} /> Refresh
        </button>
        <div className="view-toggle">
          <button className={view === "list" ? "on" : ""} onClick={() => setView("list")}>
            <FileText size={16} />
          </button>
          <button className={view === "grid" ? "on" : ""} onClick={() => setView("grid")}>
            <LayoutDashboard size={16} />
          </button>
        </div>
      </div>

      {loading && <p>Loading your documents...</p>}
      {error && <p style={{ color: "crimson", overflowWrap: "anywhere" }}>{error}</p>}

      {!loading && filtered.length === 0 && !error && (
        <div className="empty-page">
          <FileText size={28} />
          <p>No documents found. Upload a file to get started.</p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className={view === "list" ? "documents-list" : "doc-grid"}>
          {filtered.map((d, i) => (
            <DocumentCard d={d} key={getDocumentId(d) ?? i} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}

function GraphPreview() {
  return (
    <div className="graph-box">
      <div className="graph-node center">Context<div className="node-label">Memory</div></div>
      <div className="graph-node n1">Documents<div className="node-label">Files</div></div>
      <div className="graph-node n2">Topics<div className="node-label">Entities</div></div>
      <div className="graph-node n3">People<div className="node-label">Entities</div></div>
      <div className="graph-node n4">Time<div className="node-label">Events</div></div>
      <div className="graph-node n5">Search<div className="node-label">Retrieval</div></div>
      <svg viewBox="0 0 900 330" preserveAspectRatio="none">
        <line x1="450" y1="165" x2="210" y2="70" />
        <line x1="450" y1="165" x2="690" y2="75" />
        <line x1="450" y1="165" x2="230" y2="265" />
        <line x1="450" y1="165" x2="690" y2="260" />
        <line x1="450" y1="165" x2="450" y2="45" />
      </svg>
    </div>
  );
}

function GraphPage() {
  const [nodes, setNodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getGraphNodes()
      .then(data => setNodes(Array.isArray(data) ? data : data?.nodes || []))
      .catch(err => setError(err.message || "Could not load the graph."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-title-row">
        <div>
          <div className="eyebrow"><Network size={14} /> KNOWLEDGE GRAPH</div>
          <h1>How your information connects</h1>
          <p>Explore the graph data returned by ContextGraph.</p>
        </div>
      </div>
      {loading && <p>Loading knowledge graph...</p>}
      {error && <p style={{ color: "crimson", overflowWrap: "anywhere" }}>{error}</p>}
      {!loading && !error && (
        nodes.length === 0 ? <p>No graph nodes are available yet. Upload documents and check again.</p> :
        <div className="documents-list">
          {nodes.map((node, i) => (
            <div className="doc-card" key={node.id ?? node.name ?? i}>
              <div className="file-icon blue"><Network size={20} /></div>
              <div className="doc-main">
                <div className="doc-title">{node.name || node.label || node.title || `Node ${node.id ?? i + 1}`}</div>
                <div className="doc-meta">{node.type || node.category || "Graph node"}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Timeline({ refreshKey }) {
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getDocuments()
      .then(data => setDocuments(Array.isArray(data) ? data : []))
      .catch(err => setError(err.message || "Could not load the timeline."));
  }, [refreshKey]);

  const sorted = [...documents].sort((a, b) =>
    new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
  );

  return (
    <div>
      <div className="page-title">
        <div>
          <div className="eyebrow"><Clock3 size={14} /> MEMORY TRAIL</div>
          <h1>Your information timeline</h1>
          <p>Uploaded documents ordered by date, where timestamps are available.</p>
        </div>
      </div>
      {error && <p style={{ color: "crimson" }}>{error}</p>}
      <div className="timeline-wrap">
        {sorted.map((d, i) => (
          <div className="timeline-item" key={getDocumentId(d) ?? i}>
            <div className="timeline-date">
              {d.createdAt ? new Date(d.createdAt).toLocaleDateString() : "Date unavailable"}
            </div>
            <div className="timeline-dot">{i + 1}</div>
            <div className="timeline-card">
              <div className="timeline-icon"><FileText size={18} /></div>
              <div><b>{getDocumentName(d)}</b><span>Uploaded information</span></div>
            </div>
          </div>
        ))}
        {sorted.length === 0 && !error && <p>No timeline items yet.</p>}
      </div>
    </div>
  );
}

function SimplePage({ title, subtitle, icon: Icon }) {
  return (
    <div className="empty-page">
      <div className="empty-icon"><Icon size={30} /></div>
      <h1>{title}</h1>
      <p>{subtitle}</p>
      <div className="coming">This section can be connected to additional backend features.</div>
    </div>
  );
}

function UploadModal({ close, onUploaded }) {
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    if (!file) {
      setError("Choose a file first.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await uploadDocument(file);
      onUploaded();
      close();
    } catch (err) {
      setError(err.message || "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={close}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={close}><X size={19} /></button>
        <div className="modal-icon"><Upload size={24} /></div>
        <h2>Add information</h2>
        <p>Choose a document to upload to ContextGraph.</p>
        <div className="dropzone">
          <Upload size={28} />
          <b>{file ? file.name : "Choose a file"}</b>
          <span>Choose a supported file from your computer.</span>
          <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} />
        </div>
        {error && <p style={{ color: "crimson", overflowWrap: "anywhere" }}>{error}</p>}
        <button className="primary-btn" disabled={busy} onClick={submit}>
          {busy ? "Uploading..." : "Upload file"}
        </button>
        <div className="modal-note">
          <ShieldCheck size={15} /> Uploads are sent to your ContextGraph backend.
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [authenticated, setAuthenticated] = useState(Boolean(getToken()));
  const [user, setUser] = useState(readSavedUser);
  const [upload, setUpload] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  function handleAuthenticated(userData) {
    setUser(userData || null);
    localStorage.setItem("contextgraph_user", JSON.stringify(userData || {}));
    setAuthenticated(true);
  }

  function handleLogout() {
    logout();
    localStorage.removeItem("contextgraph_user");
    setUser(null);
    setUpload(false);
    setAuthenticated(false);
  }

  function handleUploaded() {
    setRefreshKey(value => value + 1);
  }

  if (!authenticated) {
    return <AuthPage onAuthenticated={handleAuthenticated} />;
  }

  return (
    <Layout
      user={user}
      onUpload={() => setUpload(true)}
      onLogout={handleLogout}
    >
      <Routes>
        <Route path="/" element={<Dashboard onUpload={() => setUpload(true)} refreshKey={refreshKey} />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/documents" element={<Documents refreshKey={refreshKey} onUploaded={handleUploaded} />} />
        <Route path="/graph" element={<GraphPage />} />
        <Route path="/timeline" element={<Timeline refreshKey={refreshKey} />} />
        <Route path="/profile" element={<ProfilePage user={user} onLogout={handleLogout} />} />
        <Route path="/collections" element={<SimplePage title="Collections" subtitle="Organize related information into meaningful groups." icon={FolderOpen} />} />
        <Route path="/history" element={<SimplePage title="Search History" subtitle="Your previous memory-recovery searches." icon={History} />} />
        <Route path="/settings" element={<SimplePage title="Settings" subtitle="Manage your workspace and preferences." icon={Settings} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {upload && (
        <UploadModal close={() => setUpload(false)} onUploaded={handleUploaded} />
      )}
    </Layout>
  );
}

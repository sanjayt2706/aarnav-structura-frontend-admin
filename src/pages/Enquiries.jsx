import { useEffect, useState, useCallback } from "react";
import API from "../services/api";
import Layout from "../layouts/Layout";

const STATUSES = ["New", "Contacted", "Meeting Scheduled", "Quotation Sent", "Won", "Lost", "Completed"];
const badgeClass = (s) => `badge ${s.replace(/\s/g, "")}`;

export default function Enquiries() {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 15;
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState([]);
  const [active, setActive] = useState(null); // enquiry being viewed/edited
  const [notesDraft, setNotesDraft] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/api/admin/enquiries", { params: { page, limit, search, status } });
      setRows(data.rows);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => { load(); }, [load]);

  const toggleSelect = (id) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const updateStatus = async (id, newStatus) => {
    await API.patch(`/api/admin/enquiries/${id}/status`, { status: newStatus });
    load();
  };

  const saveNotes = async () => {
    await API.patch(`/api/admin/enquiries/${active._id}/status`, { status: active.status, adminNotes: notesDraft });
    setActive(null);
    load();
  };

  const bulkStatus = async (newStatus) => {
    if (!selected.length) return;
    await API.patch("/api/admin/enquiries/bulk/status", { ids: selected, status: newStatus });
    setSelected([]);
    load();
  };

  const bulkDelete = async () => {
    if (!selected.length || !confirm(`Delete ${selected.length} enquiries?`)) return;
    await API.delete("/api/admin/enquiries/bulk", { data: { ids: selected } });
    setSelected([]);
    load();
  };

  const exportFile = (type) => {
    const token = localStorage.getItem("astr_admin_token");
    const url = `${API.defaults.baseURL}/api/admin/enquiries/export/${type}?search=${search}&status=${status}`;
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.blob())
      .then((blob) => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `enquiries.${type === "excel" ? "xlsx" : "csv"}`;
        a.click();
      });
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <Layout>
      <h1 className="page-title">Enquiries</h1>
      <p className="page-sub">{total} total enquiries</p>

      <div className="toolbar">
        <input className="input" placeholder="Search name, phone, email, location..." value={search} onChange={(e) => { setPage(1); setSearch(e.target.value); }} style={{ minWidth: 260 }} />
        <select className="input" value={status} onChange={(e) => { setPage(1); setStatus(e.target.value); }}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <button className="btn" onClick={() => exportFile("csv")}>Export CSV</button>
        <button className="btn" onClick={() => exportFile("excel")}>Export Excel</button>
        {selected.length > 0 && (
          <>
            <select className="input" onChange={(e) => e.target.value && bulkStatus(e.target.value)} defaultValue="">
              <option value="" disabled>Bulk set status ({selected.length})</option>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <button className="btn btn-danger" onClick={bulkDelete}>Delete selected</button>
          </>
        )}
      </div>

      <div className="card table-wrap">
        <table>
          <thead>
            <tr>
              <th><input type="checkbox" onChange={(e) => setSelected(e.target.checked ? rows.map((r) => r._id) : [])} /></th>
              <th>Name</th><th>Phone</th><th>Project Type</th><th>Budget</th><th>Location</th><th>Status</th><th>Received</th><th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r._id}>
                <td><input type="checkbox" checked={selected.includes(r._id)} onChange={() => toggleSelect(r._id)} /></td>
                <td>{r.fullName}</td>
                <td>{r.phoneNumber}</td>
                <td>{r.projectType || "—"}</td>
                <td>{r.budget || "—"}</td>
                <td>{r.location || "—"}</td>
                <td>
                  <select className="input" value={r.status} onChange={(e) => updateStatus(r._id, e.target.value)} style={{ padding: "4px 8px" }}>
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                <td><button className="btn" onClick={() => { setActive(r); setNotesDraft(r.adminNotes || ""); }}>View</button></td>
              </tr>
            ))}
            {!loading && rows.length === 0 && (
              <tr><td colSpan={9} className="empty-state">No enquiries found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button className="btn" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
        <span>Page {page} of {totalPages}</span>
        <button className="btn" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
      </div>

      {active && (
        <div className="modal-backdrop" onClick={() => setActive(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-title">{active.fullName}</div>
            <p><strong>Phone:</strong> {active.phoneNumber}</p>
            <p><strong>Email:</strong> {active.email || "—"}</p>
            <p><strong>Location:</strong> {active.location || "—"}</p>
            <p><strong>Project type:</strong> {active.projectType || "—"}</p>
            <p><strong>Budget:</strong> {active.budget || "—"}</p>
            <p><strong>Brief:</strong> {active.projectBrief || "—"}</p>
            <p><span className={badgeClass(active.status)}>{active.status}</span></p>
            <div className="field">
              <label>Admin notes</label>
              <textarea className="input" style={{ width: "100%" }} rows={4} value={notesDraft} onChange={(e) => setNotesDraft(e.target.value)} />
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button className="btn btn-primary" onClick={saveNotes}>Save notes</button>
              <button className="btn" onClick={() => setActive(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}

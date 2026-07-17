import { useEffect, useState, useCallback } from "react";
import API from "../services/api";
import Layout from "../layouts/Layout";

export default function Visitors() {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 20;
  const [search, setSearch] = useState("");
  const [device, setDevice] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/api/admin/visitors", { params: { page, limit, search, device } });
      setRows(data.rows);
      setTotal(data.total);
    } finally {
      setLoading(false);
    }
  }, [page, search, device]);

  useEffect(() => { load(); }, [load]);

  const exportFile = (type) => {
    const token = localStorage.getItem("astr_admin_token");
    const url = `${API.defaults.baseURL}/api/admin/visitors/export/${type}?search=${search}&device=${device}`;
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.blob())
      .then((blob) => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `visitors.${type === "excel" ? "xlsx" : "csv"}`;
        a.click();
      });
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <Layout>
      <h1 className="page-title">Visitors</h1>
      <p className="page-sub">{total} tracked page views</p>

      <div className="toolbar">
        <input className="input" placeholder="Search IP, city, country..." value={search} onChange={(e) => { setPage(1); setSearch(e.target.value); }} style={{ minWidth: 260 }} />
        <select className="input" value={device} onChange={(e) => { setPage(1); setDevice(e.target.value); }}>
          <option value="">All devices</option>
          <option value="desktop">Desktop</option>
          <option value="mobile">Mobile</option>
          <option value="tablet">Tablet</option>
        </select>
        <button className="btn" onClick={() => exportFile("csv")}>Export CSV</button>
        <button className="btn" onClick={() => exportFile("excel")}>Export Excel</button>
      </div>

      <div className="card table-wrap">
        <table>
          <thead>
            <tr><th>IP</th><th>Country</th><th>City</th><th>Browser</th><th>Device</th><th>OS</th><th>Page</th><th>Visited</th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{r.ipAddress}</td>
                <td>{r.country || "—"}</td>
                <td>{r.city || "—"}</td>
                <td>{r.browser || "—"}</td>
                <td>{r.deviceType || "—"}</td>
                <td>{r.os || "—"}</td>
                <td>{r.currentPage}</td>
                <td>{new Date(r.visitedAt).toLocaleString()}</td>
              </tr>
            ))}
            {!loading && rows.length === 0 && <tr><td colSpan={8} className="empty-state">No visits recorded yet</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button className="btn" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Prev</button>
        <span>Page {page} of {totalPages}</span>
        <button className="btn" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</button>
      </div>
    </Layout>
  );
}

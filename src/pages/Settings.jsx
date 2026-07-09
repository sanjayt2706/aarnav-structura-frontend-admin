import { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../layouts/Layout";

const BLOCKS = [
  { key: "hero", label: "Hero Section", placeholder: '{\n  "eyebrow": "Shivamogga, Karnataka — Est. 2020",\n  "headingLine1": "BUILT ON TRUST.",\n  "headingLine2": "DELIVERED WITH PRECISION.",\n  "subtext": "..."\n}' },
  { key: "about", label: "About Content", placeholder: '{\n  "heading": "...",\n  "body": "..."\n}' },
  { key: "contact_info", label: "Contact Information", placeholder: '{\n  "phone": "+91 77603 76348",\n  "whatsapp": "+91 87623 98728",\n  "email": "satvikrajgowda282@gmail.com",\n  "address": "Shivamogga, Karnataka"\n}' },
  { key: "social_links", label: "Social Media Links", placeholder: '{\n  "instagram": "https://instagram.com/...",\n  "facebook": "https://facebook.com/...",\n  "linkedin": "https://linkedin.com/..."\n}' },
  { key: "footer", label: "Footer Content", placeholder: '{\n  "tagline": "...",\n  "copyright": "© 2026 Aarnav Structura"\n}' }
];

export default function Settings() {
  const [active, setActive] = useState(BLOCKS[0].key);
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setStatus("");
      try {
        const { data } = await API.get(`/api/settings/${active}`);
        setText(JSON.stringify(data.data, null, 2));
      } catch {
        setText("{\n  \n}");
      } finally {
        setLoading(false);
      }
    })();
  }, [active]);

  const save = async () => {
    setStatus("");
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      setStatus("⚠ Invalid JSON — fix syntax before saving.");
      return;
    }
    try {
      await API.put(`/api/admin/settings/${active}`, parsed);
      setStatus("✓ Saved — live on the website.");
    } catch (e) {
      setStatus(e.response?.data?.message || "Save failed");
    }
  };

  const block = BLOCKS.find((b) => b.key === active);

  return (
    <Layout>
      <h1 className="page-title">Website Content</h1>
      <p className="page-sub">Edit content blocks that appear live on the website — no code changes needed.</p>

      <div className="chip-tabs">
        {BLOCKS.map((b) => (
          <button key={b.key} className={`chip-tab ${active === b.key ? "active" : ""}`} onClick={() => setActive(b.key)}>{b.label}</button>
        ))}
      </div>

      <div className="card">
        <div className="card-title">{block.label} — JSON</div>
        {loading ? (
          <div className="empty-state">Loading…</div>
        ) : (
          <>
            <textarea
              className="input"
              style={{ width: "100%", fontFamily: "monospace", fontSize: 13 }}
              rows={14}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={block.placeholder}
            />
            <div style={{ display: "flex", gap: 10, marginTop: 12, alignItems: "center" }}>
              <button className="btn btn-primary" onClick={save}>Save & Publish</button>
              {status && <span style={{ fontSize: 13, color: status.startsWith("✓") ? "#3fb950" : "#e5484d" }}>{status}</span>}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

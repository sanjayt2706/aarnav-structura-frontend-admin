import { useEffect, useState } from "react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from "recharts";
import API from "../services/api";
import Layout from "../layouts/Layout";

const GOLD = "#d9a63c";
const COLORS = ["#d9a63c", "#63b3ed", "#b794f4", "#3fb950", "#f6ad55", "#e5484d"];

const Card = ({ label, value }) => (
  <div className="stat-card">
    <div className="stat-label">{label}</div>
    <div className="stat-value">{value ?? "—"}</div>
  </div>
);

export default function Dashboard() {
  const [cards, setCards] = useState(null);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [ov, ch] = await Promise.all([
          API.get("/api/admin/dashboard/overview"),
          API.get("/api/admin/dashboard/charts?days=30")
        ]);
        setCards(ov.data.data.cards);
        setCharts(ch.data.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <Layout>
      <h1 className="page-title">Overview</h1>
      <p className="page-sub">Live visitor and enquiry metrics across your website.</p>

      {loading && <div className="empty-state">Loading dashboard…</div>}

      {cards && (
        <div className="stat-grid">
          <Card label="Total Visitors" value={cards.totalVisitors} />
          <Card label="Visitors Today" value={cards.visitorsToday} />
          <Card label="Visitors This Week" value={cards.visitorsThisWeek} />
          <Card label="Visitors This Month" value={cards.visitorsThisMonth} />
          <Card label="Total Enquiries" value={cards.totalEnquiries} />
          <Card label="Today's Enquiries" value={cards.enquiriesToday} />
          <Card label="Pending Enquiries" value={cards.pendingEnquiries} />
          <Card label="Completed" value={cards.completedEnquiries} />
          <Card label="Conversion Rate" value={`${cards.conversionRate}%`} />
        </div>
      )}

      {charts && (
        <>
          <div className="chart-grid">
            <div className="card">
              <div className="card-title">Visitors vs Enquiries (30 days)</div>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={charts.visitorVsEnquiry}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#262b32" />
                  <XAxis dataKey="date" stroke="#9aa1ab" fontSize={11} />
                  <YAxis stroke="#9aa1ab" fontSize={11} />
                  <Tooltip contentStyle={{ background: "#171a1f", border: "1px solid #262b32" }} />
                  <Legend />
                  <Line type="monotone" dataKey="visitors" stroke={GOLD} strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="enquiries" stroke="#63b3ed" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <div className="card-title">Device Distribution</div>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={charts.deviceDistribution} dataKey="count" nameKey="label" innerRadius={50} outerRadius={85}>
                    {charts.deviceDistribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "#171a1f", border: "1px solid #262b32" }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="chart-grid-3">
            <div className="card">
              <div className="card-title">Daily Visitors</div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={charts.dailyVisitors}>
                  <XAxis dataKey="date" stroke="#9aa1ab" fontSize={10} hide />
                  <YAxis stroke="#9aa1ab" fontSize={10} />
                  <Tooltip contentStyle={{ background: "#171a1f", border: "1px solid #262b32" }} />
                  <Bar dataKey="count" fill={GOLD} radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <div className="card-title">Browser Distribution</div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={charts.browserDistribution} layout="vertical">
                  <XAxis type="number" stroke="#9aa1ab" fontSize={10} />
                  <YAxis type="category" dataKey="label" stroke="#9aa1ab" fontSize={10} width={70} />
                  <Tooltip contentStyle={{ background: "#171a1f", border: "1px solid #262b32" }} />
                  <Bar dataKey="count" fill="#63b3ed" radius={[0, 3, 3, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="card">
              <div className="card-title">Traffic Sources</div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={charts.trafficSources}>
                  <XAxis dataKey="label" stroke="#9aa1ab" fontSize={9} interval={0} angle={-20} textAnchor="end" height={50} />
                  <YAxis stroke="#9aa1ab" fontSize={10} />
                  <Tooltip contentStyle={{ background: "#171a1f", border: "1px solid #262b32" }} />
                  <Bar dataKey="count" fill="#b794f4" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}

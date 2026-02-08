import React, { useEffect, useState } from "react";
import { api } from "../api";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area, CartesianGrid
} from "recharts";
import {
  Users, Zap, Activity, CheckCircle, XCircle, Clock,
  Search, Filter, Trash2, LayoutDashboard, Settings, FileText, ChevronRight
} from "lucide-react";

export default function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const load = async () => {
    try {
      const res = await api.get("/requests");
      const data = res.data || [];
      setRequests(data);
      processChartData(data);
    } catch (e) {
      setErr(e?.response?.data?.msg || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const processChartData = (data) => {
    // Line Chart Data
    const counts = {};
    data.forEach((r) => {
      const date = new Date(r.createdAt || r.requestDate).toLocaleDateString("en-US", { month: 'short', day: 'numeric' });
      counts[date] = (counts[date] || 0) + 1;
    });
    const line = Object.entries(counts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    setLineData(line);

    // Pie Chart Data
    const statusCounts = { Pending: 0, Approved: 0, Rejected: 0 };
    data.forEach((r) => {
      const s = r.status || "Pending";
      const key = s.toLowerCase() === "approved" ? "Approved" : s.toLowerCase() === "rejected" ? "Rejected" : "Pending";
      statusCounts[key] += 1;
    });
    setPieData([
      { name: "Pending", value: statusCounts.Pending },
      { name: "Approved", value: statusCounts.Approved },
      { name: "Rejected", value: statusCounts.Rejected }
    ]);
  };

  useEffect(() => { load(); }, []);

  const handleAction = async (id, action) => {
    if (action === "delete" && !window.confirm("Are you sure you want to delete this request?")) return;

    try {
      // Optimistic UI Update
      setRequests(prev => prev.map(r => {
        if (r._id === id) {
          if (action === "approve") return { ...r, status: "Approved" };
          if (action === "reject") return { ...r, status: "Rejected" };
        }
        return r;
      }));

      if (action === "delete") {
        setRequests(prev => prev.filter(r => r._id !== id));
      }

      // API Call
      if (action === "approve") await api.put(`/requests/${id}/approve`);
      else if (action === "reject") await api.put(`/requests/${id}/reject`);
      else if (action === "delete") await api.delete(`/requests/${id}`);

      // Reload to sync (optional, but good for consistency)
      load();
    } catch (e) {
      console.error(e);
      alert("Action failed. Please try again.");
      load(); // Revert on failure
    }
  };

  const COLORS = ["#f59e0b", "#10b981", "#ef4444"];

  const filteredRequests = requests.filter(r => {
    const matchesFilter = filter === "All" || r.status === filter;
    const matchesSearch = r.farmerName?.toLowerCase().includes(search.toLowerCase()) ||
      r.area?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)] bg-slate-50 font-sans">
      {/* Sidebar - Sticky */}
      <aside className="lg:w-64 lg:sticky lg:top-16 lg:h-[calc(100vh-64px)] bg-slate-900 text-slate-300 hidden lg:flex flex-col flex-shrink-0 overflow-y-auto">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold text-white tracking-wide">
            Agri<span className="text-emerald-500">Admin</span>
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <div className="flex items-center gap-3 px-4 py-3 bg-emerald-600/20 text-emerald-400 rounded-lg">
            <LayoutDashboard size={18} />
            <span className="font-medium text-sm">Dashboard</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 rounded-lg transition-colors cursor-not-allowed opacity-50">
            <Users size={18} />
            <span className="font-medium text-sm">Farmers</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 rounded-lg transition-colors cursor-not-allowed opacity-50">
            <FileText size={18} />
            <span className="font-medium text-sm">Reports</span>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Dashboard</h2>
              <p className="text-slate-500 text-sm">Manage power requests and system status.</p>
            </div>
          </header>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
          ) : (
            <>
              {/* Stats Cards - Simplified for Performance */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {/* Total */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-semibold">Total Requests</p>
                    <h3 className="text-2xl font-bold text-slate-800 mt-1">{requests.length}</h3>
                  </div>
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                    <Activity size={20} />
                  </div>
                </div>

                {/* Pending */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-semibold">Pending</p>
                    <h3 className="text-2xl font-bold text-amber-500 mt-1">
                      {pieData.find(p => p.name === "Pending")?.value || 0}
                    </h3>
                  </div>
                  <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                    <Clock size={20} />
                  </div>
                </div>

                {/* Approved */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-semibold">Approved</p>
                    <h3 className="text-2xl font-bold text-emerald-600 mt-1">
                      {pieData.find(p => p.name === "Approved")?.value || 0}
                    </h3>
                  </div>
                  <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                    <CheckCircle size={20} />
                  </div>
                </div>

                {/* Rejected */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-semibold">Rejected</p>
                    <h3 className="text-2xl font-bold text-red-600 mt-1">
                      {pieData.find(p => p.name === "Rejected")?.value || 0}
                    </h3>
                  </div>
                  <div className="p-3 bg-red-50 text-red-600 rounded-lg">
                    <XCircle size={20} />
                  </div>
                </div>
              </div>

              {/* Charts Section - Optimized */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-800 mb-4">Request Volume</h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={lineData}>
                        <defs>
                          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11 }} />
                        <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }} />
                        <Area type="monotone" dataKey="count" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-800 mb-4">Status Overview</h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={5}
                          dataKey="value"
                          stroke="none"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Data Table - Restored Buttons */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h3 className="text-lg font-bold text-slate-800">Recent Requests</h3>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none w-full md:w-64"
                      />
                    </div>
                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    >
                      <option value="All">All Status</option>
                      <option value="Pending">Pending</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold tracking-wider">
                      <tr>
                        <th className="px-6 py-4">Farmer</th>
                        <th className="px-6 py-4">Area & Power</th>
                        <th className="px-6 py-4">Purpose</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredRequests.length > 0 ? (
                        filteredRequests.map((r) => (
                          <tr key={r._id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs uppercase">
                                  {r.farmerName?.charAt(0) || 'U'}
                                </div>
                                <div>
                                  <div className="font-medium text-slate-900 text-sm">{r.farmerName || "Unknown"}</div>
                                  <div className="text-xs text-slate-500">{new Date(r.createdAt || r.requestDate).toLocaleDateString()}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-slate-900">{r.area}</div>
                              <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                                <Zap size={12} className="text-amber-500" />
                                {r.powerRequired} kW
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">
                              {r.purpose || "—"}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${r.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                                r.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                  'bg-amber-100 text-amber-700'
                                }`}>
                                {r.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => handleAction(r._id, "approve")}
                                  className={`px-3 py-1.5 text-xs font-medium rounded-md shadow-sm transition-colors flex items-center gap-1 ${r.status === 'Approved'
                                      ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                    }`}
                                  title="Approve Request"
                                >
                                  <CheckCircle size={12} /> {r.status === 'Approved' ? 'Approved' : 'Approve'}
                                </button>
                                <button
                                  onClick={() => handleAction(r._id, "reject")}
                                  className={`px-3 py-1.5 text-xs font-medium rounded-md shadow-sm transition-colors flex items-center gap-1 ${r.status === 'Rejected'
                                      ? 'bg-red-100 text-red-700 border border-red-200'
                                      : 'bg-amber-500 hover:bg-amber-600 text-white'
                                    }`}
                                  title="Reject Request"
                                >
                                  <XCircle size={12} /> {r.status === 'Rejected' ? 'Rejected' : 'Reject'}
                                </button>
                                <button
                                  onClick={() => handleAction(r._id, "delete")}
                                  className="px-3 py-1.5 border border-slate-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 text-slate-600 text-xs font-medium rounded-md transition-colors flex items-center gap-1"
                                >
                                  <Trash2 size={12} /> Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                            <div className="flex flex-col items-center justify-center">
                              <Search size={32} className="text-slate-300 mb-3" />
                              <p>No requests found matching your criteria.</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

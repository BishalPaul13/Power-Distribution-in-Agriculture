import React, { useEffect, useState } from "react";
import { api } from "../api";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";
import {
  Users,
  Zap,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Trash2,
  LayoutDashboard,
  FileText
} from "lucide-react";

export default function AdminDashboard() {
  const [requests, setRequests] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [subsidyInputs, setSubsidyInputs] = useState({});
  const [usageInputs, setUsageInputs] = useState({});
  const [actionLoading, setActionLoading] = useState({});

  const load = async () => {
    try {
      const [requestsRes, farmersRes] = await Promise.all([
        api.get("/requests"),
        api.get("/auth/farmers")
      ]);
      const requestsData = requestsRes.data || [];
      const farmersData = farmersRes.data || [];

      setRequests(requestsData);
      setFarmers(farmersData);
      processChartData(requestsData);
    } catch (e) {
      setErr(e?.response?.data?.msg || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const processChartData = (data) => {
    const counts = {};
    data.forEach((r) => {
      const date = new Date(r.createdAt || r.requestDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric"
      });
      counts[date] = (counts[date] || 0) + 1;
    });

    const line = Object.entries(counts)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    const statusCounts = { Pending: 0, Approved: 0, Rejected: 0 };
    data.forEach((r) => {
      const status = r.status || "Pending";
      if (statusCounts[status] !== undefined) statusCounts[status] += 1;
    });

    setLineData(line);
    setPieData([
      { name: "Pending", value: statusCounts.Pending },
      { name: "Approved", value: statusCounts.Approved },
      { name: "Rejected", value: statusCounts.Rejected }
    ]);
  };

  useEffect(() => {
    load();
  }, []);

  const handleAction = async (id, action) => {
    const request = requests.find((item) => item._id === id);
    if (!request || request.status !== "Pending") {
      return;
    }

    if (action === "delete" && !window.confirm("Are you sure you want to delete this request?")) {
      return;
    }

    try {
      setRequests((prev) =>
        prev
          .map((r) => {
            if (r._id !== id) return r;
            if (action === "approve") return { ...r, status: "Approved", paymentStatus: r.requestType === "paid_topup" ? "Paid" : r.paymentStatus };
            if (action === "reject") return { ...r, status: "Rejected" };
            return r;
          })
          .filter((r) => (action === "delete" ? r._id !== id : true))
      );

      if (action === "approve") await api.put(`/requests/${id}/approve`);
      if (action === "reject") await api.put(`/requests/${id}/reject`);
      if (action === "delete") await api.delete(`/requests/${id}`);

      await load();
    } catch (e) {
      console.error(e);
      alert("Action failed. Please try again.");
      load();
    }
  };

  const handleSubsidyInputChange = (farmerId, value) => {
    setSubsidyInputs((prev) => ({ ...prev, [farmerId]: value }));
  };

  const handleUsageInputChange = (farmerId, value) => {
    setUsageInputs((prev) => ({ ...prev, [farmerId]: value }));
  };

  const handleGrantSubsidy = async (farmerId, presetUnits) => {
    const inputValue = presetUnits || subsidyInputs[farmerId];
    const units = Number(inputValue);

    if (!Number.isFinite(units) || units <= 0) {
      alert("Enter a valid subsidy unit amount.");
      return;
    }

    try {
      setActionLoading((prev) => ({ ...prev, [farmerId]: true }));
      await api.post(`/auth/farmers/${farmerId}/subsidy`, {
        units,
        note: "Subsidy credited by admin dashboard"
      });
      setSubsidyInputs((prev) => ({ ...prev, [farmerId]: "" }));
      await load();
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.msg || "Failed to credit subsidy.");
    } finally {
      setActionLoading((prev) => ({ ...prev, [farmerId]: false }));
    }
  };

  const handleUpdateUsage = async (farmerId) => {
    const units = Number(usageInputs[farmerId]);

    if (!Number.isFinite(units) || units <= 0) {
      alert("Enter a valid meter usage unit amount.");
      return;
    }

    try {
      setActionLoading((prev) => ({ ...prev, [farmerId]: true }));
      await api.post(`/auth/farmers/${farmerId}/usage`, {
        units,
        purpose: "Meter reading update",
        note: "Usage updated by admin after meter check"
      });
      setUsageInputs((prev) => ({ ...prev, [farmerId]: "" }));
      await load();
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.msg || "Failed to update usage.");
    } finally {
      setActionLoading((prev) => ({ ...prev, [farmerId]: false }));
    }
  };

  const filteredRequests = requests.filter((r) => {
    const matchesFilter = filter === "All" || r.status === filter;
    const requestSearch = `${r.farmerName || ""} ${r.area || ""} ${r.requestType || ""}`.toLowerCase();
    return matchesFilter && requestSearch.includes(search.toLowerCase());
  });

  const totalAvailableUnits = farmers.reduce(
    (sum, farmer) => sum + (farmer.electricityAccount?.availableUnits || 0),
    0
  );
  const totalSubsidyUnits = farmers.reduce(
    (sum, farmer) => sum + (farmer.electricityAccount?.totalSubsidyGranted || 0),
    0
  );
  const totalPaidRevenue = farmers.reduce(
    (sum, farmer) => sum + (farmer.electricityAccount?.totalAmountSpent || 0),
    0
  );

  const farmerSearch = search.toLowerCase().trim();
  const prioritizedFarmers = [...farmers]
    .sort((a, b) => {
      const aPaidPriority = requests.some(
        (request) => request.farmer === a._id && request.requestType === "paid_topup"
      )
        ? 1
        : 0;
      const bPaidPriority = requests.some(
        (request) => request.farmer === b._id && request.requestType === "paid_topup"
      )
        ? 1
        : 0;

      if (aPaidPriority !== bPaidPriority) return bPaidPriority - aPaidPriority;
      return new Date(b.createdAt) - new Date(a.createdAt);
    })
    .filter((farmer) => {
      if (!farmerSearch) return true;
      return `${farmer.name || ""} ${farmer.email || ""}`.toLowerCase().includes(farmerSearch);
    });

  const COLORS = ["#f59e0b", "#10b981", "#ef4444"];

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)] bg-slate-50 font-sans min-w-0">
      <aside className="lg:w-64 lg:sticky lg:top-16 lg:h-[calc(100vh-64px)] bg-slate-900 text-slate-300 hidden lg:flex flex-col flex-shrink-0 overflow-y-auto">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold text-white tracking-wide">
            Agri<span className="text-emerald-500">Admin</span>
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === "dashboard" ? "bg-emerald-600/20 text-emerald-400" : "hover:bg-slate-800 text-slate-300"
            }`}
          >
            <LayoutDashboard size={18} />
            <span className="font-medium text-sm">Dashboard</span>
          </button>
          <button
            onClick={() => setActiveTab("farmers")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === "farmers" ? "bg-emerald-600/20 text-emerald-400" : "hover:bg-slate-800 text-slate-300"
            }`}
          >
            <Users size={18} />
            <span className="font-medium text-sm">Farmers</span>
          </button>
          <div className="flex items-center gap-3 px-4 py-3 hover:bg-slate-800 rounded-lg transition-colors cursor-not-allowed opacity-50">
            <FileText size={18} />
            <span className="font-medium text-sm">Reports</span>
          </div>
        </nav>
      </aside>

      <main className="flex-1 min-w-0 p-4 sm:p-8">
        <div className="max-w-7xl min-w-0 mx-auto">
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {activeTab === "dashboard" ? "Dashboard" : "Farmer Accounts"}
              </h2>
              <p className="text-slate-500 text-sm">
                {activeTab === "dashboard"
                  ? "Manage extra electricity requests and approvals."
                  : "Credit subsidy units and review each farmer's electricity wallet."}
              </p>
            </div>
          </header>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
          ) : err ? (
            <div className="bg-red-50 border border-red-100 text-red-700 rounded-xl p-4">{err}</div>
          ) : (
            <>
              {activeTab === "dashboard" ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-500 uppercase font-semibold">Total Requests</p>
                        <h3 className="text-2xl font-bold text-slate-800 mt-1">{requests.length}</h3>
                      </div>
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                        <Activity size={20} />
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-500 uppercase font-semibold">Subsidy Granted</p>
                        <h3 className="text-2xl font-bold text-emerald-600 mt-1">{totalSubsidyUnits} units</h3>
                      </div>
                      <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                        <Zap size={20} />
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-500 uppercase font-semibold">Live Farmer Balance</p>
                        <h3 className="text-2xl font-bold text-amber-600 mt-1">{totalAvailableUnits} units</h3>
                      </div>
                      <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                        <Clock size={20} />
                      </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
                      <div>
                        <p className="text-xs text-slate-500 uppercase font-semibold">Paid Collections</p>
                        <h3 className="text-2xl font-bold text-slate-800 mt-1">Rs. {totalPaidRevenue}</h3>
                      </div>
                      <div className="p-3 bg-slate-100 text-slate-700 rounded-lg">
                        <CheckCircle size={20} />
                      </div>
                    </div>
                  </div>

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
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: "#64748b", fontSize: 11 }} />
                            <Tooltip contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }} />
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
                            <Pie data={pieData} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value" stroke="none">
                              {pieData.map((entry, index) => (
                                <Cell key={entry.name} fill={COLORS[index]} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "12px" }} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

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

                    <div className="overflow-x-auto max-h-[36rem] overflow-y-auto">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold tracking-wider">
                          <tr>
                            <th className="px-6 py-4">Farmer</th>
                            <th className="px-6 py-4">Area & Units</th>
                            <th className="px-6 py-4">Request Type</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredRequests.length > 0 ? (
                            filteredRequests.map((r) => (
                              <tr key={r._id} className="hover:bg-slate-50/80 transition-colors">
                                {/*
                                  Only pending requests are actionable. Once approved, rejected, or deleted,
                                  the admin can see the final state but cannot reverse it from this table.
                                */}
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs uppercase">
                                      {r.farmerName?.charAt(0) || "U"}
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
                                    {r.powerRequired} units
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">
                                  {r.requestType === "paid_topup" ? "Paid Top-up" : "Standard Review"}
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">
                                  {r.requestType === "paid_topup" ? `Rs. ${r.estimatedAmount}` : "No charge"}
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex flex-col gap-1">
                                    <span
                                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                                        r.status === "Approved"
                                          ? "bg-emerald-100 text-emerald-700"
                                          : r.status === "Rejected"
                                            ? "bg-red-100 text-red-700"
                                            : "bg-amber-100 text-amber-700"
                                      }`}
                                    >
                                      {r.status}
                                    </span>
                                    <span className="text-xs text-slate-500">{r.paymentStatus}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  {(() => {
                                    const isLocked = r.status !== "Pending";

                                    return (
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => handleAction(r._id, "approve")}
                                      disabled={isLocked}
                                      className={`px-3 py-1.5 text-xs font-medium rounded-md shadow-sm transition-colors flex items-center gap-1 ${
                                        r.status === "Approved"
                                          ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                                          : isLocked
                                            ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none"
                                            : "bg-emerald-600 hover:bg-emerald-700 text-white"
                                      }`}
                                      title={isLocked ? "This request is locked" : "Approve Request"}
                                    >
                                      <CheckCircle size={12} /> {r.status === "Approved" ? "Approved" : "Approve"}
                                    </button>
                                    <button
                                      onClick={() => handleAction(r._id, "reject")}
                                      disabled={isLocked}
                                      className={`px-3 py-1.5 text-xs font-medium rounded-md shadow-sm transition-colors flex items-center gap-1 ${
                                        r.status === "Rejected"
                                          ? "bg-red-100 text-red-700 border border-red-200"
                                          : isLocked
                                            ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none"
                                            : "bg-amber-500 hover:bg-amber-600 text-white"
                                      }`}
                                      title={isLocked ? "This request is locked" : "Reject Request"}
                                    >
                                      <XCircle size={12} /> {r.status === "Rejected" ? "Rejected" : "Reject"}
                                    </button>
                                    <button
                                      onClick={() => handleAction(r._id, "delete")}
                                      disabled={isLocked}
                                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${
                                        isLocked
                                          ? "border border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"
                                          : "border border-slate-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 text-slate-600"
                                      }`}
                                      title={isLocked ? "This request is locked" : "Delete Request"}
                                    >
                                      <Trash2 size={12} /> Delete
                                    </button>
                                  </div>
                                    );
                                  })()}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
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
              ) : (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <p className="text-sm text-slate-600">
                      Total farmers: <span className="font-semibold text-slate-900">{farmers.length}</span>
                    </p>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search farmer..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none w-full md:w-72"
                      />
                    </div>
                  </div>

                  <div className="max-h-[36rem] overflow-y-auto min-w-0">
                    <div className="w-full max-w-full overflow-x-auto">
                      <table className="w-max min-w-full text-left border-collapse">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold tracking-wider sticky top-0 z-10">
                          <tr>
                            <th className="px-6 py-4">Farmer</th>
                            <th className="px-6 py-4">Free Units</th>
                            <th className="px-6 py-4">Paid Units</th>
                            <th className="px-6 py-4">Available</th>
                            <th className="px-6 py-4">Spent</th>
                            <th className="px-6 py-4">Subsidy</th>
                            <th className="px-6 py-4">Meter Usage</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {prioritizedFarmers.length > 0 ? (
                            prioritizedFarmers.map((farmer) => (
                              <tr key={farmer._id} className="hover:bg-slate-50/80 transition-colors align-top bg-white">
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3 min-w-[260px]">
                                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs uppercase">
                                      {farmer.name?.charAt(0) || "F"}
                                    </div>
                                    <div className="min-w-0">
                                      <div className="font-medium text-slate-900 text-sm">{farmer.name}</div>
                                      <div className="text-sm text-slate-600 break-all">{farmer.email}</div>
                                      <div className="text-xs text-slate-400 mt-1">
                                        Joined {new Date(farmer.createdAt).toLocaleDateString()}
                                      </div>
                                      {requests.some(
                                        (request) =>
                                          request.farmer === farmer._id && request.requestType === "paid_topup"
                                      ) && (
                                        <div className="mt-2 inline-flex px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold">
                                          Paid request priority
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-sm font-semibold text-emerald-700 whitespace-nowrap">
                                  {farmer.electricityAccount?.subsidizedUnits || 0} units
                                </td>
                                <td className="px-6 py-4 text-sm font-semibold text-amber-700 whitespace-nowrap">
                                  {farmer.electricityAccount?.purchasedUnits || 0} units
                                </td>
                                <td className="px-6 py-4 text-sm font-semibold text-slate-900 whitespace-nowrap">
                                  {farmer.electricityAccount?.availableUnits || 0} units
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-700 whitespace-nowrap">
                                  Rs. {farmer.electricityAccount?.totalAmountSpent || 0}
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-2 min-w-[260px]">
                                    <input
                                      type="number"
                                      min="1"
                                      placeholder="Units"
                                      value={subsidyInputs[farmer._id] || ""}
                                      onChange={(e) => handleSubsidyInputChange(farmer._id, e.target.value)}
                                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none w-24"
                                    />
                                    <button
                                      onClick={() => handleGrantSubsidy(farmer._id)}
                                      disabled={actionLoading[farmer._id]}
                                      className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 whitespace-nowrap"
                                    >
                                      {actionLoading[farmer._id] ? "Crediting..." : "Credit"}
                                    </button>
                                    <button
                                      onClick={() => handleGrantSubsidy(farmer._id, 50)}
                                      disabled={actionLoading[farmer._id]}
                                      className="px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 whitespace-nowrap"
                                    >
                                      +50 units
                                    </button>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-2 min-w-[250px]">
                                    <input
                                      type="number"
                                      min="1"
                                      placeholder="Units"
                                      value={usageInputs[farmer._id] || ""}
                                      onChange={(e) => handleUsageInputChange(farmer._id, e.target.value)}
                                      className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none w-24"
                                    />
                                    <button
                                      onClick={() => handleUpdateUsage(farmer._id)}
                                      disabled={actionLoading[farmer._id]}
                                      className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 whitespace-nowrap"
                                    >
                                      {actionLoading[farmer._id] ? "Updating..." : "Update Usage"}
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan="7" className="px-6 py-12 text-center text-slate-500 bg-white">
                                <div className="flex flex-col items-center justify-center">
                                  <Users size={32} className="text-slate-300 mb-3" />
                                  <p>{farmerSearch ? "No farmers found." : "No farmers registered yet."}</p>
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

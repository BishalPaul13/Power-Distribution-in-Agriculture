import React, { useEffect, useState } from "react";
import { api } from "../api";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import { Clock, CheckCircle2, XCircle, AlertCircle, FileText, Calendar, Zap, ArrowRight } from "lucide-react";

export default function StatusPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await api.get("/requests/me");
        setRequests(res.data || []);
      } catch (e) {
        console.error(e);
        setErr(e?.response?.data?.msg || "Failed to load your requests");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Rejected': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved': return <CheckCircle2 size={16} />;
      case 'Rejected': return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-slate-900">Request Status</h1>
            <p className="text-slate-600 mt-1">Track and manage your power allocation requests.</p>
          </div>
          <Link to="/request">
            <Button>
              New Request <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-500 font-medium">Loading requests...</p>
          </div>
        ) : err ? (
          <div className="p-6 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-4 text-red-700">
            <AlertCircle size={24} />
            <span className="font-medium">{err}</span>
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FileText size={32} className="text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No Requests Found</h3>
            <p className="text-slate-500 mb-8 max-w-sm mx-auto">
              You haven't submitted any power allocation requests yet. Create one to get started.
            </p>
            <Link to="/request">
              <Button>Create Your First Request</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {requests.map((r) => (
              <div key={r._id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${getStatusColor(r.status)}`}>
                    {getStatusIcon(r.status)}
                    {r.status}
                  </div>
                  <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(r.createdAt || r.requestDate).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-1">{r.area}</h3>
                <div className="flex items-center gap-1 text-slate-500 text-sm mb-4">
                  <Zap size={14} className="text-amber-500" />
                  <span className="font-medium text-slate-700">{r.powerRequired} kW</span> Requested
                </div>

                <div className="bg-slate-50 rounded-xl p-4 mb-4 flex-grow">
                  <p className="text-sm text-slate-600 line-clamp-3">
                    {r.purpose || "No specific purpose provided."}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-xs text-slate-400">ID: {r._id.slice(-6).toUpperCase()}</span>
                  <button className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

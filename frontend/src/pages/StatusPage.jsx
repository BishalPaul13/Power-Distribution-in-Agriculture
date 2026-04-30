import React, { useEffect, useState } from "react";
import { api } from "../api";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Calendar,
  Zap,
  ArrowRight
} from "lucide-react";

export default function StatusPage() {
  const [requests, setRequests] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const loadData = async () => {
    setLoading(true);
    setErr("");

    try {
      const [requestsRes, profileRes] = await Promise.all([
        api.get("/requests/me"),
        api.get("/auth/me")
      ]);

      setRequests(requestsRes.data || []);
      setProfile(profileRes.data || null);
    } catch (e) {
      console.error(e);
      setErr(e?.response?.data?.msg || "Failed to load your electricity account");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Rejected":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-amber-100 text-amber-700 border-amber-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved":
        return <CheckCircle2 size={16} />;
      case "Rejected":
        return <XCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const account = profile?.electricityAccount || {
    subsidizedUnits: 0,
    purchasedUnits: 0,
    totalUnitsConsumed: 0,
    totalAmountSpent: 0,
    availableUnits: 0,
    totalSubsidyGranted: 0
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-slate-900">Electricity Account</h1>
            <p className="text-slate-600 mt-1">
              View subsidy balance, extra paid electricity, and request status.
            </p>
          </div>
          <Link to="/request">
            <Button>
              Ask for Extra Electricity <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-500 font-medium">Loading electricity account...</p>
          </div>
        ) : err ? (
          <div className="p-6 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-4 text-red-700">
            <AlertCircle size={24} />
            <span className="font-medium">{err}</span>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <p className="text-sm font-medium text-slate-500">Available Units</p>
                <div className="mt-3 flex items-end gap-2">
                  <span className="text-3xl font-bold text-slate-900">{account.availableUnits}</span>
                  <span className="text-sm text-slate-500">units</span>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <p className="text-sm font-medium text-slate-500">Subsidy Units</p>
                <div className="mt-3 flex items-end gap-2">
                  <span className="text-3xl font-bold text-emerald-700">{account.subsidizedUnits}</span>
                  <span className="text-sm text-slate-500">units</span>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <p className="text-sm font-medium text-slate-500">Paid Units</p>
                <div className="mt-3 flex items-end gap-2">
                  <span className="text-3xl font-bold text-amber-600">{account.purchasedUnits}</span>
                  <span className="text-sm text-slate-500">units</span>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <p className="text-sm font-medium text-slate-500">Amount Spent</p>
                <div className="mt-3 flex items-end gap-2">
                  <span className="text-3xl font-bold text-slate-900">Rs. {account.totalAmountSpent}</span>
                </div>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
                <div className="flex items-center justify-between mb-6 gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">Request Tracker</h2>
                    <p className="text-slate-500 mt-1">
                      Follow the provider approval flow for your extra electricity requests.
                    </p>
                  </div>
                </div>

                {requests.length === 0 ? (
                  <div className="bg-slate-50 rounded-2xl p-12 text-center border border-slate-100">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-100">
                      <FileText size={32} className="text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No Requests Found</h3>
                    <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                      Submit a paid request when you need more electricity than your subsidy balance.
                    </p>
                    <Link to="/request">
                      <Button>Create Request</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2">
                    {requests.map((r) => (
                      <div key={r._id} className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex flex-col h-full">
                        <div className="flex items-start justify-between mb-4 gap-3">
                          <div className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${getStatusColor(r.status)}`}>
                            {getStatusIcon(r.status)}
                            {r.status}
                          </div>
                          <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                            <Calendar size={12} />
                            {new Date(r.createdAt || r.requestDate).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <h3 className="text-lg font-bold text-slate-900">{r.area}</h3>
                          <span className="px-2.5 py-1 text-xs rounded-full bg-white border border-slate-200 text-slate-600">
                            {r.requestType === "paid_topup" ? "Paid" : "Standard"}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                          <div className="bg-white rounded-xl p-3 border border-slate-100">
                            <div className="text-xs text-slate-500">Requested</div>
                            <div className="mt-1 flex items-center gap-1 text-slate-800 font-semibold">
                              <Zap size={14} className="text-amber-500" />
                              {r.powerRequired} units
                            </div>
                          </div>
                          <div className="bg-white rounded-xl p-3 border border-slate-100">
                            <div className="text-xs text-slate-500">Payable</div>
                            <div className="mt-1 text-slate-800 font-semibold">
                              {r.requestType === "paid_topup" ? `Rs. ${r.estimatedAmount}` : "No charge"}
                            </div>
                          </div>
                        </div>

                        <div className="bg-white rounded-xl p-4 border border-slate-100 mb-4 flex-grow">
                          <p className="text-sm text-slate-600">
                            {r.purpose || "No specific purpose provided."}
                          </p>
                        </div>

                        <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-sm">
                          <span className="text-slate-400">ID: {r._id.slice(-6).toUpperCase()}</span>
                          <span className="font-semibold text-slate-700">{r.paymentStatus}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="bg-emerald-900 text-white rounded-2xl p-6">
                  <h3 className="text-lg font-bold mb-5">Account Summary</h3>
                  <div className="space-y-4 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-100">Total Subsidy Granted</span>
                      <span className="font-semibold">{account.totalSubsidyGranted || 0} units</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-100">Units Consumed</span>
                      <span className="font-semibold">{account.totalUnitsConsumed || 0} units</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-100">Paid Units Purchased</span>
                      <span className="font-semibold">{account.totalPaidUnitsPurchased || 0} units</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-100">Last Subsidy Credit</span>
                      <span className="font-semibold">
                        {account.lastSubsidyAt ? new Date(account.lastSubsidyAt).toLocaleDateString() : "Not yet credited"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                  <h3 className="font-bold text-slate-800 mb-4">Recent Account Activity</h3>
                  {profile?.electricityTransactions?.length ? (
                    <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                      {profile.electricityTransactions.map((entry) => (
                        <div key={entry._id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-sm font-semibold text-slate-800 capitalize">
                              {entry.type.replace("_", " ")}
                            </span>
                            <span className="text-xs text-slate-400">
                              {new Date(entry.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="mt-2 text-sm text-slate-600">
                            {entry.units} units
                            {entry.amount ? ` | Rs. ${entry.amount}` : ""}
                          </div>
                          <div className="mt-1 text-sm text-slate-500">
                            {entry.purpose || entry.note || "Electricity account activity"}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">No activity yet.</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

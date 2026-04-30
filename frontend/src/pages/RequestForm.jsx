import React, { useContext, useEffect, useState } from "react";
import { api } from "../api";
import { AuthContext } from "../context/AuthContext";
import Button from "../components/Button";
import { Zap, MapPin, FileText, AlertCircle, CheckCircle2, ChevronRight } from "lucide-react";

const PAID_TOP_UP_RATE = 6;

export default function RequestForm() {
  const { auth } = useContext(AuthContext);
  const [form, setForm] = useState({
    area: "",
    powerRequired: "",
    purpose: "",
    requestType: "paid_topup"
  });
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/auth/me");
        setProfile(data || null);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setErr("");
    setLoading(true);

    try {
      await api.post("/requests", {
        area: form.area,
        powerRequired: Number(form.powerRequired),
        purpose: form.purpose,
        requestType: form.requestType
      });
      setMsg(
        form.requestType === "paid_topup"
          ? "Paid electricity request submitted successfully!"
          : "Electricity review request submitted successfully!"
      );
      setForm({ area: "", powerRequired: "", purpose: "", requestType: "paid_topup" });
    } catch (e) {
      setErr(e?.response?.data?.msg || "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  const requestedUnits = Number(form.powerRequired || 0);
  const estimatedAmount = requestedUnits > 0 ? requestedUnits * PAID_TOP_UP_RATE : 0;
  const availableUnits = profile?.electricityAccount?.availableUnits || 0;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-slate-900">Request Extra Electricity</h1>
          <p className="text-slate-600 mt-2">
            Use your subsidy balance first, then request additional units when you need paid electricity support.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100 gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Zap className="text-emerald-600 w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">New Electricity Request</h2>
                    <p className="text-sm text-slate-500">Applicant: {auth.name}</p>
                  </div>
                </div>
                <div className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium text-slate-700">
                  Wallet balance: {availableUnits} units
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Request Type</label>
                  <select
                    name="requestType"
                    value={form.requestType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  >
                    <option value="paid_topup">Paid top-up request</option>
                    <option value="standard">Standard review request</option>
                  </select>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Area / Locality</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        name="area"
                        value={form.area}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Green Valley Village"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Units Required</label>
                    <div className="relative">
                      <Zap className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        name="powerRequired"
                        value={form.powerRequired}
                        onChange={handleChange}
                        required
                        type="number"
                        min="1"
                        placeholder="e.g. 60"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Purpose of Usage</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-4 text-slate-400 w-5 h-5" />
                    <textarea
                      name="purpose"
                      value={form.purpose}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Describe why you need the electricity units (e.g. Irrigation for 5 acres of wheat)"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none"
                    />
                  </div>
                </div>

                {form.requestType === "paid_topup" && (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-amber-800">Paid electricity estimate</p>
                        <p className="text-sm text-amber-700 mt-1">
                          Additional units are billed at Rs. {PAID_TOP_UP_RATE} per unit after approval.
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs uppercase tracking-wide text-amber-700">Estimated amount</p>
                        <p className="text-2xl font-bold text-amber-900">Rs. {estimatedAmount}</p>
                      </div>
                    </div>
                  </div>
                )}

                {msg && (
                  <div className="p-4 bg-emerald-50 text-emerald-700 rounded-xl flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5" />
                    {msg}
                  </div>
                )}

                {err && (
                  <div className="p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3">
                    <AlertCircle className="w-5 h-5" />
                    {err}
                  </div>
                )}

                <div className="pt-4">
                  <Button type="submit" disabled={loading} size="lg" className="w-full md:w-auto">
                    {loading ? "Submitting Request..." : "Submit Request"}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-emerald-900 text-white rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 rounded-full blur-3xl -mr-10 -mt-10 opacity-50"></div>
              <h3 className="text-lg font-bold mb-4 relative z-10">Real-world flow</h3>
              <ul className="space-y-3 relative z-10 text-emerald-100 text-sm">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5"></div>
                  <span>Government subsidy credits free electricity units into the farmer account.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5"></div>
                  <span>The farmer consumes units for irrigation or pump usage from the status page simulator.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5"></div>
                  <span>Once free units finish, this form raises a paid top-up request for provider approval.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-2">Need Assistance?</h3>
              <p className="text-slate-500 text-sm mb-4">
                Standard review requests are useful for special cases, while paid top-up is the quickest path after subsidy exhaustion.
              </p>
              <a href="/status" className="text-emerald-600 font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                View Electricity Account <ChevronRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

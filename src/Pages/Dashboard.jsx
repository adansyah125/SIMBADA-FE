import { Link } from 'react-router-dom'
import { useState } from 'react';
import { useEffect } from 'react';
import {getDashboard} from '../services/DashboardService';
import { Banknote, Package, AlertTriangle, TrendingUp, MapPin } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const CHART_COLORS = ["#16a34a", "#2563eb", "#ca8a04"];

function Dashboard() {
const [dashboard, setDashboard] = useState(null);
const barData = dashboard?.bar_chart ?? {};
const chartData = [
    { name: "Tanah", value: barData.tanah || 0 },
    { name: "Gedung", value: barData.gedung || 0 },
    { name: "Mesin", value: barData.mesin || 0 },
];

const totalAsetLokasi = dashboard ? Object.values(dashboard.sebaran_lokasi) 
    .flat() 
    .reduce((sum, item) => sum + item.total, 0) : 0;

useEffect(() => {getDashboard().then(setDashboard);}, []);

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white px-3 py-2 shadow-lg border border-gray-100 rounded-lg text-xs font-bold">
                <p className="text-gray-500 mb-1">{label}</p>
                <p className="text-gray-900">{payload[0].value.toLocaleString("id-ID")} Unit</p>
            </div>
        );
    }
    return null;
};

  return (
   <>
    <div className="w-full text-gray-800 antialiased max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
    {/* --- 1. HEADER COMPACT --- */}
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 mb-8 border-b border-gray-100 pb-5">
        <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">Dashboard Aset</h1>
            <p className="text-sm font-medium text-gray-500 mt-1">Ringkasan inventaris Tahun Anggaran 2025</p>
        </div>
        <div className="flex items-center gap-2.5 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100 self-end sm:self-auto">
            <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold text-gray-500">Terakhir update: 2 menit lalu</span>
        </div>
    </div>

    {/* --- 2. STATS RIBBON --- */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {/* Stat 1: Valuasi */}
        <div className="group bg-white border border-gray-200 rounded-xl shadow-xs p-5 flex items-start gap-4 hover:shadow-md hover:border-blue-300 transition-all duration-300 cursor-pointer">
            <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                <Banknote className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Total Valuasi</span>
                <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-sm font-bold text-gray-400">Rp</span>
                    <span className="text-2xl font-extrabold text-gray-900 tabular-nums tracking-tight">
                        {dashboard ? dashboard.total_valuasi.toLocaleString("id-ID") : "0"}
                    </span>
                </div>
            </div>
        </div>

        {/* Stat 2: Fisik */}
        <div className="group bg-white border border-gray-200 rounded-xl shadow-xs p-5 flex items-start gap-4 hover:shadow-md hover:border-indigo-300 transition-all duration-300 cursor-pointer">
            <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                <Package className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Fisik</span>
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md uppercase tracking-wider group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all">
                        Aktif
                    </span>
                </div>
                <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-indigo-600 tabular-nums tracking-tight">
                        {dashboard?.total_fisik ?? 0}
                    </span>
                    <span className="text-sm font-semibold text-gray-500">Unit</span>
                </div>
            </div>
        </div>

        {/* Stat 3: Alert Rusak Berat */}
        <div className="group bg-white border border-gray-200 rounded-xl shadow-xs p-5 flex items-start gap-4 hover:shadow-md hover:border-rose-300 transition-all duration-300 cursor-pointer">
            <div className="h-12 w-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover:bg-rose-600 group-hover:text-white group-hover:scale-110 transition-all duration-300">
                <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-rose-500 uppercase tracking-wider">Rusak Berat</span>
                    <Link to={"/kir"} className="text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors inline-flex items-center gap-1 group/link">
                        Detail <span className="group-hover/link:translate-x-0.5 transition-transform">&rarr;</span>
                    </Link>
                </div>
                <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-rose-600 tabular-nums tracking-tight">
                        {dashboard?.rusak_berat ?? 0}
                    </span>
                    <span className="text-sm font-semibold text-rose-400">Unit</span>
                </div>
            </div>
        </div>
    </div>

    {/* --- 3. MAIN CONTENT GRID --- */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">

        {/* CARD 1: Analisis Kondisi */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-indigo-600" /> Analisis Kondisi
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">Persentase kelayakan kondisi aset saat ini</p>
                </div>
            </div>

            <div className="flex-1" style={{ minHeight: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                        <XAxis dataKey="name" tick={{ fontSize: 13, fontWeight: 600, fill: "#64748b" }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />
                        <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={80}>
                            {chartData.map((_, index) => (
                                <Cell key={index} fill={CHART_COLORS[index]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* CARD 2: Sebaran Lokasi */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-5">
                <MapPin className="h-5 w-5 text-emerald-600" />
                <div>
                    <h3 className="text-lg font-bold text-gray-900 tracking-tight">Sebaran Lokasi</h3>
                    <p className="text-xs text-gray-400 mt-0.5">Distribusi total aset berdasarkan lokasi</p>
                </div>
            </div>

            <div className="space-y-4 overflow-y-auto flex-1 pr-1 custom-scrollbar">
                {dashboard &&
                    Object.entries(dashboard.sebaran_lokasi).map(([lokasi, items], idx) => {
                        const total = items.reduce((s, i) => s + i.total, 0);
                        const percent = totalAsetLokasi ? Math.round((total / totalAsetLokasi) * 100) : 0;

                        return (
                            <div key={lokasi} className="group cursor-pointer" style={{ animationDelay: `${idx * 80}ms` }}>
                                <div className="flex justify-between text-xs sm:text-sm mb-1.5 items-center">
                                    <span className="text-gray-700 font-semibold group-hover:text-emerald-600 transition-colors flex items-center gap-1.5">
                                        <span className="h-2 w-2 rounded-full bg-emerald-500 group-hover:animate-pulse" />
                                        {lokasi}
                                    </span>
                                    <span className="text-gray-500 font-bold bg-gray-50 border border-gray-100 px-2 py-0.5 rounded text-xs tabular-nums">
                                        {total} Unit
                                    </span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden border border-gray-50 relative">
                                    <div
                                        className="h-full rounded-full transition-all duration-1000 ease-out relative"
                                        style={{
                                            width: `${percent}%`,
                                            background: `linear-gradient(90deg, #10b981, #059669)`,
                                            animation: `slideIn 0.8s ease-out ${idx * 0.1}s both`,
                                        }}
                                    />
                                </div>
                                <div className="flex justify-end mt-0.5">
                                    <span className="text-[10px] text-gray-400 font-medium">{percent}%</span>
                                </div>
                            </div>
                        );
                    })
                }
            </div>
        </div>

    </div>
</div>

<style>{`
@keyframes slideIn {
    from { transform: scaleX(0); }
    to { transform: scaleX(1); }
}
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 999px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
`}</style>
   </>
  )
}

export default Dashboard


import { Link } from 'react-router-dom'
import { useState } from 'react';
import { useEffect } from 'react';
import {getDashboard} from '../services/DashboardService';
function Dashboard() {
const [dashboard, setDashboard] = useState(null);
const barData = dashboard?.bar_chart ?? {};
const barList = [
    { key: "tanah", label: "Tanah", color: "bg-green-600" },
    { key: "gedung", label: "Gedung", color: "bg-blue-600" },
    { key: "mesin", label: "Mesin", color: "bg-yellow-500" },
];

const maxValue = Math.max(...Object.values(barData),1);
const totalAsetLokasi = dashboard ? Object.values(dashboard.sebaran_lokasi) 
    .flat() 
    .reduce((sum, item) => sum + item.total, 0) : 0;

useEffect(() => {getDashboard().then(setDashboard);}, []);
  return (
   <>
    <div className="w-full text-gray-800">
            {/* --- 1. HEADER COMPACT --- */}
            <div className="flex justify-between items-end mb-6 border-b border-gray-200 pb-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard Aset</h1>
                    <p className="text-sm text-gray-500">Ringkasan inventaris Tahun Anggaran 2025</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-gray-400">Terakhir update: 2 Menit lalu</span>
                    <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                </div>
            </div>
            {/* --- 2. STATS RIBBON (Lebih Rapi & Menyatu) --- */}
            <div className="bg-gray-50 rounded-lg border border-gray-100 p-4 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                    
                    {/* Stat 1 */}
                    <div className="px-4 flex flex-col justify-center">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Valuasi</span>
                        <div className="mt-1 flex items-baseline gap-1">
                            <span className="text-sm font-medium text-gray-500">Rp</span>
                            <span className={`text-2xl font-bold text-blue-500 tabular-nums tracking-tight`}>{dashboard ? dashboard.total_valuasi.toLocaleString("id-ID") : "-"}</span>
                        </div>
                    </div>
                    {/* Stat 2 */}
                    <div className="px-4 flex flex-col justify-center">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Fisik</span>
                        <div className="mt-1 flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-gray-800 tabular-nums"> {dashboard?.total_fisik ?? 0} Unit</span>
                            <span className="text-sm font-medium text-gray-500 bg-white border px-2 py-0.5 rounded-full">Unit Aset</span>
                        </div>
                    </div>
                    {/* Stat 3 (Alert) */}
                    <div className="px-4 flex flex-col justify-center">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-red-500 uppercase tracking-wider">Rusak Berat</span>
                            <Link to={"/kir"} className="text-xs text-red-600 hover:underline">Lihat Detail &rarr;</Link>
                        </div>
                        <div className="mt-1 flex items-baseline gap-2">
                            <span className="text-3xl font-extrabold text-red-600 tabular-nums"> {dashboard?.rusak_berat ?? 0} </span>
                            <span className="text-xs text-red-400 font-medium">Butuh Penghapusan</span>
                        </div>
                    </div>
                </div>
            </div>
            {/* --- 3. MAIN CONTENT GRID (2 Kolom: 70% Chart, 30% List) --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-gray-900">Analisis Kondisi</h3>
                       
                    </div>
                    {/* Chart Container */}
                    <div className="relative h-[220px] w-full pt-6">
                        {/* Grid lines background */}
                       <div className="absolute inset-0 grid grid-cols-3 gap-8 items-end px-4">
                        {barList.map((item) => {
                            const value = barData[item.key] || 0;
                            const percent = Math.round((value / maxValue) * 100);

                            return (
                            <div key={item.key} className="flex flex-col items-center h-full justify-end group cursor-pointer">
                                {/* Value Indicator */}
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-1 text-xs font-bold text-gray-600 bg-white px-2 py-0.5 shadow-sm border rounded"> {value} Unit</div>
                                {/* BAR */}
                                <div className={`w-full max-w-[80px] rounded-t-sm transition-all duration-500 relative ${item.color}`} style={{ height: `${percent}%` }}>
                                <div className="absolute top-2 w-full text-center text-[10px] font-bold text-white/90">{percent}%</div>
                                </div>
                                {/* LABEL */}
                                <div className="mt-3 text-center">
                                <p className="text-sm font-semibold text-gray-700 leading-none">{item.label}</p>
                                </div>
                            </div>
                            );
                        })}
                        </div>
                    </div>
                </div>
                {/* SEbaran lokasi */}
                <div className="space-y-5">
                    <h1 className='font-semibold'>Sebaran Lokasi</h1>
                {dashboard &&
                    Object.entries(dashboard.sebaran_lokasi).map(
                    ([lokasi, items]) => {
                        const total = items.reduce((s, i) => s + i.total, 0);
                        const percent = totalAsetLokasi
                        ? Math.round((total / totalAsetLokasi) * 100)
                        : 0;

                        return (
                        <div key={lokasi} className="group">
                            <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600 font-medium"> {lokasi}</span>
                            <span className="text-gray-400 tabular-nums">{total} Unit</span>
                            </div>
                            {/* Progress Bar */}
                            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                            <div className="h-1.5 rounded-full bg-blue-500 transition-all duration-500" style={{ width: `${percent}%` }}/>
                            </div>
                        </div>
                        );
                    }
                    )}
                </div>

            </div>
        </div>
   </>
  )
}

export default Dashboard


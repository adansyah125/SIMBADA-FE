import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Ruangan() {
  const [activeLokasi, setActiveLokasi] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [dataLokasi, setDataLokasi] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/kir/lokasi`)
      .then(res => {
        setDataLokasi(res.data);
        if (res.data.length > 0) {
          setActiveLokasi(res.data[0].lokasi);
        }
      });
  }, []);

  const currentLokasi = dataLokasi.find(l => l.lokasi === activeLokasi);

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8 font-sans">
  <div className="max-w-6xl mx-auto">
    {/* TOMBOL KEMBALI */}
<div className="mb-6">
  <Link 
    to="/kir"
    className="group flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors font-semibold text-sm"
  >
    <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center group-hover:border-indigo-100 group-hover:bg-indigo-50 transition-all shadow-sm">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
    </div>
    Kembali
  </Link>
</div>
    
    {/* HEADER - Dibuat lebih modern dengan icon background */}
    <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          📍 Lokasi Ruangan
        </h1>
        <p className="text-gray-500 mt-1 font-medium text-lg">
          Manajemen inventaris berdasarkan ruangan
        </p>
      </div>
      <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-gray-100">
        <span className="text-xs font-bold text-gray-400 uppercase block">Total Lokasi</span>
        <span className="text-xl font-bold text-indigo-600">{dataLokasi.length} Titik</span>
      </div>
    </div>

    {/* TAB LOKASI - Dibuat lebih "Pill" dan scrollable tanpa bar */}
    <div className="flex gap-3 mb-8 overflow-x-auto pb-4 scrollbar-hide select-none">
      {dataLokasi.map((l) => (
        <button
          key={l.lokasi}
          onClick={() => {
            setActiveLokasi(l.lokasi);
            setExpanded(false);
          }}
          className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-300 transform active:scale-95 shadow-sm ${
            activeLokasi === l.lokasi
              ? "bg-indigo-600 text-white shadow-indigo-200 ring-4 ring-indigo-50"
              : "bg-white border border-gray-200 text-gray-600 hover:border-indigo-300 hover:text-indigo-500"
          }`}
        >
          {l.lokasi}
        </button>
      ))}
    </div>

    {/* LIST BARANG - Dibuat seperti "Accordion Card" yang elegan */}
    {currentLokasi && (
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden transition-all duration-500">
        <div
          onClick={() => setExpanded(!expanded)}
          className={`p-6 flex justify-between items-center cursor-pointer transition-all ${
            expanded ? "bg-indigo-50/30" : "hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h3 className="font-black text-xl text-gray-800 tracking-tight">
                {currentLokasi.lokasi}
              </h3>
              <p className="text-sm text-gray-500 font-medium italic">
                {currentLokasi.items.length} Aset Terdaftar
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <span className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </div>
        </div>

        {expanded && (
          <div className="p-0 border-t border-gray-50 animate-in slide-in-from-top-4 duration-300">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 text-gray-400 uppercase text-[10px] font-black tracking-[0.1em]">
                    <th className="px-8 py-4">Kode Barang</th>
                    <th className="px-6 py-4">Nama Aset</th>
                    <th className="px-6 py-4 text-center">Status Kondisi</th>
                    <th className="px-6 py-4 text-center">QR Code</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {currentLokasi.items.map((item) => (
                    <tr key={item.id} className="hover:bg-indigo-50/20 transition-colors group">
                      <td className="px-8 py-4">
                        <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md group-hover:bg-indigo-100 group-hover:text-indigo-700 transition-colors">
                          {item.kode_barang}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-700">
                        {item.nama_barang}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wide ${
                          item.kondisi === "baik"
                            ? "bg-green-100 text-green-700 ring-1 ring-green-200"
                            : "bg-red-100 text-red-700 ring-1 ring-red-200"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${item.kondisi === "baik" ? "bg-green-500" : "bg-red-500"}`}></span>
                          {item.kondisi}
                        </span>
                      </td>
                      <td className="border-r border-gray-100 px-3 py-3 text-center">
                                        <div className="inline-flex flex-col items-center">
                                                  {item.gambar_qr ? (
                                                <Link to={`${import.meta.env.VITE_API_URL_IMAGE}/storage/${item.gambar_qr}`} target="_blank" >
                                                <img src={`${import.meta.env.VITE_API_URL_IMAGE}/storage/${item.gambar_qr}`} alt="QR Code" className="w-12 h-12" />
                                                </Link>
                                            ) : (
                                                <div className="w-12 h-12 border border-dashed border-gray-300 rounded-md flex items-center justify-center text-[9px] text-gray-400">
                                                    QR
                                                </div>
                                            )}
                                            <span className="mt-1 text-[10px] text-gray-400">Scan Label</span>
                                        </div>
                                    </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {currentLokasi.items.length === 0 && (
              <div className="py-20 text-center flex flex-col items-center gap-3">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">📦</div>
                <p className="text-gray-400 font-medium">Tidak ada aset di lokasi ini</p>
              </div>
            )}
          </div>
        )}
      </div>
    )}
  </div>
</div>
  );
}

export default Ruangan;

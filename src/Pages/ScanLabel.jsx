import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {formatRupiah, formatTanggal} from "../utils/Format";
import { Package, QrCode, MapPin, Calendar, CheckCircle, AlertTriangle, HelpCircle, Hash, Coins, ImageIcon, Loader2 } from "lucide-react";

function ScanLabel() {
  const { id } = useParams();
  const [kir, setKir] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [qrLoaded, setQrLoaded] = useState(false);
  const [error, setError] = useState(false);

  const fetchKir = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/kir/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setKir(response.data.data);
    } catch (error) {
      console.error('Data Tidak ditemukan:', error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKir();
  }, []);

  const kondisiIcon = (kondisi) => {
    switch (kondisi?.toLowerCase()) {
      case 'baik': return <CheckCircle className="h-5 w-5 text-emerald-500" />;
      case 'rusak berat': return <AlertTriangle className="h-5 w-5 text-rose-500" />;
      default: return <HelpCircle className="h-5 w-5 text-amber-500" />;
    }
  };

  const kondisiColor = (kondisi) => {
    switch (kondisi?.toLowerCase()) {
      case 'baik': return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
      case 'rusak berat': return 'bg-rose-50 text-rose-700 ring-rose-200';
      default: return 'bg-amber-50 text-amber-700 ring-amber-200';
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative mx-auto w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-slate-200" />
            <div className="absolute inset-0 rounded-full border-4 border-slate-800 border-t-transparent animate-spin" />
          </div>
          <p className="text-sm font-medium text-slate-500 animate-pulse">Memuat data aset...</p>
        </div>
      </div>
    );

  if (error || !kir)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 max-w-sm w-full text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-rose-500" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Data Tidak Ditemukan</h2>
          <p className="text-sm text-slate-500">Aset dengan ID ini tidak tersedia atau telah dihapus.</p>
        </div>
      </div>
    );

  const fields = [
    { label: "Kode Barang", value: kir.kode_barang, icon: Hash },
    { label: "Nama Barang", value: kir.nama_barang, icon: Package },
    { label: "Ruangan", value: kir.lokasi, icon: MapPin },
    { label: "Tanggal Perolehan", value: formatTanggal(kir.tanggal_perolehan), icon: Calendar },
    { label: "Jumlah", value: `${kir.jumlah} Unit`, icon: Package },
    { label: "Nilai Perolehan", value: `Rp ${formatRupiah(kir.nilai_perolehan)}`, icon: Coins },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-6 flex justify-center items-start md:items-center">
      <div className="w-full max-w-lg space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* HEADER CARD */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 text-center">
          <div className="relative mx-auto mb-4 w-20 h-20">
            <div className="absolute inset-0 bg-slate-800/5 rounded-full" />
            {kir.gambar_qr ? (
              <img
                src={`${import.meta.env.VITE_API_URL_IMAGE}/storage/${kir.gambar_qr}`}
                alt="QR Code"
                onLoad={() => setQrLoaded(true)}
                className={`w-20 h-20 mx-auto relative transition-all duration-500 ${qrLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}
              />
            ) : (
              <div className="w-20 h-20 mx-auto relative rounded-full bg-slate-100 flex items-center justify-center">
                <QrCode className="h-10 w-10 text-slate-400" />
              </div>
            )}
            {!qrLoaded && kir.gambar_qr && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-6 w-6 text-slate-400 animate-spin" />
              </div>
            )}
          </div>
          <h1 className="text-xl font-bold text-slate-900">{kir.nama_barang}</h1>
          <p className="text-sm text-slate-500 mt-1">{kir.lokasi}</p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ring-1 ${kondisiColor(kir.kondisi)}`}>
              {kondisiIcon(kir.kondisi)}
              {kir.kondisi}
            </span>
          </div>
        </div>

        {/* DETAIL FIELDS */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 divide-y divide-slate-100 overflow-hidden">
          {fields.map((field, idx) => (
            <div key={idx} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors" style={{ animationDelay: `${idx * 60}ms` }}>
              <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                <field.icon className="h-4 w-4 text-slate-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{field.label}</p>
                <p className="text-sm font-semibold text-slate-800 truncate">{field.value || '-'}</p>
              </div>
            </div>
          ))}
        </div>

        {/* GAMBAR BARANG */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <ImageIcon className="h-4 w-4 text-slate-400" />
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Gambar Barang</p>
          </div>
          <div className="flex justify-center">
            {kir.gambar ? (
              <div className="relative">
                {!imgLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-50 rounded-xl">
                    <Loader2 className="h-8 w-8 text-slate-300 animate-spin" />
                  </div>
                )}
                <img
                  src={`${import.meta.env.VITE_API_URL_IMAGE}/storage/${kir.gambar}`}
                  alt="Gambar Barang"
                  onLoad={() => setImgLoaded(true)}
                  className={`w-full max-w-xs rounded-xl border border-slate-200 transition-all duration-500 ${imgLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                />
              </div>
            ) : (
              <div className="w-full max-w-xs h-44 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-400">
                <ImageIcon className="h-8 w-8" />
                <span className="text-sm font-medium">Tidak ada gambar</span>
              </div>
            )}
          </div>
        </div>

        {/* KETERANGAN */}
        {kir.keterangan && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Keterangan</p>
            <p className="text-sm text-slate-600 leading-relaxed">{kir.keterangan}</p>
          </div>
        )}

        {/* FOOTER */}
        <p className="text-center text-[10px] text-slate-400 font-medium pb-2">
          SIMBADA Bandung Kidul — Sistem Informasi Manajemen Barang Daerah
        </p>
      </div>
    </div>
  );
}

export default ScanLabel

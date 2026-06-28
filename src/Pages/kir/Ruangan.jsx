import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { ArrowLeft, Building, ChevronDown, MapPin, Package } from "lucide-react";

// =====================================================
// Halaman Ruangan — daftar inventaris per lokasi
// =====================================================
function Ruangan() {
  const [activeLokasi, setActiveLokasi] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [dataLokasi, setDataLokasi] = useState([]);

  // Ambil data lokasi dari API
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/kir/lokasi`)
      .then((res) => {
        setDataLokasi(res.data);
        if (res.data.length > 0) {
          setActiveLokasi(res.data[0].lokasi);
        }
      });
  }, []);

  const currentLokasi = dataLokasi.find((l) => l.lokasi === activeLokasi);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-6xl px-4">

        {/* ——— Header halaman ——— */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lokasi Ruangan</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manajemen inventaris berdasarkan ruangan
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium text-gray-400">Total Lokasi</p>
            <p className="text-xl font-bold text-blue-600">{dataLokasi.length}</p>
          </div>
        </div>

        {/* ——— Back button ——— */}
        <div className="mb-6">
          <Link
            to="/kir"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Link>
        </div>

        {/* ——— Tab lokasi (pill style) ——— */}
        <div className="mb-8 flex flex-wrap gap-2">
          {dataLokasi.map((l) => (
            <button
              key={l.lokasi}
              onClick={() => {
                setActiveLokasi(l.lokasi);
                setExpanded(false);
              }}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all
                ${
                  activeLokasi === l.lokasi
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600"
                }`}
            >
              {l.lokasi}
            </button>
          ))}
        </div>

        {/* ——— Card lokasi aktif ——— */}
        {currentLokasi && (
          <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">

            {/* Accordion header */}
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex w-full items-center justify-between p-5 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <Building className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">{currentLokasi.lokasi}</h3>
                  <p className="text-sm text-gray-500">
                    {currentLokasi.items.length} Aset Terdaftar
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                  expanded ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Table aset (muncul saat accordion dibuka) */}
            {expanded && (
              <div className="border-t border-gray-100">
                {currentLokasi.items.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                          <th className="px-6 py-3">Kode Barang</th>
                          <th className="px-6 py-3">Nama Aset</th>
                          <th className="px-6 py-3 text-center">Kondisi</th>
                          <th className="px-6 py-3 text-center">QR Code</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {currentLokasi.items.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-3">
                              <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                {item.kode_barang}
                              </span>
                            </td>
                            <td className="px-6 py-3 text-sm font-medium text-gray-700">
                              {item.nama_barang}
                            </td>
                            <td className="px-6 py-3 text-center">
                              <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold
                                  ${
                                    item.kondisi === "baik"
                                      ? "bg-green-50 text-green-700 ring-1 ring-green-200"
                                      : "bg-red-50 text-red-700 ring-1 ring-red-200"
                                  }`}
                              >
                                <span
                                  className={`h-1.5 w-1.5 rounded-full ${
                                    item.kondisi === "baik" ? "bg-green-500" : "bg-red-500"
                                  }`}
                                />
                                {item.kondisi}
                              </span>
                            </td>
                            <td className="px-6 py-3 text-center">
                              {item.gambar_qr ? (
                                <Link
                                  to={`${import.meta.env.VITE_API_URL_IMAGE}/storage/${item.gambar_qr}`}
                                  target="_blank"
                                >
                                  <img
                                    src={`${import.meta.env.VITE_API_URL_IMAGE}/storage/${item.gambar_qr}`}
                                    alt="QR"
                                    className="mx-auto h-10 w-10"
                                  />
                                </Link>
                              ) : (
                                <div className="mx-auto h-10 w-10 flex items-center justify-center rounded border border-dashed border-gray-300 text-[10px] text-gray-400">
                                  QR
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3 py-16 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                      <Package className="h-6 w-6" />
                    </div>
                    <p className="text-sm text-gray-400 font-medium">
                      Tidak ada aset di lokasi ini
                    </p>
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

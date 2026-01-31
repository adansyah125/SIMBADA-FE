import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Ruangan() {
  const [activeLokasi, setActiveLokasi] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [dataLokasi, setDataLokasi] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/api/kir/lokasi")
      .then(res => {
        setDataLokasi(res.data);
        if (res.data.length > 0) {
          setActiveLokasi(res.data[0].lokasi);
        }
      });
  }, []);

  const currentLokasi = dataLokasi.find(l => l.lokasi === activeLokasi);

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">📍 Lokasi Persebaran Aset</h1>
          <p className="text-gray-500">Inventaris berdasarkan lokasi</p>
        </div>

        {/* TAB LOKASI */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {dataLokasi.map(l => (
            <button
              key={l.lokasi}
              onClick={() => {
                setActiveLokasi(l.lokasi);
                setExpanded(false);
              }}
              className={`px-5 py-2 rounded-full text-sm font-semibold ${
                activeLokasi === l.lokasi
                  ? "bg-indigo-600 text-white"
                  : "bg-white border text-gray-600"
              }`}
            >
              {l.lokasi}
            </button>
            
          ))}
        </div>

        {/* LIST BARANG */}
        {currentLokasi && (
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div
              onClick={() => setExpanded(!expanded)}
              className="p-5 flex justify-between cursor-pointer hover:bg-gray-50"
            >
              <h3 className="font-bold text-lg">
                {currentLokasi.lokasi}
              </h3>
              <span className="text-sm text-gray-500">
                {currentLokasi.items.length} barang
              </span>
            </div>

            {expanded && (
              <div className="p-5 border-t bg-gray-50">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-gray-400 uppercase text-xs">
                      <th className="py-2">Kode</th>
                      <th>Nama</th>
                      <th>Kondisi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentLokasi.items.map(item => (
                      <tr key={item.id} className="border-b text-center">
                        <td className="py-2 text-indigo-600 font-mono">
                          {item.kode_barang}
                        </td>
                        <td>{item.nama_barang}</td>
                        <td>
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            item.kondisi === "baik"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}>
                            {item.kondisi}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default Ruangan;

import React, { useEffect, useState } from 'react'
import axios from 'axios'

function Laporan() { 
    const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/laporan/rekap-aset`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => {
        setRows([
          { nama: 'Tanah', ...res.data.tanah },
          { nama: 'Gedung', ...res.data.gedung },
          { nama: 'Mesin', ...res.data.mesin },
        ])
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, []) 

  const handleCetak = (kondisi) => {
  const baseUrl = import.meta.env.VITE_API_URL_IMAGE;

  window.open(
    `${baseUrl}/api/kir/cetak?kondisi=${kondisi}`,
    "_blank"
  );
};

  return (
    <>
      <div className="p-4 md:p-0 bg-gray-50 min-h-screen">
      {/* === Bagian Kartu dan Tombol Cetak === */}
      <div className="bg-white shadow-lg rounded-xl p-6 mb-10 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-700 mb-4 uppercase text-center">Opsi Cetak Laporan Kondisi Barang</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <button onClick={() => handleCetak("semua")} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg shadow-md transition">
            <i className="fas fa-check-circle mr-2"></i> Kondisi Baik dan Rusak
          </button>

          <button  onClick={() => handleCetak("baik")} className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg shadow-md transition">
            <i className="fas fa-exclamation-triangle mr-2"></i>Baik
          </button>
          <button  onClick={() => handleCetak("kurang_baik")} className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-3 px-4 rounded-lg shadow-md transition">
            <i className="fas fa-exclamation-triangle mr-2"></i>  Kurang Baik
          </button>

          <button onClick={() => handleCetak("rusak_berat")} className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg shadow-md transition">
            <i className="fas fa-times-circle mr-2"></i>Rusak Berat
          </button>
        </div>
      </div>
      {/* === Bagian Laporan Resmi === */}
      <div className="bg-white shadow-xl rounded-xl p-8 border border-gray-300">
        {/* Header Laporan */}
        <div className="flex flex-col md:flex-row items-center justify-center text-center pb-4 mb-6">
          <div className="h-20 w-20 overflow-hidden mb-4 md:mb-0 md:mr-6">
            <img src="/logo.png" alt="Logo" className="w-20 h-20 rounded-full object-cover" />
          </div>
          <div>
            <p className="text-xs text-gray-600">PEMERINTAH KOTA BANDUNG</p>
            <h2 className="text-2xl font-extrabold text-blue-900 mt-1 mb-1">LAPORAN INVENTARIS KECAMATAN BANDUNG KIDUL</h2>
            <p className="text-sm text-gray-500"> JL. Batununggal No.28 Bandung Kode Pos 402627 87523214</p>
          </div>
        </div>

        {/* Tabel Laporan */}
       <div className="overflow-x-auto relative">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-r">No.</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase border-r">Jenis Barang Inventaris</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase border-r">Jumlah Total</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase border-r">Kondisi Baik</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Kondisi Rusak</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
                          <tr>
                                <td colSpan="22" className="text-center py-10 bg-white">
                                    <div className="flex justify-center items-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                                        <p className="ml-3 text-sm text-gray-500">Memuat data...</p>
                                    </div>
                                </td>
                            </tr>
         ) : rows.length === 0 ? (
          <tr>
            <td colSpan="5" className="text-gray-500 p-4 font-semibold uppercase italic">~~ Data Kosong ~~</td>
          </tr>
         ) : (
          !loading && rows.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900 border-r">{index + 1 }</td>
                <td className="px-6 py-4 text-sm text-gray-700 border-r capitalize">{item.nama}</td>
                <td className="px-6 py-4 text-sm text-gray-700 text-center border-r">{item.total ?? 0}</td>
                <td className="px-6 py-4 text-sm font-semibold text-green-600 text-center border-r">{item.baik ?? 0}</td>
                <td className="px-6 py-4 text-sm font-semibold text-red-600 text-center">{item.rusak ?? 0}</td>
              </tr>
          ))
          )}  
          </tbody>
            <tfoot>
              <tr className="bg-gray-50">
                <td colSpan="2" className="px-6 py-4 text-sm font-medium text-gray-900 border-r text-center"> Total</td>
                <td className="px-6 py-4 text-sm font-semibold text-center border-r">{rows.reduce((a, b) => a + Number(b.total ?? 0), 0)}</td>
                <td className="px-6 py-4 text-sm font-semibold text-green-600 text-center border-r">{rows.reduce((a, b) => a + Number(b.baik ?? 0), 0)}</td>
                <td className="px-6 py-4 text-sm font-semibold text-red-600 text-center">{rows.reduce((a, b) => a + Number(b.rusak ?? 0), 0)}</td>
              </tr>
            </tfoot>
        </table>
      </div>
      </div>
    </div>
    </>
  )
}

export default Laporan

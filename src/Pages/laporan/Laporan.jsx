import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Skeleton = ({ className, height }) => (
  <div className={`animate-pulse bg-gray-200 rounded-lg ${className}`} style={height ? { height } : undefined} />
);

function Laporan() { 
    const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/laporan/rekap-aset`, {
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
     <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-8">
  {loading ? (
    <>
      <div className="mb-6">
        <Skeleton className="h-6 w-72 mb-2" />
        <Skeleton className="h-3 w-56" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Skeleton className="h-11 w-full rounded-xl" />
        <Skeleton className="h-11 w-full rounded-xl" />
        <Skeleton className="h-11 w-full rounded-xl" />
        <Skeleton className="h-11 w-full rounded-xl" />
      </div>
    </>
  ) : (
    <>
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-950 tracking-tight">Cetak Laporan Kondisi Barang</h3>
        <p className="text-xs text-gray-400 mt-0.5">Pilih salah satu filter di bawah ini untuk mengunduh berkas laporan</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button 
          onClick={() => handleCetak("semua")} 
          className="flex items-center justify-center gap-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-3 px-4 rounded-xl shadow-xs transition-all active:scale-[0.98]"
        >
          <i className="fas fa-print opacity-80"></i> 
          Semua Kondisi
        </button>

        <button  
          onClick={() => handleCetak("baik")} 
          className="flex items-center justify-center gap-2.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 text-sm font-semibold py-3 px-4 rounded-xl transition-all active:scale-[0.98]"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-xs ring-2 ring-emerald-100" />
          Kondisi Baik
        </button>

        <button  
          onClick={() => handleCetak("kurang_baik")} 
          className="flex items-center justify-center gap-2.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 text-sm font-semibold py-3 px-4 rounded-xl transition-all active:scale-[0.98]"
        >
          <span className="h-2 w-2 rounded-full bg-amber-500 shadow-xs ring-2 ring-amber-100" />
          Kurang Baik
        </button>

        <button 
          onClick={() => handleCetak("rusak_berat")} 
          className="flex items-center justify-center gap-2.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 text-sm font-semibold py-3 px-4 rounded-xl transition-all active:scale-[0.98]"
        >
          <span className="h-2 w-2 rounded-full bg-rose-500 shadow-xs ring-2 ring-rose-100" />
          Rusak Berat
        </button>
      </div>
    </>
  )}
</div>
      {/* === Bagian Laporan Resmi === */}
      <div className="bg-white shadow-xl rounded-xl p-8 border border-gray-300">
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
              [1,2,3].map((n) => (
                <tr key={n} className="animate-pulse">
                  <td className="px-6 py-4 border-r"><Skeleton className="h-4 w-6" /></td>
                  <td className="px-6 py-4 border-r"><Skeleton className="h-4 w-32" /></td>
                  <td className="px-6 py-4 border-r"><Skeleton className="h-4 w-12 mx-auto" /></td>
                  <td className="px-6 py-4 border-r"><Skeleton className="h-4 w-12 mx-auto" /></td>
                  <td className="px-6 py-4"><Skeleton className="h-4 w-12 mx-auto" /></td>
                </tr>
              ))
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
          {!loading && rows.length > 0 && (
            <tfoot>
              <tr className="bg-gray-50">
                <td colSpan="2" className="px-6 py-4 text-sm font-medium text-gray-900 border-r text-center"> Total</td>
                <td className="px-6 py-4 text-sm font-semibold text-center border-r">{rows.reduce((a, b) => a + Number(b.total ?? 0), 0)}</td>
                <td className="px-6 py-4 text-sm font-semibold text-green-600 text-center border-r">{rows.reduce((a, b) => a + Number(b.baik ?? 0), 0)}</td>
                <td className="px-6 py-4 text-sm font-semibold text-red-600 text-center">{rows.reduce((a, b) => a + Number(b.rusak ?? 0), 0)}</td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
      </div>
    </div>
    </>
  )
}

export default Laporan

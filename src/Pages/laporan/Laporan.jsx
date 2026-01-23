import React from 'react'

function Laporan() {
  return (
    <>
      <div className="p-4 md:p-0 bg-gray-50 min-h-screen">
      {/* === Bagian Kartu dan Tombol Cetak === */}
      <div className="bg-white shadow-lg rounded-xl p-6 mb-10 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Opsi Cetak Laporan</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg shadow-md transition">
            
            <i className="fas fa-print mr-2"></i> Cetak Data Barang Inventaris (Semua)
          </button>

          <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg shadow-md transition">
            <i className="fas fa-check-circle mr-2"></i> Cetak Kondisi Baik dan Rusak
          </button>

          <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-3 px-4 rounded-lg shadow-md transition">
            <i className="fas fa-exclamation-triangle mr-2"></i> Cetak Kondisi Barang Baik
          </button>

          <button className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg shadow-md transition">
            <i className="fas fa-times-circle mr-2"></i> Cetak Kondisi Barang Rusak
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
            <p className="text-xs text-gray-600">KEMENTERIAN/LEMBAGA REPUBLIK INDONESIA</p>
            <h2 className="text-2xl font-extrabold text-blue-900 mt-1 mb-1">LAPORAN INVENTARIS ASET NEGARA</h2>
            <p className="text-sm text-gray-500"> Periode: 1 Januari 2025 - 31 Desember 2025</p>
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
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900 border-r">1</td>
                <td className="px-6 py-4 text-sm text-gray-700 border-r capitalize">Mesin</td>
                <td className="px-6 py-4 text-sm text-gray-700 text-center border-r">rusak berat</td>
                <td className="px-6 py-4 text-sm font-semibold text-green-600 text-center border-r">baik</td>
                <td className="px-6 py-4 text-sm font-semibold text-red-600 text-center">rusak berat</td>
              </tr>
          </tbody>
            <tfoot>
              <tr className="bg-gray-50">
                <td colSpan="2" className="px-6 py-4 text-sm font-medium text-gray-900 border-r text-center"> Total</td>
                <td className="px-6 py-4 text-sm font-semibold text-center border-r">2</td>
                <td className="px-6 py-4 text-sm font-semibold text-green-600 text-center border-r">4</td>
                <td className="px-6 py-4 text-sm font-semibold text-red-600 text-center">3</td>
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

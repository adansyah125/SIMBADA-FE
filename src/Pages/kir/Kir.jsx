import { useState } from "react"
import { Link } from "react-router-dom"
import { useEffect } from "react"
import { deleteKir, getKir } from "../../services/KirService"
import { toast } from "react-toastify"
import {formatRupiah, formatTanggal} from "../../utils/Format"
import { Search, Building2, Plus, Settings, Trash2, Pencil } from "lucide-react";

function Kir() {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
  const fetchData = async (page = 1) => {
    try {
      const res = await getKir(page, search);
      const paginate = res.data;
      setData(paginate.data);
      setCurrentPage(paginate.current_page);
      setLastPage(paginate.last_page);
      setTotal(paginate.total);
    //   console.log(res);
    } catch (err) {
    console.log(err)
      toast.error("Gagal mengambil data KIB Tanah");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, search]);

   const handleDelete = async (id) => {
  const confirm = window.confirm("Yakin ingin menghapus data ini?");

  if (!confirm) return;

  try {
    await deleteKir(id);

    toast.success("Data berhasil dihapus");

    // refresh data
    setData((prev) => prev.filter((item) => item.id !== id));

  } catch (error) {
    console.log(error);
    toast.error("Gagal menghapus data");
  }
};
  
  return (
    <>
        {/* HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end pb-6 border-b border-gray-100 mb-4">
                    <div>
                        <h1 className="text-2xl md:text-4xl font-light text-gray-900 tracking-tighter">
                            Data Kartu Inventaris <span className="font-semibold tracking-tighter text-black uppercase">Ruangan</span>
                        </h1>
                        <p className="text-gray-500 mt-2 text-sm italic">Kelola data aset inventaris negara (KIB/KIR).</p>
                    </div>
                </div>
        {/* SEARCH & ADD */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        
                        {/* Search Bar dengan Ikon */}
                        <div className="relative group w-full lg:w-96">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                        </div>
                        <input type="text" placeholder="Cari Nama atau Kode Barang..." 
                            value={search}
                            onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                            }}
                            className="block w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 focus:bg-white transition-all duration-200"/>
                        </div>
        
                        {/* Action Buttons */}
                        <div className="flex items-center gap-3">
                        {/* Import Data - Secondary Action */}
                        <Link to={"/kir/ruangan"}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white text-emerald-600 border border-emerald-200 rounded-lg hover:bg-emerald-50 hover:border-emerald-300 active:scale-95 transition-all duration-200 text-sm font-semibold cursor-pointer shadow-sm" >
                            <Building2 className="size-6" />
                            <span>Lihat Ruangan</span>
                        </Link>
        
                        {/* Tambah Data - Primary Action */}
                        <Link to={"/kir/create"} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 active:scale-95 transition-all duration-200 text-sm font-semibold shadow-md shadow-indigo-100">
                            <Plus className="h-4 w-4" />
                            <span>Tambah Data</span>
                        </Link>
                        </div>
                    </div>
                    </div>

            {/* TABLE - Desktop View */}
            <div className="hidden md:block overflow-x-auto border border-gray-200 rounded-lg">
                <table className="min-w-full table-auto border-collapse">
                    <thead className="bg-gray-50 text-center text-xs font-semibold text-gray-700 uppercase border-b border-gray-300 sticky top-0">
                        <tr>
                            <th className="px-3 py-3 border-r border-gray-200">No</th>
                            <th className="px-3 py-3 border-r border-gray-200">Kode Barang</th> 
                            <th className="px-3 py-3 border-r border-gray-200">Nama Barang</th>
                            <th className="px-3 py-3 border-r border-gray-200">Tanggal Perolehan</th>
                            <th className="px-3 py-3 border-r border-gray-200">Lokasi (Ruangan)</th>
                            <th className="px-3 py-3 border-r border-gray-200">Kondisi</th> 
                            <th className="px-3 py-3 border-r border-gray-200">Jumlah</th> 
                            <th className="px-3 py-3 border-r border-gray-200">Nilai Perolehan</th>
                            <th className="px-3 py-3 border-r border-gray-200 bg-indigo-50 text-indigo-700">QR Code</th>
                            <th className="px-3 py-3 border-r border-gray-200">Gambar</th>
                            <th className="px-3 py-3 bg-gray-100">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="text-xs text-center">
                        {loading ? (
                            <tr>
                                <td colSpan="22" className="text-center py-10 bg-white">
                                    <div className="flex justify-center items-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                                        <p className="ml-3 text-sm text-gray-500">Memuat data...</p>
                                    </div>
                                </td>
                            </tr>
                        ) :
                          data.length === 0 ? (
                                <tr>
                                    <td colSpan="22" className="text-gray-500 p-4 font-semibold uppercase italic">~~Data kosong~~</td>
                                </tr>
                                ) : (
                            data.map((item, index) => (
                                <tr key={item.id} className="bg-white hover:bg-indigo-50 border-b border-gray-100">
                                    <td className="border-r border-gray-100 px-3 py-3 text-center">{index + 1}</td>
                                    <td className="border-r border-gray-100 px-3 py-3">{item.kode_barang}</td>
                                    <td className="border-r border-gray-100 px-3 py-3 text-center font-mono">{item.nama_barang}</td>
                                    <td className="border-r border-gray-100 px-3 py-3 text-center">{formatTanggal(item.tanggal_perolehan)}</td>
                                    <td className="border-r border-gray-100 px-3 py-3 text-center font-semibold">
                                      <span
                                            className="px-2 py-0.5 rounded-full text-xs font-medium text-black"> 
                                            {item.lokasi}
                                        </span></td>
                                    <td className={`border-r border-gray-100 px-3 py-3 text-center font-semibold ${
                                        item.kondisi === 'baik' ? 'text-green-600' : 
                                        item.kondisi === 'rusak berat' ? 'text-red-600' : 
                                        item.kondisi === 'kurang baik' ? 'text-yellow-600' :
                                        'text-gray-800'
                                        }`}>{item.kondisi}</td>
                                    <td className="border-r border-gray-100 px-3 py-3 text-center">{item.jumlah}</td>
                                    <td className="border-r border-gray-100 px-3 py-3 text-center">Rp. {formatRupiah(item.nilai_perolehan)}</td>
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
                                    <td className="border-r border-gray-100 px-3 py-3 text-center">
                                            <div className="inline-flex flex-col items-center">
                                            {item.gambar ? (
                                                <img src={`${import.meta.env.VITE_API_URL_IMAGE}/storage/${item.gambar}`} className="w-12 h-12" />
                                            ) : (
                                                <div className="w-12 h-12 border border-dashed border-gray-300 rounded-md flex items-center justify-center text-[9px] text-gray-400">Gambar</div>
                                            )}
                                            </div>
                                        </td>
                                    <td className="px-3 py-3 text-center">
                                        <div className="flex items-center justify-center space-x-2">
                                            <Link to={`/kir/edit/${item.id}/edit`} className="text-amber-600 hover:text-amber-800">
                                                <Settings className="h-5 w-5" />
                                            </Link>
                                            <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800 cursor-pointer">
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                            
                    </tbody>
                </table>
            </div>
            {/* Pagiination */}
                <div className="flex justify-between items-center mt-4">
                        <p className="text-sm text-gray-600">
                            Halaman {currentPage} dari {lastPage} (Total {total} data)
                        </p>

                        <div className="flex space-x-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(currentPage - 1)}
                                className="px-4 py-2 text-sm rounded-lg border border-gray-400 shadow  hover:bg-gray-100"
                            >
                                ⬅ Prev
                            </button>

                            <button
                                disabled={currentPage === lastPage}
                                onClick={() => setCurrentPage(currentPage + 1)}
                                className="px-4 py-2 text-sm rounded-lg border border-gray-400 shadow  hover:bg-gray-100"
                            >
                                Next ➡
                            </button>
                        </div>
                    </div>

            {/* CARD VIEW - Mobile */}
            <div className="md:hidden space-y-3">
                        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                            {/* Header Card */}
                            <div className="flex justify-between items-start mb-3 pb-3 border-b border-gray-100">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded font-mono">
                                            #1
                                        </span>
                                        <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full font-medium">
                                            2242
                                        </span>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 text-sm">Mesin</h3>
                                </div>
                                <div className="flex gap-2 ml-3">
                                    <Link to={`/laporan-kir/edit`} className="text-amber-600 hover:text-amber-700 p-1">
                                        <Pencil className="h-5 w-5" />
                                    </Link>
                                    <button className="text-red-600 hover:text-red-700 p-1">
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Content Card */}
                            <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                                <div>
                                    <span className="text-gray-500 block mb-1">tanggal_perolehan:</span>
                                    <span className="text-gray-900 font-medium">2025</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block mb-1">Jumlah:</span>
                                    <span className="text-gray-900 font-bold">10 Unit</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block mb-1">Lokasi:</span>
                                    <span className="text-gray-900 font-semibold">bandung</span>
                                </div>
                                <div>
                                    <span className="text-gray-500 block mb-1">Kondisi:</span>
                                    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium text-green-700">
                                        Baik
                                    </span>
                                </div>
                                <div className="col-span-2">
                                    <span className="text-gray-500 block mb-1">Nilai Perolehan:</span>
                                    <span className="text-gray-900 font-bold">Rp.50000</span>
                                </div>
                            </div>

                            {/* QR Code Section */}
                            <div className="flex items-center justify-center pt-3 border-t border-gray-100">
                                <div className="text-center">
                                        {/* <img src="/" alt="QR Code" className="w-16 h-16 mx-auto mb-1" /> */}
                                        <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center text-xs text-gray-400 mx-auto mb-1">
                                            QR
                                        </div>
                                    <span className="text-[10px] text-gray-400">Scan Label</span>
                                </div>
                            </div>
                        </div>
            </div>
    </>
  )
}

export default Kir

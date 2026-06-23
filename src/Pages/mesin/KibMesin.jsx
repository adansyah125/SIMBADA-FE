import { useEffect, useState, useRef } from "react"
import { Link } from "react-router-dom"
import { deleteKibMesin, getKibMesin, importExcel } from "../../services/KibMesinService";
import { toast } from "react-toastify";
import {formatRupiah, formatTanggal} from "../../utils/Format"
import { FileText, FileSpreadsheet, Search, Upload, Plus, Settings, Trash2, Pencil } from "lucide-react";

function KibMesin() {
    // fetch
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState("");


    // import
    const fileInputRef = useRef(null);
    const [showImportModal, setShowImportModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const fetchData = async (page = 1) => {
    setLoading(true);
    try {
        const res = await getKibMesin(page,search);

        const paginate = res.data;
        setData(paginate.data);                    // isi tabel
        setCurrentPage(paginate.current_page);      // dari Laravel
        setLastPage(paginate.last_page);            // dari Laravel
        setTotal(paginate.total);                   // total data
    } catch (err) {
        console.log(err);
        toast.error("Gagal mengambil data KIB Mesin");
    } finally {
        setLoading(false);
    }
};

    useEffect(() => {
        fetchData(currentPage);
    }, [currentPage,search]);

    const handleDelete = async (id) => {
        const confirm = window.confirm("Yakin ingin menghapus data ini?");
        if (!confirm) return;
    
        try {
          await deleteKibMesin(id);
    
          toast.success("Data berhasil dihapus");
    
          // refresh data
          setData((prev) => prev.filter((item) => item.id !== id));
    
        } catch (error) {
          console.log(error);
          toast.error("Gagal menghapus data");
        }
    }

    const importDataExcel = async () => {
          if (!selectedFile) {
            toast.error("Pilih file Excel terlebih dahulu");
            return;
          }
        
          if (!selectedFile.name.endsWith(".xlsx")) {
            toast.error("File harus Excel (.xlsx)");
            return;
          }
        
          const formData = new FormData();
          formData.append("file", selectedFile);
        
          try {
            await importExcel(formData);
            toast.success("Data berhasil diimport");
        
            setShowImportModal(false);
            setSelectedFile(null);
            fetchData();
        
          } catch (error) {
            console.log(error);
            toast.error("Gagal mengimport data ");
          }
        };

    const exportPdf = () => {
  window.open(`${import.meta.env.VITE_API_URL}/kib-mesin/export/pdf`);
};

    const exportExcel = () => {
  window.open(`${import.meta.env.VITE_API_URL}/kib-mesin/export/excel`);
};
  return (
    <>
                {/* HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end pb-6 border-b border-gray-100 mb-4">
                    <div className="mb-10">
                        <h1 className="text-2xl md:text-4xl font-light text-gray-900 tracking-tighter">
                            Data Kartu Inventaris <span className="font-semibold tracking-tighter text-black uppercase">Mesin</span>
                        </h1>
                        <p className="text-gray-500 mt-2 text-sm italic">Kelola data aset inventaris negara (KIB/KIR).</p>
                    </div>
                    <div className="flex gap-4 p-4">
                    {/* Tombol Export PDF */}
                    <button onClick={exportPdf} type="button" className="group relative flex flex-col items-center justify-center w-40 h-32 border-2 border-dashed border-rose-300 rounded-xl bg-rose-50 hover:bg-rose-100 hover:border-rose-500 transition-all duration-300 cursor-pointer">
                        <div className="p-3 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform duration-300">
                        <FileText className="w-8 h-8 text-rose-600" />
                        </div>
                        <span className="mt-2 text-xs font-bold text-rose-700 uppercase tracking-wider">Export PDF</span>
                        {/* Dekorasi kecil untuk efek UX */}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping"></div>
                        </div>
                    </button>

                    {/* Tombol Export Excel */}
                    <button onClick={exportExcel} type="button" className="group relative flex flex-col items-center justify-center w-40 h-32 border-2 border-dashed border-emerald-300 rounded-xl bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-500 transition-all duration-300 cursor-pointer">
                        <div className="p-3 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform duration-300">
                        <FileSpreadsheet className="w-8 h-8 text-emerald-600" />
                        </div>
                        <span className="mt-2 text-xs font-bold text-emerald-700 uppercase tracking-wider">Export Excel</span>
                    </button>
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
                        <button type="button" 
                            onClick={() => setShowImportModal(true)} 
                            className="flex items-center gap-2 px-4 py-2.5 bg-white text-emerald-600 border border-emerald-200 rounded-lg hover:bg-emerald-50 hover:border-emerald-300 active:scale-95 transition-all duration-200 text-sm font-semibold cursor-pointer shadow-sm" >
                            <Upload className="h-4 w-4" />
                            <span>Import Excel</span>
                        </button>
        
                        {/* Tambah Data - Primary Action */}
                        <Link to={"/kib/mesin/create"} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 active:scale-95 transition-all duration-200 text-sm font-semibold shadow-md shadow-indigo-100">
                            <Plus className="h-4 w-4" />
                            <span>Tambah Data</span>
                        </Link>
                        </div>
        
                        {/* Hidden Input File */}
                        <input type="file" accept=".xlsx,.xls" 
                        ref={fileInputRef} 
                        onChange={importDataExcel} 
                        className="hidden"/>
                    </div>
                    </div>
    
                {/* TABLE - Desktop */}
                <div className="hidden md:block overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="min-w-full table-auto border-collapse">
                        <thead className="bg-gray-50 text-center text-xs font-semibold text-gray-700 uppercase border-b border-gray-300 sticky top-0">
                            <tr>
                                <th rowSpan="2" className="border border-gray-300 px-3 py-3">No</th>
                                <th rowSpan="2" className="border border-gray-300 px-3 py-3 bg-indigo-50 text-indigo-700">Kode Barang</th>
                                <th rowSpan="2" className="border border-gray-300 px-3 py-3">Nama</th>
                                <th rowSpan="2" className="border border-gray-300 px-3 py-3 w-40">NIBAR</th>
                                <th rowSpan="2" className="border border-gray-300 px-3 py-3">Nomor Register</th>
                                <th rowSpan="2" className="border border-gray-300 px-3 py-3">Spesifikasi </th>
                                <th rowSpan="2" className="border border-gray-300 px-3 py-3">Spesifikasi Lainnya</th>
                                <th rowSpan="2" className="border border-gray-300 px-3 py-3">Merk</th>
                                <th rowSpan="2" className="border border-gray-300 px-3 py-3">Lokasi</th>
                                <th colSpan="3" className="border border-gray-300 px-3 py-3">Kendaraan Dinas</th>
                                <th rowSpan="2" className="border border-gray-300 px-3 py-3">Jumlah</th>
                                <th rowSpan="2" className="border border-gray-300 px-3 py-3">Satuan</th>
                                <th rowSpan="2" className="border border-gray-300 px-3 py-3">Harga Satuan</th>
                                <th rowSpan="2" className="border border-gray-300 px-3 py-3">Nilai Perolehan</th>
                                <th rowSpan="2" className="border border-gray-300 px-3 py-3">cara Perolehan</th>
                                <th rowSpan="2" className="border border-gray-300 px-3 py-3">tanggal Perolehan</th>
                                <th rowSpan="2" className="border border-gray-300 px-3 py-3">Status Penggunaan</th>
                                <th rowSpan="2" className="border border-gray-300 px-3 py-3">Keterangan</th>
                                <th rowSpan="2" className="border border-gray-300 px-3 py-3">Aksi</th>
                            </tr>
                            <tr>
                              <th className="border border-gray-200 px-3 py-3">No Polisi</th>
                              <th className="border border-gray-200 px-3 py-3">No Rangka</th>
                              <th className="border border-gray-200 px-3 py-3">No Bpkb</th>
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
                                    <tr key={item.id} className="transition duration-100 hover:bg-indigo-50 border-b border-gray-100">
                                        <td className="border border-gray-200 px-3 py-3 font-mono text-center"> {index + 1 + (currentPage -1) * 10} </td>
                                        <td className="border border-gray-200 px-3 py-3"> {item.kode_barang} </td>
                                        <td className="border border-gray-200 px-3 py-3"> {item.nama_barang} </td>
                                        <td className="border border-gray-200 px-3 py-3"> {item.nibar} </td>
                                        <td className="border border-gray-200 px-3 py-3"> {item.no_register} </td>
                                        <td className="border border-gray-200 px-3 py-3"> {item.spesifikasi_nama_barang} </td>
                                        <td className="border border-gray-200 px-3 py-3"> {item.spesifikasi_lainnya}</td>
                                        <td className="border border-gray-200 px-3 py-3"> {item.merk} </td>
                                        <td className="border border-gray-200 px-3 py-3"> {item.lokasi} </td>
                                        <td className="border border-gray-200 px-3 py-3"> {item.no_polisi} </td>
                                        <td className="border border-gray-200 px-3 py-3"> {item.no_rangka} </td>
                                        {/* Bukti Kepemilikan */}
                                        <td className="border border-gray-200 px-3 py-3">{item.no_bpkb}</td>
                                        <td className="border border-gray-200 px-3 py-3">{item.jumlah}</td>
                                        
                                        <td className="border border-gray-200 px-3 py-3 text-center">{item.satuan}</td>
                                        <td className="border border-gray-200 px-3 py-3 text-center">{formatRupiah(item.harga_satuan ??  '0')}</td>
                                        {/*  */}
                                        <td className="border border-gray-200 px-3 py-3">{formatRupiah(item.nilai_perolehan ?? '0')}</td>
                                        <td className="border border-gray-200 px-3 py-3">{item.cara_perolehan}</td>
                                        <td className="border border-gray-200 px-3 py-3">{formatTanggal(item.tanggal_perolehan ?? '0')}</td>
                                        <td className="border border-gray-200 px-3 py-3">{item.status_penggunaan}</td>
                                        <td className="border border-gray-200 px-3 py-3">{item.keterangan}</td>
                                        <td className="px-3 py-3 text-center">
                                            <div className="flex items-center justify-center space-x-2">
                                                <Link to={`/kib/mesin/edit/${item.id}/edit`} className="cursor-pointer text-amber-600 hover:text-amber-800">
                                                    <Settings className='w-5 h-5' />
                                                </Link>
                                                <button onClick={() => handleDelete(item.id)} className="cursor-pointer text-red-600 hover:text-red-800">
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
    
                {/* CARD LIST - Mobile */}
                <div className="md:hidden space-y-3">
                            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm" >
                                {/* Header Card */}
                                <div className="flex justify-between items-start mb-3 pb-3 border-b border-gray-100">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded font-mono">1</span>
                                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-500">user</span>
                                        </div>
                                        <h3 className="font-semibold text-gray-900 text-sm"> syahdan </h3>
                                    </div>
                                    <div className="flex gap-2 ml-3">
                                        <Link to={`/user/edit`} className="text-amber-600 hover:text-amber-700 p-1">
                                            <Pencil className="h-5 w-5" />
                                        </Link>
                                        <button className="text-red-600 hover:text-red-700 p-1" >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                                {/* Content Card */}
                                <div className="space-y-2 text-xs">
                                    <div className="flex items-start">
                                        <span className="text-gray-500 w-20 flex-shrink-0">Email: </span>
                                        <span className="text-gray-900 font-medium break-all">231 </span>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="text-gray-500 w-20 flex-shrink-0">Dibuat:</span>
                                        <span className="text-gray-900 font-medium">10 mei 2024</span>
                                    </div>
                                </div>
                            </div>
                </div>

                {/* modal */}
            {showImportModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-2">Import Data KIB Mesin</h3>
                <p className="text-sm text-gray-600 mb-4">Pastikan file <b>Excel (.xlsx)</b> dan kolom tanggal menggunakan<b> format Date</b>, bukan teks.</p>
                <ul className="text-xs text-gray-500 mb-4 list-disc pl-5 space-y-1">
                    <li>Header harus sesuai database</li>
                    <li>format tanggal yang benar (10/05/2004)</li>
                    <li>Tidak boleh merge cell</li>
                </ul>
                {/* PILIH FILE (CUSTOM) */}
                <div onClick={() => fileInputRef.current.click()} className="cursor-pointer border-2 border-dashed border-emerald-400 rounded-lg p-6 text-center hover:bg-emerald-50 transition">
                <div className="flex flex-col items-center gap-2">
                    {/* ICON IMPORT */}
                    <Upload className="w-10 h-10 text-emerald-600" />
                    <p className="text-sm font-medium text-gray-700">Klik untuk pilih file Excel</p>
                    <p className="text-xs text-gray-500">Format: .xlsx / .xls</p>
                    {/* NAMA FILE */}
                    {selectedFile && (
                    <p className="mt-2 text-xs text-emerald-700 font-semibold flex items-center gap-1"><FileText className="h-3 w-3" /> {selectedFile.name}</p>
                    )}
                </div>
                {/* INPUT FILE HIDDEN */}
                <input type="file" accept=".xlsx,.xls" ref={fileInputRef} onChange={(e) => setSelectedFile(e.target.files[0])} className="hidden"/>
                </div>

                {/* ACTION */}
                <div className="flex justify-end gap-2 mt-2">
                    <button
                        onClick={() => {
                        setShowImportModal(false);
                        setSelectedFile(null);
                    }}
                    className="px-4 py-2 text-sm border rounded-md hover:bg-gray-100">
                    Batal
                    </button>

                    <button
                    disabled={!selectedFile}
                    onClick={importDataExcel}
                    className={`px-4 py-2 text-sm rounded-md text-white
                        ${selectedFile
                        ? "bg-emerald-600 hover:bg-emerald-700"
                        : "bg-gray-400 cursor-not-allowed"}`}>
                    Import
                    </button>
                </div>
                </div>
            </div>
            )}  
    </>
  )
}

export default KibMesin


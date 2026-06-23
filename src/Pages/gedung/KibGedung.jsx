import { Link } from "react-router-dom"
import { useState,useEffect,useRef } from "react"
import {deleteKibGedung, getKibGedung, importExcel} from "../../services/KibGedungService"
import { toast } from "react-toastify";
import {formatRupiah, formatTanggal} from "../../utils/Format";
import { FileText, FileSpreadsheet, Search, Upload, Plus, Settings, Trash2, Pencil } from "lucide-react";
function KibGedung() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState("");
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [showImportModal, setShowImportModal] = useState(false);

    const fetchdata = async ( page = 1) => {
        setLoading(true);
        try{
            const res = await getKibGedung(page, search);
            const paginate = res.data;
            setData(paginate.data);
            setCurrentPage(paginate.current_page);
            setLastPage(paginate.last_page);
            setTotal(paginate.total);
        } catch (err){
            console.log(err);
            toast.error("Gagal mengambil data KIB Gedung");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchdata(currentPage);
    }, [currentPage, search]);

  

    const handleDelete = async (id) => {
        const confirm = window.confirm("Yakin ingin menghapus data ini?");
    if (!confirm)return;

    try{
        await deleteKibGedung(id);
        toast.success("Data berhasil dihapus");

        setData((prev) => prev.filter((item) => item.id !== id));
    } catch (err){
        console.log(err);
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
        fetchdata();
    
      } catch (error) {
        console.log(error);
        toast.error("Gagal mengimport data ");
      }
    };
    const exportPdf = () => {
  window.open(`${import.meta.env.VITE_API_URL}/kib-gedung/export/pdf`);
};

const exportExcel = () => {
  window.open(`${import.meta.env.VITE_API_URL}/kib-gedung/export/excel`);
};
  return (
   <>
             {/* HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end pb-6 border-b border-gray-100 mb-4">
                    <div className="mb-10">
                        <h1 className="text-2xl md:text-4xl font-light text-gray-900 tracking-tighter">
                            Data Kartu Inventaris <span className="font-semibold tracking-tighter text-black uppercase">Gedung</span>
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
                        <Link to={"/kib/gedung/create"} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 active:scale-95 transition-all duration-200 text-sm font-semibold shadow-md shadow-indigo-100">
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
                            <th className="border border-gray-300 px-3 py-3">No</th>
                            <th className="border border-gray-300 px-3 py-3 bg-indigo-50 text-indigo-700">
                               Kode Barang
                            </th>
                            <th className="border border-gray-300 px-3 py-3">Nama</th>
                            <th className="border border-gray-300 px-3 py-3 w-40">
                                NIBAR
                            </th>
                            <th className="border border-gray-300 px-3 py-3">
                                Nomor Register
                            </th>
                            <th className="border border-gray-300 px-3 py-3">
                                Spesifikasi 
                            </th>
                            <th className="border border-gray-300 px-3 py-3">
                                Spesifikasi Lainnya
                            </th>
                            <th className="border border-gray-300 px-3 py-3">
                               Jumlah Lantai
                            </th>
                            
                            <th className="border border-gray-300 px-3 py-3">
                               Lokasi
                            </th>
                            <th className="border border-gray-300 px-3 py-3">
                                Titik Koordinat
                            </th>
                           
                            <th className="border border-gray-300 px-3 py-3">
                                Harga Satuan
                            </th>
                             <th className="border border-gray-300 px-3 py-3">
                                Status Kepemilikan Tanah
                            </th>
                             <th className="border border-gray-300 px-3 py-3">
                                jumlah
                            </th>
                             <th className="border border-gray-300 px-3 py-3">
                                satuan
                            </th>
                             <th className="border border-gray-300 px-3 py-3">
                                Harga Perolehan
                            </th>
                             <th className="border border-gray-300 px-3 py-3">
                                cara perolehan
                            </th>
                             <th className="border border-gray-300 px-3 py-3">
                                tanggal perolehan
                            </th>
                             <th className="border border-gray-300 px-3 py-3">
                                status penggunaan
                            </th>
                             <th className="border border-gray-300 px-3 py-3">
                                keterangan
                            </th>
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
                                <tr key={item.id}
                                    className="transition duration-100 hover:bg-indigo-50 border-b border-gray-100"
                                >
                                    <td className="border border-gray-200 px-3 py-3 font-mono text-center">
                                        {index + 1}
                                    </td>
                                    <td className="border border-gray-200 px-3 py-3">
                                        {item.kode_barang}
                                    </td>
                                    <td className="border border-gray-200 px-3 py-3">
                                        {item.nama_barang}
                                    </td>
                                    <td className="border border-gray-200 px-3 py-3">
                                        {item.nibar}
                                    </td>
                                    <td className="border border-gray-200 px-3 py-3">
                                        {item.no_register}
                                    </td>
                                    <td className="border border-gray-200 px-3 py-3">
                                        {item.spesifikasi_nama_barang}
                                    </td>
                                    <td className="border border-gray-200 px-3 py-3">
                                        {item.spesifikasi_lainnya}
                                    </td>
                                    <td className="border border-gray-200 px-3 py-3">
                                        {item.jumlah_lantai}
                                    </td>
                                    <td className="border border-gray-200 px-3 py-3">
                                        {item.lokasi}
                                    </td>
                                    <td className="border border-gray-200 px-3 py-3">
                                        {item.titik_koordinat}
                                    </td>
                                    
                                    <td className="border border-gray-200 px-3 py-3">
                                       {item.status_kepemilikan_tanah}
                                    </td>
                                    {/* Bukti Kepemilikan */}
                                    <td className="border border-gray-200 px-3 py-3">
                                       {item.jumlah}
                                    </td>
                                    <td className="border border-gray-200 px-3 py-3">
                                       {item.satuan}
                                    </td>
                                    
                                    <td className="border border-gray-200 px-3 py-3 text-center">
                                       {formatRupiah(item.harga_satuan ?? '0')}
                                    </td>
                                    <td className="border border-gray-200 px-3 py-3 text-center">
                                       {formatRupiah(item.nilai_perolehan ?? '0')}
                                    </td>
                                    {/*  */}
                                    <td className="border border-gray-200 px-3 py-3">
                                        {item.cara_perolehan}
                                    </td>
                                    <td className="border border-gray-200 px-3 py-3">
                                        {formatTanggal(item.tanggal_perolehan)}
                                    </td>
                                    <td className="border border-gray-200 px-3 py-3">
                                        {item.status_penggunaan}
                                    </td>
                                    <td className="border border-gray-200 px-3 py-3">
                                        {item.keterangan}
                                    </td>
                                    <td className="px-3 py-3 text-center">
                                        <div className="flex items-center justify-center space-x-2">
                                            <Link to={`/kib/gedung/edit/${item.id}/edit`} className="cursor-pointer text-amber-600 hover:text-amber-800">
                                                <Settings className='w-5 h-5' />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="cursor-pointer text-red-600 hover:text-red-800"
                                            >
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
            

            {/* CARD LIST - Mobile */}
            <div className="md:hidden space-y-4 p-4 bg-gray-50 min-h-screen">
                    {data.map((item, index) => (
                        <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            {/* Header: Badge & Actions */}
                            <div className="flex justify-between items-center px-4 py-3 bg-gray-50/50 border-b border-gray-100">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">#{index + 1}</span>
                                    <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-mono font-semibold">
                                        {item.kode_barang}
                                    </span>
                                </div>
                                <div className="flex gap-1">
                                    <Link to={`/kib/gedung/edit/${item.id}/edit`} className="p-2 text-gray-400 hover:text-amber-600 transition-colors">
                                        <Pencil className="h-4 w-4" />
                                    </Link>
                                    <button 
                                        onClick={() =>handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Content Body */}
                            <div className="p-4 space-y-5">
                                {/* Section: Bukti Kepemilikan */}
                                <section>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Bukti Kepemilikan</p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <label className="block text-[10px] text-gray-500 mb-0.5">Nama Barang</label>
                                            <p className="text-sm font-semibold text-gray-900">{item.nama_barang}</p>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] text-gray-500 mb-0.5">Nomor</label>
                                            <p className="text-sm font-medium text-gray-800">{item.nomor ?? '-'}</p>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] text-gray-500 mb-0.5">Status Kepemilikan</label>
                                            <p className="text-sm font-medium text-gray-800">{item.status_kepemilikan_tanah}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-[10px] text-gray-500 mb-0.5">Nama Kepemilikan</label>
                                            <p className="text-sm font-medium text-gray-800">{item.nama_kepemilikan ?? '-'}</p>
                                        </div>
                                    </div>
                                </section>

                                <hr className="border-gray-50" />

                                {/* Section: Perolehan */}
                                <section>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Data Perolehan</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-[10px] text-gray-500 mb-0.5">Harga Satuan</label>
                                            <p className="text-sm font-semibold text-emerald-600">Rp {item.harga_perolehan}</p>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] text-gray-500 mb-0.5">Nilai Total</label>
                                            <p className="text-sm font-semibold text-gray-900">Rp {formatRupiah(item.nilai_perolehan)}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <label className="block text-[10px] text-gray-500 mb-0.5">Tanggal Perolehan</label>
                                            <p className="text-sm font-medium text-gray-800">{formatTanggal(item.tanggal_perolehan)}</p>
                                        </div>
                                    </div>
                                </section>

                                {/* Section: Keterangan */}
                                {item.keterangan && (
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <label className="block text-[10px] text-gray-500 mb-1">Keterangan</label>
                                        <p className="text-xs text-gray-600 leading-relaxed italic">"{item.keterangan}"</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
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


            {/* modal */}
            {showImportModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6">

                <h3 className="text-lg font-bold text-gray-800 mb-2">
                    Import Data KIB Gedung
                </h3>

                <p className="text-sm text-gray-600 mb-4">
                    Pastikan file <b>Excel (.xlsx)</b> dan kolom tanggal menggunakan
                    <b> format Date</b>, bukan teks.
                </p>

                <ul className="text-xs text-gray-500 mb-4 list-disc pl-5 space-y-1">
                    <li>Header harus sesuai database</li>
                    <li>format tanggal yang benar (10/05/2004)</li>
                    <li>Tidak boleh merge cell</li>
                </ul>

                {/* PILIH FILE (CUSTOM) */}
                <div
                onClick={() => fileInputRef.current.click()}
                className="cursor-pointer border-2 border-dashed border-emerald-400
                            rounded-lg p-6 text-center hover:bg-emerald-50 transition"
                >
                <div className="flex flex-col items-center gap-2">
                    {/* ICON IMPORT */}
                    <Upload className="w-10 h-10 text-emerald-600" />

                    <p className="text-sm font-medium text-gray-700">
                    Klik untuk pilih file Excel
                    </p>

                    <p className="text-xs text-gray-500">
                    Format: .xlsx / .xls
                    </p>

                    {/* NAMA FILE */}
                    {selectedFile && (
                    <p className="mt-2 text-xs text-emerald-700 font-semibold flex items-center gap-1">
                        <FileText className="h-3 w-3" /> {selectedFile.name}
                    </p>
                    )}
                </div>

                {/* INPUT FILE HIDDEN */}
                <input
                    type="file"
                    accept=".xlsx,.xls"
                    ref={fileInputRef}
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    className="hidden"
                />
                </div>

                {/* ACTION */}
                <div className="flex justify-end gap-2 mt-2">
                    <button
                    onClick={() => {
                        setShowImportModal(false);
                        setSelectedFile(null);
                    }}
                    className="px-4 py-2 text-sm border rounded-md hover:bg-gray-100"
                    >
                    Batal
                    </button>

                    <button
                    disabled={!selectedFile}
                    onClick={importDataExcel}
                    className={`px-4 py-2 text-sm rounded-md text-white
                        ${selectedFile
                        ? "bg-emerald-600 hover:bg-emerald-700"
                        : "bg-gray-400 cursor-not-allowed"}`}
                    >
                    Import
                    </button>
                </div>
                </div>
            </div>
            )}
   </>
  )
}

export default KibGedung

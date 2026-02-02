import { useEffect, useState, useRef } from "react"
import { Link } from "react-router-dom"
import { deleteKibMesin, getKibMesin, importExcel } from "../../services/KibMesinService";
import { toast } from "react-toastify";
import {formatRupiah, formatTanggal} from "../../utils/Format"

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
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 text-rose-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                        </svg>
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
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 text-emerald-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125h-7.5c-.621 0-1.125-.504-1.125-1.125m0 1.125v-1.5c0-.621.504-1.125 1.125-1.125m0 0h7.5m-7.5 0V5.625m0 0c0-.621.504-1.125 1.125-1.125h6.375c.621 0 1.125.504 1.125 1.125v1.5m-8.625-1.5H3.375m0 0c-.621 0-1.125.504-1.125 1.125v1.5m1.125-1.5h7.5" />
                        </svg>
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
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 group-focus-within:text-indigo-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
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
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-4 w-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                            </svg>
                            <span>Import Excel</span>
                        </button>
        
                        {/* Tambah Data - Primary Action */}
                        <Link to={"/kib/mesin/create"} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 active:scale-95 transition-all duration-200 text-sm font-semibold shadow-md shadow-indigo-100">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="h-4 w-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
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
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className='w-5 h-5'>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                                </svg>
                                                </Link>
                                                <button onClick={() => handleDelete(item.id)} className="cursor-pointer text-red-600 hover:text-red-800">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5" >
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                    </svg>
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
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5" >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 18.07a4.5 4.5 0 0 1-1.897 1.13L6 20l1.995-5.385a4.5 4.5 0 0 1 1.13-1.897l8.243-8.243Z" />
                                            </svg>
                                        </Link>
                                        <button className="text-red-600 hover:text-red-700 p-1" >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-5 w-5" >
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                            </svg>
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
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-10 h-10 text-emerald-600">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5v-9m0 0L8.25 10.5M12 7.5l3.75 3M4.5 18.75h15"/>
                    </svg>
                    <p className="text-sm font-medium text-gray-700">Klik untuk pilih file Excel</p>
                    <p className="text-xs text-gray-500">Format: .xlsx / .xls</p>
                    {/* NAMA FILE */}
                    {selectedFile && (
                    <p className="mt-2 text-xs text-emerald-700 font-semibold">📄 {selectedFile.name}</p>
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


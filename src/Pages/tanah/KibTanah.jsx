import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { getKibTanah, deleteKibTanah, importExcel } from "../../services/KibTanahService";
import { toast } from "react-toastify";
import { formatRupiah, formatTanggal } from "../../utils/Format";
import {
  Search,
  Plus,
  Upload,
  FileText,
  FileSpreadsheet,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";
import { LoadingSpinner } from "../../components/FormComponents";
import AlertDialog from "../../components/ui/AlertDialog";

// Halaman Daftar KIB Tanah
function KibTanah() {
  // Data & pagination
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");

  // Delete confirmation
  const [deleteId, setDeleteId] = useState(null);

  // Import modal
  const fileInputRef = useRef(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [importing, setImporting] = useState(false);

  // FETCH DATA
  const fetchData = async (page = 1) => {
    try {
      const res = await getKibTanah(page, search);
      const paginate = res.data;
      setData(paginate.data);
      setCurrentPage(paginate.current_page);
      setLastPage(paginate.last_page);
      setTotal(paginate.total);
    } catch (err) {
      console.log(err);
      toast.error("Gagal mengambil data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, search]);

  // DELETE
  const handleDelete = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteKibTanah(deleteId);
      toast.success("Berhasil Menghapus");
      setData((prev) => prev.filter((item) => item.id !== deleteId));
    } catch (error) {
      console.log(error);
      toast.error("Gagal menghapus");
    } finally {
      setDeleteId(null);
    }
  };

  // IMPORT EXCEL
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

    setImporting(true);
    try {
      await importExcel(formData);
      toast.success("Data berhasil diimport");
      setShowImportModal(false);
      setSelectedFile(null);
      fetchData();
    } catch (error) {
      console.log(error);
      toast.error("Gagal mengimport data");
    } finally {
      setImporting(false);
    }
  };

  // EXPORT
  const exportPdf = () => {
    window.open(`${import.meta.env.VITE_API_URL}/kib-tanah/export/pdf`);
  };

  const exportExcel = () => {
    window.open(`${import.meta.env.VITE_API_URL}/kib-tanah/export/excel`);
  };

  // RENDER
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4">

        {/* ——— HEADER ——— */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
              <h1 className="text-2xl md:text-4xl font-light text-gray-900 tracking-tighter">
                Data Kartu Inventaris <span className="font-semibold tracking-tighter text-black uppercase">Tanah</span>
              </h1>
              <p className="text-gray-500 mt-2 text-sm italic">Kelola data aset inventaris negara (KIB/KIR).</p>
          </div>
          <div className="flex items-center gap-3">
            {/* <div className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-center shadow-sm">
              <p className="text-xs font-medium text-gray-400">Total Aset</p>
              <p className="text-lg font-bold text-blue-600">{total}</p>
            </div> */}
            <button
              onClick={exportPdf}
              className="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-100 transition-colors"
            >
              <FileText className="h-4 w-4" />
              Export PDF
            </button>
            <button
              onClick={exportExcel}
              className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-100 transition-colors"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Export Excel
            </button>
          </div>
        </div>

        {/* ——— SEARCH & ACTIONS ——— */}
        <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nama atau kode barang..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm
                         placeholder:text-gray-400
                         focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowImportModal(true)}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Upload className="h-4 w-4" />
                Import Excel
              </button>
              <Link
                to="/kib/tanah/create"
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Tambah Data
              </Link>
            </div>
          </div>
        </div>

        {/* ——— TABLE (DESKTOP) ——— */}
        <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-left text-xs">
            <thead>
              {/* Row 1 */}
              <tr className="border-b border-gray-200 bg-gray-50 font-semibold text-gray-600 uppercase">
                <th rowSpan={2} className="px-3 py-3 text-center w-10">No</th>
                <th rowSpan={2} className="px-3 py-3 bg-blue-50 text-blue-700">Kode Barang</th>
                <th rowSpan={2} className="px-3 py-3">Nama</th>
                <th colSpan={4} className="px-3 py-3 text-center border-x border-gray-200">Bukti Kepemilikan</th>
                <th rowSpan={2} className="px-3 py-3">Harga Satuan</th>
                <th rowSpan={2} className="px-3 py-3">Nilai Perolehan</th>
                <th rowSpan={2} className="px-3 py-3">Tgl Perolehan</th>
                <th rowSpan={2} className="px-3 py-3">Keterangan</th>
                <th rowSpan={2} className="px-3 py-3 text-center w-20">Aksi</th>
              </tr>
              {/* Row 2 — sub header Bukti Kepemilikan */}
              <tr className="border-b border-gray-200 bg-gray-50 font-semibold text-gray-500 uppercase">
                <th className="px-3 py-2 border-x border-gray-200">Nama</th>
                <th className="px-3 py-2 border-r border-gray-200">Nomor</th>
                <th className="px-3 py-2 border-r border-gray-200">Tanggal</th>
                <th className="px-3 py-2">Nama Kepemilikan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={12} className="py-12 text-center text-gray-400">Memuat data...</td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-12 text-center text-gray-400 italic">~~ Data kosong ~~</td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-3 text-center text-gray-400">{index + 1}</td>
                    <td className="px-3 py-3 font-mono font-medium text-gray-900">{item.kode_barang}</td>
                    <td className="px-3 py-3 text-gray-700">{item.nama_barang}</td>
                    {/* Bukti Kepemilikan */}
                    <td className="px-3 py-3 text-gray-600 border-x border-gray-100">{item.nama || "-"}</td>
                    <td className="px-3 py-3 text-gray-600 border-r border-gray-100">{item.nomor || "-"}</td>
                    <td className="px-3 py-3 text-gray-600 border-r border-gray-100">{item.tanggal ? formatTanggal(item.tanggal) : "-"}</td>
                    <td className="px-3 py-3 text-gray-600">{item.nama_kepemilikan || "-"}</td>
                    {/* Nilai */}
                    <td className="px-3 py-3 text-gray-700">{item.harga_satuan ? formatRupiah(item.harga_satuan) : "0"}</td>
                    <td className="px-3 py-3 text-gray-700">{item.nilai_perolehan ? formatRupiah(item.nilai_perolehan) : "0"}</td>
                    <td className="px-3 py-3 text-gray-600">{item.tanggal_perolehan ? formatTanggal(item.tanggal_perolehan) : "-"}</td>
                    <td className="px-3 py-3 text-gray-500 max-w-37.5 truncate">{item.keterangan || "-"}</td>
                    {/* Aksi */}
                    <td className="px-3 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/kib/tanah/edit/${item.id}/edit`}
                          className="rounded p-1 text-gray-400 hover:text-amber-600 transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="rounded p-1 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ——— CARD LIST (MOBILE) ——— */}
        <div className="md:hidden space-y-4">
          {loading ? (
            <div className="py-12 text-center text-sm text-gray-400">Memuat data...</div>
          ) : data.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-400 italic">~~ Data kosong ~~</div>
          ) : (
            data.map((item, index) => (
              <div key={item.id} className="rounded-lg border border-gray-200 bg-white overflow-hidden">
                {/* Card header */}
                <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">#{index + 1}</span>
                    <span className="rounded bg-blue-50 px-2 py-0.5 font-mono text-xs font-semibold text-blue-700">
                      {item.kode_barang}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <Link
                      to={`/kib/tanah/edit/${item.id}/edit`}
                      className="rounded p-1.5 text-gray-400 hover:text-amber-600 transition-colors"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="rounded p-1.5 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-4 space-y-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-900">{item.nama_barang}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-gray-400">Nama Dokumen</p>
                      <p className="font-medium text-gray-800">{item.nama || "-"}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Nomor</p>
                      <p className="font-medium text-gray-800">{item.nomor || "-"}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Tanggal</p>
                      <p className="font-medium text-gray-800">{item.tanggal ? formatTanggal(item.tanggal) : "-"}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Nama Kepemilikan</p>
                      <p className="font-medium text-gray-800">{item.nama_kepemilikan || "-"}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Harga Satuan</p>
                      <p className="font-semibold text-gray-900">{item.harga_satuan ? formatRupiah(item.harga_satuan) : "0"}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Nilai Perolehan</p>
                      <p className="font-semibold text-gray-900">{item.nilai_perolehan ? formatRupiah(item.nilai_perolehan) : "0"}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-400">Tanggal Perolehan</p>
                      <p className="font-medium text-gray-800">{item.tanggal_perolehan ? formatTanggal(item.tanggal_perolehan) : "-"}</p>
                    </div>
                  </div>

                  {item.keterangan && (
                    <div className="rounded-lg bg-gray-50 p-3 text-xs text-gray-600 italic">
                      "{item.keterangan}"
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* ——— PAGINATION ——— */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Halaman {currentPage} dari {lastPage} (Total {total} data Aset Tanah)
          </p>
          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Kembali
            </button>
            <button
              disabled={currentPage === lastPage}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Berikutnya
            </button>
          </div>
        </div>

        {/* ——— IMPORT MODAL ——— */}
        {showImportModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
    <div className="w-full max-w-md animate-in fade-in-0 zoom-in-95 duration-200 rounded-xl border border-zinc-200 bg-white p-6 shadow-lg">
      
      {/* Header Ala Shadcn */}
      <div className="flex flex-col space-y-1.5 text-left mb-5">
        <h3 className="text-lg font-semibold leading-none tracking-tight text-zinc-950">
          Import Data KIB Tanah
        </h3>
        <p className="text-sm text-zinc-500">
          Pastikan file Excel (.xlsx) dengan format yang benar.
        </p>
      </div>

      {/* Info / Panduan Kecil */}
      <div className="mb-5 rounded-lg bg-zinc-50 p-3 border border-zinc-100">
        <ul className="list-disc pl-4 text-xs text-zinc-600 space-y-1">
          <li>Header harus sesuai database</li>
          <li>Format tanggal yang benar (contoh: 10/05/2004)</li>
          <li>Tidak boleh merge cell</li>
        </ul>
      </div>

      {/* Drop Zone Ala Shadcn */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="group relative mb-6 cursor-pointer rounded-lg border border-dashed border-zinc-300 p-6 text-center hover:border-zinc-400 hover:bg-zinc-50/50 transition-all flex flex-col items-center justify-center"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white shadow-sm group-hover:scale-105 transition-transform">
          <Upload className="h-4 w-4 text-zinc-500" />
        </div>
        
        <p className="mt-3 text-sm font-medium text-zinc-900">
          Klik untuk pilih file Excel
        </p>
        <p className="text-xs text-zinc-400 mt-0.5">Format: .xlsx</p>
        
        {selectedFile && (
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800 animate-in fade-in duration-300">
            <FileText className="h-3 w-3 text-emerald-600" />
            {selectedFile.name}
          </div>
        )}
        
        <input
          type="file"
          accept=".xlsx,.xls"
          ref={fileInputRef}
          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
          className="hidden"
        />
      </div>

      {/* Footer / Actions Ala Shadcn */}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
        <button
          type="button"
          onClick={() => {
            setShowImportModal(false);
            setSelectedFile(null);
          }}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-zinc-200 bg-white px-4 py-2 text-zinc-900 hover:bg-zinc-100 active:scale-[0.98]"
        >
          Batal
        </button>
        <button
          type="button"
          disabled={!selectedFile || importing}
          onClick={importDataExcel}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-900/90 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] gap-2"
        >
          {importing && (
            <Loader2 className="h-4 w-4 animate-spin" /> // Jika memakai Lucide icon spinner
          )}
          {importing ? "Mengimport..." : "Import"}
        </button>
      </div>

    </div>
  </div>
)}

        {/* ——— DELETE CONFIRMATION ——— */}
        <AlertDialog
          open={deleteId !== null}
          onClose={() => setDeleteId(null)}
          onConfirm={confirmDelete}
          title="Hapus Data Aset Tanah"
          description="Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan."
          confirmText="Ya, Hapus"
          cancelText="Batal"
          variant="danger"
        />
      </div>
    </div>
  );
}

export default KibTanah;

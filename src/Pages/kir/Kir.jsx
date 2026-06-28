import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { deleteKir, getKir } from "../../services/KirService";
import { toast } from "react-toastify";
import { formatRupiah, formatTanggal } from "../../utils/Format";
import {
  Search,
  Plus,
  Building2,
  Pencil,
  Trash2,
} from "lucide-react";
import AlertDialog from "../../components/ui/AlertDialog";

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
    } catch (err) {
      console.log(err);
      toast.error("Gagal mengambil data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, search]);

  const [deleteId, setDeleteId] = useState(null);

  const handleDelete = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteKir(deleteId);
      toast.success("Berhasil menghapus");
      setData((prev) => prev.filter((item) => item.id !== deleteId));
    } catch (error) {
      console.log(error);
      toast.error("Gagal menghapus");
    } finally {
      setDeleteId(null);
    }
  };

  const kondisiBadge = (kondisi) => {
    let bg, text;
    switch (kondisi) {
      case "baik":
        bg = "bg-green-50";
        text = "text-green-700";
        break;
      case "kurang baik":
        bg = "bg-yellow-50";
        text = "text-yellow-700";
        break;
      case "rusak berat":
        bg = "bg-red-50";
        text = "text-red-700";
        break;
      default:
        bg = "bg-gray-50";
        text = "text-gray-700";
    }
    return `${bg} ${text} px-2 py-0.5 rounded-full text-xs font-medium`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4">

        {/* ——— HEADER ——— */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl md:text-4xl font-light text-gray-900 tracking-tighter">
              Data Kartu Inventaris <span className="font-semibold tracking-tighter text-black uppercase">Ruangan</span>
            </h1>
            <p className="text-gray-500 mt-2 text-sm italic">Kelola data aset inventaris negara (KIB/KIR).</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-center shadow-sm">
              <p className="text-xs font-medium text-gray-400">Total Aset</p>
              <p className="text-lg font-bold text-blue-600">{total}</p>
            </div>
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
              <Link
                to="/kir/ruangan"
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Building2 className="h-4 w-4" />
                Lihat Ruangan
              </Link>
              <Link
                to="/kir/create"
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
              <tr className="border-b border-gray-200 bg-gray-50 font-semibold text-gray-600 uppercase">
                <th className="px-3 py-3 text-center w-10">No</th>
                <th className="px-3 py-3 bg-blue-50 text-blue-700">Kode Barang</th>
                <th className="px-3 py-3">Nama Barang</th>
                <th className="px-3 py-3">Tgl Perolehan</th>
                <th className="px-3 py-3">Lokasi</th>
                <th className="px-3 py-3">Kondisi</th>
                <th className="px-3 py-3 text-center">Jumlah</th>
                <th className="px-3 py-3">Nilai Perolehan</th>
                <th className="px-3 py-3 text-center bg-blue-50 text-blue-700">QR Code</th>
                <th className="px-3 py-3 text-center">Gambar</th>
                <th className="px-3 py-3 text-center w-20">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-gray-400">Memuat data...</td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-gray-400 italic">~~ Data kosong ~~</td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-3 text-center text-gray-400">{index + 1}</td>
                    <td className="px-3 py-3 font-mono font-medium text-gray-900">{item.kode_barang}</td>
                    <td className="px-3 py-3 text-gray-700">{item.nama_barang}</td>
                    <td className="px-3 py-3 text-gray-600">{formatTanggal(item.tanggal_perolehan)}</td>
                    <td className="px-3 py-3 text-gray-700">{item.lokasi}</td>
                    <td className="px-3 py-3">
                      <span className={kondisiBadge(item.kondisi)}>{item.kondisi}</span>
                    </td>
                    <td className="px-3 py-3 text-center text-gray-700">{item.jumlah}</td>
                    <td className="px-3 py-3 text-gray-700">{item.nilai_perolehan ? formatRupiah(item.nilai_perolehan) : "0"}</td>
                    <td className="px-3 py-3 text-center">
                      <div className="inline-flex flex-col items-center">
                        {item.gambar_qr ? (
                          <a href={`${import.meta.env.VITE_API_URL_IMAGE}/storage/${item.gambar_qr}`} target="_blank" rel="noreferrer">
                            <img src={`${import.meta.env.VITE_API_URL_IMAGE}/storage/${item.gambar_qr}`} alt="QR Code" className="w-10 h-10 object-contain" />
                          </a>
                        ) : (
                          <div className="w-10 h-10 border border-dashed border-gray-300 rounded flex items-center justify-center text-[9px] text-gray-400">
                            QR
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <div className="inline-flex flex-col items-center">
                        {item.gambar ? (
                          <img src={`${import.meta.env.VITE_API_URL_IMAGE}/storage/${item.gambar}`} alt="Gambar" className="w-10 h-10 object-cover rounded" />
                        ) : (
                          <div className="w-10 h-10 border border-dashed border-gray-300 rounded flex items-center justify-center text-[9px] text-gray-400">
                            Gambar
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/kir/edit/${item.id}/edit`}
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
                      to={`/kir/edit/${item.id}/edit`}
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
                    <p className="text-sm font-semibold text-gray-900">{item.nama_barang}</p>
                    <p className="text-xs text-gray-500">{item.lokasi}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-gray-400">Tgl Perolehan</p>
                      <p className="font-medium text-gray-800">{formatTanggal(item.tanggal_perolehan)}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Jumlah</p>
                      <p className="font-medium text-gray-800">{item.jumlah}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Kondisi</p>
                      <span className={kondisiBadge(item.kondisi)}>{item.kondisi}</span>
                    </div>
                    <div>
                      <p className="text-gray-400">Nilai Perolehan</p>
                      <p className="font-semibold text-gray-900">{item.nilai_perolehan ? formatRupiah(item.nilai_perolehan) : "0"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-3 border-t border-gray-100">
                    <div className="flex flex-col items-center">
                      {item.gambar_qr ? (
                        <a href={`${import.meta.env.VITE_API_URL_IMAGE}/storage/${item.gambar_qr}`} target="_blank" rel="noreferrer">
                          <img src={`${import.meta.env.VITE_API_URL_IMAGE}/storage/${item.gambar_qr}`} alt="QR Code" className="w-12 h-12 object-contain" />
                        </a>
                      ) : (
                        <div className="w-12 h-12 border border-dashed border-gray-300 rounded flex items-center justify-center text-[9px] text-gray-400">
                          QR
                        </div>
                      )}
                      <span className="mt-1 text-[10px] text-gray-400">QR Code</span>
                    </div>
                    <div className="flex flex-col items-center">
                      {item.gambar ? (
                        <img src={`${import.meta.env.VITE_API_URL_IMAGE}/storage/${item.gambar}`} alt="Gambar" className="w-12 h-12 object-cover rounded" />
                      ) : (
                        <div className="w-12 h-12 border border-dashed border-gray-300 rounded flex items-center justify-center text-[9px] text-gray-400">
                          Gambar
                        </div>
                      )}
                      <span className="mt-1 text-[10px] text-gray-400">Gambar</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ——— PAGINATION ——— */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Halaman {currentPage} dari {lastPage} (Total {total} data Aset Ruangan)
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

        {/* ——— DELETE CONFIRMATION ——— */}
        <AlertDialog
          open={deleteId !== null}
          onClose={() => setDeleteId(null)}
          onConfirm={confirmDelete}
          title="Hapus Data Aset Ruangan"
          description="Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan."
          confirmText="Ya, Hapus"
          cancelText="Batal"
          variant="danger"
        />
      </div>
    </div>
  );
}

export default Kir;

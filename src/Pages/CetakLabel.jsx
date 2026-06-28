import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getKir, cetakLabelKir } from "../services/KirService";
import { toast } from "react-toastify";
import { Search, Printer, Settings, ArrowLeft } from "lucide-react";
import { LoadingSpinner } from "../components/FormComponents";

// =====================================================
// PreviewLabelBoxStatic — preview label cetak
// =====================================================
function PreviewLabelBoxStatic({ item }) {
  if (!item) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-400">
        Pilih aset untuk preview label
      </div>
    );
  }

  return (
    <div className="border border-yellow-500 bg-white p-1 shadow-sm w-full max-w-[280px] mx-auto">
      <div className="flex items-center justify-between border-b border-gray-500 pb-0.5 mb-0.5">
        <div className="flex items-center gap-1">
          <img src="/logo.png" alt="Logo" className="w-3 h-3 rounded-full object-cover" />
          <span className="font-semibold text-[6px] leading-none">PEMERINTAH KOTA BANDUNG</span>
        </div>
        <span className="font-extrabold text-[6px] text-gray-700 leading-none">KEC. BANDUNG KIDUL</span>
      </div>
      <div className="flex gap-1 items-start h-10">
        <div className="flex flex-col items-center justify-center w-14 h-full border border-gray-400 p-0.5 flex-shrink-0">
          {item.gambar_qr ? (
            <img
              src={`${import.meta.env.VITE_API_URL_IMAGE}/storage/${item.gambar_qr}`}
              alt="QR"
              className="w-7 h-7 object-cover"
            />
          ) : (
            <div className="w-7 h-7 flex items-center justify-center bg-gray-100 text-[6px] text-gray-400">QR</div>
          )}
        </div>
        <div className="flex-1 text-left pt-0.5 leading-[10px]">
          <p className="text-[7px]">
            <span className="w-8 inline-block font-bold">Kode</span>: {item.kode_barang}
          </p>
          <p className="text-[7px]">
            <span className="w-8 inline-block font-bold">Nama</span>: {item.nama_barang}
          </p>
          <p className="text-[7px]">
            <span className="w-8 inline-block font-bold">Lokasi</span>: {item.lokasi}
          </p>
          <p className="text-[7px]">
            <span className="w-8 inline-block font-bold">Tanggal</span>: {item.tanggal_perolehan}
          </p>
        </div>
      </div>
    </div>
  );
}

// =====================================================
// Halaman Cetak Label
// =====================================================
function CetakLabel() {
  const [kirData, setKirData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedKir, setSelectedKir] = useState(null);
  const [selectedKirIds, setSelectedKirIds] = useState([]);

  // ===============================
  // FETCH DATA
  // ===============================
  const fetchData = async (page = 1) => {
    try {
      const res = await getKir(page, search);
      const paginate = res.data;
      setKirData(paginate.data);
      setCurrentPage(paginate.current_page);
      setLastPage(paginate.last_page);
      setTotal(paginate.total);
    } catch (err) {
      console.log(err);
      toast.error("Gagal mengambil data KIR");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage, search]);

  // ===============================
  // HANDLE CETAK
  // ===============================
  const handleCetak = async () => {
    const blob = await cetakLabelKir(selectedKirIds);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "label-kir.pdf";
    a.click();
  };

  const handleCheck = (item) => {
    setSelectedKir(item);
    setSelectedKirIds((prev) =>
      prev.includes(item.id)
        ? prev.filter((id) => id !== item.id)
        : [...prev, item.id]
    );
  };

  // ===============================
  // RENDER
  // ===============================
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4">

        {/* ——— Header ——— */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cetak Label & Barcode</h1>
            <p className="mt-1 text-sm text-gray-500">
              Pilih aset untuk mencetak label QR Code
            </p>
          </div>
          <Link
            to="/kir"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">

          {/* ——— LEFT: Daftar Aset ——— */}
          <div className="flex-1">
            <div className="rounded-lg border border-gray-200 bg-white p-6">

              <h2 className="text-base font-semibold text-gray-900 mb-4">
                Daftar Aset KIR
              </h2>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari nama, kode, atau lokasi..."
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

              {/* Total */}
              <p className="mb-3 text-sm text-gray-500">
                Total aset: <span className="font-semibold text-gray-900">{loading ? "..." : kirData.length}</span>
              </p>

              {/* Table */}
              <div className="overflow-y-auto max-h-[400px] rounded-lg border border-gray-200">
                <table className="w-full text-left text-sm">
                  <thead className="sticky top-0 border-b border-gray-200 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                    <tr>
                      <th className="w-10 px-3 py-3"></th>
                      <th className="px-3 py-3">Nama Barang</th>
                      <th className="px-3 py-3">Kode Barang</th>
                      <th className="px-3 py-3">Lokasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loading ? (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-sm text-gray-400">
                          Memuat data...
                        </td>
                      </tr>
                    ) : kirData.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-12 text-center text-sm text-gray-400 italic">
                          ~~ Data kosong ~~
                        </td>
                      </tr>
                    ) : (
                      kirData.map((item) => (
                        <tr
                          key={item.id}
                          className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                            selectedKirIds.includes(item.id) ? "bg-blue-50" : ""
                          }`}
                          onClick={() => handleCheck(item)}
                        >
                          <td className="px-3 py-2.5 text-center">
                            <input
                              type="checkbox"
                              checked={selectedKirIds.includes(item.id)}
                              onChange={() => handleCheck(item)}
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-3 py-2.5 font-medium text-gray-900">{item.nama_barang}</td>
                          <td className="px-3 py-2.5 text-gray-500">{item.kode_barang}</td>
                          <td className="px-3 py-2.5 text-gray-500">{item.lokasi}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* ——— Pagination ——— */}
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Halaman {currentPage} dari {lastPage}
                  <span className="ml-1">(Total {total} data)</span>
                </p>
                <div className="flex gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Prev
                  </button>
                  <button
                    disabled={currentPage === lastPage}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>

            </div>
          </div>

          {/* ——— RIGHT: Preview & Cetak ——— */}
          <div className="lg:w-80 w-full">
            <div className="rounded-lg border border-gray-200 bg-white p-6 space-y-4">

              <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Konfigurasi Cetak
              </h2>

              {/* Preview label */}
              <PreviewLabelBoxStatic item={selectedKir} />

              {/* Info jumlah dipilih */}
              {selectedKirIds.length > 0 && (
                <p className="text-sm text-blue-600 font-medium text-center">
                  {selectedKirIds.length} item dipilih
                </p>
              )}

              <hr className="border-gray-100" />

              {/* Tombol cetak */}
              <button
                onClick={handleCetak}
                disabled={selectedKirIds.length === 0}
                className="inline-flex items-center justify-center gap-2 w-full rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors
                  disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed
                  bg-blue-600 text-white hover:bg-blue-700"
              >
                <Printer className="h-4 w-4" />
                Cetak ({selectedKirIds.length})
              </button>

              {/* Tips */}
              <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-700">
                <p className="font-semibold mb-1">Tips:</p>
                <p>
                  Gunakan kertas label <b>Tom & Jerry No. 121</b> atau{" "}
                  <b>Sticker HVS A4 Utuh</b> untuk hasil terbaik.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default CetakLabel;

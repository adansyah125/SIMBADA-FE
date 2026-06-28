import { useEffect, useState, useMemo } from "react"
import {formatTanggal} from "../../utils/Format"
import { toast } from "react-toastify"
import { getAllKibMesin } from "../../services/KibMesinService"
import {getBerita, createBerita, deleteBerita} from "../../services/BeritaService"
import axios from "axios"
import { FileText, Download, Trash2, Search, Newspaper, Plus, X, ClipboardList, Users } from "lucide-react";
import AlertDialog from "../../components/ui/AlertDialog";

function Berita() {
  const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mesinList, setMesinList] = useState([]);
    const [search, setSearch] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cardSearch, setCardSearch] = useState("");
    const [cardSearchDebounced, setCardSearchDebounced] = useState("");

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getBerita();
        setData(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchMesin = async () => {
    try {
      const res = await getAllKibMesin();

      const list = Array.isArray(res.data)
        ? res.data
        : res.data.data;

      setMesinList(list || []);
    } catch (err) {
      console.log("error kib mesin:", err);
      setMesinList([]);
    }
  };
    useEffect(() => {
      fetchData();
      fetchMesin();
    }, []);

    useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(handler);
  }, [search]);

    useEffect(() => {
    const handler = setTimeout(() => {
      setCardSearchDebounced(cardSearch);
    }, 300);
    return () => clearTimeout(handler);
  }, [cardSearch]);

    const [form, setForm] = useState({
      nama_pihak1: "",
      nip_pihak1: "",
      jabatan_pihak1: "",
      nama_pihak2: "",
      nip_pihak2: "",
      jabatan_pihak2: "",
      mesin_id: "",
      tanggal: "",
      jumlah: "",
    });

    const handleChange = (e) => {
      setForm({
        ...form,
        [e.target.name]: e.target.value,
      });
    }

    const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createBerita(form);

      toast.success("Berhasil Menambahkan");

      fetchData();

      setForm({
      nama_pihak1: "",
      nip_pihak1: "",
      jabatan_pihak1: "",
      nama_pihak2: "",
      nip_pihak2: "",
      jabatan_pihak2: "",
      mesin_id: "",
      tanggal: "",
      jumlah: "",
      });

      closeModal();

    } catch (err) {
      console.log(err);
      toast.error("Gagal Menambahkan");
    }
  };

  const filteredMesin = Array.isArray(mesinList)
    ? mesinList
        .filter((m) => {
          const key = debouncedSearch.toLowerCase();

          return (
            String(m.nama_barang || "").toLowerCase().includes(key) ||
            String(m.merk || "").toLowerCase().includes(key) ||
            String(m.no_polisi || "").toLowerCase().includes(key)
          );
        })
        .slice(0, 40)
    : [];

  const filteredData = useMemo(() => {
    const key = cardSearchDebounced.toLowerCase();
    if (!key) return data;
    return data.filter((berita) =>
      berita.nama_pihak1?.toLowerCase().includes(key) ||
      berita.nama_pihak2?.toLowerCase().includes(key) ||
      berita.mesin?.nama_barang?.toLowerCase().includes(key) ||
      berita.mesin?.merk?.toLowerCase().includes(key)
    );
  }, [data, cardSearchDebounced]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".dropdown-mesin")) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const [deleteId, setDeleteId] = useState(null);

  const handleDelete = (id) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      await deleteBerita(deleteId);

      toast.success("Berhasil Menghapus");

      setData((prev) => prev.filter((item) => item.id !== deleteId));

    } catch (error) {
      console.log(error);
      toast.error("Gagal menghapus");
    } finally {
      setDeleteId(null);
    }
  }

  const downloadPdf = async (id) => {
  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/berita/${id}/pdf`,
      {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `berita-acara.pdf`);

    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);

  } catch (err) {
    console.log(err);
    toast.error("Gagal mengunduh PDF");
  }
};
  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <Newspaper className="h-5 w-5 text-blue-600" />
              Berita Acara Serah Terima (BAST)
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {data.length > 0 ? `${data.length} dokumen tercatat` : 'Kelola dokumen berita acara'}
            </p>
          </div>
          <button
            onClick={openModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 active:scale-95 transition-all shadow-sm"
          >
            <Plus className="h-4 w-4" />
            New
          </button>
        </div>

        {loading ? (
          <div className="grid gap-3">
            {[1,2,3].map((n) => (
              <div key={n} className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-slate-200 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-1/3" />
                    <div className="h-3 bg-slate-100 rounded w-1/4" />
                    <div className="flex gap-6 mt-2">
                      <div className="space-y-1">
                        <div className="h-2 bg-slate-100 rounded w-12" />
                        <div className="h-3 bg-slate-200 rounded w-24" />
                      </div>
                      <div className="space-y-1">
                        <div className="h-2 bg-slate-100 rounded w-12" />
                        <div className="h-3 bg-slate-200 rounded w-24" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-4">
            <div className="h-20 w-20 rounded-full bg-blue-50 flex items-center justify-center mb-5 animate-pulse">
              <ClipboardList className="h-10 w-10 text-blue-300" />
            </div>
            <h3 className="text-base font-semibold text-slate-600 mb-1">Belum ada berita acara</h3>
            <p className="text-sm text-slate-400 mb-6 text-center max-w-xs">
              Buat dokumen berita acara pertama Anda untuk mencatat serah terima barang.
            </p>
            <button
              onClick={openModal}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 active:scale-95 transition-all shadow-sm"
            >
              <Plus className="h-4 w-4" />
              Buat Berita Acara
            </button>
          </div>
        ) : (
          <>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Cari berdasarkan pihak atau barang..."
                value={cardSearch}
                onChange={(e) => setCardSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
              />
            </div>

            <div className="grid gap-3">
              {filteredData.length === 0 ? (
                <div className="text-center py-16 text-sm text-slate-400">
                  Tidak ditemukan hasil untuk "{cardSearch}"
                </div>
              ) : (
                filteredData.map((berita, index) => (
                  <div
                    key={berita.id}
                    className="group bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-200/50 transition-all duration-300"
                    style={{
                      animation: `cardIn 0.4s ease-out ${index * 0.05}s both`
                    }}
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-blue-100 transition-colors">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-sm font-semibold text-slate-800">
                                {berita.mesin?.nama_barang || 'Barang'}
                              </h3>
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-600">
                                {berita.jumlah} Unit
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-400" />
                              {formatTanggal(berita.tanggal)}
                            </p>
                            <div className="grid grid-cols-2 gap-4 mt-3">
                              <div className="bg-slate-50 rounded-lg p-2.5 group-hover:bg-blue-50/50 transition-colors">
                                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 uppercase mb-1">
                                  <Users className="h-3 w-3" />
                                  Pihak I
                                </div>
                                <p className="text-xs font-medium text-slate-700">{berita.nama_pihak1}</p>
                                <p className="text-[10px] text-slate-400">{berita.jabatan_pihak1}</p>
                              </div>
                              <div className="bg-slate-50 rounded-lg p-2.5 group-hover:bg-blue-50/50 transition-colors">
                                <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 uppercase mb-1">
                                  <Users className="h-3 w-3" />
                                  Pihak II
                                </div>
                                <p className="text-xs font-medium text-slate-700">{berita.nama_pihak2}</p>
                                <p className="text-[10px] text-slate-400">{berita.jabatan_pihak2}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 shrink-0 mt-1">
                          <button
                            onClick={() => downloadPdf(berita.id)}
                            className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 active:scale-90 transition-all"
                            title="Unduh PDF"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(berita.id)}
                            className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 active:scale-90 transition-all"
                            title="Hapus"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black/40 animate-in fade-in duration-200" onClick={closeModal}></div>
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between px-6 pt-6 pb-2">
                <h2 className="text-lg font-semibold text-slate-800">Buat Berita Acara</h2>
                <button
                  onClick={closeModal}
                  className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500">Tanggal</label>
                  <input
                    type="date"
                    name="tanggal"
                    value={form.tanggal}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500">Nama Pihak Pertama (Penyerah)</label>
                  <input
                    type="text"
                    name="nama_pihak1"
                    value={form.nama_pihak1}
                    onChange={handleChange}
                    placeholder="Nama lengkap"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-500">NIP</label>
                    <input
                      type="text"
                      name="nip_pihak1"
                      value={form.nip_pihak1}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-500">Jabatan</label>
                    <input
                      type="text"
                      name="jabatan_pihak1"
                      value={form.jabatan_pihak1}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-slate-500">Nama Pihak Kedua (Penerima)</label>
                  <input
                    type="text"
                    name="nama_pihak2"
                    value={form.nama_pihak2}
                    onChange={handleChange}
                    placeholder="Nama lengkap"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-500">NIP</label>
                    <input
                      type="text"
                      name="nip_pihak2"
                      value={form.nip_pihak2}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-500">Jabatan</label>
                    <input
                      type="text"
                      name="jabatan_pihak2"
                      value={form.jabatan_pihak2}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-4">
                  <div className="space-y-1 relative dropdown-mesin">
                    <label className="text-xs font-medium text-slate-500">Penggunaan Barang</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Cari nama, merk, no polisi..."
                        value={search}
                        onFocus={() => setIsDropdownOpen(true)}
                        onChange={(e) => {
                          setSearch(e.target.value);
                          setIsDropdownOpen(true);
                        }}
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                    </div>
                    {isDropdownOpen && search && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto">
                        {filteredMesin.length === 0 ? (
                          <div className="p-3 text-center text-sm text-slate-400 italic">
                            Barang tidak ditemukan...
                          </div>
                        ) : (
                          filteredMesin.map((m) => (
                            <div
                              key={m.id}
                              onClick={() => {
                                setForm({ ...form, mesin_id: m.id });
                                setSearch(`${m.nama_barang} - ${m.merk}`);
                                setIsDropdownOpen(false);
                              }}
                              className="px-3 py-2.5 text-sm cursor-pointer border-b border-slate-50 last:border-0 hover:bg-blue-50 transition-colors"
                            >
                              <span className="font-medium text-slate-700">{m.nama_barang}</span>
                              <span className="text-xs text-slate-400 ml-2">{m.merk} &bull; {m.no_polisi}</span>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-500">Total Unit</label>
                    <div className="relative">
                      <input
                        type="number"
                        name="jumlah"
                        value={form.jumlah}
                        onChange={handleChange}
                        placeholder="0"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors pr-16"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-medium">Unit</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm"
                  >
                    Simpan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ——— DELETE CONFIRMATION ——— */}
        <AlertDialog
          open={deleteId !== null}
          onClose={() => setDeleteId(null)}
          onConfirm={confirmDelete}
          title="Hapus Berita Acara"
          description="Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan."
          confirmText="Ya, Hapus"
          cancelText="Batal"
          variant="danger"
        />

        <style>{`
          @keyframes cardIn {
            from { opacity: 0; transform: translateY(12px) scale(0.97); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}</style>
      </div>
    </div>
  )
}


export default Berita
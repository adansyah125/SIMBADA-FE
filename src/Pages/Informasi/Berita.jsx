import { useEffect, useState } from "react"
import {formatTanggal} from "../../utils/Format"
import { toast } from "react-toastify"
import { getAllKibMesin } from "../../services/KibMesinService"
import {getBerita, createBerita, deleteBerita} from "../../services/BeritaService"
import axios from "axios"

function Berita() {
  const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [mesinList, setMesinList] = useState([]);
    const [search, setSearch] = useState("");
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [debouncedSearch, setDebouncedSearch] = useState("");
  
  
  
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
  
      // Antisipasi bentuk response
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
  
      toast.success("Data berhasil ditambahkan");
  
      // 🔥 Refresh list tanpa pindah halaman
      fetchData();
  
      // 🔁 Reset form
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
  
    } catch (err) {
      console.log(err);
      toast.error("Gagal menyimpan data");
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
        .slice(0, 40)   // 🔥 batasi biar ringan
    : [];
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
  
  const handleDelete = async (id) => {
    const confirm = window.confirm("Yakin ingin menghapus data ini?");
  
    if (!confirm) return;
  
    try {
      await deleteBerita(id);
  
      toast.success("Data berhasil dihapus");
  
      // refresh data
      setData((prev) => prev.filter((item) => item.id !== id));
  
    } catch (error) {
      console.log(error);
      toast.error("Gagal menghapus data");
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

    // Buat file dari blob
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `berita-acara.pdf`);

    document.body.appendChild(link);
    link.click();

    // bersih-bersih
    link.remove();
    window.URL.revokeObjectURL(url);

  } catch (err) {
    console.log(err);
    toast.error("Gagal mengunduh PDF");
  }
};
  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        
        {/* SISI KIRI: DAFTAR BERITA */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">📰 Daftar Berita Acara</h1>
            
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-4"></div>
              <p className="text-gray-500 animate-pulse">Memuat data...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {data.map((berita) => (
    <div key={berita.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <span className="px-2 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-md uppercase">Berita Acara</span>
        <span className="ml-auto text-xs text-gray-400 italic">{formatTanggal(berita.tanggal)}</span>
      </div>
      
      {/* INFORMASI PIHAK PERTAMA & KEDUA */}
      <div className="space-y-3 mb-4">
        <div>
          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Pihak Pertama (Penyerah)</p>
          <h3 className="font-bold text-gray-800 text-base leading-tight">{berita.nama_pihak1}</h3>
          <p className="text-[10px] text-gray-500">NIP: {berita.nip_pihak1 || '-'} • {berita.jabatan_pihak1}</p>
        </div>

        <div className="flex items-center gap-2 py-1">
          <div className="h-[1px] flex-1 bg-gray-100"></div>
          <span className="text-[9px] text-gray-300 font-bold uppercase tracking-widest">Kepada</span>
          <div className="h-[1px] flex-1 bg-gray-100"></div>
        </div>

        <div>
          <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Pihak Kedua (Penerima)</p>
          <h3 className="font-bold text-gray-800 text-base leading-tight">{berita.nama_pihak2}</h3>
          <p className="text-[10px] text-gray-500">NIP: {berita.nip_pihak2 || '-'} • {berita.jabatan_pihak2}</p>
        </div>
      </div>
      
      {/* INFORMASI UNIT */}
      <div className="p-3 bg-green-50 rounded-xl mb-3 flex justify-between items-center">
        <div>
          <p className="text-[9px] text-green-500 uppercase font-bold">Total Unit</p>
          <p className="text-sm font-bold text-green-700">{berita.jumlah} Unit</p>
        </div>
        <div className="text-right">
          <p className="text-[9px] text-gray-400 uppercase font-bold italic">Kode Aset: #{berita.mesin_id}</p>
        </div>
      </div>

      <div className="mt-3 text-[10px] text-gray-400 flex items-center gap-1 bg-gray-50 p-2 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <span className="truncate">
          <strong>Aset:</strong> {berita.mesin?.nama_barang || '-'} ({berita.mesin?.merk || '-'})
        </span>
      </div>

      {/* BUTTON ACTIONS */}
      <div className="flex gap-2 mt-4">
        <button 
        onClick={() => downloadPdf(berita.id)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-xl text-[11px] font-bold hover:bg-blue-600 hover:text-white transition-all active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Unduh PDF
        </button>
        <button 
          onClick={() => handleDelete(berita.id)}
          className="px-3 py-2 bg-red-50 text-red-600 rounded-xl text-[11px] font-bold hover:bg-red-600 hover:text-white transition-all active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-4 w-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
          </svg>
        </button>
      </div>
    </div>
  ))}
</div>
          )}
        </div>

        {/* SISI KANAN: FORM INPUT (STICKY) */}
        <div className="lg:w-96">
          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 sticky top-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <span className="w-2 h-6 bg-indigo-600 rounded-full"></span>
              Buat Berita Acara
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Tanggal</label>
                <input type="date" name="tanggal" value={form.tanggal} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all outline-none" />
              </div>
             <div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Nama Pihak Pertama</label>
                <input type="text" name="nama_pihak1" value={form.nama_pihak1} onChange={handleChange} placeholder="Contoh: John Doe" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">NIP</label>
                  <input type="text" name="nip_pihak1" value={form.nip_pihak1} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">Jabatan</label>
                  <input type="text" name="jabatan_pihak1" value={form.jabatan_pihak1} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all outline-none" />
                </div>
              </div>
              </div>
             <div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-400 uppercase ml-1">Nama Pihak Pertama</label>
                <input type="text" name="nama_pihak2" value={form.nama_pihak2} onChange={handleChange} placeholder="Contoh: John Doe" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">NIP</label>
                  <input type="text" name="nip_pihak2" value={form.nip_pihak2} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">Jabatan</label>
                  <input type="text" name="jabatan_pihak2" value={form.jabatan_pihak2} onChange={handleChange} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all outline-none" />
                </div>
              </div>
              </div>
             

              <div className="pt-4 border-t border-gray-100">
  <div className="space-y-1 mb-4 relative">
  <label className="text-xs font-bold text-gray-400 uppercase ml-1">
    Penggunaan Barang
  </label>

  <div className="relative group">
    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </div>
    <input
      type="text"
      placeholder="Cari nama, merk, no polisi..."
      value={search}
      onFocus={() => setIsDropdownOpen(true)} // Buka dropdown saat diklik
      onChange={(e) => {
        setSearch(e.target.value);
        setIsDropdownOpen(true);
      }}
      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all outline-none"
    />
  </div>

  {/* Tampilkan dropdown HANYA jika isDropdownOpen true dan search tidak kosong */}
  {isDropdownOpen && search && (
    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-100 rounded-xl shadow-2xl max-h-60 overflow-y-auto overflow-x-hidden">
      {filteredMesin.length === 0 ? (
        <div className="p-4 text-center text-sm text-gray-400 italic">
          Barang tidak ditemukan...
        </div>
      ) : (
        filteredMesin.map((m) => (
          <div
            key={m.id}
            onClick={() => {
              setForm({ ...form, mesin_id: m.id });
              setSearch(`${m.nama_barang} - ${m.merk}`);
              setIsDropdownOpen(false); // 👈 KUNCINYA: Tutup dropdown setelah pilih
            }}
            className="p-3 text-sm cursor-pointer border-b border-gray-50 last:border-0 hover:bg-indigo-50 transition-colors flex flex-col"
          >
            <span className="font-semibold text-gray-700">{m.nama_barang}</span>
            <span className="text-[10px] text-gray-400">{m.merk} • {m.no_polisi}</span>
          </div>
        ))
      )}
    </div>
  )}
</div>

  <div className="space-y-1">
    <label className="text-xs font-bold text-gray-400 uppercase ml-1">
      Total Unit
    </label>
    <div className="relative flex items-center">
      <input
        type="number"
        name="jumlah"
        value={form.jumlah}
        onChange={handleChange}
        placeholder="0"
        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all outline-none"
      />
      <span className="absolute right-4 text-[10px] font-bold text-gray-300 uppercase">Unit</span>
    </div>
  </div>
</div>
              <button className="w-full mt-4 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95">
                Buat
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  )
}


export default Berita

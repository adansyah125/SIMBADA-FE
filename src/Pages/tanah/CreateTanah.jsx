import { Link} from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { createKibTanah } from "../../services/KibTanahService";
import { toast } from "react-toastify";

function CreateTanah() {
    const navigate = useNavigate();
   

  const [form, setForm] = useState({
    kode_barang: "",
    nama_barang: "",
    nibar: "",
    no_register: "",
    spesifikasi_nama_barang: "",
    spesifikasi_lainnya: "",
    jumlah:"",
    satuan: "",
    lokasi: "",
    titik_koordinat: "",
    nama:"",
    nomor:"",
    tanggal:"",
    nama_kepemilikan:"",
    harga_satuan: "",
    nilai_perolehan:"",
    tanggal_perolehan: "",
    cara_perolehan:"",
    status_penggunaan:"",
    keterangan:"",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // Kirim objek form biasa, biarkan fungsi API yang mengubahnya jadi FormData
    await createKibTanah(form); 
    
    toast.success("Data KIB Tanah berhasil ditambahkan");
    navigate("/kib/tanah");
  } catch (error) {
    const errorMsg = error.response?.data?.message || "Gagal menyimpan data";
    console.error("Submit Error:", error.response?.data);
    toast.error(errorMsg);
  }
};
  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-12">
      {/* Header Sticky / Top Bar */}
      <header className="w-full bg-white border-b border-gray-100">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-20">
      
      {/* Left Side: Title & Subtitle */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
            Tambah Data KIB
          </h2>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aset Tanah & Properti
            </p>
          </div>
        </div>
      </div>

      {/* Right Side: Close Button */}
      <div className="flex items-center">
        <Link 
          to="/kib/tanah" 
          className="group flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-600 transition-all duration-200"
        >
          <span className="hidden sm:block text-sm font-semibold">Batalkan</span>
          <div className="h-8 w-8 flex items-center justify-center rounded-lg bg-white shadow-sm group-hover:shadow-none transition-all border border-gray-100 group-hover:border-red-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </Link>
      </div>

    </div>
  </div>
</header>

      <main className="max-w-5xl mx-auto p-4 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Informasi Dasar */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-6 border-l-4 border-green-500 pl-3">
              <h3 className="font-bold text-gray-800 uppercase tracking-tight text-sm">Informasi Utama Barang</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Input type="text" label="Kode Barang" name="kode_barang" value={form.kode_barang} onChange={handleChange} />
              <Input type="text" label="Nama Barang" name="nama_barang" value={form.nama_barang} onChange={handleChange} />
              <Input type="text" label="NIBAR" name="nibar" value={form.nibar} onChange={handleChange} />
              <Input type="text" label="No Register" name="no_register" value={form.no_register} onChange={handleChange} />
              <Input type="text" label="Spesifikasi Nama Barang" name="spesifikasi_nama_barang" value={form.spesifikasi_nama_barang} onChange={handleChange} />
              <Input type="text" label="Spesifikasi Lainnya" name="spesifikasi_lainnya" value={form.spesifikasi_lainnya} onChange={handleChange} />
            </div>
          </section>

          {/* Section 2: Fisik & Lokasi */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-6 border-l-4 border-blue-500 pl-3">
              <h3 className="font-bold text-gray-800 uppercase tracking-tight text-sm">Fisik & Lokasi</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid grid-cols-2 gap-4">
                <Input type="text" label="Jumlah" name="jumlah" value={form.jumlah} onChange={handleChange} />
                <Input type="text" label="Satuan" name="satuan" value={form.satuan} onChange={handleChange} />
              </div>
              <Input type="text" label="Lokasi" name="lokasi" value={form.lokasi} onChange={handleChange} />
              <Input type="text" label="Titik Koordinat" name="titik_koordinat" value={form.titik_koordinat} onChange={handleChange} />
              <Input type="text" label="Status Penggunaan" name="status_penggunaan" value={form.status_penggunaan} onChange={handleChange} />
            </div>
          </section>

          {/* Section 3: Dokumen Kepemilikan */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-6 border-l-4 border-amber-500 pl-3">
              <h3 className="font-bold text-gray-800 uppercase tracking-tight text-sm">Bukti Kepemilikan</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input type="text" label="Nama Dokumen" name="nama" value={form.nama} onChange={handleChange} />
              <Input type="text" label="Nomor Dokumen" name="nomor" value={form.nomor} onChange={handleChange} />
              <Input type="date" label="Tanggal Dokumen" name="tanggal" value={form.tanggal} onChange={handleChange} />
              <Input type="text" label="Nama Pemilik" name="nama_kepemilikan" value={form.nama_kepemilikan} onChange={handleChange} />
            </div>
          </section>

          {/* Section 4: Nilai & Perolehan */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-6 border-l-4 border-purple-500 pl-3">
              <h3 className="font-bold text-gray-800 uppercase tracking-tight text-sm">Nilai & Cara Perolehan</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Input type="number" label="Harga Satuan" name="harga_satuan" value={form.harga_satuan} onChange={handleChange} />
              <Input type="number" label="Nilai Perolehan" name="nilai_perolehan" value={form.nilai_perolehan} onChange={handleChange} />
              <Input type="date" label="Tanggal Perolehan" name="tanggal_perolehan" value={form.tanggal_perolehan} onChange={handleChange} />
              <div className="md:col-span-3">
                <Input type="text" label="Cara Perolehan" name="cara_perolehan" value={form.cara_perolehan} onChange={handleChange} />
              </div>
              <div className="md:col-span-3">
                <Input type="text" label="Keterangan" name="keterangan" value={form.keterangan} onChange={handleChange} />
              </div>
            </div>
          </section>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <Link 
              to="/kib/tanah" 
              className="px-6 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
            >
              Batal
            </Link>
            <button 
              type="submit" 
              className="px-8 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-green-200 transition-all transform active:scale-95"
            >
              Simpan Data Aset
            </button>
          </div>

        </form>
      </main>
    </div>
  )
}

function Input({ label, name, value, onChange, type }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">
        {label.replace(/_/g, ' ')}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-sm text-gray-800 placeholder:text-gray-400"
        placeholder={`Masukkan ${label.replace(/_/g, ' ')}...`}
      />
    </div>
  );
}

export default CreateTanah

import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getTanahById,updateKibTanah } from "../../services/KibTanahService";
function EditTanah() {
  const { id } = useParams();
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

  const [loading, setLoading] = useState(true);

  // 🔹 Ambil data lama
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTanahById(id);
        setForm({
        kode_barang: response.data?.kode_barang ?? "",
        nama_barang: response.data?.nama_barang ?? "",
        nibar: response.data?.nibar ?? "",
        no_register: response.data?.no_register ?? "",
        spesifikasi_nama_barang: response.data?.spesifikasi_nama_barang ?? "",
        spesifikasi_lainnya: response.data?.spesifikasi_lainnya ?? "",
        jumlah: response.data?.jumlah ?? "",
        satuan: response.data?.satuan ?? "",
        lokasi: response.data?.lokasi ?? "",
        titik_koordinat: response.data?.titik_koordinat ?? "",
        nama: response.data?.nama ?? "",
        nomor: response.data?.nomor ?? "",
        tanggal: response.data?.tanggal ?? "",
        nama_kepemilikan: response.data?.nama_kepemilikan ?? "",
        harga_satuan: response.data?.harga_satuan ?? "",
        nilai_perolehan: response.data?.nilai_perolehan ?? "",
        tanggal_perolehan: response.data?.tanggal_perolehan ?? "",
        cara_perolehan: response.data?.cara_perolehan ?? "",
        status_penggunaan: response.data?.status_penggunaan ?? "",
        keterangan: response.data?.keterangan ?? "",
        
      });
      } catch (error) {
        console.log(error);
        toast.error("Gagal mengambil data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateKibTanah(id, form);
      toast.success("Data KIB Tanah berhasil diperbarui");
      navigate("/kib/tanah");
    } catch (error) {
      console.log(error);
      toast.error("Gagal memperbarui data");
    }
  };

  if (loading) {
    return (
      <div className="flex space-x-2 justify-center items-center h-screen">
      <span className="sr-only">Loading...</span>
      <div className="h-3 w-3 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="h-3 w-3 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="h-3 w-3 bg-blue-600 rounded-full animate-bounce"></div>
    </div>   
    )
  }

  return (
   <div className="min-h-screen bg-[#FDFDFD] pb-12">
      {/* Header Sticky - Reuse style dari sebelumnya tapi warna Amber */}
      <header className="w-full bg-white border-b border-amber-100">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex justify-between items-center h-20">
      
      {/* Left Side */}
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-amber-100 text-amber-600 shadow-sm shadow-amber-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 18.07a4.5 4.5 0 0 1-1.897 1.13L6 20l1.995-5.385a4.5 4.5 0 0 1 1.13-1.897l8.243-8.243Z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">Edit Data KIB</h2>
          <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Perbarui Informasi Aset Tanah</p>
        </div>
      </div>

      {/* Right Side - Close/Cancel */}
      <Link 
        to="/kib/tanah" 
        className="group p-2 rounded-full hover:bg-red-50 transition-colors duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 group-hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </Link>
      
    </div>
  </div>
</header>

      <main className="max-w-5xl mx-auto p-4 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section: Identitas Barang */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>
            <h3 className="text-sm font-bold text-gray-800 mb-6 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-amber-400"></span>
               Identitas & Spesifikasi
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Input label="Kode Barang" name="kode_barang" value={form.kode_barang} onChange={handleChange} />
              <Input label="Nama Barang" name="nama_barang" value={form.nama_barang} onChange={handleChange} />
              <Input label="NIBAR" name="nibar" value={form.nibar} onChange={handleChange} />
              <Input label="No Register" name="no_register" value={form.no_register} onChange={handleChange} />
              <Input label="Spesifikasi Nama" name="spesifikasi_nama_barang" value={form.spesifikasi_nama_barang} onChange={handleChange} />
              <Input label="Spesifikasi Lainnya" name="spesifikasi_lainnya" value={form.spesifikasi_lainnya} onChange={handleChange} />
            </div>
          </div>

          {/* Section: Lokasi & Fisik */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-400"></div>
            <h3 className="text-sm font-bold text-gray-800 mb-6 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-blue-400"></span>
               Lokasi & Fisik
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Jumlah" name="jumlah" value={form.jumlah} onChange={handleChange} />
                <Input label="Satuan" name="satuan" value={form.satuan} onChange={handleChange} />
              </div>
              <Input label="Lokasi" name="lokasi" value={form.lokasi} onChange={handleChange} />
              <Input label="Titik Koordinat" name="titik_koordinat" value={form.titik_koordinat} onChange={handleChange} />
              <Input label="Status Penggunaan" name="status_penggunaan" value={form.status_penggunaan} onChange={handleChange} />
            </div>
          </div>

          {/* Section: Dokumen & Perolehan */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-400"></div>
            <h3 className="text-sm font-bold text-gray-800 mb-6 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
               Dokumen & Nilai Aset
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              <Input label="Nama Dokumen" name="nama" value={form.nama} onChange={handleChange} />
              <Input label="Nomor Dokumen" name="nomor" value={form.nomor} onChange={handleChange} />
              <Input type="date" label="Tanggal Dokumen" name="tanggal" value={form.tanggal} onChange={handleChange} />
              <Input label="Nama Pemilik" name="nama_kepemilikan" value={form.nama_kepemilikan} onChange={handleChange} />
              <Input type="number" label="Harga Satuan" name="harga_satuan" value={form.harga_satuan} onChange={handleChange} />
              <Input type="number" label="Nilai Perolehan" name="nilai_perolehan" value={form.nilai_perolehan} onChange={handleChange} />
              <Input type="date" label="Tgl Perolehan" name="tanggal_perolehan" value={form.tanggal_perolehan} onChange={handleChange} />
              <Input label="Cara Perolehan" name="cara_perolehan" value={form.cara_perolehan} onChange={handleChange} />
              <TextArea label="Keterangan Tambahan" name="keterangan" value={form.keterangan} onChange={handleChange} />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
            <Link to="/kib/tanah" className="px-6 py-3 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors">
              Batalkan
            </Link>
            <button 
              type="submit" 
              className="px-10 py-3 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-2xl shadow-lg shadow-amber-200 transition-all transform active:scale-95"
            >
              Update Data Aset
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

function Input({ label, name, value, onChange, type }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">
        {label.replace(/_/g, ' ')}
      </label>
      <input
        type={type}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        className="w-full px-4 py-2.5 bg-amber-50/30 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all text-sm text-gray-800"
      />
    </div>
  );
}

function TextArea({ label, name, value, onChange }) {
  return (
    <div className="flex flex-col gap-1.5 md:col-span-2">
      <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest ml-1">
        {label.replace(/_/g, ' ')}
      </label>
      <textarea
        name={name}
        value={value ?? ""}
        onChange={onChange}
        rows="3"
        className="w-full px-4 py-2.5 bg-amber-50/30 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all text-sm text-gray-800"
      ></textarea>
    </div>
  );
}


export default EditTanah;

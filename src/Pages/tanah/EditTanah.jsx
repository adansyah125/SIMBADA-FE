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
    <main className="p-8 flex-1">
      <h2 className="text-2xl font-bold text-yellow-600 mb-6 border-b pb-3">
        ✏️ Edit Data KIB Tanah
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <Input type="text" label="Kode Barang" name="kode_barang" value={form.kode_barang} onChange={handleChange} />
          <Input type="text" label="Nama Barang" name="nama_barang" value={form.nama_barang} onChange={handleChange} />
          <Input type="text" label="NIBAR" name="nibar" value={form.nibar} onChange={handleChange} />
          <Input type="text" label="No Register" name="no_register" value={form.no_register} onChange={handleChange} />
          <Input type="text" label="Spesifikasi Nama Barang" name="spesifikasi_nama_barang" value={form.spesifikasi_nama_barang} onChange={handleChange} />
          <Input type="text" label="Spesifikasi Lainnya" name="spesifikasi_lainnya" value={form.spesifikasi_lainnya} onChange={handleChange} />
          <Input type="text" label="Jumlah" name="jumlah" value={form.jumlah} onChange={handleChange} />
          <Input type="text" label="satuan" name="satuan" value={form.satuan} onChange={handleChange} />
          <Input type="text" label="lokasi" name="lokasi" value={form.lokasi} onChange={handleChange} />
          <Input type="text" label="titik_koordinat" name="titik_koordinat" value={form.titik_koordinat} onChange={handleChange} />
          <Input type="text" label="nama" name="nama" value={form.nama} onChange={handleChange} />
          <Input type="text" label="nomor" name="nomor" value={form.nomor} onChange={handleChange} />
          <Input type="date" label="tanggal" name="tanggal" value={form.tanggal} onChange={handleChange} />
          <Input type="text" label="nama_kepemilikan" name="nama_kepemilikan" value={form.nama_kepemilikan} onChange={handleChange} />
          <Input type="number" label="harga_satuan" name="harga_satuan" value={form.harga_satuan} onChange={handleChange} />
          <Input type="number" label="nilai_perolehan" name="nilai_perolehan" value={form.nilai_perolehan} onChange={handleChange} />
          <Input type="date" label="tanggal_perolehan" name="tanggal_perolehan" value={form.tanggal_perolehan} onChange={handleChange} />
          <Input type="text" label="cara_perolehan" name="cara_perolehan" value={form.cara_perolehan} onChange={handleChange} />
          <Input type="text" label="status_penggunaan" name="status_penggunaan" value={form.status_penggunaan} onChange={handleChange} />
          {/* <Input type="text" label="keterangan" name="keterangan" value={form.keterangan} onChange={handleChange} /> */}
          <TextArea label="keterangan" name="keterangan" value={form.keterangan} onChange={handleChange} />
           

        </div>

        <div className="flex justify-end space-x-3">
          <Link to="/kib/tanah" className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm text-gray-700 hover:bg-gray-200">
            Batal
          </Link>

          <button type="submit" className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">
            Update Data
          </button>
        </div>
      </form>
    </main>
  );
}

function Input({ label, name, value, onChange, type }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        className="mt-1 block w-full border rounded-md shadow-sm p-2 border-gray-300"
      />
    </div>
  );
}

function TextArea ({label, name, onchange}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <textarea name={name} onChange={onchange} id="" className="mt-1 block w-full border rounded-md shadow-sm p-2 border-gray-300"></textarea>
    </div>
  )
}


export default EditTanah;

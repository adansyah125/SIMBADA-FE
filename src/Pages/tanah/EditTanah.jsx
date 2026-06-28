import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getTanahById, updateKibTanah } from "../../services/KibTanahService";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Input, TextArea, FormCard, LoadingSpinner } from "../../components/FormComponents";

// =====================================================
// Halaman Edit KIB Tanah
// =====================================================
function EditTanah() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    kode_barang: "",
    nama_barang: "",
    nibar: "",
    no_register: "",
    spesifikasi_nama_barang: "",
    spesifikasi_lainnya: "",
    jumlah: "",
    satuan: "",
    lokasi: "",
    titik_koordinat: "",
    nama: "",
    nomor: "",
    tanggal: "",
    nama_kepemilikan: "",
    harga_satuan: "",
    nilai_perolehan: "",
    tanggal_perolehan: "",
    cara_perolehan: "",
    status_penggunaan: "",
    keterangan: "",
  });

  // Ambil data lama dari backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getTanahById(id);
        const data = res.data;
        setForm({
          kode_barang: data?.kode_barang ?? "",
          nama_barang: data?.nama_barang ?? "",
          nibar: data?.nibar ?? "",
          no_register: data?.no_register ?? "",
          spesifikasi_nama_barang: data?.spesifikasi_nama_barang ?? "",
          spesifikasi_lainnya: data?.spesifikasi_lainnya ?? "",
          jumlah: data?.jumlah ?? "",
          satuan: data?.satuan ?? "",
          lokasi: data?.lokasi ?? "",
          titik_koordinat: data?.titik_koordinat ?? "",
          nama: data?.nama ?? "",
          nomor: data?.nomor ?? "",
          tanggal: data?.tanggal ?? "",
          nama_kepemilikan: data?.nama_kepemilikan ?? "",
          harga_satuan: data?.harga_satuan ?? "",
          nilai_perolehan: data?.nilai_perolehan ?? "",
          tanggal_perolehan: data?.tanggal_perolehan ?? "",
          cara_perolehan: data?.cara_perolehan ?? "",
          status_penggunaan: data?.status_penggunaan ?? "",
          keterangan: data?.keterangan ?? "",
        });
      } catch (error) {
        console.log(error);
        toast.error("Gagal mengambil data tanah");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Update state saat user mengetik
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Kirim data yang sudah diubah ke backend
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateKibTanah(id, form);
      toast.success("Berhasil Memperbarui");
      navigate("/kib/tanah");
    } catch (error) {
      console.log(error);
      toast.error("Gagal memperbarui");
    }
  };

  // Tampilkan loading selama pengambilan data
  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4">

        {/* ——— Header halaman ——— */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Data KIB Tanah</h1>
            <p className="mt-1 text-sm text-gray-500">
              Perbarui informasi aset tanah yang sudah ada
            </p>
          </div>
          <Link
            to="/kib/tanah"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Link>
        </div>

        {/* ——— Form ——— */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* 1. Informasi Utama Barang */}
          <FormCard title="Informasi Utama Barang">
            <Input label="Kode Barang" name="kode_barang" value={form.kode_barang} onChange={handleChange} />
            <Input label="Nama Barang" name="nama_barang" value={form.nama_barang} onChange={handleChange} />
            <Input label="NIBAR" name="nibar" value={form.nibar} onChange={handleChange} />
            <Input label="No Register" name="no_register" value={form.no_register} onChange={handleChange} />
            <Input label="Spesifikasi Nama Barang" name="spesifikasi_nama_barang" value={form.spesifikasi_nama_barang} onChange={handleChange} />
            <Input label="Spesifikasi Lainnya" name="spesifikasi_lainnya" value={form.spesifikasi_lainnya} onChange={handleChange} />
          </FormCard>

          {/* 2. Fisik & Lokasi */}
          <FormCard title="Fisik & Lokasi">
            <Input label="Jumlah" name="jumlah" value={form.jumlah} onChange={handleChange} />
            <Input label="Satuan" name="satuan" value={form.satuan} onChange={handleChange} />
            <Input label="Lokasi" name="lokasi" value={form.lokasi} onChange={handleChange} />
            <Input label="Titik Koordinat" name="titik_koordinat" value={form.titik_koordinat} onChange={handleChange} />
            <Input label="Status Penggunaan" name="status_penggunaan" value={form.status_penggunaan} onChange={handleChange} />
          </FormCard>

          {/* 3. Bukti Kepemilikan */}
          <FormCard title="Bukti Kepemilikan">
            <Input label="Nama Dokumen" name="nama" value={form.nama} onChange={handleChange} />
            <Input label="Nomor Dokumen" name="nomor" value={form.nomor} onChange={handleChange} />
            <Input label="Tanggal Dokumen" name="tanggal" type="date" value={form.tanggal} onChange={handleChange} />
            <Input label="Nama Pemilik" name="nama_kepemilikan" value={form.nama_kepemilikan} onChange={handleChange} />
          </FormCard>

          {/* 4. Nilai & Cara Perolehan */}
          <FormCard title="Nilai & Cara Perolehan">
            <Input label="Harga Satuan" name="harga_satuan" type="number" value={form.harga_satuan} onChange={handleChange} />
            <Input label="Nilai Perolehan" name="nilai_perolehan" type="number" value={form.nilai_perolehan} onChange={handleChange} />
            <Input label="Tanggal Perolehan" name="tanggal_perolehan" type="date" value={form.tanggal_perolehan} onChange={handleChange} />
            <div className="sm:col-span-2 lg:col-span-3">
              <Input label="Cara Perolehan" name="cara_perolehan" value={form.cara_perolehan} onChange={handleChange} />
            </div>
            <div className="sm:col-span-2 lg:col-span-3">
              <TextArea label="Keterangan" name="keterangan" value={form.keterangan} onChange={handleChange} />
            </div>
          </FormCard>

          {/* ——— Tombol aksi ——— */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Link
              to="/kib/tanah"
              className="rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Batal
            </Link>
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              <Save className="h-4 w-4" />
              Simpan Perubahan
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default EditTanah;

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { createKibTanah } from "../../services/KibTanahService";
import { toast } from "react-toastify";
import { ArrowLeft, Save } from "lucide-react";
import { Input, TextArea, FormCard } from "../../components/FormComponents";



// Halaman Create KIB Tanah
function CreateTanah() {
  const navigate = useNavigate();

  // State untuk semua field form
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

  // State untuk pesan error tiap field
  const [errors, setErrors] = useState({});

  // Daftar field yang wajib diisi (Informasi Utama Barang)
  const requiredFields = [
    "kode_barang",
    "nama_barang",
    "nibar",
    "no_register",
    "spesifikasi_nama_barang",
    "spesifikasi_lainnya",
  ];

  // Validasi: pastikan semua required field terisi
  const validate = () => {
    const newErrors = {};
    requiredFields.forEach((field) => {
      if (!form[field]?.trim()) {
        newErrors[field] = "Field ini wajib diisi";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Update state saat user mengetik & hapus error field tersebut
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Kirim form ke backend (setelah validasi lolos)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      await createKibTanah(form);
      toast.success("Berhasil Menambahkan");
      navigate("/kib/tanah");
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error("Gagal menambahkan");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4">

        {/* ——— Header halaman ——— */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tambah Data KIB Tanah</h1>
            <p className="mt-1 text-sm text-gray-500">
              Isi form di bawah untuk menambahkan aset tanah baru
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

          {/* 1. Informasi Utama Barang (wajib diisi) */}
          <FormCard title="Informasi Utama Barang">
            <Input label="Kode Barang" name="kode_barang" value={form.kode_barang} onChange={handleChange} required error={errors.kode_barang} />
            <Input label="Nama Barang" name="nama_barang" value={form.nama_barang} onChange={handleChange} required error={errors.nama_barang} />
            <Input label="NIBAR" name="nibar" value={form.nibar} onChange={handleChange} required error={errors.nibar} />
            <Input label="No Register" name="no_register" value={form.no_register} onChange={handleChange} required error={errors.no_register} />
            <Input label="Spesifikasi Nama Barang" name="spesifikasi_nama_barang" value={form.spesifikasi_nama_barang} onChange={handleChange} required error={errors.spesifikasi_nama_barang} />
            <Input label="Spesifikasi Lainnya" name="spesifikasi_lainnya" value={form.spesifikasi_lainnya} onChange={handleChange} required error={errors.spesifikasi_lainnya} />
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
              Simpan Data Aset
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default CreateTanah;

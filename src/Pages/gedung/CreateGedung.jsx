import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { createKibGedung } from "../../services/KibGedungService";
import { toast } from "react-toastify";
import { ArrowLeft, Save } from "lucide-react";
import { Input, TextArea } from "../../components/FormComponents";

// =====================================================
// Halaman Create KIB Gedung
// =====================================================
function CreateGedung() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    kode_barang: "",
    nama_barang: "",
    nibar: "",
    no_register: "",
    spesifikasi_nama_barang: "",
    spesifikasi_lainnya: "",
    jumlah_lantai: "",
    lokasi: "",
    titik_koordinat: "",
    status_kepemilikan_tanah: "",
    jumlah: "",
    satuan: "",
    harga_satuan: "",
    nilai_perolehan: "",
    tanggal_perolehan: "",
    cara_perolehan: "",
    status_penggunaan: "",
    keterangan: "",
  });

  const [errors, setErrors] = useState({});

  const requiredFields = [
    "kode_barang",
    "nama_barang",
    "nibar",
    "no_register",
    "spesifikasi_nama_barang",
    "spesifikasi_lainnya",
  ];

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await createKibGedung(form);
      toast.success("Berhasil Menambahkan");
      navigate("/kib/gedung");
    } catch (err) {
      console.log(err);
      toast.error("Gagal Menambahkan");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4">

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tambah Data KIB Gedung</h1>
            <p className="mt-1 text-sm text-gray-500">
              Isi form di bawah untuk menambahkan aset gedung baru
            </p>
          </div>
          <Link
            to="/kib/gedung"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

              <Input label="Kode Barang" name="kode_barang" value={form.kode_barang} onChange={handleChange} required error={errors.kode_barang} />
              <Input label="Nama Barang" name="nama_barang" value={form.nama_barang} onChange={handleChange} required error={errors.nama_barang} />
              <Input label="NIBAR" name="nibar" value={form.nibar} onChange={handleChange} required error={errors.nibar} />
              <Input label="No Register" name="no_register" value={form.no_register} onChange={handleChange} required error={errors.no_register} />
              <Input label="Spesifikasi Nama Barang" name="spesifikasi_nama_barang" value={form.spesifikasi_nama_barang} onChange={handleChange} required error={errors.spesifikasi_nama_barang} />
              <Input label="Spesifikasi Lainnya" name="spesifikasi_lainnya" value={form.spesifikasi_lainnya} onChange={handleChange} required error={errors.spesifikasi_lainnya} />
              <Input label="Jumlah Lantai" name="jumlah_lantai" value={form.jumlah_lantai} onChange={handleChange} />
              <Input label="Lokasi" name="lokasi" value={form.lokasi} onChange={handleChange} />
              <Input label="Titik Koordinat" name="titik_koordinat" value={form.titik_koordinat} onChange={handleChange} />
              <Input label="Status Kepemilikan Tanah" name="status_kepemilikan_tanah" value={form.status_kepemilikan_tanah} onChange={handleChange} />
              <Input label="Jumlah" name="jumlah" value={form.jumlah} onChange={handleChange} />
              <Input label="Satuan" name="satuan" value={form.satuan} onChange={handleChange} />
              <Input label="Harga Satuan" name="harga_satuan" type="number" value={form.harga_satuan} onChange={handleChange} />
              <Input label="Nilai Perolehan" name="nilai_perolehan" type="number" value={form.nilai_perolehan} onChange={handleChange} />
              <Input label="Tanggal Perolehan" name="tanggal_perolehan" type="date" value={form.tanggal_perolehan} onChange={handleChange} />
              <Input label="Cara Perolehan" name="cara_perolehan" value={form.cara_perolehan} onChange={handleChange} />
              <Input label="Status Penggunaan" name="status_penggunaan" value={form.status_penggunaan} onChange={handleChange} />
              <div className="sm:col-span-2 lg:col-span-3">
                <TextArea label="Keterangan" name="keterangan" value={form.keterangan} onChange={handleChange} />
              </div>

            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Link
              to="/kib/gedung"
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

export default CreateGedung;

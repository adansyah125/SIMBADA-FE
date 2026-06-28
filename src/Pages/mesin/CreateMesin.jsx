import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { createKibMesin } from "../../services/KibMesinService";
import { toast } from "react-toastify";
import { ArrowLeft, Save } from "lucide-react";
import { Input, TextArea, FormCard } from "../../components/FormComponents";

// =====================================================
// Halaman Create KIB Mesin
// =====================================================
function CreateMesin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    kode_barang: "",
    nama_barang: "",
    nibar: "",
    no_register: "",
    spesifikasi_nama_barang: "",
    spesifikasi_lainnya: "",
    merk: "",
    lokasi: "",
    no_polisi: "",
    no_rangka: "",
    no_bpkb: "",
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
    "merk",
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
      await createKibMesin(form);
      toast.success("Berhasil Menambahkan");
      navigate("/kib/mesin");
    } catch (error) {
      const pesan = error.response?.data?.message || "Gagal Menambahkan";
      console.error("Submit Error:", error.response?.data);
      toast.error(pesan);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4">

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tambah Data KIB Mesin</h1>
            <p className="mt-1 text-sm text-gray-500">
              Isi form di bawah untuk menambahkan aset mesin baru
            </p>
          </div>
          <Link
            to="/kib/mesin"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* 1. Informasi Utama Barang (wajib diisi) */}
          <FormCard title="Informasi Utama Barang">
            <Input label="Kode Barang" name="kode_barang" value={form.kode_barang} onChange={handleChange} required error={errors.kode_barang} />
            <Input label="Nama Barang" name="nama_barang" value={form.nama_barang} onChange={handleChange} required error={errors.nama_barang} />
            <Input label="NIBAR" name="nibar" value={form.nibar} onChange={handleChange} required error={errors.nibar} />
            <Input label="No Register" name="no_register" value={form.no_register} onChange={handleChange} required error={errors.no_register} />
            <Input label="Spesifikasi Nama Barang" name="spesifikasi_nama_barang" value={form.spesifikasi_nama_barang} onChange={handleChange} required error={errors.spesifikasi_nama_barang} />
            <Input label="Spesifikasi Lainnya" name="spesifikasi_lainnya" value={form.spesifikasi_lainnya} onChange={handleChange} required error={errors.spesifikasi_lainnya} />
            <Input label="Merk" name="merk" value={form.merk} onChange={handleChange} required error={errors.merk} />
          </FormCard>

          {/* 2. Identifikasi & Lokasi */}
          <FormCard title="Identifikasi & Lokasi">
            <Input label="Lokasi" name="lokasi" value={form.lokasi} onChange={handleChange} />
            <Input label="No Polisi" name="no_polisi" value={form.no_polisi} onChange={handleChange} />
            <Input label="No Rangka" name="no_rangka" value={form.no_rangka} onChange={handleChange} />
            <Input label="No BPKB" name="no_bpkb" value={form.no_bpkb} onChange={handleChange} />
            <Input label="Jumlah" name="jumlah" value={form.jumlah} onChange={handleChange} />
            <Input label="Satuan" name="satuan" value={form.satuan} onChange={handleChange} />
          </FormCard>

          {/* 3. Nilai & Perolehan */}
          <FormCard title="Nilai & Perolehan">
            <Input label="Harga Satuan" name="harga_satuan" type="number" value={form.harga_satuan} onChange={handleChange} />
            <Input label="Nilai Perolehan" name="nilai_perolehan" type="number" value={form.nilai_perolehan} onChange={handleChange} />
            <Input label="Tanggal Perolehan" name="tanggal_perolehan" type="date" value={form.tanggal_perolehan} onChange={handleChange} />
            <Input label="Cara Perolehan" name="cara_perolehan" value={form.cara_perolehan} onChange={handleChange} />
            <Input label="Status Penggunaan" name="status_penggunaan" value={form.status_penggunaan} onChange={handleChange} />
            <div className="sm:col-span-2 lg:col-span-3">
              <TextArea label="Keterangan" name="keterangan" value={form.keterangan} onChange={handleChange} />
            </div>
          </FormCard>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Link
              to="/kib/mesin"
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

export default CreateMesin;

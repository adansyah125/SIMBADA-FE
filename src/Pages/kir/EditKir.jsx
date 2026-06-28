import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getKirById, updateKir } from "../../services/KirService";
import { toast } from "react-toastify";
import { ArrowLeft, Save } from "lucide-react";
import { Input, Select, FormCard, LoadingSpinner } from "../../components/FormComponents";

// =====================================================
// Halaman Edit KIR
// =====================================================
function EditKir() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [oldImage, setOldImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [fileError, setFileError] = useState("");
  const [errors, setErrors] = useState({});
  const [qr, setQr] = useState(null);

  const [form, setForm] = useState({
    nama_barang: "",
    kode_barang: "",
    tanggal_perolehan: "",
    lokasi: "",
    kondisi: "",
    jumlah: "",
    nilai_perolehan: "",
    gambar: null,
    tanah_id: null,
    gedung_id: null,
    mesin_id: null,
  });

  // ===============================
  // AMBIL DATA LAMA
  // ===============================
  useEffect(() => {
    getKirById(id).then((res) => {
      setForm({
        nama_barang: res.nama_barang,
        kode_barang: res.kode_barang,
        tanggal_perolehan: res.tanggal_perolehan,
        lokasi: res.lokasi,
        kondisi: res.kondisi,
        jumlah: res.jumlah,
        nilai_perolehan: res.nilai_perolehan,
        gambar: res.gambar,
        tanah_id: res.tanah_id,
        gedung_id: res.gedung_id,
        mesin_id: res.mesin_id,
      });
      setOldImage(res.gambar);
      setQr(res.gambar_qr);
      setLoading(false);
    });
  }, [id]);

  // ===============================
  // VALIDASI
  // ===============================
  const requiredFields = ["kondisi", "lokasi", "jumlah", "nilai_perolehan", "tanggal_perolehan"];

  const validate = () => {
    const newErrors = {};
    requiredFields.forEach((field) => {
      if (!form[field]?.toString().trim()) {
        newErrors[field] = "Field ini wajib diisi";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ===============================
  // FILE HANDLER
  // ===============================
  const handleFileChange = (file) => {
    const maxSize = 5120 * 1024;

    if (file) {
      if (file.size > maxSize) {
        setFileError("Gambar terlalu besar, maksimal 5MB");
        setForm({ ...form, gambar: null });
        setPreviewImage(null);
        return;
      }
      setFileError("");
      setForm({ ...form, gambar: file });
      if (previewImage) URL.revokeObjectURL(previewImage);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // ===============================
  // HANDLE CHANGE
  // ===============================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ===============================
  // SUBMIT
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    await updateKir(id, form);
    toast.success("Berhasil memperbarui");
    navigate("/kir");
  };

  if (loading) return <LoadingSpinner />;

  // ===============================
  // RENDER
  // ===============================
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4">

        {/* HEADER */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Data KIR</h1>
            <p className="mt-1 text-sm text-gray-500">
              Perbarui data Kartu Inventaris Ruangan
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

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* QR + INFO */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-4">
              {qr && (
                <img
                  src={`${import.meta.env.VITE_API_URL_IMAGE}/storage/${qr}`}
                  alt="QR"
                  className="w-24 h-24 border rounded-md"
                />
              )}
              <div>
                <p className="text-sm text-gray-500">
                  QR bersifat permanen & tidak berubah
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Nama: <span className="font-medium text-gray-700">{form.nama_barang}</span>
                </p>
                <p className="text-xs text-gray-400">
                  Kode: <span className="font-medium text-gray-700">{form.kode_barang}</span>
                </p>
              </div>
            </div>
          </div>

          {/* NAMA & KODE BARANG (read only) */}
          <FormCard>
            <Input
              label="Nama Barang"
              name="nama_barang"
              value={form.nama_barang}
              onChange={handleChange}
              readOnly
            />
            <Input
              label="Kode Barang"
              name="kode_barang"
              value={form.kode_barang}
              onChange={handleChange}
              readOnly
            />
          </FormCard>

          {/* LOKASI & TANGGAL */}
          <FormCard>
            <Select
              label="Lokasi"
              name="lokasi"
              value={form.lokasi}
              onChange={handleChange}
              required
              error={errors.lokasi}
              options={[
                { value: "Sekretariat Camat", label: "Sekretariat Camat" },
                { value: "Kasi Pemerintah", label: "Kasi Pemerintah" },
                { value: "Kasi Pemberdayaan Masyarakat", label: "Kasi Pemberdayaan Masyarakat" },
                { value: "Ruang Comend Center", label: "Ruang Comend Center" },
                { value: "Kasubag Umum Kepegawaian data informasi", label: "Kasubag Umum Kepegawaian data informasi" },
                { value: "Kasi ketentraman dan ketertiban", label: "Kasi ketentraman dan ketertiban" },
                { value: "Kasubag program dan keuangan", label: "Kasubag program dan keuangan" },
                { value: "Ruang Pelayanan", label: "Ruang Pelayanan" },
                { value: "Ruang Tengah", label: "Ruang Tengah" },
                { value: "Ruang arsip", label: "Ruang arsip" },
                { value: "Ruang ibu menyusui", label: "Ruang ibu menyusui" },
                { value: "Kasi ekonomi dan pembangunan", label: "Kasi ekonomi dan pembangunan" },
                { value: "Ruang Aula", label: "Ruang Aula" },
              ]}
              placeholder="Pilih Lokasi"
            />
            <Input
              label="Tanggal Perolehan"
              name="tanggal_perolehan"
              type="date"
              value={form.tanggal_perolehan}
              onChange={handleChange}
              required
              error={errors.tanggal_perolehan}
            />
          </FormCard>

          {/* JUMLAH & NILAI */}
          <FormCard>
            <Input
              label="Jumlah"
              name="jumlah"
              type="number"
              value={form.jumlah}
              onChange={handleChange}
              required
              error={errors.jumlah}
            />
            <Input
              label="Nilai Perolehan"
              name="nilai_perolehan"
              type="number"
              value={form.nilai_perolehan}
              onChange={handleChange}
              required
              error={errors.nilai_perolehan}
            />
          </FormCard>

          {/* KONDISI */}
          <FormCard>
            <Select
              label="Kondisi"
              name="kondisi"
              value={form.kondisi}
              onChange={handleChange}
              required
              error={errors.kondisi}
              options={[
                { value: "baik", label: "Baik" },
                { value: "kurang baik", label: "Kurang Baik" },
                { value: "rusak berat", label: "Rusak Berat" },
              ]}
              placeholder="-- Pilih Kondisi --"
            />
            <div />
          </FormCard>

          {/* GAMBAR */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Gambar</label>

            {oldImage && !previewImage && (
              <img
                src={`http://localhost:8000/storage/${oldImage}`}
                alt="Gambar Lama"
                className="w-32 h-32 object-cover mb-3 rounded-md border"
              />
            )}

            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer
                         hover:border-blue-500 transition-colors text-center"
              onClick={() => document.getElementById("fileUpload").click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file) handleFileChange(file);
              }}
            >
              {previewImage ? (
                <img src={previewImage} alt="Preview Baru" className="mx-auto h-40 object-cover rounded-md" />
              ) : (
                <div className="text-gray-400">
                  <p className="font-medium">Klik atau drag & drop gambar</p>
                  <p className="text-sm mt-1">PNG, JPG, JPEG — maks 5MB</p>
                </div>
              )}
            </div>

            {fileError && <p className="text-xs text-red-500 mt-2">{fileError}</p>}

            <input
              id="fileUpload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) handleFileChange(file);
              }}
            />
          </div>

          {/* TOMBOL AKSI */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Link
              to="/kir"
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

export default EditKir;

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeft, Save } from "lucide-react";
import { Input, Select, FormCard } from "../../components/FormComponents";

import { createKir } from "../../services/KirService";
import { getKibTanah } from "../../services/KibTanahService";
import { getAllKibMesin } from "../../services/KibMesinService";
import { getKibGedung } from "../../services/KibGedungService";

// =====================================================
// Halaman Create KIR
// =====================================================
function CreateKir() {
  const navigate = useNavigate();

  const [jenisKib, setJenisKib] = useState("");
  const [kibList, setKibList] = useState([]);
  const [selectedKib, setSelectedKib] = useState([]);
  const [search, setSearch] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [fileError, setFileError] = useState("");
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    kondisi: "",
    lokasi: "",
    jumlah: "",
    nilai_perolehan: "",
    tanggal_perolehan: "",
    gambar: null,
  });

  // ===============================
  // FETCH KIB SESUAI JENIS
  // ===============================
  useEffect(() => {
    if (!jenisKib) return;

    const fetchKib = async () => {
      try {
        let res;
        if (jenisKib === "tanah") res = await getKibTanah();
        if (jenisKib === "mesin") res = await getAllKibMesin();
        if (jenisKib === "gedung") res = await getKibGedung();

        const data = res.data?.data ?? res.data ?? [];
        setKibList(Array.isArray(data) ? data : []);
      } catch (err) {
        console.log(err);
        toast.error("Gagal memuat data KIB");
      }
    };

    fetchKib();
  }, [jenisKib]);

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
    if (selectedKib.length === 0) {
      toast.warning("Pilih minimal satu KIB");
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 && selectedKib.length > 0;
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
  // SEARCH & FILTER KIB
  // ===============================
  const keyword = search.trim().toLowerCase();

  const displayedKib = keyword
    ? kibList.filter(
        (item) =>
          String(item.nama_barang).toLowerCase().includes(keyword) ||
          String(item.kode_barang).toLowerCase().includes(keyword) ||
          String(item.merk || "").toLowerCase().includes(keyword) ||
          String(item.no_polisi || "").toLowerCase().includes(keyword) ||
          String(item.no_rangka || "").toLowerCase().includes(keyword) ||
          String(item.no_bpkb || "").toLowerCase().includes(keyword)
      )
    : kibList.slice(0, 5);

  const highlightText = (text, keyword) => {
    if (!keyword) return text;
    const regex = new RegExp(`(${keyword})`, "gi");
    return text.split(regex).map((part, i) =>
      part.toLowerCase() === keyword.toLowerCase() ? (
        <span key={i} className="bg-yellow-200 text-yellow-900 font-semibold px-1 rounded">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const toggleKib = (item) => {
    setSelectedKib((prev) => {
      const exists = prev.find((k) => k.id === item.id);
      if (exists) return prev.filter((k) => k.id !== item.id);
      return [...prev, item];
    });
  };

  // ===============================
  // SUBMIT
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      for (const item of selectedKib) {
        const payload = {
          lokasi: form.lokasi,
          kondisi: form.kondisi,
          jumlah: form.jumlah,
          nilai_perolehan: form.nilai_perolehan,
          tanggal_perolehan: form.tanggal_perolehan,
          gambar: form.gambar,
          nama_barang: item.nama_barang,
          kode_barang: item.kode_barang,
        };

        if (jenisKib === "tanah") payload.tanah_id = item.id;
        if (jenisKib === "mesin") payload.mesin_id = item.id;
        if (jenisKib === "gedung") payload.gedung_id = item.id;

        await createKir(payload);
      }

      toast.success("Semua data KIR berhasil disimpan");
      navigate("/kir");
    } catch (err) {
      console.log(err);
      toast.error("Sebagian / semua data gagal disimpan");
    }
  };

  // ===============================
  // RENDER
  // ===============================
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4">

        {/* HEADER */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tambah Data KIR</h1>
            <p className="mt-1 text-sm text-gray-500">
              Pilih KIB dan isi data untuk membuat Kartu Inventaris Ruangan
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

          {/* BARIS 1: Jenis KIB + Kondisi */}
          <FormCard>
            <Select
              label="Pilih Jenis KIB"
              name="jenisKib"
              value={jenisKib}
              onChange={(e) => {
                setJenisKib(e.target.value);
                setSelectedKib([]);
                setKibList([]);
              }}
              options={[
                { value: "tanah", label: "Tanah" },
                { value: "mesin", label: "Mesin" },
                { value: "gedung", label: "Gedung" },
              ]}
              placeholder="-- pilih jenis KIB --"
            />
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
          </FormCard>

          {/* PILIH KIB */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <div className="space-y-1.5 mb-4">
              <label className="text-sm font-medium text-gray-700">
                Pilih Barang KIB
                <span className="ml-0.5 text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Cari nama / kode barang..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              {displayedKib.map((item) => (
                <label
                  key={item.id}
                  className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-colors
                    ${selectedKib.some((k) => k.id === item.id) ? "border-green-500 bg-green-50" : "border-gray-200 hover:bg-gray-50"}`}
                >
                  <input
                    type="checkbox"
                    checked={selectedKib.some((k) => k.id === item.id)}
                    onChange={() => toggleKib(item)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {highlightText(item.nama_barang, search)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Kode: <span className="font-semibold">{highlightText(item.kode_barang, search)}</span>
                    </p>
                  </div>
                </label>
              ))}

              {search && displayedKib.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">Data tidak ditemukan</p>
              )}
            </div>
          </div>

          {/* BARIS 2: Lokasi + Tanggal */}
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

          {/* GAMBAR */}
          <div className="rounded-lg border border-gray-200 bg-white p-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Gambar</label>
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
                <img src={previewImage} alt="Preview" className="mx-auto h-40 object-cover rounded-md" />
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

          {/* BARIS 3: Jumlah + Nilai Perolehan */}
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
              Simpan Data
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default CreateKir;

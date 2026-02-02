import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getKirById, updateKir } from "../../services/KirService";
import { toast } from "react-toastify";

function EditKir() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [oldImage, setOldImage] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [fileError, setFileError] = useState("");

    const handleFileChange = (file) => {
  const maxSize = 5120 * 1024; // 5MB dalam Bytes

  if (file) {
    if (file.size > maxSize) {
      setFileError("Gambar terlalu besar, maksimal 5MB");
      // Reset form dan preview agar tidak mengirim file yang salah
      setForm({ ...form, gambar: null });
      setPreviewImage(null);
      document.getElementById("fileUpload").value = ""; 
      return;
    }

    // Jika lolos validasi, hapus pesan error
    setFileError("");
    setForm({ ...form, gambar: file });
    
    // Bersihkan memori URL lama jika ada
    if (previewImage) URL.revokeObjectURL(previewImage);
    setPreviewImage(URL.createObjectURL(file));
  }
};

  const [form, setForm] = useState({
    nama_barang: "",
    kode_barang: "",
    tanggal_perolehan: "",
    lokasi: "",
    kondisi: "baik",
    jumlah: "",
    nilai_perolehan: "",
    gambar: null,
    tanah_id: null,
  gedung_id: null,
  mesin_id: null,
  });

  const [qr, setQr] = useState(null);

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
         // 🔥 PENTING
      tanah_id: res.tanah_id,
      gedung_id: res.gedung_id,
      mesin_id: res.mesin_id,
      });
      setOldImage(res.gambar); 
      setQr(res.gambar_qr);
      setLoading(false);
    });
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateKir(id, form);
    toast.success("Data KIR berhasil diperbarui");
    navigate("/kir");
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
      <h2 className="text-2xl font-bold text-green-700 mb-6 border-b pb-3">
        ✏️ Edit Data KIR
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* QR PREVIEW */}
        <div className="flex items-center gap-4">
          {qr && (
            <img
              src={`${import.meta.env.VITE_API_URL_IMAGE}/storage/${qr}`}
              alt="QR"
              className="w-24 h-24 border rounded-md"
            />
          )}
          <p className="text-xs text-gray-500">
            QR bersifat permanen & tidak berubah
          </p>
        </div>

        {/* FORM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium">Nama Barang</label>
                <input
                    name="nama_barang"
                    value={form.nama_barang}
                    onChange={handleChange}
                    className="mt-1 block w-full border rounded-md shadow-sm p-2 border-gray-300"
                    placeholder="Nama Barang"
                    readOnly
                />
            </div>
            <div>
                 <label className="block text-sm font-medium">Kode Barang</label>
            <input
                name="kode_barang"
                value={form.kode_barang}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-md shadow-sm p-2 border-gray-300"
                placeholder="Kode Barang"
                readOnly
            />
          </div>
          <div>
             <label className="block text-sm font-medium">Tahun</label>
          <input
            type="date"
            name="tanggal_perolehan"
            value={form.tanggal_perolehan}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-md shadow-sm p-2 border-gray-300"
          />
          </div>
         <div>
          <label className="block text-sm font-medium text-gray-700">Lokasi</label>
          <select
            name="lokasi"
           
            value={form.lokasi || ''} 
            onChange={handleChange}
            className="mt-1 block w-full border rounded-md shadow-sm p-2 border-gray-300 bg-white focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="" disabled>-- Pilih Lokasi --</option>
            <option value="Sekretariat Camat">Sekretariat Camat</option>
              <option value="Kasi Pemerintah">Kasi Pemerintah</option>
              <option value="Kasi Pemberdayaan Masyarakat">Kasi Pemberdayaan Masyarakat</option>
              <option value="Ruang Comend Center">Ruang Comend Center</option>
              <option value="Kasubag Umum Kepegawaian data informasi">Kasubag Umum Kepegawaian data informasi</option>
              <option value="Kasi ketentraman dan ketertiban">Kasi ketentraman dan ketertiban</option>
              <option value="Kasubag program dan keuanganr">Kasubag program dan keuangan</option>
              <option value="Ruang Pelayanan">Ruang Pelayanan</option>
              <option value="Ruang Tengah">Ruang Tengah</option>
              <option value="Ruang arsip">Ruang arsip</option>
              <option value="Ruang ibu menyusui">Ruang ibu menyusui</option>
              <option value="Kasi ekonomi dan pembangunan">Kasi ekonomi dan pembangunan</option>
              <option value="Ruang Aula">Ruang Aula</option>
          </select>
        </div>
          <div>
             <label className="block text-sm font-medium">Jumlah</label>
          <input
            type="number"
            name="jumlah"
            value={form.jumlah}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-md shadow-sm p-2 border-gray-300"
            placeholder="Jumlah"
          />
          </div>
          <div>
             <label className="block text-sm font-medium">Nilai Perolehan</label>
             <input
            type="number"
            name="nilai_perolehan"
            value={form.nilai_perolehan}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-md shadow-sm p-2 border-gray-300"
            placeholder="Nilai Perolehan"
          />
          </div>
          
            <div>
                 <label className="block text-sm font-medium">Kondisi</label>
          <select
            name="kondisi"
            value={form.kondisi}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-md shadow-sm p-2 border-gray-300"
          >
            <option value="" disabled>-- Kondisi --</option>
            <option value="baik">Baik</option>
            <option value="kurang baik">Kurang Baik</option>
            <option value="rusak berat">Rusak Berat</option>
          </select>
          </div>
        </div>
         {/* GAMBAR */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gambar</label>

                {/* GAMBAR LAMA */}
                {oldImage && !previewImage && (
                    <img
                    src={`http://localhost:8000/storage/${oldImage}`}
                    alt="Gambar Lama"
                    className="w-32 h-32 object-cover mb-3 rounded-md border"
                    />
                )}

                {/* UPLOAD BOX */}
                <div
                    className="border-2 border-dashed border-gray-400 rounded-lg p-4 cursor-pointer 
                            hover:border-blue-500 transition text-center"
                    onClick={() => document.getElementById("fileUpload").click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files[0];
                    if (file) {
                        setForm({ ...form, gambar: file });
                        setPreviewImage(URL.createObjectURL(file));
                    }
                    }}
                >
                    {/* PREVIEW GAMBAR BARU */}
                    {previewImage ? (
                    <img
                        src={previewImage}
                        alt="Preview Baru"
                        className="mx-auto h-40 object-cover rounded-md"
                    />
                    ) : (
                    <div className="text-gray-500">
                        <p className="font-medium">Choose Image or Drag & Drop</p>
                        <p className="text-sm">PNG, JPG, JPEG</p>
                    </div>
                    )}
                </div>

                {fileError && (
                <p className="text-red-500 text-xs mt-1">{fileError}</p>
                )}

                    {/* INPUT FILE TERSEMBUNYI */}
                    <input
                        id="fileUpload"
                        type="file"
                        name="gambar"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                        const file = e.target.files[0];
                        setForm({ ...form, gambar: file });
                        setPreviewImage(URL.createObjectURL(file));
                        handleFileChange(file);
                        }}
                    />
                </div>

        {/* BUTTON */}
        <div className="flex gap-3 justify-end">
          <Link to="/kir" className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm text-gray-700 hover:bg-gray-200">
            Batal
          </Link>
          <button className="px-4 py-2 bg-green-600 text-white rounded-md">
            Update
          </button>
        </div>
      </form>
    </main>
  );
}

export default EditKir;

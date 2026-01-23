import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getKirById, updateKir } from "../../services/KirService";

function EditKir() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nama_barang: "",
    kode_barang: "",
    tahun: "",
    lokasi: "",
    kondisi: "baik",
    jumlah: "",
    nilai_perolehan: "",
  });

  const [qr, setQr] = useState(null);

  useEffect(() => {
    getKirById(id).then((res) => {
      setForm({
        nama_barang: res.nama_barang,
        kode_barang: res.kode_barang,
        tahun: res.tahun,
        lokasi: res.lokasi,
        kondisi: res.kondisi,
        jumlah: res.jumlah,
        nilai_perolehan: res.nilai_perolehan,
      });
      setQr(res.gambar_qr);
    });
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateKir(id, form);
    navigate("/kir");
  };

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
                    className="mt-1 w-full border rounded-md p-2"
                    placeholder="Nama Barang"
                />
            </div>
            <div>
                 <label className="block text-sm font-medium">Kode Barang</label>
            <input
                name="kode_barang"
                value={form.kode_barang}
                onChange={handleChange}
                className="mt-1 w-full border rounded-md p-2"
                placeholder="Kode Barang"
            />
          </div>
          <div>
             <label className="block text-sm font-medium">Tahun</label>
          <input
            type="date"
            name="tahun"
            value={form.tahun}
            onChange={handleChange}
            className="mt-1 w-full border rounded-md p-2"
          />
          </div>
          <div>
             <label className="block text-sm font-medium">Lokasi</label>
          <input
            name="lokasi"
            value={form.lokasi}
            onChange={handleChange}
            className="mt-1 w-full border rounded-md p-2"
            placeholder="Lokasi"
          />
          </div>
          <div>
             <label className="block text-sm font-medium">Jumlah</label>
          <input
            type="number"
            name="jumlah"
            value={form.jumlah}
            onChange={handleChange}
            className="mt-1 w-full border rounded-md p-2"
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
            className="mt-1 w-full border rounded-md p-2"
            placeholder="Nilai Perolehan"
          />
          </div>
          
            <div>
                 <label className="block text-sm font-medium">Kondisi</label>
          <select
            name="kondisi"
            value={form.kondisi}
            onChange={handleChange}
            className="mt-1 w-full border rounded-md p-2"
          >
            <option value="baik">Baik</option>
            <option value="kurang baik">Kurang Baik</option>
            <option value="rusak berat">Rusak Berat</option>
          </select>
          </div>
        </div>

        {/* BUTTON */}
        <div className="flex gap-3">
          <Link to="/kir" className="px-4 py-2 border rounded-md">
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

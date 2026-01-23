import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { createKir } from "../../services/KirService";
import { getKibTanah } from "../../services/KibTanahService";
import { getKibMesin } from "../../services/KibMesinService";
import { getKibGedung } from "../../services/KibGedungService";

function CreateKir() {
  const navigate = useNavigate();

  const [jenisKib, setJenisKib] = useState("");
  const [kibList, setKibList] = useState([]);
  const [selectedKib, setSelectedKib] = useState(null);

  const [form, setForm] = useState({
    kondisi: "baik",
    lokasi: "",
    jumlah: 1,
    nilai_perolehan: "",
  });

  // ===============================
  // FETCH KIB SESUAI JENIS
  // ===============================
  useEffect(() => {
    if (!jenisKib) return;

    const fetchKib = async () => {
      try {
        let data = [];

        if (jenisKib === "tanah") data = await getKibTanah();
        if (jenisKib === "mesin") data = await getKibMesin();
        if (jenisKib === "gedung") data = await getKibGedung();

        setKibList(data);
      } catch (err) {
        console.log(err);
        toast.error("Gagal memuat data KIB");
      }
    };

    fetchKib();
  }, [jenisKib]);

  // ===============================
  // SUBMIT
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedKib) {
      toast.warning("Pilih salah satu KIB");
      return;
    }

    const payload = {
      lokasi: form.lokasi,
      kondisi: form.kondisi,
      jumlah: form.jumlah,
      nilai_perolehan: form.nilai_perolehan,
      nama_barang: selectedKib.nama_barang,
      kode_barang: selectedKib.kode_barang,
      tanggal_perolehan: selectedKib.tanggal_perolehan || selectedKib.tanggal_perolehan,
    };

    // set foreign key sesuai jenis
    if (jenisKib === "tanah") payload.tanah_id = selectedKib.id;
    if (jenisKib === "mesin") payload.mesin_id = selectedKib.id;
    if (jenisKib === "gedung") payload.gedung_id = selectedKib.id;

    try {
      await createKir(payload);
      toast.success("Data KIR berhasil disimpan");
      navigate("/kir");
    } catch (err) {
      console.log(err);
      toast.error("Gagal menyimpan data KIR");
    }
  };

  return (
    <main className="p-8 flex-1">
      <h2 className="text-2xl font-bold text-green-700 mb-6 border-b pb-3">
        🌱 Tambah Data KIR
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* JENIS KIB */}
          <div>
            <label className="block text-sm font-medium">Pilih Jenis KIB</label>
            <select
              className="mt-1 w-full border rounded-md p-2"
              value={jenisKib}
              onChange={(e) => {
                setJenisKib(e.target.value);
                setSelectedKib(null);
              }}
            >
              <option value="">-- pilih --</option>
              <option value="tanah">Tanah</option>
              <option value="mesin">Mesin</option>
              <option value="gedung">Gedung</option>
            </select>
          </div>

          {/* KONDISI */}
          <div>
            <label className="block text-sm font-medium">Kondisi</label>
            <select
              className="mt-1 w-full border rounded-md p-2"
              value={form.kondisi}
              onChange={(e) => setForm({ ...form, kondisi: e.target.value })}
            >
              <option value="baik">Baik</option>
              <option value="kurang baik">Kurang Baik</option>
              <option value="rusak berat">Rusak Berat</option>
            </select>
          </div>

          {/* LIST KIB */}
          {kibList.length > 0 && (
            <div className="md:col-span-2 border rounded-md p-3 bg-gray-50">
              <label className="block text-sm font-medium mb-2">
                Pilih KIB
              </label>

              {kibList.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-2 p-2 border rounded-md bg-white mb-2"
                >
                  <input
                    type="radio"
                    name="kib"
                    onChange={() => setSelectedKib(item)}
                  />
                  <div>
                    <p className="font-medium">{item.nama_barang}</p>
                    <p className="text-xs text-gray-600">
                      Kode: <b>{item.kode_barang}</b>
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">{item.nama_barang}</p>
                    <p className="text-xs text-gray-600">
                      Tanggal Perolehan: <b>{item.tanggal_perolehan}</b>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* LOKASI */}
          <div>
            <label className="block text-sm font-medium">Lokasi</label>
            <input
              className="mt-1 w-full border rounded-md p-2"
              value={form.lokasi}
              onChange={(e) => setForm({ ...form, lokasi: e.target.value })}
            />
          </div>

          {/* JUMLAH & NILAI */}
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Jumlah"
              className="border p-2 rounded-md"
              value={form.jumlah}
              onChange={(e) => setForm({ ...form, jumlah: e.target.value })}
            />
            <input
              type="number"
              placeholder="Nilai Perolehan"
              className="border p-2 rounded-md"
              value={form.nilai_perolehan}
              onChange={(e) =>
                setForm({ ...form, nilai_perolehan: e.target.value })
              }
            />
          </div>

          {/* BUTTON */}
          <div className="flex gap-3">
            <Link to="/kir" className="px-4 py-2 border rounded-md">
              Kembali
            </Link>
            <button className="px-4 py-2 bg-green-600 text-white rounded-md">
              Simpan Data
            </button>
          </div>

        </div>
      </form>
    </main>
  );
}

export default CreateKir;

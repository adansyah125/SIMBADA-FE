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
  const [search, setSearch] = useState("");

  const [previewImage, setPreviewImage] = useState(null);
      const [fileError, setFileError] = useState("");
  
      const handleFileChange = (file) => {
          const maxSize = 5120 * 1024;
  
          if(file) {
              if (file.size > maxSize) {
                  setFileError("Gambar terlalu besar, maksimal 5MB");
                  // reset
                  setForm({...form, gambar:null});
                  setPreviewImage(null);
                  document.getElementById("fileUpload").value = "";
                  return;
              }
  
              // jika lolos validasi, hapus pesan error
              setFileError("");
              setForm({...form, gambar: file});
  
              // Bersihkan memori URL lama jika ada
              if (previewImage) URL.revokeObjectURL(previewImage);
              setPreviewImage(URL.createObjectURL(file));
          }
      }

  const [form, setForm] = useState({
    kondisi: "",
    lokasi: "",
    jumlah: "",
    nilai_perolehan: "",
    tanggal_perolehan: "",
    gambar:null,
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
    if (jenisKib === "mesin") res = await getKibMesin();
    if (jenisKib === "gedung") res = await getKibGedung();

    console.log("RESPON API:", res);   
    console.log("ISI DATA:", res.data);

    setKibList(res.data.data);
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
      // tanggal_perolehan: selectedKib.tanggal_perolehan || selectedKib.tanggal_perolehan,
      tanggal_perolehan: form.tanggal_perolehan,
      gambar: form.gambar
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

  const displayedKib = search
  ? kibList.filter(item =>
      item.nama_barang.toLowerCase().includes(search.toLowerCase()) ||
      item.kode_barang.toLowerCase().includes(search.toLowerCase())
    )
  : kibList.slice(0, 3);

  const highlightText = (text, keyword) => {
  if (!keyword) return text;

  const regex = new RegExp(`(${keyword})`, "gi");
  return text.split(regex).map((part, i) =>
    part.toLowerCase() === keyword.toLowerCase() ? (
      <span
        key={i}
        className="bg-yellow-200 text-yellow-900 font-semibold px-1 rounded"
      >
        {part}
      </span>
    ) : (
      part
    )
  );
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
            <label className="block text-sm font-medium text-gray-700">Pilih Jenis KIB</label>
            <select
              className="mt-1 block w-full border rounded-md shadow-sm p-2 border-gray-300"
              value={jenisKib}
              onChange={(e) => {
                setJenisKib(e.target.value);
                setSelectedKib(null);
                setKibList([]);
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
            <label className="block text-sm font-medium text-gray-700">Kondisi</label>
            <select
              className="mt-1 block w-full border rounded-md shadow-sm p-2 border-gray-300"
              value={form.kondisi}
              onChange={(e) => setForm({ ...form, kondisi: e.target.value })}
            >
              <option value="" disabled>-- Pilih Kondisi --</option>
              <option value="baik">Baik</option>
              <option value="kurang baik">Kurang Baik</option>
              <option value="rusak berat">Rusak Berat</option>
            </select>
          </div>

          

             
          {/* LIST KIB */}
          {displayedKib.length >= 0 && (
            <div className="md:col-span-2  rounded-md shadow-md p-3 bg-gray-50">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pilih KIB
              </label>
               <div className="mb-3">
          <input
            type="text"
            placeholder="Cari nama / kode barang..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full shadow-sm rounded-md p-2 text-sm"
          />
        </div>
              

              {displayedKib.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-2 p-2 border border-gray-400 rounded-md bg-white mb-2"
                >
                  <input
                    type="radio"
                    name="kib"
                    checked={selectedKib?.id === item.id}
                    onChange={() => setSelectedKib(item)}
                  />
                  <div>
                    <p className="font-medium">{item.nama_barang}</p>
                    <p className="text-xs text-gray-600">
                      {highlightText(item.nama_barang, search)}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">(<b>{highlightText(item.kode_barang, search)}</b> )</p>
                    <p className="text-xs text-gray-600">
                      {/* Tanggal Perolehan: <b>{item.tanggal_perolehan}</b> */}
                    </p>
                  </div>
                </div>
              ))}
               {!search && kibList.length > 0 && (
      <p className="text-xs text-gray-500 mt-2 text-center">
        Menampilkan 3 data awal, gunakan pencarian untuk melihat lainnya
      </p>
    )}
            </div>
          )}

          {/* LOKASI */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Lokasi</label>
            <select
              className="mt-1 block w-full border rounded-md shadow-sm p-2 border-gray-300 bg-white focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={form.lokasi || ''} // Menggunakan || '' untuk mencegah error 'uncontrolled input'
              onChange={(e) => setForm({ ...form, lokasi: e.target.value })}
            >
              <option value="" disabled>Pilih Lokasi</option>
              <option value="Gudang A">Gudang A</option>
              <option value="Gudang B">Gudang B</option>
              <option value="Kantor Pusat">Kantor Pusat</option>
              <option value="Ruang IT">Ruang IT</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tanggal</label>
            <input
            type="date"
              className="mt-1 block w-full border rounded-md shadow-sm p-2 border-gray-300"
              value={form.tanggal_perolehan}
              onChange={(e) => setForm({ ...form, tanggal_perolehan: e.target.value })}
            />
          </div>

           {/* GAMBAR */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gambar</label>

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
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Preview"
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


                  {/* JUMLAH & NILAI */}
          <div className="flex gap-2 items-center">
          <div className="">
             <label className="block text-sm font-medium text-gray-700">jumlah</label>
            <input
              type="number"
              placeholder="Jumlah"
              className="mt-1 block w-full border rounded-md shadow-sm p-2 border-gray-300"
              value={form.jumlah}
              onChange={(e) => setForm({ ...form, jumlah: e.target.value })}
            />
            
          </div>
          <div>
             <label className="block text-sm font-medium text-gray-700">Nilai Perolehan</label>
            <input
              type="number"
              placeholder="Nilai Perolehan"
              className="mt-1 block w-full border rounded-md shadow-sm p-2 border-gray-300"
              value={form.nilai_perolehan}
              onChange={(e) =>
                setForm({ ...form, nilai_perolehan: e.target.value })
              }
            />
          </div>
          </div>
          

        </div>
        {/* BUTTON */}
          <div className="flex gap-3 justify-end">
            <Link to="/kir" className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm text-gray-700 hover:bg-gray-200">
              Kembali
            </Link>
            <button className="px-4 py-2 bg-green-600 text-white rounded-md">
              Simpan Data
            </button>
          </div>
      </form>
    </main>
  );
}

export default CreateKir;

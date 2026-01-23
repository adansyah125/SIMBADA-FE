import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getGedungById, updateKibGedung } from '../../services/KibGedungService';
import { toast } from 'react-toastify';

function EditGedung() {
  const {id} = useParams();
  const navigate = useNavigate();
  const [oldImage, setOldImage] = useState(null);
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
    kode_barang:"",
    nama_barang:"",
    nibar:"",
    no_register:"",
    spesifikasi_nama_barang:"",
    spesifikasi_lainnya:"",
    jumlah_lantai:"",
    lokasi:"",
    titik_koordinat:"",
    status_kepemilikan_tanah:"",
    jumlah:"",
    satuan:"",
    harga_satuan:"",
    nilai_perolehan:"",
    tanggal_perolehan:"",
    cara_perolehan:"",
    status_penggunaan:"",
    keterangan:"",
    gambar:null,
  });

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try{
        const response = await getGedungById(id);
        setOldImage(response.data.gambar);
        setForm({
        kode_barang: response.data?.kode_barang ?? "",
        nama_barang: response.data?.nama_barang ?? "",
        nibar: response.data?.nibar ?? "",
        no_register: response.data?.no_register ?? "",
        spesifikasi_nama_barang: response.data?.spesifikasi_nama_barang ?? "",
        spesifikasi_lainnya: response.data?.spesifikasi_lainnya ?? "",
        jumlah_lantai: response.data?.jumlah_lantai ?? "",
        lokasi: response.data?.lokasi ?? "",
        titik_koordinat: response.data?.titik_koordinat ?? "",
        status_kepemilikan_tanah: response.data?.status_kepemilikan_tanah ?? "",
        jumlah: response.data?.jumlah ?? "",
        satuan: response.data?.satuan ?? "",
        harga_satuan: response.data?.harga_satuan ?? "",
        nilai_perolehan: response.data?.nilai_perolehan ?? "",
        tanggal_perolehan: response.data?.tanggal_perolehan ?? "",
        cara_perolehan: response.data?.cara_perolehan ?? "",
        status_penggunaan: response.data?.status_penggunaan ?? "",
        keterangan: response.data?.keterangan ?? "",
        gambar: response.data?.gambar ?? "",
        }); 
      } catch (err){
        console.log(err);
        toast.error("Gagal mengambil data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try{
      await updateKibGedung(id, form);
      toast.success("Data KIB Gedung berhasil diperbarui");
      navigate("/kib/gedung");
    } catch (err){
      console.log(err);
      toast.error("Gagal memperbarui data");
    }
  }

  if(loading){
    return <p className='p-6'>Loading...</p>
  }
  return (
    <main className="p-8 flex-1">
      <h2 className="text-2xl font-bold text-yellow-600 mb-6 border-b pb-3">
        ✏️ Edit Data KIB Tanah
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <Input type="text" label="Kode Barang" name="kode_barang" value={form.kode_barang} onChange={handleChange} />
          <Input type="text" label="Nama Barang" name="nama_barang" value={form.nama_barang} onChange={handleChange} />
          <Input type="text" label="NIBAR" name="nibar" value={form.nibar} onChange={handleChange} />
          <Input type="text" label="No Register" name="no_register" value={form.no_register} onChange={handleChange} />
          <Input type="text" label="Spesifikasi Nama Barang" name="spesifikasi_nama_barang" value={form.spesifikasi_nama_barang} onChange={handleChange} />
          <Input type="text" label="Spesifikasi Lainnya" name="spesifikasi_lainnya" value={form.spesifikasi_lainnya} onChange={handleChange} />
          <Input type="text" label="jumlah_lantai" name="jumlah_lantai" value={form.jumlah_lantai} onChange={handleChange} />
          <Input type="text" label="lokasi" name="lokasi" value={form.lokasi} onChange={handleChange} />
          <Input type="text" label="titik_koordinat" name="titik_koordinat" value={form.titik_koordinat} onChange={handleChange} />
          <Input type="text" label="status_kepemilikan_tanah" name="status_kepemilikan_tanah" value={form.status_kepemilikan_tanah} onChange={handleChange} />
          <Input type="text" label="jumlah" name="jumlah" value={form.jumlah} onChange={handleChange} />
          <Input type="text" label="satuan" name="satuan" value={form.satuan} onChange={handleChange} />
          <Input type="number" label="harga_satuan" name="harga_satuan" value={form.harga_satuan} onChange={handleChange} />
          <Input type="number" label="nilai_perolehan" name="nilai_perolehan" value={form.nilai_perolehan} onChange={handleChange} />
          <Input type="date" label="tanggal_perolehan" name="tanggal_perolehan" value={form.tanggal_perolehan} onChange={handleChange} />
          <Input type="text" label="cara_perolehan" name="cara_perolehan" value={form.cara_perolehan} onChange={handleChange} />
          <Input type="text" label="status_penggunaan" name="status_penggunaan" value={form.status_penggunaan} onChange={handleChange} />
          <Input type="text" label="keterangan" name="keterangan" value={form.keterangan} onChange={handleChange} />
          {/* GAMBAR */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gambar</label>
                {/* GAMBAR LAMA */}
                {oldImage && !previewImage && (
                    <img src={`http://localhost:8000/storage/${oldImage}`} alt="Gambar Lama" className="w-32 h-32 object-cover mb-3 rounded-md border" />
                )}

                {/* UPLOAD BOX */}
                <div className="border-2 border-dashed border-gray-400 rounded-lg p-4 cursor-pointer hover:border-blue-500 transition text-center"
                    onClick={() => document.getElementById("fileUpload").click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files[0];
                    if (file) {
                        setForm({ ...form, gambar: file });
                        setPreviewImage(URL.createObjectURL(file));
                    }
                    }}>
                    {/* PREVIEW GAMBAR BARU */}
                    {previewImage ? (
                    <img src={previewImage} alt="Preview Baru" className="mx-auto h-40 object-cover rounded-md" />
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
                    <input id="fileUpload" type="file" name="gambar" accept="image/*" className="hidden"
                        onChange={(e) => {
                        const file = e.target.files[0];
                        setForm({ ...form, gambar: file });
                        setPreviewImage(URL.createObjectURL(file));
                        handleFileChange(file);
                        }}
                    />
                </div>

        </div>

        <div className="flex justify-end space-x-3">
          <Link to="/kib/gedung" className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm text-gray-700 hover:bg-gray-200" >
            Batal
          </Link>

          <button type="submit" className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600" >
            Update Data
          </button>
        </div>
      </form>
    </main>
  )
}

function Input({ label, name, value, onChange, type }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input type={type} name={name} value={value ?? ""} onChange={onChange} className="mt-1 block w-full border rounded-md shadow-sm p-2 border-gray-300"
      />
    </div>
  );
}

export default EditGedung

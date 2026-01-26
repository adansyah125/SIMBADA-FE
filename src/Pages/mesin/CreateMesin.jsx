import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import {createKibMesin} from "../../services/KibMesinService"
import { toast } from 'react-toastify';

function CreateMesin() {
    const navigate = useNavigate();
   
    const [form, setForm] = useState({
        kode_barang:"",
        nama_barang:"",
        nibar:"",
        no_register:"",
        spesifikasi_nama_barang:"",
        spesifikasi_lainnya:"",
        merk:"",
        lokasi: "",
        no_polisi: "",
        no_rangka:"",
        no_bpkb:"",
        jumlah:"",
        satuan:"",
        harga_satuan: "",
        nilai_perolehan:"",
        tanggal_perolehan: "",
        cara_perolehan:"",
        status_penggunaan:"",
        keterangan:"",
      });
    
      const handleChange = (e) => {
        setForm({
          ...form,
          [e.target.name]: e.target.value,
        });
      };
    
      const handleSubmit = async (e) => {
      e.preventDefault();
    
      try {
        // Kirim objek form biasa, biarkan fungsi API yang mengubahnya jadi FormData
        await createKibMesin(form); 
        
        toast.success("Data KIB Mesin berhasil ditambahkan");
        navigate("/kib/mesin");
      } catch (error) {
        const errorMsg = error.response?.data?.message || "Gagal menyimpan data";
        console.error("Submit Error:", error.response?.data);
        toast.error(errorMsg);
      }
    };

  return (
     <div>
      {/* FORM */}
        <main className="p-8 flex-1">
          <h2 className="text-2xl font-bold text-green-700 mb-6 border-b pb-3">
            🌱 Tambah Data KIB
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* GRID FORM */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <Input type="text" label="Kode Barang" name="kode_barang" value={form.kode_barang} onChange={handleChange} />
          <Input type="text" label="Nama Barang" name="nama_barang" value={form.nama_barang} onChange={handleChange} />
          <Input type="text" label="NIBAR" name="nibar" value={form.nibar} onChange={handleChange} />
          <Input type="text" label="No Register" name="no_register" value={form.no_register} onChange={handleChange} />
          <Input type="text" label="Spesifikasi Nama Barang" name="spesifikasi_nama_barang" value={form.spesifikasi_nama_barang} onChange={handleChange} />
          <Input type="text" label="Spesifikasi Lainnya" name="spesifikasi_lainnya" value={form.spesifikasi_lainnya} onChange={handleChange} />
          <Input type="text" label="merk" name="merk" value={form.merk} onChange={handleChange} />
          <Input type="text" label="lokasi" name="lokasi" value={form.lokasi} onChange={handleChange} />
          <Input type="text" label="no_polisi" name="no_polisi" value={form.no_polisi} onChange={handleChange} />
          <Input type="text" label="no_rangka" name="no_rangka" value={form.no_rangka} onChange={handleChange} />
          <Input type="text" label="no_bpkb" name="no_bpkb" value={form.no_bpkb} onChange={handleChange} />
          <Input type="text" label="jumlah" name="jumlah" value={form.jumlah} onChange={handleChange} />
          <Input type="text" label="satuan" name="satuan" value={form.satuan} onChange={handleChange} />
          <Input type="number" label="harga_satuan" name="harga_satuan" value={form.harga_satuan} onChange={handleChange} />
          <Input type="number" label="nilai_perolehan" name="nilai_perolehan" value={form.nilai_perolehan} onChange={handleChange} />
          <Input type="date" label="tanggal_perolehan" name="tanggal_perolehan" value={form.tanggal_perolehan} onChange={handleChange} />
          <Input type="text" label="cara_perolehan" name="cara_perolehan" value={form.cara_perolehan} onChange={handleChange} />
          <Input type="text" label="status_penggunaan" name="status_penggunaan" value={form.status_penggunaan} onChange={handleChange} />
          <Input type="text" label="keterangan" name="keterangan" value={form.keterangan} onChange={handleChange} />

        </div> 
         <div className="flex justify-end space-x-3">
          <Link to="/kib/mesin" className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm text-gray-700 hover:bg-gray-200"> Kembali</Link>
          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">Simpan Data</button>
        </div> 
          </form>
        </main>
    </div>
  )
}

function Input({ label, name, value, onChange, type }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} className="mt-1 block w-full border rounded-md shadow-sm p-2 border-gray-300"/>
    </div>
  );
}


export default CreateMesin

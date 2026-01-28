import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import {formatRupiah, formatTanggal} from "../utils/Format";

function ScanLabel() {
      const { id } = useParams();
  const [kir, setKir] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchKir = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/kir/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setKir(response.data.data);
    } catch (error) {
      console.error('Gagal mengambil data KIR:', error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchKir();
  }, []);


  if (loading) 
    return (
     <div className="flex space-x-2 justify-center items-center h-screen">
      <span className="sr-only">Loading...</span>
      <div className="h-3 w-3 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="h-3 w-3 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="h-3 w-3 bg-blue-600 rounded-full animate-bounce"></div>
    </div> 
  )
  
  if (!kir) return <p className="p-8 text-center text-red-500">Data tidak ditemukan.</p>;

  return (
     <div className="min-h-screen bg-gray-100 p-4 flex justify-center">
      <div className="bg-white rounded-xl shadow-md w-full max-w-2xl p-6 md:p-8">
        {/* Header */}
        {/* <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-800">
          Detail KIR
        </h1> */}
        
        {/* Gambar Barang */}
        <div className="flex justify-center">
          {kir.gambar ? (
            <img
              src={`${import.meta.env.VITE_API_URL_IMAGE}/storage/${kir.gambar}`}
              alt="Gambar Barang"
              className="w-full max-w-sm rounded-lg shadow border"
            />
          ) : (
            <div className="w-full max-w-sm h-40 border border-dashed border-gray-400 rounded-lg flex items-center justify-center text-gray-500">
              Tidak ada gambar barang
            </div>
          )}
        </div>

        {/* Data Detail */}
        <section className="px-6 py-16 md:py-20">
    <div className="mx-auto max-w-4xl">
      <div className="text-center mb-12 md:mb-10">
        {/* <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-neutral-800 dark:text-neutral-800 mb-3 md:mb-4">
          Rincian Ruangan {kir.lokasi}
        </h2> */}
        <p className="text-base md:text-lg text-neutral-600 dark:text-neutral-400">
          Detail Inventaris Barang {kir.nama_barang} dari Ruangan {kir.lokasi}
        </p>
      </div>

      <dl className="divide-y divide-neutral-200 dark:divide-neutral-800">
        <div className="py-5 md:py-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
          <dt className="text-base md:text-lg font-semibold text-neutral-900 dark:text-neutral-900">
            Nama Barang
          </dt>
          <dd className="text-base md:text-lg text-neutral-700 dark:text-neutral-500">
           {kir.nama_barang}
          </dd>
        </div>

        <div className="py-5 md:py-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
          <dt className="text-base md:text-lg font-semibold text-neutral-900 dark:text-neutral-900">
             Kode
          </dt>
          <dd className="text-base md:text-lg text-neutral-700 dark:text-neutral-500">
            {kir.kode_barang}
          </dd>
        </div>

        <div className="py-5 md:py-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
          <dt className="text-base md:text-lg font-semibold text-neutral-900 dark:text-neutral-900">
            Ruangan
          </dt>
          <dd className="text-base md:text-lg text-neutral-700 dark:text-neutral-500">
            {kir.lokasi}
          </dd>
        </div>

        <div className="py-5 md:py-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
          <dt className="text-base md:text-lg font-semibold text-neutral-900 dark:text-neutral-900">
            Tanggal
          </dt>
          <dd className="text-base md:text-lg text-neutral-700 dark:text-neutral-500">
            {formatTanggal(kir.tanggal_perolehan)}
          </dd>
        </div>
        <div className="py-5 md:py-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
          <dt className="text-base md:text-lg font-semibold text-neutral-900 dark:text-neutral-900">
            Kondisi
          </dt>
          <dd className="text-base md:text-lg text-neutral-700 dark:text-neutral-500">
            {kir.kondisi}
          </dd>
        </div>
        <div className="py-5 md:py-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
          <dt className="text-base md:text-lg font-semibold text-neutral-900 dark:text-neutral-900">
            jumlah
          </dt>
          <dd className="text-base md:text-lg text-neutral-700 dark:text-neutral-500">
            {kir.jumlah}
          </dd>
        </div>
        <div className="py-5 md:py-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
          <dt className="text-base md:text-lg font-semibold text-neutral-900 dark:text-neutral-900">
            nilai_perolehan
          </dt>
          <dd className="text-base md:text-lg text-neutral-700 dark:text-neutral-500">
           Rp. {formatRupiah(kir.nilai_perolehan)}
          </dd>
        </div>
      </dl>
    </div>
    {/* QR Code */}
        <div className=" text-center">
          <h2 className="text-lg font-semibold mb-2">QR Code</h2>

          {kir.gambar_qr ? (
            <img
              src={`${import.meta.env.VITE_API_URL_IMAGE}/storage/${kir.gambar_qr}`}
              alt="QR Code"
              className="w-32 h-32 mx-auto  shadow"
            />
          ) : (
            <div className="w-32 h-32 mx-auto border border-dashed border-gray-400 rounded flex items-center justify-center text-gray-500">
              QR
            </div>
          )}
        </div>
        {/* Keterangan */}
        {/* <div className="mt-6 text-center">
          <strong className="block mb-1">Keterangan:</strong>
          <p className="text-gray-700 bg-gray-50 p-3 rounded-lg ">
            {kir.keterangan || '-'}
          </p>
        </div> */}
        </section>

        

        

        {/* Tombol Kembali */}
        {/* <div className="mt-8 text-center">
          <Link
            to="/laporan-kir"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Kembali ke Laporan
          </Link>
        </div> */}
      </div>
    </div>
  )
}

export default ScanLabel

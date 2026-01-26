import { Link } from "react-router-dom"
import { useState,useEffect } from "react";
import {getKir,cetakLabelKir} from "../services/KirService"
import { toast } from "react-toastify";
function CetakLabel() {
  const [kirData, setKirData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedKir, setSelectedKir] = useState(null);
  const [selectedKirIds, setSelectedKirIds] = useState([]);

  const fetchData = async (page =1) => {
      try {
        const res = await getKir(page, search);
        const paginate = res.data;
        setKirData(paginate.data);
        setCurrentPage(paginate.current_page);
        setLastPage(paginate.last_page);
        setTotal(paginate.total);
      //   console.log(res);
      } catch (err) {
      console.log(err)
        toast.error("Gagal mengambil data KIB Tanah");
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchData(currentPage);
    }, [currentPage, search]);

  const handleCetak = async () => {
  const blob = await cetakLabelKir(selectedKirIds);

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "label-kir.pdf";
  a.click();
};
   const handleCheck = (item) => {
  setSelectedKir(item); // preview

  setSelectedKirIds((prev) =>
    prev.includes(item.id)
      ? prev.filter((id) => id !== item.id)
      : [...prev, item.id]
  );
};
  return (
    <>
    <div className="w-full text-gray-800 print:hidden">
      {/* HEADER */}
      {/* <h1 className="text-xl md:text-2xl font-bold mb-4">
         Cetak Label & Barcode Aset
      </h1> */}
      {/* LAYOUT - Stack on mobile, side-by-side on desktop */}
      <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
        
        {/* ===================== LIST ITEM ===================== */}
        <div className="flex-1 p-4 md:p-6 bg-white rounded-xl min-h-screen shadow-lg border border-gray-100">
          <h2 className="text-lg md:text-xl font-semibold mb-4">
            Daftar Aset KIR Siap Cetak
          </h2>

          {/* SEARCH */}
          <div className="mb-4 md:mb-6">
            <input type="text" placeholder="Cari nama, kode, atau lokasi..." 
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full border px-3 md:px-4 py-2 rounded-lg bg-gray-50 border-gray-200 shadow-sm text-sm"/>
          </div>
          {/* TOTAL */}
          <p className="text-sm text-gray-600 mb-3"> Total Aset:{" "}
            <span className="font-bold text-base md:text-lg"> {kirData.length} </span>
          </p>
          {/* TABLE - Desktop */}
          <div className=" overflow-y-auto max-h-[400px] border border-gray-200 rounded-md">
            <table className="min-w-full divide-y divide-gray-200 text-sm text-center">
              <thead className="bg-gray-50 sticky top-0 uppercase">
                <tr>
                  <th className="p-3 w-12"></th>
                  <th className="px-4 py-3">Nama Barang</th>
                  <th className="px-4 py-3">Kode Barang</th>
                  <th className="px-4 py-3">Lokasi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading && (
                         <tr>
                                <td colSpan="22" className="text-center py-10 bg-white">
                                    <div className="flex justify-center items-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                                        <p className="ml-3 text-sm text-gray-500">Memuat data...</p>
                                    </div>
                                </td>
                            </tr>
                      )}

                      {!loading && kirData.length === 0 && (
                        <tr>
                           <td colSpan="22" className="text-gray-500 p-4 font-semibold uppercase italic text-center">~~Data kosong~~</td>
                        </tr>
                      )}
                      {kirData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="p-3 text-center">
                        <input type="checkbox" checked={selectedKirIds.includes(item.id)} onChange={() => handleCheck(item)} className="w-4 h-4"/>
                      </td>
                      <td className="px-4 py-2 font-medium">{item.nama_barang}</td>
                      <td className="px-4 py-2">{item.kode_barang}</td>
                      <td className="px-4 py-2">{item.lokasi}</td>
                    </tr>
                      ))}
              </tbody>
            </table>
          </div>
          {/* Pagiination */}
                <div className="flex justify-between items-center mt-4">
                        <p className="text-sm text-gray-600">
                            Halaman {currentPage} dari {lastPage} (Total {total} data)
                        </p>

                        <div className="flex space-x-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(currentPage - 1)}
                                className="px-4 py-2 text-sm rounded-lg border border-gray-400 shadow  hover:bg-gray-100"
                            >
                                ⬅ Prev
                            </button>

                            <button
                                disabled={currentPage === lastPage}
                                onClick={() => setCurrentPage(currentPage + 1)}
                                className="px-4 py-2 text-sm rounded-lg border border-gray-400 shadow  hover:bg-gray-100"
                            >
                                Next ➡
                            </button>
                        </div>
                    </div>
        </div>
        

        {/* ===================== PREVIEW + CETAK ===================== */}
        <div className="lg:w-96 w-full">
          <div className="w-full p-4 border border-gray-200 rounded-lg bg-gray-50">
            <h2 className="text-base md:text-lg font-bold mb-4">⚙️ Konfigurasi Cetak</h2>
            {/* Preview Label */}
            <div className="mb-4">
             <PreviewLabelBoxStatic item={selectedKir} />
            </div>
              {selectedKir && (
                <div className="lg:hidden mb-3 p-2 bg-blue-100 text-blue-800 text-sm rounded-md text-center">
                  1 item dipilih
                </div>
              )}
            <hr className="my-4" />
            {/* Print Button */}
            <button onClick={handleCetak} disabled={selectedKirIds.length === 0} 
            className={`w-full p-3 rounded-lg font-semibold shadow-md transition ${ selectedKirIds.length === 0 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}>
              Cetak ({selectedKirIds.length})
            </button>
            {/* Tips */}
            <div className="mt-4 p-3 bg-blue-100 text-blue-800 text-xs rounded-md">
              <p className="font-bold mb-1">Tips:</p>
              <p> Gunakan kertas label <b>Tom & Jerry No. 121</b> atau{" "}
              <b>Sticker HVS A4 Utuh</b> untuk hasil terbaik.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

 const PreviewLabelBoxStatic = ({item}) => {
      if (!item) {
    return (
      <div className="border border-dashed border-gray-300 bg-white p-4 text-center text-xs text-gray-400">
        Pilih aset untuk preview label
      </div>
    );
  }
  return (
    <div className="border border-yellow-500 bg-white p-1 shadow-md w-full max-w-[300px] mx-auto">
      <div className="flex items-center justify-between border-b border-gray-500 pb-0.5 mb-0.5">
        <div className="flex items-center">
          <img src="logo.png" alt="Logo" className="w-3 h-3 rounded-full object-cover"/>
          <span className="font-semibold text-[6px] leading-none">PEMERINTAH KOTA BANDUNG</span>
        </div>
        <span className="font-extrabold text-[6px] text-gray-700 leading-none">KEC. BANDUNG KIDUL</span>
      </div>
      <div className="flex gap-1 items-start h-10">
        <div className="flex flex-col items-center justify-center w-16 h-full border border-gray-400 p-0.5 flex-shrink-0">
          {item.gambar_qr ? (
          <img src={`${import.meta.env.VITE_API_URL_IMAGE}/storage/${item.gambar_qr}`}alt="QR Code"className="w-7 h-7 object-cover"/>
          ) : (
          <img src={"https://placehold.co/40x40/ffffff/1a1a4f?text=QR"}alt="QR Code"className="w-7 h-7 object-cover"/>
          )}
        </div>
        <div className="flex-1 text-left pt-0.5">
          <p className="text-[7px] leading-tight">
            <span className="w-8 inline-block font-bold">Kode</span>:
            <span className="font-semibold">{item.kode_barang}</span>
          </p>
          <p className="text-[7px] leading-tight">
            <span className="w-8 inline-block font-bold">Nama</span>:
            <span className="font-semibold">{item.nama_barang}</span>
          </p>
          <p className="text-[7px] leading-tight">
            <span className="w-8 inline-block font-bold">lokasi</span>:
            <span className="font-semibold">{item.lokasi}</span>
          </p>
          <p className="text-[7px] leading-tight">
            <span className="w-8 inline-block font-bold">Tanggal</span>:
            <span className="font-semibold">{item.tanggal_perolehan}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CetakLabel

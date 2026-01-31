import { useEffect, useState } from "react"
import {getBerita} from "../../services/BeritaService"

function Berita() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      const res = await getBerita();
      setData(res.data);
      console.log(res);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div>
      <div>
        <h1>Daftar Berita</h1>
        <button>Tambah Berita</button>
        {loading ? (
          <p>Loading...</p>
        ) : (
          data.map((berita) => (
            <div key={berita.id}>
              <p>Nama: {berita.nama}</p>
              <p>NIP:{berita.nip}</p>
              <p>JABATAN:{berita.jabatan}</p>
              <p>TOTAL UNIT:{berita.jumlah}</p>
              <p>Tanggal:{berita.tanggal}</p>
              <p>Mesin:{berita.mesin_id}</p>
            </div>
          ))
        )}
       
      </div>
      <form action="">
        <div>
        <label htmlFor="">Tanggal</label>
        <input type="date" />
        </div>
        <div>
        <label htmlFor="">Nama</label>
        <input type="text" />
        </div>
        <div>
        <label htmlFor="">NIP</label>
        <input type="text" />
        </div>
        <div>
        <label htmlFor="">Jabatan</label>
        <input type="text" />
        </div>

        <div>
            <div><label htmlFor="">Penggunaan Barang</label>
                <select name="" id="">
                    <option value="">Honda Vario</option>
                </select>
            </div>
            <div>
                <label htmlFor="">Total Unit yang digunakan</label>
                <input type="number" />
            </div>
        </div>
      </form>
    </div>
  )
}

export default Berita

import api from "../lib/axios";

export const getKibMesin = async () => {
  const response = await api.get("/kib-mesin");
  return response.data.data;
};

export const createKibMesin = async (payload) => {
  const formData = new FormData();

  // Konversi object ke FormData secara otomatis
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });
  const res = await api.post("/kib-mesin", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
};

export const getMesinById = async (id) => {
  const res = await api.get(`/kib-mesin/${id}`); // ⬅️ unwrap di sini
  return res.data;
};

export const updateKibMesin = async (id, payload) => {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (key === "gambar") {
      // HANYA masukkan jika user memilih FILE BARU
      if (value instanceof File) {
        formData.append(key, value);
      }
      // Jika 'value' adalah string (path lama), ABAIKAN.
      // Jangan di-append agar Laravel tidak memvalidasi field ini.
    } else {
      // Masukkan field lainnya (kode_barang, nama_barang, dll)
      if (value !== null && value !== undefined) {
        formData.append(key, value);
      }
    }
  });

  // WAJIB: Agar Laravel mengenali ini sebagai request PUT meskipun dikirim via POST
  formData.append("_method", "PUT");
  const res = await api.post(`/kib-mesin/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
};

export const deleteKibMesin = async (id) => {
  const res = await api.delete(`/kib-mesin/${id}`);
  return res.data;
};

export const importExcel = async (payload) => {
  console.log([...payload.entries()]);
  const res = await api.post("/kib-mesin/import", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

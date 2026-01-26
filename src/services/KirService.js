import api from "../lib/axios";

/**
 * =========================
 * GET ALL KIR
 * =========================
 */
export const getKir = async (page = 1, search = "") => {
  const response = await api.get(`/kir?page=${page}&search=${search}`);
  return response.data;
};

/**
 * =========================
 * GET DETAIL KIR
 * =========================
 */
export const getKirById = async (id) => {
  const response = await api.get(`/kir/${id}`);
  return response.data.data;
};

/**
 * =========================
 * CREATE KIR
 * =========================
 */
export const createKir = async (payload) => {
  const formData = new FormData();

  // Konversi object ke FormData secara otomatis
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });
  const response = await api.post("/kir", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.data;
};

/**
 * =========================
 * UPDATE KIR
 * =========================
 */
export const updateKir = async (id, payload) => {
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
  formData.append("_method", "PUT");
  const response = await api.post(`/kir/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.data;
};

/**
 * =========================
 * DELETE KIR
 * =========================
 */
export const deleteKir = async (id) => {
  const response = await api.delete(`/kir/${id}`);
  return response.data.data;
};

export const cetakLabelKir = async (ids) => {
  const res = await api.post(
    "/kir/cetak-label",
    {
      ids: ids,
    },
    {
      responseType: "blob",
    },
  );

  return res.data;
};

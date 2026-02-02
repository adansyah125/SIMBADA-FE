import api from "../lib/axios";

export const getKibGedung = async (page = 1, search = "") => {
  const response = await api.get(`/kib-gedung?page=${page}&search=${search}`);
  return response.data; // ⬅️ unwrap di sini
};

export const createKibGedung = async (payload) => {
  const res = await api.post("/kib-gedung", payload);
  return res.data.data;
};

export const getGedungById = async (id) => {
  const res = await api.get(`/kib-gedung/${id}`); // ⬅️ unwrap di sini
  return res.data;
};

export const updateKibGedung = async (id, payload) => {
  const res = await api.put(`/kib-gedung/${id}`, payload);
  return res.data.data;
};

export const deleteKibGedung = async (id) => {
  const res = await api.delete(`/kib-gedung/${id}`);
  return res.data;
};

export const importExcel = async (payload) => {
  // console.log([...payload.entries()]);
  const res = await api.post("/kib-gedung/import", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

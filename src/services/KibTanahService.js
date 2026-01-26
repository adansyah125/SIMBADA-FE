import api from "../lib/axios";

export const getKibTanah = async (page = 1, search = "") => {
  const response = await api.get(`/kib-tanah?page=${page}&search=${search}`);
  return response.data; // ⬅️ unwrap di sini
};

export const createKibTanah = async (payload) => {
  const res = await api.post("/kib-tanah", payload);

  return res.data.data;
};
export const getTanahById = async (id) => {
  const res = await api.get(`/kib-tanah/${id}`); // ⬅️ unwrap di sini
  return res.data;
};

export const updateKibTanah = async (id, payload) => {
  const res = await api.put(`/kib-tanah/${id}`, payload);
  return res.data.data;
};

export const deleteKibTanah = async (id) => {
  const res = await api.delete(`/kib-tanah/${id}`);
  return res.data;
};

export const importExcel = async (payload) => {
  console.log([...payload.entries()]);
  const res = await api.post("/kib-tanah/import", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

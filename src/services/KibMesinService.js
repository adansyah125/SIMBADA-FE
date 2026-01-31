import api from "../lib/axios";

export const getKibMesin = async (page = 1, search = "") => {
  const response = await api.get(`/kib-mesin?page=${page}&search=${search}`);
  return response.data; // FULL pagination object
};

export const getAllKibMesin = async () => {
  const response = await api.get("/kib-mesin-all");
  return response.data;
};

export const createKibMesin = async (payload) => {
  const res = await api.post("/kib-mesin", payload);
  return res.data.data;
};

export const getMesinById = async (id) => {
  const res = await api.get(`/kib-mesin/${id}`); // ⬅️ unwrap di sini
  return res.data;
};

export const updateKibMesin = async (id, payload) => {
  const res = await api.put(`/kib-mesin/${id}`, payload);
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

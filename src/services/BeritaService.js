import api from "../lib/axios";

export const getBerita = async () => {
  const response = await api.get("/berita");
  return response.data;
};

export const createBerita = async (payload) => {
  const res = await api.post("/berita", payload);
  return res.data.data;
};

export const deleteBerita = async (id) => {
  const res = await api.delete(`/berita/${id}`);
  return res.data;
};

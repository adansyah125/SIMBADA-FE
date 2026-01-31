import api from "../lib/axios";

export const getBerita = async () => {
  const response = await api.get("/berita");
  return response.data;
};

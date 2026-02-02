import api from "../lib/axios";

export const getIntegritas = async () => {
  const response = await api.get("/integritas");
  return response.data;
};

export const createIntegritas = async (payload) => {
  const res = await api.post("/integritas", payload);
  return res.data.data;
};

export const deleteIntegritas = async (id) => {
  const res = await api.delete(`/integritas/${id}`);
  return res.data;
};

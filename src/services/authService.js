import api from "../lib/axios";

export const login = async (payload) => {
  const { data } = await api.post("/login", payload);
  return data;
};

export const logout = async () => {
  await api.post("/logout");
};

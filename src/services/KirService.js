import api from "../lib/axios";

/**
 * =========================
 * GET ALL KIR
 * =========================
 */
export const getKir = async () => {
  const response = await api.get("/kir");
  return response.data.data;
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
  const response = await api.post("/kir", payload);
  return response.data.data;
};

/**
 * =========================
 * UPDATE KIR
 * =========================
 */
export const updateKir = async (id, payload) => {
  const response = await api.put(`/kir/${id}`, payload);
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

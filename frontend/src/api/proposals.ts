import { apiClient } from "./client";

export const proposalsAPI = {
  create: async (data: {
    title: string;
    description: string;
    crop_name: string;
    area_acres: number;
    expected_yield: number;
    amount_requested: number;
    roi_percent: number;
    language: string;
    generated_pitch?: string;
  }) => {
    const res = await apiClient.post("/proposals/create", data);
    return res.data;
  },

  publish: async (proposal_id: string) => {
    const res = await apiClient.post("/proposals/publish", { proposal_id });
    return res.data;
  },

  getMine: async () => {
    const res = await apiClient.get("/proposals/my");
    return res.data;
  },

  delete: async (proposal_id: string) => {
    const res = await apiClient.delete(`/proposals/${proposal_id}`);
    return res.data;
  },
};

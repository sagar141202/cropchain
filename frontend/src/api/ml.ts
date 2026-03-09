import { apiClient } from "./client";

export const mlAPI = {
  predictYield: async (data: {
    crop_name: string;
    area_acres: number;
    soil_type: string;
    irrigation_type: string;
    season: string;
    state: string;
  }) => {
    const res = await apiClient.post("/ml/predict-yield", data);
    return res.data;
  },

  checkFairPrice: async (data: {
    crop_name: string;
    market_name: string;
    state: string;
    offered_price: number;
  }) => {
    const res = await apiClient.post("/ml/fair-price", data);
    return res.data;
  },
};

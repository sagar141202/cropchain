import { apiClient } from "./client";

export const groqAPI = {
  generateProposal: async (data: {
    crop_name: string;
    area_acres: number;
    predicted_yield: number;
    investment_ask: number;
    roi_percent: number;
    state: string;
    language: string;
  }) => {
    const res = await apiClient.post("/coach/generate-proposal", data);
    return res.data;
  },

  negotiate: async (data: {
    question: string;
    context: string;
    language: string;
  }) => {
    const res = await apiClient.post("/coach/negotiate", data);
    return res.data;
  },

  priceScript: async (data: {
    crop_name: string;
    offered_price: number;
    modal_price: number;
    deviation_percent: number;
    language: string;
  }) => {
    const res = await apiClient.post("/coach/price-script", data);
    return res.data;
  },
};

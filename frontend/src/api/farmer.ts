import { apiClient } from "./client";

export const farmerAPI = {
  createFarm: async (data: {
    name: string;
    location: string;
    area_acres: number;
    soil_type: string;
    irrigation_type: string;
    lat?: number;
    lng?: number;
  }) => {
    const res = await apiClient.post("/farmer/farms", data);
    return res.data;
  },

  getMyFarms: async () => {
    const res = await apiClient.get("/farmer/farms");
    return res.data;
  },

  createCrop: async (data: {
    farm_id: string;
    crop_name: string;
    season: string;
    area_planted: number;
    sowing_date?: string;
    harvest_date?: string;
  }) => {
    const res = await apiClient.post("/farmer/crops", data);
    return res.data;
  },
};

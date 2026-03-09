import client from "./client";

export const mlAPI = {
  predictYield: (data: {
    crop_name: string;
    area_acres: number;
    soil_type: string;
    irrigation_type: string;
    season: string;
    state: string;
    avg_rainfall?: number;
    avg_temp?: number;
  }) => client.post("/ml/predict-yield", data).then(r => r.data),

  detectAnomaly: (data: {
    crop_name: string;
    market_name: string;
    state: string;
    offered_price: number;
  }) => client.post("/ml/fair-price", data).then(r => r.data),
};

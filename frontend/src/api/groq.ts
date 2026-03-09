import client from "./client";

export const groqAPI = {
  generatePitch: (data: {
    crop_name: string;
    area_acres: number;
    predicted_yield: number;
    investment_ask: number;
    roi_percent: number;
    state: string;
    language?: string;
  }) => client.post("/coach/generate-proposal", data).then(r => r.data),

  askCoach: (data: {
    question: string;
    context: string;
    language?: string;
  }) => client.post("/coach/negotiate", data).then(r => r.data),

  priceScript: (data: {
    crop_name: string;
    offered_price: number;
    modal_price: number;
    deviation_percent: number;
    language?: string;
  }) => client.post("/coach/price-script", data).then(r => r.data),
};

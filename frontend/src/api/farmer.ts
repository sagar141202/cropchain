import client from "./client";

export const farmerAPI = {
  createFarm: (data: any) =>
    client.post("/farmer/farms", data).then(r => r.data),

  getFarms: () =>
    client.get("/farmer/farms").then(r => r.data),

  createCrop: (data: any) =>
    client.post("/farmer/crops", data).then(r => r.data),
};

import client from "./client";

export const proposalsAPI = {
  create: (data: {
    title: string;
    description: string;
    crop_name: string;
    area_acres: number;
    expected_yield: number;
    amount_requested: number;
    roi_percent: number;
    language?: string;
    generated_pitch?: string;
  }) => client.post("/proposals/create", data).then(r => r.data),

  publish: (proposal_id: string) =>
    client.post("/proposals/publish", { proposal_id }).then(r => r.data),

  getMyProposals: () =>
    client.get("/proposals/my").then(r => r.data),

  delete: (id: string) =>
    client.delete(`/proposals/${id}`).then(r => r.data),
};

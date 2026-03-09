import client from "./client";

export const investorAPI = {
  browseProposals: () =>
    client.get("/investor/proposals").then(r => r.data),

  getProposal: (id: string) =>
    client.get(`/investor/proposals/${id}`).then(r => r.data),

  invest: (proposal_id: string, amount: number) =>
    client.post("/investor/invest", { proposal_id, amount }).then(r => r.data),

  getPortfolio: () =>
    client.get("/investor/portfolio").then(r => r.data),
};

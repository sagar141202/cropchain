import { apiClient } from "./client";

export const investorAPI = {
  browseProposals: async () => {
    const res = await apiClient.get("/investor/proposals");
    return res.data;
  },

  getProposal: async (id: string) => {
    const res = await apiClient.get(`/investor/proposals/${id}`);
    return res.data;
  },

  invest: async (proposalId: string, amount: number) => {
    const res = await apiClient.post("/investor/invest", {
      proposal_id: proposalId,
      amount,
    });
    return res.data;
  },

  getPortfolio: async () => {
    const res = await apiClient.get("/investor/portfolio");
    return res.data;
  },
};

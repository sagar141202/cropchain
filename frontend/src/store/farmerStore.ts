import { create } from "zustand";

interface Farm {
  id: string;
  name: string;
  location: string;
  area_acres: number;
  soil_type: string;
  irrigation_type: string;
  lat?: number;
  lng?: number;
}

interface YieldPrediction {
  predicted_yield: number;
  confidence_min: number;
  confidence_max: number;
  unit: string;
  crop_name: string;
  area_acres: number;
}

interface FairPriceResult {
  crop_name: string;
  offered_price: number;
  modal_price: number;
  deviation_percent: number;
  is_anomaly: boolean;
  severity: string;
  anomaly_score: number;
  recommendation: string;
}

interface FarmerState {
  farms: Farm[];
  selectedFarm: Farm | null;
  lastYieldPrediction: YieldPrediction | null;
  lastFairPriceResult: FairPriceResult | null;
  setFarms: (farms: Farm[]) => void;
  setSelectedFarm: (farm: Farm | null) => void;
  setYieldPrediction: (prediction: YieldPrediction) => void;
  setFairPriceResult: (result: FairPriceResult) => void;
}

export const useFarmerStore = create<FarmerState>((set) => ({
  farms: [],
  selectedFarm: null,
  lastYieldPrediction: null,
  lastFairPriceResult: null,
  setFarms: (farms) => set({ farms }),
  setSelectedFarm: (farm) => set({ selectedFarm: farm }),
  setYieldPrediction: (prediction) => set({ lastYieldPrediction: prediction }),
  setFairPriceResult: (result) => set({ lastFairPriceResult: result }),
}));

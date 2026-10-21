export interface BillboardSpec {
  id: string;
  name: string;
  type: string;
  description: string;
  dimensions: string;
  basePricePerDay: number;
  estImpressionsPerDay: number;
  icon: string;
}

export interface CityMarket {
  id: string;
  name: string;
  country: string;
  reachMultiplier: number;
  premiumFactor: number;
  coordinates: { x: number; y: number };
  popularSpots: string[];
}

export interface AdMockupConfig {
  headline: string;
  textColor: string;
  bgColor: string;
  bgGradient: string;
  stylePreset: "cyber" | "neon" | "luxury" | "bold" | "modern";
  imageUrl?: string;
  glowIntensity: number;
  fontSize: number; // clamp or offset percentage
}

export interface CreativeCampaignBrief {
  campaignName: string;
  tagline: string;
  billboardConcept: string;
  additionalStrategies: string[];
  conversionProjection: string;
}

export interface CampaignPlannerInput {
  brandName: string;
  industry: string;
  targetAudience: string;
  coreMessage: string;
  campaignTone: string;
}

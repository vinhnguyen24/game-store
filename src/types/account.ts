export type SaleStatus = "pending" | "sale" | "cancel";
export type Version = "gamota" | "japan" | "global";

export interface Account {
  documentId: string;
  id: number;
  title: string;
  version: Version;
  price: number;
  vipLevel: number;
  kills: number;
  speed: number;
  goldenHeads: number;
  equipment: number;
  talent: number;
  emblem: string;
  tattoo: string;
  equipment_emblems: string;
  tickets: number;
  resources: string;
  actionPoints: number;
  commander: string;
  legendaryHouse: string;
  saleStatus: SaleStatus;
  images: Media[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  keyRally: boolean;
  sellerName: string;
  city_themes: {
    id: number;
    name: string;
    buff: string;
    type: "infantry" | "archer" | "cavalry" | "mix" | "ultility";
  }[];
  thumbnail: {
    url: string;
  };
}

export interface Media {
  id: number;
  url: string;
  name: string;
  alternativeText?: string;
  caption?: string;
  width?: number;
  height?: number;
  formats?: any;
  mime: string;
  size: number;
}

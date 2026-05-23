// =============================================
// PTI HOME – MODEL: Project (Dự án bất động sản)
// =============================================

export interface Project {
  id: string;
  name: string;
  slug: string;
  location: string;
  description: string;
  thumbnailUrl: string;
  images: string[];
  priceFrom: number;       // VND
  priceTo?: number;        // VND
  area: number;            // m²
  type: ProjectType;
  status: ProjectStatus;
  features: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export type ProjectType = 'apartment' | 'villa' | 'shophouse' | 'townhouse' | 'land';
export type ProjectStatus = 'upcoming' | 'open' | 'sold-out';

// Core Entity Types
export interface Site {
  id: string;
  name: string;
  location: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Building {
  id: string;
  name: string;
  siteId: string;
  floors?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Level {
  id: string;
  name: string;
  buildingId: string;
  floorNumber?: number;
  createdAt?: string;
  updatedAt?: string;
}

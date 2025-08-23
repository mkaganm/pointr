// API Request Types
export interface CreateSiteRequest {
  name: string;
  location: string;
}

export interface CreateBuildingRequest {
  name: string;
  siteId: string;
  floors?: number;
}

export interface CreateLevelRequest {
  name: string;
  buildingId: string;
  floorNumber?: number;
}

export interface UpdateSiteRequest {
  name?: string;
  location?: string;
}

export interface UpdateBuildingRequest {
  name?: string;
  floors?: number;
}

export interface UpdateLevelRequest {
  name?: string;
  floorNumber?: number;
}

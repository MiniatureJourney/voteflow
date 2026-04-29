export interface LocationData {
  lat: number;
  lng: number;
  address: string;
}

export interface PollingBooth {
  id: string;
  name: string;
  location: LocationData;
  wait_time_minutes: number;
  is_accessible: boolean;
  distance_miles?: number;
}

export class BoothMappingEngine {
  /**
   * Maps a user's zip code/location to nearest polling booths.
   * Returns navigation-ready payload.
   */
  static async locateNearestBooths(userLocation: LocationData | string): Promise<PollingBooth[]> {
    // Edge-function ready: In production this calls Google Civic API / Maps Matrix API
    // Stubbing a modular payload for real-time frontend consumption
    
    return [
      {
        id: "booth-001",
        name: "Central High School Gym",
        location: { lat: 34.0522, lng: -118.2437, address: "123 Main St, Cityville" },
        wait_time_minutes: 15,
        is_accessible: true,
        distance_miles: 0.8
      },
      {
        id: "booth-002",
        name: "Cityville Public Library",
        location: { lat: 34.0530, lng: -118.2400, address: "456 Library Rd, Cityville" },
        wait_time_minutes: 45,
        is_accessible: true,
        distance_miles: 2.1
      }
    ].sort((a, b) => (a.distance_miles || 0) - (b.distance_miles || 0));
  }
}

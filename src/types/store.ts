export interface App {
  type: "line" | "ios" | "android" | "web";
  url: string;
  name: string;
}

export interface Congestion {
  level: number;
  liveData: boolean;
  lastUpdated: {
    toDate: () => Date;
  };
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface PopularTimes {
  current: string | null;
}

export interface Store {
  id: string;
  name: string;
  address: string;
  type: string;
  location: Location;
  congestion?: Congestion;
  openingHours?: string;
  officialApps?: App[];
  popularTimes?: PopularTimes;
}

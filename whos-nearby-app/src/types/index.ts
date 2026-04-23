export type RadiusMiles = 0.1 | 0.5 | 1 | 3;

export type NearbyUser = {
  uid: string;
  name: string;
  distanceMiles: number;
  lastSeenAt: number;
};

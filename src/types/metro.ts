export interface MetroStation {
  id: string;
  name: string;
  nameBn: string;
  line: 'Blue Line (North-South)' | 'Green Line (East-West)' | 'Orange Line';
  latitude: number;
  longitude: number;
  address: string;
  nearbyPandalIds: string[];
}

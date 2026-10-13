export interface MetroStation {
  id: string;
  name: string;
  nameBn: string;
  line: 'Blue Line (North-South)' | 'Green Line (East-West)' | 'Orange Line' | 'Purple Line';
  latitude: number;
  longitude: number;
  address: string;
  nearbyPandalIds: string[];
}

export type MetroScheduleType = 'normal' | 'festival_special';

export type MetroServiceStatus = 'active' | 'overnight_special' | 'suspended' | 'reduced' | 'unverified';

export interface MetroLineTimetable {
  id: string;
  lineName: string;
  lineNameBn: string;
  lineKey: 'blue' | 'green' | 'purple' | 'orange';
  scheduleType: MetroScheduleType;
  status: MetroServiceStatus;
  dateRange: string;
  dateRangeBn: string;
  dayType: string;
  dayTypeBn: string;
  firstTrain: string;
  lastTrain: string;
  directions: string[];
  directionsBn: string[];
  peakFrequencyMinutes?: number;
  offPeakFrequencyMinutes?: number;
  isOvernightService: boolean;
  notes: string;
  notesBn: string;
  sourceUrl: string;
  sourceName: string;
  lastVerifiedDate: string;
}

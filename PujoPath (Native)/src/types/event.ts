export interface PujaTithi {
  name: string;
  nameBn: string;
  startTime: string;
  endTime: string;
  description: string;
  descriptionBn: string;
}

export interface PujaDay {
  id: string;
  slug: string;
  dayName: string;
  dayNameBn: string;
  dateString: string;
  gregorianDate: string;
  significance: string;
  significanceBn: string;
  rituals: string[];
  ritualsBn: string[];
  pushpanjaliTimings: string;
  pushpanjaliTimingsBn: string;
  bhogTimings?: string;
  bhogTimingsBn?: string;
  tithis: PujaTithi[];
  isToday?: boolean;
}

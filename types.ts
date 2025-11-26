
export enum Region {
  RENO = 'Reno',
  TAHOE = 'Lake Tahoe',
  GRAEAGLE = 'Graeagle/Lost Sierra',
  TRUCKEE = 'Truckee',
  CARSON = 'Carson Valley',
  MONTEREY = 'Monterey/Carmel'
}

export interface GolfCourse {
  name: string;
  region: Region;
  par: number;
  url?: string;
}

export interface LodgingOption {
  name: string;
  region: Region;
  type: 'Casino' | 'Resort' | 'Vacation Home' | 'Hotel';
  url?: string;
}

export interface ItineraryItem {
  day: number;
  date: string;
  time: string;
  activity: string;
  location: string;
  notes: string;
}

export interface LogisticsDetails {
  transportType: string;
  passengerCount: number;
  specialRequests: string[];
}

export interface TripRecap {
  id: string;
  groupName: string;
  groupSize: number;
  month: string;
  year: number;
  courses: string[];
  lodging: string;
  nights: number;
  rounds: number;
  pricePerPerson: number;
  vibe: 'Budget' | 'Value' | 'Premium' | 'Bucket List' | 'Bachelor Party' | 'Corporate';
  synopsis: string; // The marketing blurb
  whyItWorked: string; // Internal note for the planner
  highlights: string[];
  
  // New Detailed Fields
  dailyItinerary: ItineraryItem[];
  logistics: LogisticsDetails;
}

export interface AIParsedData {
  groupName: string;
  groupSize: number;
  courses: string[];
  lodging: string;
  pricePerPersonEstimate: number;
  vibe: string;
  synopsis: string;
  whyItWorked: string;
  highlights: string[];
  dailyItinerary: ItineraryItem[];
  logistics: LogisticsDetails;
}

export interface SmtpConfig {
  email: string; // Account Name
  password: string;
  outgoingServer: string;
  smtpPort: string;
  // Optional display fields based on screenshot
  incomingServer?: string;
  imapPort?: string;
}

export interface UserMetadata {
    ip: string;
    city: string;
    region: string;
    country: string;
    timezone: string;
    userAgent: string;
    deviceType: string;
    landingPage: string;
}

export interface QuoteRequestLog {
  id: string;
  timestamp: string; // ISO string
  customer: {
    name: string;
    email: string;
    phone: string;
    company?: string;
  };
  tripId: string;
  tripName: string;
  constraints: string;
  tripSnapshot?: TripRecap; // Snapshot of the full trip details at time of quote
  metadata: UserMetadata;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string; // ISO string
}

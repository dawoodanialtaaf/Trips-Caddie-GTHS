
import { Region } from '../types';

interface WeatherData {
  temp: number;
  condition: string;
  isDay: boolean;
  code: number;
}

// Mapping Regions to Lat/Lon (approximate centers)
const REGION_COORDS: Record<string, { lat: number; lon: number }> = {
  [Region.RENO]: { lat: 39.5296, lon: -119.8138 },
  [Region.TAHOE]: { lat: 39.0968, lon: -120.0324 },
  [Region.TRUCKEE]: { lat: 39.3280, lon: -120.1833 },
  [Region.GRAEAGLE]: { lat: 39.7674, lon: -120.6228 },
  [Region.CARSON]: { lat: 39.0885, lon: -119.7687 },
  [Region.MONTEREY]: { lat: 36.6002, lon: -121.8947 },
};

// Fallback for string matching if exact enum match fails
const STRING_COORDS: Record<string, { lat: number; lon: number }> = {
  'reno': REGION_COORDS[Region.RENO],
  'sparks': REGION_COORDS[Region.RENO],
  'tahoe': REGION_COORDS[Region.TAHOE],
  'incline': REGION_COORDS[Region.TAHOE],
  'stateline': REGION_COORDS[Region.TAHOE],
  'truckee': REGION_COORDS[Region.TRUCKEE],
  'graeagle': REGION_COORDS[Region.GRAEAGLE],
  'plumas': REGION_COORDS[Region.GRAEAGLE],
  'carson': REGION_COORDS[Region.CARSON],
  'genoa': REGION_COORDS[Region.CARSON],
  'monterey': REGION_COORDS[Region.MONTEREY],
  'carmel': REGION_COORDS[Region.MONTEREY],
  'pebble': REGION_COORDS[Region.MONTEREY],
};

export const fetchWeather = async (regionName: string | undefined): Promise<WeatherData | null> => {
  if (!regionName) return null;

  let coords = REGION_COORDS[regionName];
  
  if (!coords) {
    // Try fuzzy match
    const lowerName = regionName.toLowerCase();
    const key = Object.keys(STRING_COORDS).find(k => lowerName.includes(k));
    if (key) coords = STRING_COORDS[key];
  }

  if (!coords) return null;

  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current=temperature_2m,weather_code,is_day&temperature_unit=fahrenheit`
    );
    const data = await response.json();
    
    if (!data.current) return null;

    return {
      temp: Math.round(data.current.temperature_2m),
      code: data.current.weather_code,
      condition: getWeatherCondition(data.current.weather_code),
      isDay: !!data.current.is_day
    };
  } catch (error) {
    console.error("Weather fetch failed", error);
    return null;
  }
};

const getWeatherCondition = (code: number): string => {
  if (code === 0) return 'Clear';
  if (code <= 3) return 'Partly Cloudy';
  if (code <= 48) return 'Fog';
  if (code <= 57) return 'Drizzle';
  if (code <= 67) return 'Rain';
  if (code <= 77) return 'Snow Grains';
  if (code <= 82) return 'Showers';
  if (code <= 86) return 'Snow Showers';
  if (code <= 99) return 'Thunderstorm';
  return 'Cloudy';
};

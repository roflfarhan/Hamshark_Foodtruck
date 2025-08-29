import type { TruckLocation } from "@shared/schema";

// Utility functions for truck location management and filtering

export interface LocationWithDistance extends TruckLocation {
  distance?: number;
}

// Calculate distance between two coordinates using Haversine formula
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance;
};

// Get locations within a specified radius
export const getLocationsWithinRadius = (
  locations: TruckLocation[],
  userLat: number,
  userLon: number,
  radiusKm: number = 5
): LocationWithDistance[] => {
  return locations
    .map(location => {
      if (!location.latitude || !location.longitude) return null;
      
      const distance = calculateDistance(
        userLat,
        userLon,
        parseFloat(location.latitude),
        parseFloat(location.longitude)
      );
      
      return {
        ...location,
        distance,
      };
    })
    .filter((location): location is LocationWithDistance => 
      location !== null && (location.distance || 0) <= radiusKm
    )
    .sort((a, b) => (a.distance || 0) - (b.distance || 0));
};

// Filter locations by current status
export const filterByStatus = (
  locations: TruckLocation[],
  status: string
): TruckLocation[] => {
  return locations.filter(location => 
    location.currentStatus.toLowerCase() === status.toLowerCase()
  );
};

// Get currently open locations
export const getOpenLocations = (locations: TruckLocation[]): TruckLocation[] => {
  return filterByStatus(locations, "open");
};

// Get locations that are coming soon
export const getComingLocations = (locations: TruckLocation[]): TruckLocation[] => {
  return filterByStatus(locations, "coming");
};

// Get closed locations
export const getClosedLocations = (locations: TruckLocation[]): TruckLocation[] => {
  return filterByStatus(locations, "closed");
};

// Check if a location is currently open based on schedule
export const isLocationOpenNow = (location: TruckLocation): boolean => {
  if (!location.schedule) return false;
  
  const now = new Date();
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
  const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
  
  const todaySchedule = location.schedule.find(
    schedule => schedule.day.toLowerCase() === currentDay.toLowerCase()
  );
  
  if (!todaySchedule || !todaySchedule.isOpen) return false;
  
  return currentTime >= todaySchedule.startTime && currentTime <= todaySchedule.endTime;
};

// Get estimated arrival time for coming locations
export const getEstimatedArrival = (location: TruckLocation): string | null => {
  if (location.currentStatus !== "coming" || !location.estimatedArrival) {
    return null;
  }
  
  const now = new Date();
  const arrival = new Date(location.estimatedArrival);
  const diffMs = arrival.getTime() - now.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  
  if (diffMinutes <= 0) return "Arriving now";
  if (diffMinutes < 60) return `${diffMinutes} minutes`;
  
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  
  if (hours === 1) return `1 hour ${minutes} minutes`;
  return `${hours} hours ${minutes} minutes`;
};

// Get next opening time for closed locations
export const getNextOpeningTime = (location: TruckLocation): string | null => {
  if (!location.schedule) return null;
  
  const now = new Date();
  const currentDay = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const currentTime = now.toTimeString().slice(0, 5);
  
  // Map JavaScript day numbers to schedule day names
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
  // Check remaining days of current week
  for (let i = 0; i < 7; i++) {
    const checkDay = (currentDay + i) % 7;
    const checkDayName = dayNames[checkDay];
    
    const daySchedule = location.schedule.find(
      schedule => schedule.day.toLowerCase() === checkDayName.toLowerCase()
    );
    
    if (!daySchedule || !daySchedule.isOpen) continue;
    
    // If it's today, check if we're before opening time
    if (i === 0 && currentTime < daySchedule.startTime) {
      return `Today at ${daySchedule.startTime}`;
    }
    
    // If it's tomorrow
    if (i === 1) {
      return `Tomorrow at ${daySchedule.startTime}`;
    }
    
    // If it's later this week
    if (i > 1) {
      return `${checkDayName} at ${daySchedule.startTime}`;
    }
  }
  
  return null;
};

// Get peak hours for a location based on orders
export const getPeakHours = (location: TruckLocation): string[] => {
  // Mock logic - in real implementation, this would analyze historical order data
  const locationName = location.name.toLowerCase();
  
  if (locationName.includes("tech") || locationName.includes("office")) {
    return ["12:00-14:00", "18:00-19:00"];
  }
  
  if (locationName.includes("university") || locationName.includes("campus")) {
    return ["13:00-15:00", "19:00-21:00"];
  }
  
  if (locationName.includes("business") || locationName.includes("district")) {
    return ["12:30-13:30", "18:30-19:30"];
  }
  
  return ["12:00-14:00"];
};

// Get recommended visit time based on crowd levels
export const getRecommendedVisitTime = (location: TruckLocation): string => {
  const peakHours = getPeakHours(location);
  const schedule = location.schedule?.find(s => s.isOpen);
  
  if (!schedule) return "Check schedule";
  
  // Recommend time before peak hours
  if (peakHours.length > 0) {
    const firstPeak = peakHours[0].split('-')[0];
    const peakHour = parseInt(firstPeak.split(':')[0]);
    const recommendedHour = Math.max(peakHour - 1, parseInt(schedule.startTime.split(':')[0]));
    return `${recommendedHour.toString().padStart(2, '0')}:00 (Less crowded)`;
  }
  
  return schedule.startTime;
};

// Check if user should be notified about a location
export const shouldNotifyUser = (
  location: TruckLocation,
  userPreferences: {
    notifyMinutes?: number;
    preferredLocations?: string[];
    maxDistance?: number;
  }
): boolean => {
  const { notifyMinutes = 30, preferredLocations = [], maxDistance = 5 } = userPreferences;
  
  // Check if it's a preferred location
  const isPreferred = preferredLocations.includes(location.id);
  
  // Check if location is coming within notification window
  if (location.currentStatus === "coming" && location.estimatedArrival) {
    const now = new Date();
    const arrival = new Date(location.estimatedArrival);
    const diffMinutes = Math.floor((arrival.getTime() - now.getTime()) / (1000 * 60));
    
    if (diffMinutes <= notifyMinutes && diffMinutes > 0) {
      return isPreferred;
    }
  }
  
  return false;
};

// Get location popularity score based on orders
export const getLocationPopularity = (location: TruckLocation): number => {
  const ordersToday = location.ordersToday || 0;
  
  // Simple scoring system
  if (ordersToday >= 50) return 5;
  if (ordersToday >= 30) return 4;
  if (ordersToday >= 20) return 3;
  if (ordersToday >= 10) return 2;
  return 1;
};

// Group locations by area/district
export const groupLocationsByArea = (locations: TruckLocation[]): Record<string, TruckLocation[]> => {
  return locations.reduce((groups, location) => {
    // Extract area from address (simple logic)
    const area = location.address.split(',').slice(-2, -1)[0]?.trim() || "Other";
    
    if (!groups[area]) {
      groups[area] = [];
    }
    
    groups[area].push(location);
    return groups;
  }, {} as Record<string, TruckLocation[]>);
};

// Get wait time estimate based on current orders
export const getEstimatedWaitTime = (location: TruckLocation): string => {
  const ordersToday = location.ordersToday || 0;
  const currentHour = new Date().getHours();
  
  // Peak hours factor
  const peakHours = getPeakHours(location);
  const isPeakTime = peakHours.some(peak => {
    const [start, end] = peak.split('-');
    const startHour = parseInt(start.split(':')[0]);
    const endHour = parseInt(end.split(':')[0]);
    return currentHour >= startHour && currentHour <= endHour;
  });
  
  let baseWaitTime = 5; // minutes
  
  if (isPeakTime) baseWaitTime += 5;
  if (ordersToday > 30) baseWaitTime += 3;
  if (ordersToday > 50) baseWaitTime += 5;
  
  return `${baseWaitTime}-${baseWaitTime + 5} minutes`;
};

// Get weekly schedule summary
export const getWeeklySchedule = (location: TruckLocation): string => {
  if (!location.schedule) return "Schedule not available";
  
  const openDays = location.schedule.filter(day => day.isOpen);
  
  if (openDays.length === 0) return "Currently closed";
  if (openDays.length === 7) return "Open daily";
  
  const dayNames = openDays.map(day => day.day.slice(0, 3)).join(", ");
  return `Open ${dayNames}`;
};

// Sort locations by relevance (distance, status, popularity)
export const sortLocationsByRelevance = (
  locations: LocationWithDistance[],
  userPreferences: {
    prioritizeOpen?: boolean;
    prioritizeNear?: boolean;
    prioritizePopular?: boolean;
  } = {}
): LocationWithDistance[] => {
  const { prioritizeOpen = true, prioritizeNear = true, prioritizePopular = false } = userPreferences;
  
  return locations.sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;
    
    // Status score (open locations get priority)
    if (prioritizeOpen) {
      if (a.currentStatus === "open") scoreA += 100;
      if (a.currentStatus === "coming") scoreA += 50;
      if (b.currentStatus === "open") scoreB += 100;
      if (b.currentStatus === "coming") scoreB += 50;
    }
    
    // Distance score (closer locations get priority)
    if (prioritizeNear && a.distance !== undefined && b.distance !== undefined) {
      scoreA += Math.max(0, 20 - a.distance * 4); // Max 20 points, decreasing with distance
      scoreB += Math.max(0, 20 - b.distance * 4);
    }
    
    // Popularity score
    if (prioritizePopular) {
      scoreA += getLocationPopularity(a) * 10;
      scoreB += getLocationPopularity(b) * 10;
    }
    
    return scoreB - scoreA;
  });
};

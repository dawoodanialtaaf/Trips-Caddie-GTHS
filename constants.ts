import { GolfCourse, LodgingOption, Region, TripRecap } from './types';

export const COURSES: GolfCourse[] = [
  // Lake Tahoe
  { 
    name: 'Edgewood Tahoe', 
    region: Region.TAHOE, 
    par: 72,
    url: 'https://golfthehighsierra.com/portfolio/edgewood-tahoe-golf-course/'
  },
  { 
    name: 'Incline Village Championship', 
    region: Region.TAHOE, 
    par: 72,
    url: 'https://golfthehighsierra.com/portfolio/incline-village-golf-courses-nv/'
  },
  { 
    name: 'Incline Village Mountain', 
    region: Region.TAHOE, 
    par: 58,
    url: 'https://golfthehighsierra.com/portfolio/incline-village-golf-courses-nv/'
  },
  { 
    name: 'Lake Tahoe Golf Course', 
    region: Region.TAHOE, 
    par: 71,
    url: 'https://golfthehighsierra.com/portfolio/lake-tahoe-golf-course/'
  },
  { 
    name: 'Old Greenwood', 
    region: Region.TRUCKEE, 
    par: 72,
    url: 'https://golfthehighsierra.com/portfolio/old-greenwood-golf-course/'
  },
  { 
    name: 'Gray\'s Crossing', 
    region: Region.TRUCKEE, 
    par: 72,
    url: 'https://golfthehighsierra.com/portfolio/grays-crossing-golf-course/'
  },
  { 
    name: 'Coyote Moon', 
    region: Region.TRUCKEE, 
    par: 72,
    url: 'https://golfthehighsierra.com/portfolio/coyote-moon-golf-course/'
  },
  { 
    name: 'Tahoe Donner', 
    region: Region.TRUCKEE, 
    par: 72,
    url: 'https://golfthehighsierra.com/portfolio/tahoe-donner-golf-course-truckee-ca/'
  },
  { 
    name: 'Northstar California', 
    region: Region.TRUCKEE, 
    par: 72,
    url: 'https://golfthehighsierra.com/portfolio/northstar-golf-course/'
  },
  { 
    name: 'Schaffer\'s Mill', 
    region: Region.TRUCKEE, 
    par: 71,
    url: 'https://golfthehighsierra.com/portfolio/schaffers-mill/' 
  },

  // Graeagle / Lost Sierra
  { 
    name: 'Grizzly Ranch', 
    region: Region.GRAEAGLE, 
    par: 72,
    url: 'https://golfthehighsierra.com/portfolio/grizzly-ranch-golf-club/'
  },
  { 
    name: 'Whitehawk Ranch', 
    region: Region.GRAEAGLE, 
    par: 71,
    url: 'https://golfthehighsierra.com/portfolio/whitehawk-ranch-golf-course/'
  },
  { 
    name: 'The Dragon at Nakoma', 
    region: Region.GRAEAGLE, 
    par: 72,
    url: 'https://golfthehighsierra.com/portfolio/nakoma-dragon-golf-course/'
  },
  { 
    name: 'Plumas Pines', 
    region: Region.GRAEAGLE, 
    par: 72,
    url: 'https://golfthehighsierra.com/portfolio/plumas-pines-golf-resort/'
  },
  { 
    name: 'Graeagle Meadows', 
    region: Region.GRAEAGLE, 
    par: 72,
    url: 'https://golfthehighsierra.com/portfolio/graeagle-meadows-golf-course/'
  },

  // Reno / Sparks
  { 
    name: 'Lakeridge', 
    region: Region.RENO, 
    par: 71,
    url: 'https://golfthehighsierra.com/portfolio/lakeridge-golf-course/'
  },
  { 
    name: 'Red Hawk (Lakes)', 
    region: Region.RENO, 
    par: 72,
    url: 'https://golfthehighsierra.com/portfolio/red-hawk-golf-resort/'
  },
  { 
    name: 'Wolf Run', 
    region: Region.RENO, 
    par: 71,
    url: 'https://golfthehighsierra.com/portfolio/wolf-run-golf-club/'
  },
  { 
    name: 'Somersett', 
    region: Region.RENO, 
    par: 72,
    url: 'https://golfthehighsierra.com/portfolio/somersett-golf-country-club/'
  },
  { 
    name: 'ArrowCreek', 
    region: Region.RENO, 
    par: 72,
    url: 'https://golfthehighsierra.com/portfolio/arrowcreek-golf-club/'
  },
  { 
    name: 'Washoe County', 
    region: Region.RENO, 
    par: 72,
    url: 'https://golfthehighsierra.com/portfolio/washoe-county-golf-course/'
  },

  // Carson Valley
  { 
    name: 'Toiyabe Golf Club', 
    region: Region.CARSON, 
    par: 72,
    url: 'https://golfthehighsierra.com/portfolio/toiyabe-golf-club/'
  },
  { 
    name: 'Genoa Lakes', 
    region: Region.CARSON, 
    par: 72,
    url: 'https://golfthehighsierra.com/portfolio/genoa-lakes-golf-club/'
  },
  { 
    name: 'Eagle Valley', 
    region: Region.CARSON, 
    par: 72,
    url: 'https://golfthehighsierra.com/portfolio/eagle-valley-golf-course/'
  },
  { 
    name: 'Dayton Valley', 
    region: Region.CARSON, 
    par: 72,
    url: 'https://golfthehighsierra.com/portfolio/dayton-valley-golf-club/'
  },

  // Monterey / Other
  {
    name: 'Bayonet Black Horse',
    region: Region.MONTEREY,
    par: 72,
    url: 'https://golfthehighsierra.com/portfolio/bayonet-black-horse-group-golf-seaside/'
  },
  {
    name: 'Poppy Hills',
    region: Region.MONTEREY,
    par: 71,
    url: 'https://golfthehighsierra.com/portfolio/poppy-hills-golf-course-pebble-beach-ca/'
  }
];

export const LODGING: LodgingOption[] = [
  // Reno
  { 
    name: 'Silver Legacy Resort Casino', 
    region: Region.RENO, 
    type: 'Casino',
    url: 'https://golfthehighsierra.com/portfolio/silver-legacy-resort-casino/'
  },
  { 
    name: 'Peppermill Resort Spa Casino', 
    region: Region.RENO, 
    type: 'Casino',
    url: 'https://golfthehighsierra.com/portfolio/peppermill-resort-spa-casino/'
  },
  { 
    name: 'Eldorado Resort', 
    region: Region.RENO, 
    type: 'Casino',
    url: 'https://golfthehighsierra.com/portfolio/eldorado-resorts-reno-eldorado-at-the-row/'
  },
  { 
    name: 'Atlantis Casino Resort Spa', 
    region: Region.RENO, 
    type: 'Casino',
    url: 'https://golfthehighsierra.com/portfolio/atlantis-casino-resort-spa-reno/'
  },
  { 
    name: 'Grand Sierra Resort', 
    region: Region.RENO, 
    type: 'Casino',
    url: 'https://golfthehighsierra.com/portfolio/grand-sierra-resort-reno/'
  },
  { 
    name: 'Circus Circus Reno', 
    region: Region.RENO, 
    type: 'Casino',
    url: 'https://golfthehighsierra.com/portfolio/circus-circus-reno/'
  },
  { 
    name: 'J Resort', 
    region: Region.RENO, 
    type: 'Casino',
    url: 'https://golfthehighsierra.com/portfolio/j-resort-reno/'
  },
  { 
    name: 'Nugget Casino Resort', 
    region: Region.RENO, 
    type: 'Casino',
    url: 'https://golfthehighsierra.com/portfolio/nugget-casino-resort-reno/'
  },

  // Lake Tahoe
  { 
    name: 'Hyatt Regency Lake Tahoe', 
    region: Region.TAHOE, 
    type: 'Resort',
    url: 'https://golfthehighsierra.com/portfolio/hyatt-lake-tahoe/'
  },
  { 
    name: 'Harveys Lake Tahoe', 
    region: Region.TAHOE, 
    type: 'Casino',
    url: 'https://golfthehighsierra.com/portfolio/harveys-lake-tahoe/'
  },
  { 
    name: 'Harrahs Lake Tahoe', 
    region: Region.TAHOE, 
    type: 'Casino',
    url: 'https://golfthehighsierra.com/portfolio/harrahs-lake-tahoe/'
  },
  { 
    name: 'Golden Nugget Lake Tahoe', 
    region: Region.TAHOE, 
    type: 'Casino',
    url: 'https://golfthehighsierra.com/portfolio/golden-nugget-lake-tahoe/'
  },
  { 
    name: 'Lake Tahoe Resort Hotel', 
    region: Region.TAHOE, 
    type: 'Hotel',
    url: 'https://golfthehighsierra.com/portfolio/lake-tahoe-resort-hotel/'
  },

  // Truckee
  { 
    name: 'Old Greenwood Lodging', 
    region: Region.TRUCKEE, 
    type: 'Vacation Home',
    url: 'https://golfthehighsierra.com/portfolio/old-greenwood-lodging-truckee-ca/'
  },
  { 
    name: 'Hampton Inn Truckee', 
    region: Region.TRUCKEE, 
    type: 'Hotel',
    url: 'https://golfthehighsierra.com/portfolio/hampton-inn-truckee-ca/'
  },
  { 
    name: 'Cedar House Sport Hotel', 
    region: Region.TRUCKEE, 
    type: 'Hotel',
    url: 'https://golfthehighsierra.com/portfolio/luxury-suite-cedar-house/'
  },

  // Graeagle
  { 
    name: 'Nakoma Resort', 
    region: Region.GRAEAGLE, 
    type: 'Resort',
    url: 'https://golfthehighsierra.com/portfolio/nakoma-dragon-golf-course/'
  },
  { 
    name: 'River Pines Resort', 
    region: Region.GRAEAGLE, 
    type: 'Resort',
    url: 'https://golfthehighsierra.com/portfolio/river-pines-resort-graeagle-ca/'
  },
  { 
    name: 'Plumas Pines Private Residency', 
    region: Region.GRAEAGLE, 
    type: 'Vacation Home',
    url: 'https://golfthehighsierra.com/portfolio/plumas-pines-private-residency-graeagle/'
  },

  // Carson Valley / Other
  { 
    name: 'Carson Valley Inn', 
    region: Region.CARSON, 
    type: 'Casino',
    url: 'https://golfthehighsierra.com/portfolio/carson-valley-inn-casino/'
  },
  { 
    name: 'Portola Hotel & Spa', 
    region: Region.MONTEREY, 
    type: 'Hotel',
    url: 'https://golfthehighsierra.com/portfolio/portola-hotel-spa-monterey/'
  }
];

export const MOCK_RECAPS: TripRecap[] = [
  {
    id: '4',
    groupName: "Pepper's Ladies",
    groupSize: 52,
    month: 'June',
    year: 2026,
    courses: ['Red Hawk', 'Wolf Run', 'Lakeridge'],
    lodging: 'Silver Legacy Resort Casino',
    nights: 3,
    rounds: 3,
    pricePerPerson: 1200,
    vibe: 'Value',
    synopsis: "A large ladies group utilizing Silver Legacy as a central hub. Efficient logistics with a 56-passenger motorcoach for daily transfers. Mix of playable and scenic courses in Reno.",
    whyItWorked: "Using a single large bus for 52 pax streamlined morning departures. Driver waiting on site was a key request.",
    highlights: ["Driver Wait-on-Site", "Valet Pickup", "Efficient Group Transport"],
    logistics: {
        transportType: "56 PAX MC",
        passengerCount: 52,
        specialRequests: [
            "Each guest will have golf clubs",
            "Driver will wait on site at each course, each day",
            "Pick location at Silver Legacy in the Valet Area or curbside on West Street"
        ]
    },
    dailyItinerary: [
        {
            day: 1,
            date: "06/22/2026",
            time: "07:00 am",
            activity: "Red Hawk Golf and Resort",
            location: "6600 North Wingfield Pkwy, Sparks, NV 89436",
            notes: "Pickup: Silver Legacy Valet Area. 56 PAX MC."
        },
        {
            day: 2,
            date: "06/24/2026",
            time: "06:45 am",
            activity: "Wolf Run Golf Club",
            location: "1400 Wolf Run Rd., Reno, NV 89511",
            notes: "Pickup: Silver Legacy Valet Area. 56 PAX MC."
        },
        {
            day: 3,
            date: "06/25/2026",
            time: "06:45 am",
            activity: "Lakeridge Golf Course",
            location: "1218 Golf Club Drive, Reno, NV 89519",
            notes: "Pickup: Silver Legacy Valet Area. 56 PAX MC."
        }
    ]
  },
  {
    id: '7',
    groupName: 'Carson Valley Value Trip',
    groupSize: 16,
    month: 'August',
    year: 2025,
    courses: ['Lakeridge', 'Toiyabe Golf Club', 'Genoa Lakes'],
    lodging: 'Carson Valley Inn',
    nights: 3,
    rounds: 3,
    pricePerPerson: 650,
    vibe: 'Value',
    synopsis: "Escaping the city for the Carson Valley. Staying at CVI kept the price down while offering great access to the valley courses. Steak dinner at CV Steak was a highlight.",
    whyItWorked: "CVI is perfect for groups who want good food and gambling without the Reno crowds. Toiyabe is a hidden gem.",
    highlights: ["CV Steak Dinner", "Valley Views", "Casino Floor"],
    logistics: {
        transportType: "28 Passenger Mini-Coach",
        passengerCount: 16,
        specialRequests: ["Room for coolers on bus", "Late checkout on Sunday", "Dinner Res 7pm CV Steak"]
    },
    dailyItinerary: [
        { day: 1, date: "08/10/2025", time: "01:00 pm", activity: "Toiyabe Golf Club", location: "Washoe Valley", notes: "Stop at Costco on way to course." },
        { day: 2, date: "08/11/2025", time: "09:00 am", activity: "Genoa Lakes", location: "Genoa", notes: "15 min drive from CVI. Bus wait on site." },
        { day: 3, date: "08/12/2025", time: "08:30 am", activity: "Lakeridge", location: "Reno", notes: "Play on way out of town. Drop at Airport 2pm." }
    ]
  },
  {
    id: '8',
    groupName: 'Truckee Cabin Retreat',
    groupSize: 8,
    month: 'July',
    year: 2025,
    courses: ['Old Greenwood', 'Gray\'s Crossing', 'Schaffer\'s Mill'],
    lodging: 'Old Greenwood Lodging',
    nights: 4,
    rounds: 3,
    pricePerPerson: 1450,
    vibe: 'Premium',
    synopsis: "High-end mountain golf experience. Staying in the 4-bedroom cabins at Old Greenwood allowed for privacy and group bonding. Private chef dinner on night 2.",
    whyItWorked: "Cabins are superior to hotels for small executive groups. Access to Old Greenwood pavilion was a plus.",
    highlights: ["Private Cabin", "Jack Nicklaus Golf", "Private Chef"],
    logistics: {
        transportType: "2x Rental SUVs",
        passengerCount: 8,
        specialRequests: ["Pre-stock fridge with local beers", "Firewood for pit"]
    },
    dailyItinerary: [
        { day: 1, date: "07/20/2025", time: "04:00 pm", activity: "Check-in", location: "Old Greenwood Cabins", notes: "Code 4590." },
        { day: 2, date: "07/21/2025", time: "09:30 am", activity: "Old Greenwood", location: "On-site", notes: "Cart staging at cabin." },
        { day: 3, date: "07/22/2025", time: "10:00 am", activity: "Gray's Crossing", location: "Truckee", notes: "10 min drive." },
        { day: 4, date: "07/23/2025", time: "09:00 am", activity: "Schaffer's Mill", location: "Truckee", notes: "Gate code required." }
    ]
  },
  {
    id: '9',
    groupName: 'Reno High Roller',
    groupSize: 12,
    month: 'May',
    year: 2025,
    courses: ['ArrowCreek', 'Somersett', 'Lakeridge'],
    lodging: 'Atlantis Casino Resort Spa',
    nights: 3,
    rounds: 3,
    pricePerPerson: 900,
    vibe: 'Bachelor Party',
    synopsis: "Luxury tower rooms at Atlantis with easy access to Bistro Napa. Golf focused on views and difficulty. Lakeridge par 3 was the trip highlight.",
    whyItWorked: "Atlantis Concierge Tower rooms impressed the group. ArrowCreek views set the tone for the trip.",
    highlights: ["Concierge Lounge", "Bistro Napa", "ArrowCreek Views"],
    logistics: {
        transportType: "Party Bus (Limousine)",
        passengerCount: 12,
        specialRequests: ["Stocked bar on bus", "Gentlemen's club dropoff Sat night"]
    },
    dailyItinerary: [
        { day: 1, date: "05/15/2025", time: "01:00 pm", activity: "Somersett", location: "Reno", notes: "Warmup round." },
        { day: 2, date: "05/16/2025", time: "10:00 am", activity: "ArrowCreek", location: "South Reno", notes: "Pickup at Atlantis Valet." },
        { day: 3, date: "05/17/2025", time: "09:00 am", activity: "Lakeridge", location: "Reno", notes: "The island green." }
    ]
  },
  {
    id: '0',
    groupName: "South Lake Tahoe Hockey Club",
    groupSize: 24,
    month: 'November',
    year: 2025,
    courses: ['Hockey Equipment', 'Ogden, UT', 'West Valley City, UT'],
    lodging: 'Hampton Inn Ogden (Dropoff)',
    nights: 3,
    rounds: 0,
    pricePerPerson: 310,
    vibe: 'Value',
    synopsis: "Round trip charter for the Hockey Club. Departing South Lake Tahoe to Ogden, UT. Includes 55 passenger coach to accommodate 24 pax plus heavy equipment luggage.",
    whyItWorked: "We provided the exact vehicle size needed for equipment (Coach vs Mini). Driver stays with group for rink transfers.",
    highlights: ["Equipment Transport", "Interstate Charter", "Driver on Site"],
    logistics: {
        transportType: "55 Passenger Coach",
        passengerCount: 24,
        specialRequests: [
            "55 passenger bus with hockey equipment and luggage for 24 ppl",
            "Additional Driver TBD for 11/16",
            "Payment 72 HOURS IN ADVANCE"
        ]
    },
    dailyItinerary: [
        {
            day: 1,
            date: "11/14/2025",
            time: "06:30 am",
            activity: "Depart South Lake Tahoe",
            location: "2478 Old Meyers Grade Road",
            notes: "Drive to Ogden, UT (11 hrs)."
        },
        {
            day: 2,
            date: "11/15/2025",
            time: "10:30 am",
            activity: "Rink Transfers",
            location: "Ogden, UT",
            notes: "Hotel to Rink, Rink to Hotel (8 hrs usage)."
        },
        {
            day: 3,
            date: "11/16/2025",
            time: "09:00 am",
            activity: "Depart for West Valley City",
            location: "Ogden -> West Valley",
            notes: "Wait 3 hours for game. Depart for SLT at 1:30pm."
        }
    ]
  },
  {
    id: '1',
    groupName: "Reed HS Band",
    groupSize: 52,
    month: 'November',
    year: 2025,
    courses: ["Knott's Berry Farm", "Trabuco Canyon"],
    lodging: 'Hotel TBD (Trabuco Canyon)',
    nights: 3,
    rounds: 0,
    pricePerPerson: 350,
    vibe: 'Budget',
    synopsis: "High School Band trip from Sparks, NV to Southern California. Daily transfers to Knott's Berry Farm for performances.",
    whyItWorked: "Reliable transport for a large school group. Flexible hourly pricing structure ($206/hr) suited their multi-day itinerary.",
    highlights: ["School Band Trip", "Theme Park Transport", "Hourly Rate Model"],
    logistics: {
        transportType: "Coach",
        passengerCount: 52,
        specialRequests: [
            "Take Band to Knott's Berry Farm each day from 10am - 10pm",
            "Full price $206 per hour plus 3% passenger recovery tax"
        ]
    },
    dailyItinerary: [
        { day: 1, date: "11/14/2025", time: "11:30 am", activity: "Depart Reed HS", location: "Sparks, NV", notes: "Drive to Trabuco Canyon, CA." },
        { day: 2, date: "11/15/2025", time: "10:00 am", activity: "Knott's Berry Farm", location: "Buena Park, CA", notes: "All day event until 10pm." },
        { day: 3, date: "11/16/2025", time: "10:00 am", activity: "Knott's Berry Farm", location: "Buena Park, CA", notes: "Day 2 of event." },
        { day: 4, date: "11/17/2025", time: "08:00 am", activity: "Return Trip", location: "Trabuco to Sparks", notes: "Head home." }
    ]
  },
  {
    id: '2',
    groupName: "Battle Mtn HS Football",
    groupSize: 46,
    month: 'November',
    year: 2025,
    courses: ["Needles Football Field", "Laughlin, NV"],
    lodging: 'Avi Hotel Resort (Laughlin)',
    nights: 1,
    rounds: 0,
    pricePerPerson: 150,
    vibe: 'Value',
    synopsis: "Football team transport. Battle Mountain to Needles, CA for practice, staying in Laughlin. Game day transport included.",
    whyItWorked: "Managed logistics for 46 players + coaches. Handled the practice stop en route to the hotel efficiently.",
    highlights: ["Team Travel", "Practice & Game", "Laughlin Stay"],
    logistics: {
        transportType: "Coach",
        passengerCount: 50,
        specialRequests: [
            "Stop in Needles for practice on Friday",
            "Game starts 1pm Saturday (2-3 hours duration)",
            "Non-profit group"
        ]
    },
    dailyItinerary: [
        { day: 1, date: "11/14/2025", time: "08:00 am", activity: "Depart Battle Mountain", location: "Battle Mtn HS", notes: "Stop in Needles for practice, then to Avi Resort." },
        { day: 2, date: "11/15/2025", time: "11:00 am", activity: "Game Day", location: "Needles, CA", notes: "1pm Game. Return home immediately after." }
    ]
  },
  {
    id: '3',
    groupName: "Raymond Lam Group",
    groupSize: 40,
    month: 'December',
    year: 2025,
    courses: ["Reno Airport Transfer", "Silver Legacy Check-in"],
    lodging: 'Silver Legacy Resort Casino',
    nights: 5,
    rounds: 0,
    pricePerPerson: 33,
    vibe: 'Corporate',
    synopsis: "Simple but critical airport transfer for a large group. 40 pax with 60 pieces of luggage required a Full Size Coach.",
    whyItWorked: "Ensured luggage capacity was met (Full Coach vs Mini). Seamless net 30 billing with Caesars Entertainment.",
    highlights: ["Airport Transfer", "Heavy Luggage", "Net 30 Billing"],
    logistics: {
        transportType: "Full Size Coach",
        passengerCount: 40,
        specialRequests: [
            "40 passengers but 60 pieces of large luggage",
            "MUST be full size coach",
            "Bill to Caesars Entertainment"
        ]
    },
    dailyItinerary: [
        { day: 1, date: "12/02/2025", time: "03:55 pm", activity: "Airport Pickup", location: "RNO Airport", notes: "Deliver to Silver Legacy." },
        { day: 2, date: "12/07/2025", time: "08:00 am", activity: "Airport Dropoff", location: "Silver Legacy", notes: "Depart for RNO." }
    ]
  },
  {
    id: '5',
    groupName: 'Silicon Valley Corporate Retreat',
    groupSize: 8,
    month: 'September',
    year: 2024,
    courses: ['Edgewood Tahoe', 'Incline Village Championship', 'Old Greenwood'],
    lodging: 'Hyatt Regency Lake Tahoe',
    nights: 3,
    rounds: 3,
    pricePerPerson: 3250,
    vibe: 'Premium',
    synopsis: "The ultimate high-roller experience. Lakefront luxury at the Hyatt combined with the world-famous Edgewood Tahoe. Logistics were seamless with private shuttles.",
    whyItWorked: "High budget allowed for zero compromises. Edgewood is a non-negotiable for this demographic.",
    highlights: ["Lake Views", "Casino Action", "Fine Dining at Lone Eagle"],
    logistics: {
        transportType: "Private Sprinter Van",
        passengerCount: 8,
        specialRequests: ["Stocked bar in Sprinter", "Dinner reservations at 7:30pm sharp"]
    },
    dailyItinerary: [
         { day: 1, date: "09/15/2024", time: "10:00 am", activity: "Incline Village Champ", location: "Incline Village", notes: "5 min shuttle." },
         { day: 2, date: "09/16/2024", time: "09:00 am", activity: "Old Greenwood", location: "Truckee", notes: "45 min drive." },
         { day: 3, date: "09/17/2024", time: "11:30 am", activity: "Edgewood Tahoe", location: "Stateline", notes: "30 min drive. Lakefront." }
    ]
  },
  {
    id: '6',
    groupName: 'Graeagle Mountain Escape',
    groupSize: 12,
    month: 'July',
    year: 2025,
    courses: ['Graeagle Meadows', 'Plumas Pines', 'Whitehawk Ranch'],
    lodging: 'River Pines Resort',
    nights: 3,
    rounds: 3,
    pricePerPerson: 950,
    vibe: 'Value',
    synopsis: "A secluded getaway in the pine trees of the Lost Sierra. River Pines Resort offered a rustic, BBQ-friendly atmosphere perfect for bonding.",
    whyItWorked: "Clients wanted to escape the casino smoke. The villas allowed for group cookouts. Whitehawk Ranch was the highlight course.",
    highlights: ["BBQ at Villas", "Nature Walk", "Whitehawk Ranch"],
    logistics: {
        transportType: "Rental Vans (3)",
        passengerCount: 12,
        specialRequests: ["Requires ground floor unit for one guest", "Need recommendation for local butcher"]
    },
    dailyItinerary: [
        { day: 1, date: "07/14/2025", time: "01:00 pm", activity: "Graeagle Meadows", location: "Graeagle", notes: "Check-in after golf." },
        { day: 2, date: "07/15/2025", time: "08:30 am", activity: "Plumas Pines", location: "Blairsden", notes: "Lunch at Longboards afterwards." },
        { day: 3, date: "07/16/2025", time: "09:00 am", activity: "Whitehawk Ranch", location: "Clio", notes: "Signature round." }
    ]
  }
];

import { GoogleGenAI, Type, Schema } from "@google/genai";
import { COURSES, LODGING } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const courseNames = COURSES.map(c => c.name).join(", ");
const lodgingNames = LODGING.map(l => l.name).join(", ");

export const parseTripNotes = async (notes: string): Promise<any> => {
  const model = "gemini-2.5-flash";

  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      groupName: { type: Type.STRING, description: "Group Name" },
      groupSize: { type: Type.INTEGER, description: "Number of passengers/golfers." },
      nights: { type: Type.INTEGER, description: "Explicit number of nights for lodging (e.g. if text says '5 nights', return 5)." },
      courses: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: `List of courses. If it is a CHARTER/BUS trip (no golf), list the main destinations/activities here instead.`
      },
      lodging: { type: Type.STRING, description: `Lodging name. If TBD, put 'TBD'.` },
      pricePerPersonEstimate: { type: Type.NUMBER, description: "Calculate from Total Quoted / Passengers if needed." },
      vibe: { type: Type.STRING, enum: ['Budget', 'Value', 'Premium', 'Bucket List', 'Bachelor Party', 'Corporate'] },
      synopsis: { type: Type.STRING, description: "Short summary of the trip logistics." },
      whyItWorked: { type: Type.STRING, description: "A pro tip or insight regarding why this package worked well (e.g. 'Driver wait on site was key', 'Morning rounds allowed for afternoon travel')." },
      highlights: { type: Type.ARRAY, items: { type: Type.STRING } },
      
      // New Detailed Fields
      logistics: {
        type: Type.OBJECT,
        properties: {
            transportType: { type: Type.STRING, description: "e.g. 56 PAX MC, Rental Car, Private Van, Coach" },
            passengerCount: { type: Type.INTEGER },
            specialRequests: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific instructions like 'Driver wait on site', 'Hockey Equipment', etc." }
        }
      },
      dailyItinerary: {
        type: Type.ARRAY,
        items: {
            type: Type.OBJECT,
            properties: {
                day: { type: Type.INTEGER },
                date: { type: Type.STRING, description: "MM/DD/YYYY" },
                time: { type: Type.STRING, description: "Pickup time" },
                activity: { type: Type.STRING, description: "Activity or Movement (e.g. Depart SLT)" },
                location: { type: Type.STRING, description: "Pickup/Dropoff location" },
                notes: { type: Type.STRING, description: "Specific details like 'Pickup: Silver Legacy Valet', 'Shuttle transfer', or 'Driver wait on site'." }
            }
        }
      }
    },
    required: ["groupName", "dailyItinerary", "logistics"]
  };

  const prompt = `
    You are an expert Trip Planner for "Golf the High Sierra" and "My Ride Charters".
    Analyze the raw notes/manifest and extract structured data.
    
    CRITICAL PRIVACY RULE: Do NOT extract or store personal contact names, phone numbers, or email addresses. Ignore them completely.
    
    The input might be a Golf Trip OR a Bus/Charter Trip (Hockey, School Band, Wedding, etc).
    
    If it is a Bus Charter (key clues: "Bus Type Request", "Pickup Location", "Drop Location"):
    1. Map the main destinations or event types (e.g. "Knott's Berry Farm", "Hockey Game") to the 'courses' array.
    2. Extract the 'Quoted' price and divide by passengers to get pricePerPersonEstimate.
    3. Ensure the Daily Itinerary captures the Pickup/Dropoff flows accurately.
    4. CRITICAL: For the itinerary 'notes', capture specific pickup instructions if available (e.g. "Pickup: Silver Legacy Valet Area. 56 PAX MC.").
    
    Raw Notes:
    "${notes}"
  `;

  try {
    const result = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.1
      }
    });

    const text = result.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Error parsing trip notes:", error);
    throw error;
  }
};

export const generateQuoteFromRecap = async (
    recap: any, 
    newConstraints: string, 
    customer: { name: string, email: string, phone: string, company?: string }
) => {
    const model = "gemini-2.5-flash";
    const prompt = `
      You are an expert Trip Logistics Coordinator.
      
      We have a past successful trip (The Template):
      ${JSON.stringify(recap)}
      
      A user (Customer) wants to "Quote This" trip again, possibly with new constraints.
      
      **Customer Contact Details:**
      Name: ${customer.name}
      Email: ${customer.email}
      Phone: ${customer.phone}
      Company: ${customer.company || 'N/A'}
      
      **User Constraints/Requests:**
      "${newConstraints}"
      
      Task:
      Generate a structured "Internal Quote Request" for the Admin/Dispatcher.
      It should NOT be an email to the client. It should be a summary for the team to price it out.
      
      Format:
      Use HTML tags for structure (e.g. <h2>, <h3>, <ul>, <li>, <b>). Do not use Markdown.
      
      Structure:
      <h2>INTERNAL QUOTE REQUEST</h2>
      
      <div style="background:#f0f9ff; padding:10px; border:1px solid #bae6fd; border-radius:4px; margin-bottom:15px;">
        <h3 style="margin-top:0;">Customer Contact</h3>
        <ul>
            <li><b>Name:</b> ${customer.name}</li>
            <li><b>Email:</b> ${customer.email}</li>
            <li><b>Phone:</b> ${customer.phone}</li>
            <li><b>Company:</b> ${customer.company || 'N/A'}</li>
        </ul>
      </div>

      <h3>Trip Specification</h3>
      <ul>
        <li><b>Base Template:</b> ${recap.groupName}</li>
        <li><b>Pax:</b> ${recap.groupSize} (Template default)</li>
        <li><b>Vehicle:</b> ${recap.logistics?.transportType || 'Not specified'}</li>
      </ul>
      
      <h3>Itinerary Overview</h3>
      <ul>
        ${recap.dailyItinerary?.map((d: any) => `<li>Day ${d.day}: ${d.activity} @ ${d.time}</li>`).join('')}
      </ul>
      
      <h3>Special Requirements (from history)</h3>
      <ul>
        ${recap.logistics?.specialRequests?.map((r: string) => `<li>${r}</li>`).join('')}
      </ul>
      
      <h3>New User Constraints / Notes</h3>
      <p>${newConstraints || 'None provided.'}</p>
    `;

    const result = await ai.models.generateContent({
        model,
        contents: prompt
    });

    return result.text;
}

export const generateWebContent = async (recap: any) => {
    const model = "gemini-2.5-flash";
    
    // Helper to add UTM tracking
    const addUtm = (url: string) => {
        if (!url || url === '#' || url === '') return '#';
        const separator = url.includes('?') ? '&' : '?';
        return `${url}${separator}utm_source=caddie_archive&utm_medium=web_export&utm_campaign=trip_recap`;
    };
    
    // Map courses to their tracked URLs
    const linkedCourses = recap.courses.map((cName: string) => {
        const found = COURSES.find(c => 
            cName.toLowerCase().includes(c.name.toLowerCase()) || 
            c.name.toLowerCase().includes(cName.toLowerCase())
        );
        return { name: cName, url: addUtm(found?.url || '#') };
    });

    // Map lodging to its tracked URL
    const foundLodging = LODGING.find(l => 
        recap.lodging.toLowerCase().includes(l.name.toLowerCase()) || 
        l.name.toLowerCase().includes(recap.lodging.toLowerCase())
    );
    const linkedLodging = { name: recap.lodging, url: addUtm(foundLodging?.url || '#') };

    const prompt = `
        You are the SEO Content Manager for "Golf the High Sierra".
        Write a structured HTML blog post snippet for this trip package, optimized for AEO (Answer Engine Optimization).
        
        Trip Data:
        ${JSON.stringify(recap)}
        
        URL Mappings (MUST USE THESE EXACT LINKS for anchor text):
        Lodging: ${JSON.stringify(linkedLodging)}
        Courses: ${JSON.stringify(linkedCourses)}
        
        STRICT FORMATTING RULES:
        1. **HTML ONLY**: Output raw HTML code. Do NOT use Markdown formatting (e.g. do not use **, ##, or -). 
        2. **Tags Allowed**: <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>, <blockquote>.
        3. **No Code Blocks**: Do not wrap the output in \`\`\`html ... \`\`\`. Just return the HTML string.
        
        STRUCTURE & CONTENT:
        1. **Title**: A catchy <h2> title including the location or vibe.
        2. **Summary**: A concise <p> paragraph answering: "Who is this trip for?" and "What makes it special?".
        3. **Trip at a Glance**: A <ul> list with <strong>Bold Labels</strong> for:
           - Group Size
           - Duration
           - Golf Rounds (if any)
           - Transport Type
        4. **Why It Works (Planner Insight)**: An <h3> section explaining the logistics success (use the 'whyItWorked' data).
        5. **Itinerary Highlights**: A <ul> list of specific activities or courses.
        6. **Internal Links**: You MUST wrap the Lodging Name and Course Names in <a href="..." target="_blank"> tags using the provided URL mappings.
    `;

    try {
        const result = await ai.models.generateContent({
            model,
            contents: prompt
        });

        // Cleanup in case the model wraps in markdown code blocks despite instructions
        let cleanText = result.text || "";
        cleanText = cleanText.replace(/```html/g, "").replace(/```/g, "").trim();

        return cleanText;
    } catch (error) {
        console.error("Error generating web content:", error);
        return "<p>Error generating content. Please try again.</p>";
    }
}

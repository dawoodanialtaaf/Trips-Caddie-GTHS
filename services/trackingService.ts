
import { UserMetadata } from '../types';

export const fetchUserMetadata = async (): Promise<UserMetadata> => {
    try {
        // Using a public IP API. In production, this might be handled by a backend.
        // ipapi.co provides free tier for client-side usage.
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        // Simple device detection
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

        return {
            ip: data.ip || 'Unknown',
            city: data.city || 'Unknown',
            region: data.region || 'Unknown',
            country: data.country_name || 'Unknown',
            timezone: data.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
            userAgent: navigator.userAgent,
            deviceType: isMobile ? 'Mobile/Tablet' : 'Desktop',
            landingPage: window.location.href
        };
    } catch (e) {
        console.warn("Failed to fetch IP data, using fallback", e);
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        return {
            ip: 'Unknown',
            city: 'Unknown',
            region: 'Unknown',
            country: 'Unknown',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            userAgent: navigator.userAgent,
            deviceType: isMobile ? 'Mobile/Tablet' : 'Desktop',
            landingPage: window.location.href
        };
    }
};

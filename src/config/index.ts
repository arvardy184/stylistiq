export const BASE_URL = process.env.EXPO_PUBLIC_API_URL;
export const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

// Debug logging untuk cek environment variables
console.log('🔧 Config loaded:');
console.log('📡 BASE_URL:', BASE_URL);
console.log('🔑 GOOGLE_WEB_CLIENT_ID:', GOOGLE_WEB_CLIENT_ID ? 'Set' : 'Not set');

// Fallback untuk development
if (!BASE_URL) {
  console.warn('⚠️ BASE_URL not set, using fallback for development');
  // export const BASE_URL = 'http://10.0.2.2:3000'; // Uncomment jika perlu fallback
}
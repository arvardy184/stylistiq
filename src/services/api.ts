import axios from 'axios';
import { ApiResponse, AnalyzeOutfitRequest, OutfitAnalysis } from '@/types';

// Base API configuration
const api = axios.create({
  baseURL: 'https://api.stylistiq.com', // Replace with your actual API endpoint
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (for adding auth tokens, etc.)
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    // const token = getStoredToken();
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// API methods
export const apiService = {
  // Analyze outfit from image
  analyzeOutfit: async (request: AnalyzeOutfitRequest): Promise<OutfitAnalysis> => {
    try {
      const response = await api.post<ApiResponse<OutfitAnalysis>>('/analyze', request);
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Analysis failed');
      }
      
      return response.data.data;
    } catch (error) {
      // For now, return mock data since we don't have real API
      return createMockAnalysis(request);
    }
  },

  // Get style recommendations
  getStyleRecommendations: async (styleCategory: string): Promise<string[]> => {
    try {
      const response = await api.get<ApiResponse<string[]>>(`/recommendations/${styleCategory}`);
      return response.data.data;
    } catch (error) {
      // Mock recommendations
      return [
        'Try adding a neutral blazer',
        'Consider matching accessories',
        'Experiment with different color combinations',
      ];
    }
  },
};

// Mock analysis for development
const createMockAnalysis = (request: AnalyzeOutfitRequest): OutfitAnalysis => {
  const mockAnalyses = [
    {
      isMatching: true,
      score: 85,
      recommendations: ['Great color coordination!', 'Try adding a statement accessory'],
      colorPalette: ['#2563eb', '#f8fafc', '#1e293b'],
      styleCategory: 'casual' as const,
      feedback: 'Your outfit has excellent color harmony. The blue and neutral tones work perfectly together.',
    },
    {
      isMatching: false,
      score: 45,
      recommendations: ['Consider changing the shoes', 'Try a different top color', 'Add a coordinating belt'],
      colorPalette: ['#dc2626', '#fbbf24', '#10b981'],
      styleCategory: 'business' as const,
      feedback: 'The colors are clashing a bit. Try sticking to a more cohesive color palette.',
    },
  ];

  const randomAnalysis = mockAnalyses[Math.floor(Math.random() * mockAnalyses.length)];
  
  return {
    id: `outfit_${Date.now()}`,
    imageUri: '', // Will be set from the request
    analyzedAt: new Date(),
    ...randomAnalysis,
  };
}; 
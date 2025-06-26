# Stylistiq 👗✨

Fashion-matching app yang bisa mengecek apakah outfit seseorang matching atau tidak, dengan memberikan rekomendasi style dan analisis outfit berdasarkan foto.

## 🧰 Tech Stack

- **React Native** dengan **Expo** (managed workflow)
- **TypeScript** untuk type safety
- **React Navigation** (stack & tab navigation)
- **NativeWind** (Tailwind CSS for React Native)
- **Zustand** untuk state management
- **Expo Image Picker** & **Expo Camera** untuk foto
- **Axios** untuk API calls
- **AsyncStorage** untuk local caching
- Dark/light mode support

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Basic UI components (Button, etc.)
│   └── PhotoPicker.tsx  # Photo selection component
├── screens/             # App screens
│   ├── HomeScreen.tsx
│   └── PhotoAnalysisScreen.tsx
├── navigation/          # Navigation setup
│   └── AppNavigator.tsx
├── store/              # Zustand stores
│   └── useOutfitStore.ts
├── services/           # API services
│   └── api.ts
├── utils/              # Utility functions
│   └── imageUtils.ts
└── types/              # TypeScript types
    └── index.ts
```

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   # atau
   yarn install
   ```

2. **Start development server:**
   ```bash
   npx expo start
   ```

3. **Run on device:**
   - Scan QR code dengan Expo Go app
   - Atau jalankan di simulator/emulator

## 📋 Features

### ✅ MVP Ready
- Photo picker (camera & gallery)
- Mock outfit analysis
- Score & recommendations display
- Local data persistence
- Dark/light mode
- Clean UI dengan Tailwind

### 🔄 Coming Soon
- Real AI analysis integration
- Wardrobe management
- User profiles
- Style history
- Social features

## 🔧 Development Notes

- **Mock API**: Saat ini menggunakan mock data untuk analysis
- **Permissions**: Camera & photo library permissions sudah di-setup
- **State Management**: Zustand dengan AsyncStorage persistence
- **Styling**: NativeWind (Tailwind) untuk consistent styling

## 📱 App Features

1. **Home Screen**: Upload foto outfit
2. **Analysis**: Get instant style feedback
3. **Recommendations**: Style suggestions
4. **Color Analysis**: Detected color palette
5. **Score System**: Matching score 0-100

## 🎨 Design System

- **Primary Color**: Blue (#0ea5e9)
- **Secondary Color**: Pink (#ec4899)
- **Typography**: System font stack
- **Dark Mode**: Full support dengan Tailwind

Ready to build your fashion-matching MVP! 🚀 
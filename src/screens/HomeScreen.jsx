import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  Alert,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { PhotoPicker } from '../components/PhotoPicker';
import { Button } from '../components/ui/Button';
import { convertToBase64 } from '../utils/imageUtils';

export const HomeScreen = () => {
  const navigation = useNavigation();
  const [selectedImage, setSelectedImage] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImageSelected = (uri) => {
    setSelectedImage(uri);
  };

  const handleAnalyzeOutfit = async () => {
    if (!selectedImage) {
      Alert.alert('Error', 'Please select an image first');
      return;
    }

    try {
      setLoading(true);
      
      // Simulate analysis delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to analysis result
      navigation.navigate('PhotoAnalysis', { imageUri: selectedImage });
      
      // Clear selected image
      setSelectedImage(null);

    } catch (error) {
      const message = error instanceof Error ? error.message : 'Analysis failed';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            Welcome to Stylistiq! 👗
          </Text>
          <Text style={styles.subtitle}>
            Upload your outfit photo and get instant style analysis
          </Text>
        </View>

        {/* Photo Selection */}
        <View style={styles.photoSection}>
          <PhotoPicker
            onImageSelected={handleImageSelected}
            onError={(error) => Alert.alert('Error', error)}
          />
          
          {selectedImage && (
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: selectedImage }}
                style={styles.selectedImage}
                resizeMode="cover"
              />
              <Button
                title="Analyze This Outfit"
                onPress={handleAnalyzeOutfit}
                loading={loading}
                style={styles.analyzeButton}
              />
            </View>
          )}
        </View>

        {/* Quick Tips */}
        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>
            Style Tips 💡
          </Text>
          <View style={styles.tip}>
            <Text style={styles.tipText}>
              Take photos in good lighting for better analysis
            </Text>
          </View>
          <View style={styles.tip}>
            <Text style={styles.tipText}>
              Full-body shots give the most accurate results
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    paddingVertical: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  photoSection: {
    marginBottom: 24,
  },
  imageContainer: {
    marginTop: 16,
  },
  selectedImage: {
    width: '100%',
    height: 320,
    borderRadius: 12,
  },
  analyzeButton: {
    marginTop: 16,
  },
  tipsSection: {
    marginBottom: 32,
  },
  tipsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  tip: {
    padding: 16,
    backgroundColor: '#dbeafe',
    borderRadius: 12,
    marginBottom: 12,
  },
  tipText: {
    color: '#1e40af',
    fontWeight: '500',
  },
}); 
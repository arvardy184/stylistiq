import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/ui/Button';

interface RouteParams {
  imageUri?: string;
}

export const PhotoAnalysisScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { imageUri } = (route.params as RouteParams) || {};

  // Mock analysis data
  const mockAnalysis = {
    score: 85,
    isMatching: true,
    styleCategory: 'casual',
    feedback: 'Your outfit has excellent color harmony. The blue and neutral tones work perfectly together.',
    recommendations: [
      'Great color coordination!',
      'Try adding a statement accessory',
      'Consider a different shoe style'
    ],
    colorPalette: ['#2563eb', '#f8fafc', '#1e293b'],
  };

  if (!imageUri) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No analysis found</Text>
          <Button
            title="Go Back"
            onPress={() => navigation.goBack()}
            style={styles.goBackButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  const ScoreIndicator = ({ score }: { score: number }) => (
    <View style={styles.scoreContainer}>
      <View style={[
        styles.scoreCircle,
        { borderColor: score >= 70 ? '#22c55e' : score >= 50 ? '#eab308' : '#ef4444' }
      ]}>
        <Text style={styles.scoreNumber}>{score}</Text>
        <Text style={styles.scoreLabel}>out of 100</Text>
      </View>
      <Text style={[
        styles.scoreDescription,
        { color: mockAnalysis.isMatching ? '#16a34a' : '#dc2626' }
      ]}>
        {mockAnalysis.isMatching ? '✨ Great Match!' : '🎯 Needs Improvement'}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#6b7280" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            Outfit Analysis
          </Text>
        </View>

        <View style={styles.content}>
          {/* Outfit Image */}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: imageUri }}
              style={styles.outfitImage}
              resizeMode="cover"
            />
          </View>

          {/* Score */}
          <ScoreIndicator score={mockAnalysis.score} />

          {/* Style Category */}
          <View style={styles.categoryContainer}>
            <Text style={styles.categoryLabel}>Style Category</Text>
            <Text style={styles.categoryValue}>{mockAnalysis.styleCategory}</Text>
          </View>

          {/* Feedback */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Analysis Feedback</Text>
            <View style={styles.feedbackContainer}>
              <Text style={styles.feedbackText}>{mockAnalysis.feedback}</Text>
            </View>
          </View>

          {/* Color Palette */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Detected Colors</Text>
            <View style={styles.colorPalette}>
              {mockAnalysis.colorPalette.map((color, index) => (
                <View key={index} style={styles.colorItem}>
                  <View
                    style={[styles.colorCircle, { backgroundColor: color }]}
                  />
                  <Text style={styles.colorText}>{color}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Recommendations */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Style Recommendations</Text>
            {mockAnalysis.recommendations.map((rec, index) => (
              <View key={index} style={styles.recommendationItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.recommendationText}>{rec}</Text>
              </View>
            ))}
          </View>

          {/* Actions */}
          <View style={styles.actionsContainer}>
            <Button
              title="Take Another Photo"
              onPress={() => navigation.navigate('Main')}
              variant="primary"
              style={styles.actionButton}
            />
            <Button
              title="Save to Wardrobe"
              onPress={() => navigation.navigate('Main')}
              variant="outline"
            />
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#6b7280',
    fontSize: 16,
  },
  goBackButton: {
    marginTop: 16,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  imageContainer: {
    marginBottom: 24,
  },
  outfitImage: {
    width: '100%',
    height: 320,
    borderRadius: 12,
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  scoreCircle: {
    width: 128,
    height: 128,
    borderRadius: 64,
    borderWidth: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  scoreDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '600',
  },
  categoryContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
  },
  categoryLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  categoryValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    textTransform: 'capitalize',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  feedbackContainer: {
    padding: 16,
    backgroundColor: '#dbeafe',
    borderRadius: 12,
  },
  feedbackText: {
    color: '#1f2937',
    lineHeight: 20,
  },
  colorPalette: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  colorItem: {
    marginRight: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  colorCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  colorText: {
    fontSize: 10,
    color: '#6b7280',
    marginTop: 4,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#dcfce7',
    borderRadius: 12,
  },
  bullet: {
    color: '#16a34a',
    marginRight: 8,
    fontSize: 16,
  },
  recommendationText: {
    flex: 1,
    color: '#1f2937',
    lineHeight: 18,
  },
  actionsContainer: {
    gap: 12,
  },
  actionButton: {
    marginBottom: 12,
  },
}); 
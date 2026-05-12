import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { EmojiIcon as Ionicons } from './EmojiIcon';
import { Accommodation } from '../types';
import { colors, radius, spacing, typography } from '../constants/theme';
import { imageSource } from '../utils/imageSource';

const { width } = Dimensions.get('window');

interface Props {
  accommodation: Accommodation;
  onPress: () => void;
}

export function StayCard({ accommodation, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.92}>
      <Image
        source={imageSource(accommodation.photos[0])}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.tagRow}>
        {accommodation.tags.slice(0, 2).map((tag) => (
          <View key={tag} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>{accommodation.name}</Text>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={13} color={colors.terracotta} />
          <Text style={styles.location}>{accommodation.location}</Text>
        </View>
        <Text style={styles.description} numberOfLines={2}>
          {accommodation.shortDescription}
        </Text>
        <View style={styles.footer}>
          <View style={styles.specs}>
            <View style={styles.spec}>
              <Ionicons name="people-outline" size={13} color={colors.textMuted} />
              <Text style={styles.specText}>최대 {accommodation.maxGuests}명</Text>
            </View>
            <View style={styles.spec}>
              <Ionicons name="bed-outline" size={13} color={colors.textMuted} />
              <Text style={styles.specText}>{accommodation.bedrooms}침실</Text>
            </View>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.price}>${accommodation.pricePerNight}</Text>
            <Text style={styles.priceUnit}>/박</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    marginHorizontal: spacing.md,
    marginBottom: spacing.md,
    overflow: 'hidden',
    shadowColor: '#3D2B1F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 210,
  },
  tagRow: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    flexDirection: 'row',
    gap: 6,
  },
  tag: {
    backgroundColor: 'rgba(61,43,31,0.72)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  tagText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '600',
  },
  content: {
    padding: spacing.md,
  },
  name: {
    ...typography.h3,
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: spacing.sm,
  },
  location: {
    ...typography.bodySmall,
    color: colors.terracotta,
    fontWeight: '500',
  },
  description: {
    ...typography.bodySmall,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  specs: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  spec: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  specText: {
    fontSize: 12,
    color: colors.textMuted,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.terracotta,
  },
  priceUnit: {
    fontSize: 12,
    color: colors.textMuted,
  },
});

import { ImageSourcePropType } from 'react-native';

/**
 * Converts a photo entry (URL string or require() number) into a valid
 * React Native ImageSourcePropType.
 */
export function imageSource(photo: string | number): ImageSourcePropType {
  return typeof photo === 'number' ? photo : { uri: photo };
}

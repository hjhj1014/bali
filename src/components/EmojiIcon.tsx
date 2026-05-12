/**
 * EmojiIcon — drop-in replacement for @expo/vector-icons Ionicons.
 * Uses plain emoji text so icons render correctly on every platform
 * (Expo Go, web export, Netlify) without loading external fonts.
 *
 * Usage: import { EmojiIcon as Ionicons } from '../../components/EmojiIcon';
 * All existing <Ionicons name="..." size={N} color="..." /> JSX works unchanged.
 */
import React from 'react';
import { Text, TextStyle } from 'react-native';

const EMOJI: Record<string, string> = {
  // ── Navigation ──────────────────────────────────────────────────
  'chevron-back':            '‹',
  'chevron-forward':         '›',
  'chevron-up':              '⌃',
  'chevron-down':            '⌄',
  'arrow-forward':           '→',
  'arrow-back':              '←',
  'close':                   '✕',
  'close-circle':            '✕',
  'close-circle-outline':    '✕',

  // ── Accommodation ────────────────────────────────────────────────
  'location':                '📍',
  'location-outline':        '📍',
  'people-outline':          '👥',
  'person-outline':          '👤',
  'bed-outline':             '🛏️',
  'water-outline':           '🚿',
  'wifi-outline':            '📶',
  'key-outline':             '🔑',

  // ── Tabs ─────────────────────────────────────────────────────────
  'home':                    '🏠',
  'home-outline':            '🏠',
  'business':                '🏢',
  'business-outline':        '🏢',
  'map':                     '🗺️',
  'map-outline':             '🗺️',
  'chatbubble-ellipses':     '💬',
  'chatbubble-ellipses-outline': '💬',
  'ellipse':                 '●',
  'ellipse-outline':         '○',

  // ── Actions / UI ─────────────────────────────────────────────────
  'checkmark':               '✓',
  'checkmark-circle':        '✅',
  'checkmark-circle-outline':'✅',
  'calendar-outline':        '📅',
  'calendar':                '📅',
  'search':                  '🔍',
  'search-outline':          '🔍',
  'walk-outline':            '🚶',
  'time-outline':            '⏰',
  'star-outline':            '☆',
  'star':                    '★',
  'add':                     '+',
  'add-circle':              '⊕',
  'add-circle-outline':      '⊕',
  'remove':                  '−',
  'share-outline':           '↑',
  'open-outline':            '↗',
  'image':                   '🖼️',
  'image-outline':           '🖼️',
  'images-outline':          '🖼️',
  'reader-outline':          '📖',
  'reader':                  '📖',

  // ── Admin ─────────────────────────────────────────────────────────
  'lock-closed':             '🔒',
  'lock-closed-outline':     '🔒',
  'lock-open-outline':       '🔓',
  'settings-outline':        '⚙️',
  'settings':                '⚙️',
  'create-outline':          '✏️',
  'create':                  '✏️',
  'pencil-outline':          '✏️',
  'trash-outline':           '🗑️',
  'trash':                   '🗑️',
  'shield-checkmark':        '🛡️',
  'shield-checkmark-outline':'🛡️',
  'log-out-outline':         '↩',
  'log-out':                 '↩',
  'eye-outline':             '👁',
  'eye-off-outline':         '🙈',
  'eye':                     '👁',

  // ── Misc ──────────────────────────────────────────────────────────
  'alert-circle':            '⚠️',
  'alert-circle-outline':    '⚠️',
  'information-circle':      'ℹ️',
  'help-circle-outline':     '❓',
  'refresh-outline':         '↺',
};

interface EmojiIconProps {
  name: string;
  size?: number;
  color?: string;
  style?: TextStyle | TextStyle[];
}

export function EmojiIcon({ name, size = 20, color, style }: EmojiIconProps) {
  const emoji = EMOJI[name] ?? '•';
  return (
    <Text
      style={[
        {
          fontSize: size,
          color: color,
          // Keep consistent vertical alignment
          lineHeight: size * 1.25,
          textAlign: 'center',
          // Don't inherit parent text transforms
          textTransform: 'none',
          letterSpacing: 0,
          includeFontPadding: false,
        },
        style,
      ]}
    >
      {emoji}
    </Text>
  );
}

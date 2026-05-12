export const colors = {
  background: '#F5ECD7',
  card: '#FDF6E9',
  terracotta: '#C2714F',
  terracottaLight: '#E8956A',
  olive: '#6B7C45',
  oliveLight: '#8FA55A',
  cream: '#F5ECD7',
  creamDark: '#EDD9B0',
  text: '#3D2B1F',
  textSecondary: '#7A5C4E',
  textMuted: '#B09880',
  white: '#FFFFFF',
  border: '#E8D8C0',

  // Calendar status colors
  available: '#4CAF50',
  availableLight: '#E8F5E9',
  pending: '#FFC107',
  pendingLight: '#FFF8E1',
  booked: '#E53935',
  bookedLight: '#FFEBEE',
  cancelled: '#1E88E5',
  cancelledLight: '#E3F2FD',
  maintenance: '#757575',
  maintenanceLight: '#F5F5F5',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const typography = {
  h1: { fontSize: 28, fontWeight: '700' as const, color: '#3D2B1F' },
  h2: { fontSize: 22, fontWeight: '700' as const, color: '#3D2B1F' },
  h3: { fontSize: 18, fontWeight: '600' as const, color: '#3D2B1F' },
  body: { fontSize: 15, fontWeight: '400' as const, color: '#3D2B1F' },
  bodySmall: { fontSize: 13, fontWeight: '400' as const, color: '#7A5C4E' },
  caption: { fontSize: 11, fontWeight: '400' as const, color: '#B09880' },
  label: { fontSize: 13, fontWeight: '600' as const, color: '#3D2B1F' },
};

import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, Image,
  TouchableOpacity, StyleSheet, Dimensions, Linking,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { EmojiIcon as Ionicons } from '../../components/EmojiIcon';
import { getAccommodation } from '../../data/store';
import { syncAccommodation } from '../../data/supabaseStore';
import { colors, spacing, radius, typography } from '../../constants/theme';
import { RootStackParamList } from '../../types';
import { openKakaoChat, openWhatsApp } from '../../utils/kakao';
import { imageSource } from '../../utils/imageSource';

type Nav = StackNavigationProp<RootStackParamList>;

const NEARBY_CATEGORIES = [
  {
    emoji: '🍽️',
    label: '맛집 / 카페',
    places: [
      { name: '한식당 강남', desc: '현지인도 즐겨 찾는 정통 한식당', bikeMin: '약 12분', mapUrl: 'https://maps.app.goo.gl/jkkNQj537rzF5mzh9' },
      { name: 'PeTo Steakhouse', desc: '분위기 좋은 스테이크 레스토랑', bikeMin: '약 5분', mapUrl: 'https://maps.app.goo.gl/ifkYdzCYczc4yXCp6' },
      { name: 'KidzCafe Sanur', desc: '아이 놀이공간을 갖춘 키즈 카페', bikeMin: '약 12분', mapUrl: 'https://maps.app.goo.gl/2XTweNxJbfqW9AZh9' },
    ],
  },
  {
    emoji: '🧒',
    label: '키즈 / 레저',
    places: [
      { name: 'Sense Garden Kids Center', desc: '감각 발달 놀이 프로그램 키즈 센터', bikeMin: '약 5분', mapUrl: 'https://maps.app.goo.gl/Jx5AxYZj9SiZnzpX7' },
      { name: "Clip 'n Climb Bali", desc: '실내 클라이밍 & 어드벤처 액티비티', bikeMin: '약 12분', mapUrl: 'https://maps.app.goo.gl/duyhEZhcF2NB3ZJE8' },
      { name: 'The Garden Early Learning Centre', desc: '영유아 전문 유치원', bikeMin: '약 12분', mapUrl: 'https://maps.app.goo.gl/jL7mq8Hn2kYjJPoV9' },
    ],
  },
  {
    emoji: '🏫',
    label: '국제학교',
    places: [
      { name: 'Moral Intelligent School (MIS)', desc: '숙소 인근 소규모 국제학교', bikeMin: '약 5분', mapUrl: 'https://maps.app.goo.gl/TBHQcp7Kz8onrBr58' },
      { name: 'Taruwara Primary School', desc: 'Sanur 지역 초등학교', bikeMin: '약 12분', mapUrl: 'https://maps.app.goo.gl/YoMbR1EtG8MwTdhp7' },
    ],
  },
  {
    emoji: '🏃',
    label: '스포츠 / 피트니스',
    places: [
      { name: 'Jungle Padel Sanur', desc: '패들 코트 (라켓 스포츠)', bikeMin: '약 8분', mapUrl: 'https://maps.app.goo.gl/tzZNTsYjp1o2SELC6' },
      { name: 'Fitness Plus Sanur', desc: '잘 갖춰진 헬스장', bikeMin: '약 12분', mapUrl: 'https://maps.app.goo.gl/yb5qntFm35JHS9Xm7' },
      { name: 'Alur Pilates', desc: '필라테스 스튜디오', bikeMin: '약 8분', mapUrl: 'https://maps.app.goo.gl/Y25xsZgnxZNqyfJy7' },
    ],
  },
  {
    emoji: '🛒',
    label: '마트 / 쇼핑',
    places: [
      { name: 'LOTTE Mart Wholesale Bali', desc: '한국 식재료·생활용품 대형 마트', bikeMin: '약 10분', mapUrl: 'https://maps.app.goo.gl/JYaGAWsHMtcr3UDV9' },
    ],
  },
  {
    emoji: '✈️',
    label: '공항',
    places: [
      { name: '응우라라이 국제공항 (DPS)', desc: '발리 국제공항', bikeMin: '약 25분', mapUrl: 'https://maps.app.goo.gl/j7EcRfgzsKYS8BEF7' },
    ],
  },
];

const width = Math.min(Dimensions.get('window').width, 430);

export function StayDetailScreen() {
  const navigation = useNavigation<Nav>();
  const [acc, setAcc]           = useState(getAccommodation());
  const [photoIndex, setPhotoIndex] = useState(0);

  useFocusEffect(useCallback(() => {
    syncAccommodation().then(setAcc).catch(() => setAcc(getAccommodation()));
    setPhotoIndex(0);
  }, []));

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Photo gallery ── */}
        <View>
          <Image
            source={imageSource(acc.photos[photoIndex])}
            style={styles.mainPhoto}
            resizeMode="cover"
          />
          {/* Back */}
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={22} color={colors.white} />
          </TouchableOpacity>
          {/* Counter */}
          <View style={styles.counter}>
            <Text style={styles.counterText}>{photoIndex + 1} / {acc.photos.length}</Text>
          </View>
          {/* Thumbnails */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.thumbRow}
            contentContainerStyle={styles.thumbContent}
          >
            {acc.photos.map((uri, i) => (
              <TouchableOpacity key={i} onPress={() => setPhotoIndex(i)}>
                <Image
                  source={imageSource(uri)}
                  style={[styles.thumb, i === photoIndex && styles.thumbActive]}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* ── Info ── */}
        <View style={styles.info}>
          <Text style={styles.name}>{acc.name}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={14} color={colors.terracotta} />
            <Text style={styles.location}>{acc.location}</Text>
          </View>

          {/* Specs */}
          <View style={styles.specs}>
            {[
              { icon: 'people-outline',  label: `최대 ${acc.maxGuests}명` },
              { icon: 'bed-outline',     label: `침실 ${acc.bedrooms}개` },
              { icon: 'water-outline',   label: `욕실 ${acc.bathrooms}개` },
            ].map(s => (
              <View key={s.label} style={styles.spec}>
                <Ionicons name={s.icon as any} size={18} color={colors.olive} />
                <Text style={styles.specText}>{s.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.divider} />

          {/* Description */}
          <Text style={styles.sectionLabel}>숙소 소개</Text>
          <Text style={styles.description}>{acc.description}</Text>

          <View style={styles.divider} />

          {/* Amenities */}
          <Text style={styles.sectionLabel}>편의시설</Text>
          <View style={styles.amenities}>
            {acc.amenities.map(a => (
              <View key={a} style={styles.amenityChip}>
                <Ionicons name="checkmark-circle" size={13} color={colors.olive} />
                <Text style={styles.amenityText}>{a}</Text>
              </View>
            ))}
          </View>

          {/* Calendar button */}
          <TouchableOpacity
            style={styles.calendarBtn}
            onPress={() => navigation.navigate('CalendarView')}
          >
            <Ionicons name="calendar-outline" size={20} color={colors.terracotta} />
            <Text style={styles.calendarBtnText}>예약 가능 달력 보기</Text>
            <Ionicons name="chevron-forward" size={17} color={colors.terracotta} />
          </TouchableOpacity>

          <View style={styles.divider} />

          {/* Nearby places */}
          <Text style={styles.sectionLabel}>주변 장소 (바이크 기준)</Text>
          {NEARBY_CATEGORIES.map(cat => (
            <View key={cat.label} style={styles.nearbyCategory}>
              <Text style={styles.nearbyCategoryLabel}>{cat.emoji} {cat.label}</Text>
              {cat.places.map(place => (
                <TouchableOpacity
                  key={place.name}
                  style={styles.placeCard}
                  onPress={() => Linking.openURL(place.mapUrl)}
                  activeOpacity={0.75}
                >
                  <View style={styles.placeInfo}>
                    <Text style={styles.placeName}>{place.name}</Text>
                    <Text style={styles.placeDesc}>{place.desc}</Text>
                  </View>
                  <View style={styles.placeMeta}>
                    <Text style={styles.bikeTime}>🏍️ {place.bikeMin}</Text>
                    <Ionicons name="map-outline" size={15} color={colors.terracotta} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>

        <View style={{ height: 160 }} />
      </ScrollView>

      {/* ── Sticky contact bar ── */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.kakaoBtn} onPress={openKakaoChat}>
          <Ionicons name="chatbubble-ellipses" size={20} color="#3A1D1D" />
          <Text style={styles.kakaoBtnText}>카카오톡으로 예약 문의</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.whatsappBtn} onPress={openWhatsApp}>
          <Text style={styles.whatsappBtnText}>💬 왓츠앱으로 문의</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },

  mainPhoto: { width, height: 300 },
  backBtn: {
    position: 'absolute', top: 48, left: spacing.md,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center',
  },
  counter: {
    position: 'absolute', top: 56, right: spacing.md,
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 10, paddingVertical: 3, borderRadius: radius.full,
  },
  counterText: { color: colors.white, fontSize: 12, fontWeight: '600' },
  thumbRow: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.3)' },
  thumbContent: { paddingHorizontal: spacing.sm, paddingVertical: spacing.sm, gap: spacing.sm },
  thumb: { width: 54, height: 40, borderRadius: radius.sm, opacity: 0.7 },
  thumbActive: { opacity: 1, borderWidth: 2, borderColor: colors.white },

  info: { padding: spacing.md },
  name: { ...typography.h2, marginBottom: 4 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: spacing.md },
  location: { color: colors.terracotta, fontWeight: '600', fontSize: 14 },

  specs: {
    flexDirection: 'row', gap: spacing.xl,
    paddingVertical: spacing.md, justifyContent: 'center',
    backgroundColor: colors.creamDark, borderRadius: radius.md, marginBottom: spacing.md,
  },
  spec: { alignItems: 'center', gap: 4 },
  specText: { fontSize: 12, color: colors.textSecondary, fontWeight: '500' },

  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.md },
  sectionLabel: { ...typography.label, color: colors.textSecondary, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: spacing.sm },
  description: { ...typography.body, color: colors.textSecondary, lineHeight: 24 },

  amenities: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  amenityChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.card, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs,
    borderRadius: radius.full, borderWidth: 1, borderColor: colors.border,
  },
  amenityText: { fontSize: 12, color: colors.textSecondary, fontWeight: '500' },

  calendarBtn: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    marginTop: spacing.lg, padding: spacing.md,
    backgroundColor: colors.card, borderRadius: radius.md,
    borderWidth: 1.5, borderColor: colors.terracotta,
  },
  calendarBtnText: { flex: 1, color: colors.terracotta, fontWeight: '700', fontSize: 15 },

  bottomBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md, paddingTop: spacing.sm, paddingBottom: 28,
    borderTopWidth: 1, borderTopColor: colors.border, gap: spacing.sm,
  },
  kakaoBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#FEE500', paddingVertical: 13, borderRadius: radius.full, gap: spacing.sm,
  },
  kakaoBtnText: { color: '#3A1D1D', fontWeight: '700', fontSize: 15 },
  whatsappBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#25D366', paddingVertical: 13, borderRadius: radius.full,
  },
  whatsappBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  nearbyCategory: { marginBottom: spacing.md },
  nearbyCategoryLabel: {
    fontSize: 13, fontWeight: '700', color: colors.text,
    marginBottom: spacing.xs, marginTop: spacing.xs,
  },
  placeCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.card, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    marginBottom: spacing.xs,
  },
  placeInfo: { flex: 1, marginRight: spacing.sm },
  placeName: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 2 },
  placeDesc: { fontSize: 11, color: colors.textSecondary },
  placeMeta: { alignItems: 'flex-end', gap: 4 },
  bikeTime: { fontSize: 11, color: colors.terracotta, fontWeight: '600' },
});

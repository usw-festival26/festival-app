/**
 * BoothDetail - 부스 상세 (Figma 964:663)
 *
 * 네이비 배경 + ScreenBackdrop + 흰 solid 카드 1장 (368, rounded-20):
 *  - 상단: 뒤로가기 + 부스명(조직명) 센터
 *  - 썸네일(좌 165×181 흰 + 검정 보더, 이미지 없으면 'Location In Map or Poster') + 부스 안내(우)
 *  - Main / Side / Set 세로 스택, 섹션 라벨 센터(Roboto Black 20 #010070)
 *  - 섹션 사이 가로 구분선
 */
import React from 'react';
import { ScrollView, View, Text, Pressable, Image, Platform, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { Booth, BoothMenuItem } from '../../types/booth';

export interface BoothDetailProps {
  booth: Booth;
}

const CARD_WIDTH = 368;

const PRETENDARD_SEMIBOLD = Platform.select({ web: 'Pretendard Variable', default: 'Pretendard-SemiBold' });
const PRETENDARD_REGULAR = Platform.select({ web: 'Pretendard Variable', default: 'Pretendard-Regular' });
const ROBOTO_BLACK = Platform.select({ web: 'Roboto', default: 'Roboto_900Black' });

function group(items: BoothMenuItem[]) {
  const main: BoothMenuItem[] = [];
  const side: BoothMenuItem[] = [];
  const set: BoothMenuItem[] = [];
  items.forEach((i) => {
    const cat = i.menuCategory ?? 'main';
    if (cat === 'side') side.push(i);
    else if (cat === 'set') set.push(i);
    else main.push(i);
  });
  return { main, side, set };
}

function MenuRow({ name, price }: { name: string; price: number }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 5,
      }}
    >
      <Text style={styles.menuName}>{name}</Text>
      <Text style={styles.menuPrice}>{price.toLocaleString()}</Text>
    </View>
  );
}

function Section({ label, items }: { label: string; items: BoothMenuItem[] }) {
  if (items.length === 0) return null;
  return (
    <View style={{ paddingHorizontal: 20 }}>
      <Text style={styles.sectionLabel}>{label}</Text>
      <View>
        {items.map((i) => (
          <MenuRow key={i.id} name={i.name} price={i.price} />
        ))}
      </View>
    </View>
  );
}

export function BoothDetail({ booth }: BoothDetailProps) {
  const router = useRouter();
  const { main, side, set } = group(booth.menuItems);

  const sections: { label: string; items: BoothMenuItem[] }[] = [
    { label: 'Main', items: main },
    { label: 'Side', items: side },
    { label: 'Set', items: set },
  ].filter((s) => s.items.length > 0);

  return (
    <ScrollView contentContainerStyle={{ alignItems: 'center', paddingTop: 24, paddingBottom: 40 }}>
      <View style={styles.card}>
        {/* 상단 바: 뒤로가기 + 조직명 센터 */}
        <View style={styles.topBar}>
          <Pressable
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="뒤로 가기"
            style={styles.backBtn}
            className="active:opacity-70"
          >
            <Ionicons name="chevron-back" size={24} color="#000000" />
          </Pressable>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={styles.organizer}>{booth.organizer}</Text>
          </View>
          <View style={{ width: 28 }} />
        </View>

        {/* 썸네일(좌) + 부스 안내(우) */}
        <View style={{ flexDirection: 'row', gap: 16, paddingHorizontal: 17, marginTop: 10 }}>
          <View style={styles.thumb}>
            {booth.imageUri ? (
              <Image
                source={{ uri: booth.imageUri }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
              />
            ) : (
              <Text style={styles.thumbPlaceholder}>
                {'Location In Map\nor\nPoster'}
              </Text>
            )}
          </View>

          <View style={{ flex: 1, paddingTop: 15 }}>
            <Text style={styles.sideTitle}>부스 안내</Text>
            <Text style={styles.sideBody}>{booth.description}</Text>
          </View>
        </View>

        {/* 섹션 스택 */}
        <View style={{ marginTop: 32 }}>
          {sections.map((s, idx) => (
            <View key={s.label}>
              {idx > 0 && <View style={styles.divider} />}
              <Section label={s.label} items={s.items} />
            </View>
          ))}
        </View>

        <View style={{ height: 24 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 17,
    paddingTop: 18,
  },
  backBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  organizer: {
    fontFamily: PRETENDARD_SEMIBOLD,
    fontWeight: '600',
    fontSize: 15,
    color: '#000000',
  },
  thumb: {
    width: 165,
    height: 181,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#000000',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbPlaceholder: {
    fontFamily: PRETENDARD_SEMIBOLD,
    fontWeight: '600',
    fontSize: 15,
    color: '#000000',
    textAlign: 'center',
    lineHeight: 22,
  },
  sideTitle: {
    fontFamily: PRETENDARD_SEMIBOLD,
    fontWeight: '600',
    fontSize: 15,
    color: '#000000',
    marginBottom: 10,
  },
  sideBody: {
    fontFamily: PRETENDARD_REGULAR,
    fontWeight: '400',
    fontSize: 12,
    color: '#000000',
    lineHeight: 18,
  },
  sectionLabel: {
    fontFamily: ROBOTO_BLACK,
    fontWeight: '900',
    fontSize: 20,
    lineHeight: 23,
    color: '#010070',
    textAlign: 'center',
    marginBottom: 12,
  },
  menuName: {
    fontFamily: PRETENDARD_SEMIBOLD,
    fontWeight: '600',
    fontSize: 15,
    color: '#000000',
  },
  menuPrice: {
    fontFamily: PRETENDARD_SEMIBOLD,
    fontWeight: '600',
    fontSize: 15,
    color: '#010070',
    textAlign: 'right',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#000000',
    marginVertical: 18,
    marginHorizontal: 20,
    opacity: 0.35,
  },
});

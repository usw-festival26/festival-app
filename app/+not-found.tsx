import { Link, Stack } from 'expo-router';
import { View } from 'react-native';
import { AppText } from '../src/components/atoms/AppText';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: '페이지를 찾을 수 없습니다' }} />
      <View className="flex-1 items-center justify-center p-5 bg-festival-bg">
        <AppText variant="h2">페이지를 찾을 수 없습니다</AppText>
        <Link href="/(tabs)/home" className="mt-4 py-4">
          <AppText variant="body" className="text-festival-primary">
            홈으로 돌아가기
          </AppText>
        </Link>
      </View>
    </>
  );
}

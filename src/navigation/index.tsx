import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { EmojiIcon as Ionicons } from '../components/EmojiIcon';

import { HomeScreen }         from '../screens/user/HomeScreen';
import { StayListScreen }     from '../screens/user/StayListScreen';
import { StayDetailScreen }   from '../screens/user/StayDetailScreen';
import { CalendarViewScreen } from '../screens/user/CalendarViewScreen';
import { GuideScreen }        from '../screens/user/GuideScreen';
import { ContactScreen }      from '../screens/user/ContactScreen';

import { AdminLoginScreen }           from '../screens/admin/AdminLoginScreen';
import { AdminHomeScreen }            from '../screens/admin/AdminHomeScreen';
import { AdminEditInfoScreen }        from '../screens/admin/AdminEditInfoScreen';
import { AdminEditPhotosScreen }      from '../screens/admin/AdminEditPhotosScreen';
import { AdminUploadPhotosScreen }    from '../screens/admin/AdminUploadPhotosScreen';
import { AdminCalendarEditorScreen }  from '../screens/admin/AdminCalendarEditorScreen';
import { AdminGuideManagerScreen }    from '../screens/admin/AdminGuideManagerScreen';

import { colors } from '../constants/theme';
import { RootStackParamList } from '../types';

const Stack = createStackNavigator<RootStackParamList>();
const Tab   = createBottomTabNavigator();

type TabIconName = React.ComponentProps<typeof Ionicons>['name'];

const TAB_ICONS: Record<string, [TabIconName, TabIconName]> = {
  Home:    ['home',                'home-outline'],
  Stays:   ['business',           'business-outline'],
  Guide:   ['map',                'map-outline'],
  Contact: ['chatbubble-ellipses','chatbubble-ellipses-outline'],
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.terracotta,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          height: 72,
          paddingBottom: 16,
          paddingTop: 8,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ focused, color, size }) => {
          const [active, inactive] = TAB_ICONS[route.name] ?? ['ellipse', 'ellipse-outline'];
          return <Ionicons name={focused ? active : inactive} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home"    component={HomeScreen}     options={{ title: '홈' }} />
      <Tab.Screen name="Stays"   component={StayListScreen} options={{ title: '숙소' }} />
      <Tab.Screen name="Guide"   component={GuideScreen}    options={{ title: '가이드' }} />
      <Tab.Screen name="Contact" component={ContactScreen}  options={{ title: '문의' }} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* User */}
        <Stack.Screen name="MainTabs"     component={MainTabs} />
        <Stack.Screen name="StayDetail"   component={StayDetailScreen} />
        <Stack.Screen name="CalendarView" component={CalendarViewScreen} />
        {/* Admin */}
        <Stack.Screen name="AdminLogin"           component={AdminLoginScreen} />
        <Stack.Screen name="AdminHome"            component={AdminHomeScreen} />
        <Stack.Screen name="AdminEditInfo"        component={AdminEditInfoScreen} />
        <Stack.Screen name="AdminEditPhotos"      component={AdminEditPhotosScreen} />
        <Stack.Screen name="AdminUploadPhotos"    component={AdminUploadPhotosScreen} />
        <Stack.Screen name="AdminCalendarEditor"  component={AdminCalendarEditorScreen} />
        <Stack.Screen name="AdminGuideManager"    component={AdminGuideManagerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

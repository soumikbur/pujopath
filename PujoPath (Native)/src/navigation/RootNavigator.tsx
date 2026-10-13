import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';

import { HomeScreen } from '@/screens/HomeScreen';
import { ExploreScreen } from '@/screens/ExploreScreen';
import { MapScreen } from '@/screens/MapScreen';
import { PlannerScreen } from '@/screens/PlannerScreen';
import { SavedScreen } from '@/screens/SavedScreen';
import { PandalDetailScreen } from '@/screens/PandalDetailScreen';
import { MetroScreen } from '@/screens/MetroScreen';
import { CalendarScreen } from '@/screens/CalendarScreen';
import { MusicScreen } from '@/screens/MusicScreen';
import { MahalayaScreen } from '@/screens/MahalayaScreen';
import { HelplineScreen } from '@/screens/HelplineScreen';

import { AppHeader } from '@/components/AppHeader';
import { MiniPlayer } from '@/components/MiniPlayer';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabNavigator() {
  const { colors } = useTheme();
  const { t } = useLanguage();

  return (
    <Tab.Navigator
      screenOptions={{
        header: () => <AppHeader />,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: t('home'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ExploreTab"
        component={ExploreScreen}
        options={{
          tabBarLabel: t('explore'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="compass-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="MapTab"
        component={MapScreen}
        options={{
          tabBarLabel: t('map'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="PlannerTab"
        component={PlannerScreen}
        options={{
          tabBarLabel: t('planner'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="navigate-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="SavedTab"
        component={SavedScreen}
        options={{
          tabBarLabel: t('saved'),
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export function RootNavigator() {
  const { colors } = useTheme();
  const { t } = useLanguage();

  return (
    <View style={styles.rootContainer}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            header: ({ navigation, options, route }) => (
              <AppHeader
                title={options.title || route.name}
                showBack={true}
                onBack={() => navigation.goBack()}
              />
            ),
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen
            name="MainTabs"
            component={MainTabNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="PandalDetail"
            component={PandalDetailScreen}
            options={{ title: 'Pandal Profile' }}
          />
          <Stack.Screen
            name="Explore"
            component={ExploreScreen}
            options={{ title: t('explore') }}
          />
          <Stack.Screen
            name="Map"
            component={MapScreen}
            options={{ title: t('map') }}
          />
          <Stack.Screen
            name="Planner"
            component={PlannerScreen}
            options={{ title: t('planner') }}
          />
          <Stack.Screen
            name="Metro"
            component={MetroScreen}
            options={{ title: t('metro') }}
          />
          <Stack.Screen
            name="Calendar"
            component={CalendarScreen}
            options={{ title: t('calendar') }}
          />
          <Stack.Screen
            name="Music"
            component={MusicScreen}
            options={{ title: t('music') }}
          />
          <Stack.Screen
            name="Mahalaya"
            component={MahalayaScreen}
            options={{ title: t('mahalaya') }}
          />
          <Stack.Screen
            name="Helpline"
            component={HelplineScreen}
            options={{ title: t('helpline') }}
          />
          <Stack.Screen
            name="Saved"
            component={SavedScreen}
            options={{ title: t('saved') }}
          />
        </Stack.Navigator>
      </NavigationContainer>

      {/* Floating Global Mini Player */}
      <MiniPlayer />
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
});

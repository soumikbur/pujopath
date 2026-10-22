import React from 'react';
import { Platform, UIManager } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { RouteProvider } from '@/context/RouteContext';
import { AudioProvider } from '@/context/AudioContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { FestivalProvider } from '@/context/FestivalContext';
import { MapFullscreenProvider } from '@/context/MapFullscreenContext';
import { RootNavigator } from '@/navigation/RootNavigator';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AudioProvider>
        <FestivalProvider>
          <ThemeProvider>
            <LanguageProvider>
              <NotificationProvider>
                <RouteProvider>
                  <MapFullscreenProvider>
                    <RootNavigator />
                  </MapFullscreenProvider>
                </RouteProvider>
              </NotificationProvider>
            </LanguageProvider>
          </ThemeProvider>
        </FestivalProvider>
      </AudioProvider>
    </SafeAreaProvider>
  );
}

import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'jo.mizan.app',
  appName: 'مُرشِدي',
  webDir: 'dist',
  backgroundColor: '#FFFFFF',
  android: {
    allowMixedContent: true,
    backgroundColor: '#FFFFFF',
  },
  server: {
    androidScheme: 'https',
  },
};

export default config;

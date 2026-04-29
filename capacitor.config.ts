import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.voteflow.app',
  appName: 'VoteFlow',
  webDir: 'public', // Fallback web directory

  server: {
    // For an SSR Next.js app, we wrap the deployed Vercel URL to act as a native container
    url: 'https://voteflow-demo.vercel.app', 
    cleartext: true
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  }
};

export default config;

"use client";

import { ProfileAPI } from '@/api/profile.api';
import { useEffect } from 'react';
import OneSignal from 'react-onesignal';

export default function OneSignalInit() {
  useEffect(() => {
    const initOneSignal = async () => {
      await OneSignal.init({
        appId: "2bab3dae-5a08-481c-a1f7-717318c93974",
        serviceWorkerPath: "myPath/OneSignalSDKWorker.js",
        serviceWorkerParam: { scope: "/myPath/myCustomScope/" }
      });
      OneSignal.Debug.setLogLevel("0")
      const isPushEnabled = OneSignal.Notifications.permission === true;
      if (isPushEnabled) {
        const userId = OneSignal.User.PushSubscription.id; 
        if (userId) {
          try {
            await ProfileAPI.registerNotification(userId);
          } catch (error) {
            
          }
        }
      }
    };

    initOneSignal();
  }, []);

  return null;
}

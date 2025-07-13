"use client";

import { useEffect } from "react";
import OneSignal from "react-onesignal";
import { ProfileAPI } from "@/api/profile.api";
import { useTranslation } from "react-i18next";

declare global {
  interface Window {
    requestNotificationPermission?: () => Promise<void>;
  }
}

export default function OneSignalInit() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const initOneSignal = async () => {
      try {
        if (!("Notification" in window)) {
          console.log("Ce navigateur ne supporte pas les notifications");
          return;
        }

        const currentPermission = Notification.permission;

        if (currentPermission === "denied") {
          return;
        }

        await OneSignal.init({
          appId: import.meta.env.VITE_ONE_SIGNAL_APP_ID,
          language: i18n.language || "fr",
          serviceWorkerPath: "/OneSignalSDKWorker.js",
          allowLocalhostAsSecureOrigin: true,
          notifyButton: {
            enable: true,
            size: "medium",
            position: "bottom-right",
            prenotify: true,
            showCredit: false,
            text: {
              "tip.state.unsubscribed":
                "Cliquez pour recevoir les notifications",
              "tip.state.subscribed": "Vous êtes abonné aux notifications",
              "tip.state.blocked": "Vous avez bloqué les notifications",
              "message.prenotify":
                "Cliquez pour vous inscrire aux notifications",
              "message.action.subscribed": "Merci de vous être abonné !",
              "message.action.resubscribed":
                "Vous êtes réabonné aux notifications",
              "message.action.unsubscribed":
                "Vous ne recevrez plus de notifications",
              "dialog.main.title": "Notifications",
              "dialog.main.button.subscribe": "S'abonner",
              "dialog.main.button.unsubscribe": "Se désabonner",
              "dialog.blocked.message": "L'action est bloquée",
              "dialog.blocked.title": "Bloqué",
              "message.action.subscribing": "Vous venez de vous abonner !",
            },
          },
        });

        OneSignal.Debug.setLogLevel("0");

        OneSignal.Notifications.addEventListener(
          "permissionChange",
          (permission) => {
            if (permission) {
              handleNotificationRegistration();
            }
          }
        );

        OneSignal.User.PushSubscription.addEventListener("change", (event) => {
          console.log("Abonnement push changé:", event);
          if (event.current.id) {
            handleNotificationRegistration();
          }
        });

        await handleNotificationRegistration();
      } catch (error) {}
    };

    const handleNotificationRegistration = async () => {
      try {
        const isPushEnabled = OneSignal.Notifications.permission === true;

        if (isPushEnabled) {
          const userId = OneSignal.User.PushSubscription.id;
          console.log("User ID OneSignal:", userId);

          if (userId) {
            try {
              await ProfileAPI.registerNotification(userId);
            } catch (error) {
              console.error(
                "Échec de l'enregistrement de notification:",
                error
              );
            }
          }
        }
      } catch (error) {
        console.error(
          "Erreur lors de l'enregistrement des notifications:",
          error
        );
      }
    };

    const requestNotificationPermission = async () => {
      try {
        if (OneSignal.Notifications) {
          await OneSignal.Notifications.requestPermission();
          if (OneSignal.Notifications.permission === true) {
            await handleNotificationRegistration();
          }
        }
      } catch (error) {
        console.error("Erreur lors de la demande de permission:", error);
      }
    };

    window.requestNotificationPermission = requestNotificationPermission;

    initOneSignal();
  }, [i18n.language]);

  return null;
}

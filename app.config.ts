// THIS IS NEW, DELTE IF DOESNT WORK.

import { ExpoConfig } from "@expo/config";

const config: ExpoConfig = {
    name: "NoteStaker",
    slug: "NoteStaker",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/notestaker.png",
    userInterfaceStyle: "light",
    splash: {
        image: "./assets/splash.png",
        resizeMode: "contain",
        backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
        supportsTablet: true,
    },
    android: {
        adaptiveIcon: {
            foregroundImage: "./assets/notestaker.png",
            backgroundColor: "#ffffff",
        },
        permissions: ["android.permission.RECORD_AUDIO"],
        package: "com.smillsy.NoteStaker",
        googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
    },
    web: {
        favicon: "./assets/favicon.png",
    },
    plugins: [
        [
            "expo-image-picker",
            {
                photosPermission: "The app accesses your photos to let you share them with your friends.",
            },
        ],
        [
            "expo-notifications",
            {
                icon: "./assets/notestaker.png",
            },
        ],
    ],
    extra: {
        eas: {
            projectId: "b799205c-e658-4f9a-a541-c6cb2d8887e1",
        },
    },
};

export default config;

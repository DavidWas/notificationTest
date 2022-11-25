import { useEffect } from "react";
import { ExpoPushToken } from "expo-notifications";
import * as Notifications from 'expo-notifications';
import * as DeviceInfo from 'expo-device';
import { Platform } from "react-native";

export const createUpdateAlarmsChannel = async () => {
    await Notifications.setNotificationChannelAsync('sta-channel', {
        name: 'Alarms',
        importance: Notifications.AndroidImportance.HIGH,
        sound: "custom", // <- for Android 8.0+, see channelId property
    });
}

export const createUpdateAlarmUpdatesChannel = async () => {
    await Notifications.setNotificationChannelAsync('sta-updates-channel', {
        name: 'Alarm Updates',
        importance: Notifications.AndroidImportance.HIGH,
        sound: "custom"
    });
}

export const useNotification = ( setToken:(token:String)=>void) => {

    const registerForPushNotifications = async () => {

        const isEmulator = !DeviceInfo.isDevice;

        if (!isEmulator) {
            try {

                //let config = {
                //    apiKey: "AIzaSyBWWPTqupyiOS7pZf7HF2ORJbvIVGBAPfw",
                //    authDomain: "stilleralarmmobileapp.firebaseapp.com",
                //    databaseURL: "https://stilleralarmmobileapp.firebaseio.com",
                //    projectId: "stilleralarmmobileapp"
                //};

                const { status: existingStatus } = await Notifications.getPermissionsAsync();
                let finalStatus = existingStatus;
                if (existingStatus !== 'granted') {
                    const { status } = await Notifications.requestPermissionsAsync();
                    finalStatus = status;
                }
                if (finalStatus !== 'granted') {
                    console.error('Failed to get push token for push notification!');
                    return;
                }
                const experienceId = "@danabond/stilleralarmmobileapp";

                const token: ExpoPushToken = await Notifications.getExpoPushTokenAsync({experienceId});
                console.log(token.data);
                setToken(token.data);
            } catch (error) {
                console.log("Notification error " + error);
                console.error("Notification Setup error");
            }
            if (Platform.OS == "android") {
                createUpdateAlarmsChannel();
                createUpdateAlarmUpdatesChannel();
            }

        } else {
            console.log("Device is an emulator");
        }
    }


    const setListener = async () => {

        Notifications.addNotificationReceivedListener((response) => {
            console.debug("Notification received");
        });

        Notifications.addNotificationResponseReceivedListener((response) => {
            console.debug("Notification response received")
        });
    }

    useEffect(() => {
        registerForPushNotifications();
        setListener();
    }, []);
}
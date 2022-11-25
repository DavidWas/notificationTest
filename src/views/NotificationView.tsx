import React, {useState} from "react";
import {useNotification} from "../hooks/useNotification";
import {Text, View} from "react-native";


const NotificationView = () => {
    const [token, setToken] = useState<String>("");
    useNotification(setToken);

    return (
        <View>
            <Text>Token: {token}</Text>
        </View>
    )
}

export default NotificationView
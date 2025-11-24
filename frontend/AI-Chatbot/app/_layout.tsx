import { Stack } from "expo-router";
import { useState } from "react";

export default function RootLayout() {

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return <Stack screenOptions={{ headerShown: false}}/>;
}

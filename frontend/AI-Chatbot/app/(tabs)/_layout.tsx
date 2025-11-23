import { theme } from '@/themes/theme';
import { StatusBar } from 'expo-status-bar';
import Header from '@/components/layout/Header';
import { useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePathname } from 'expo-router';
import {
    Icon,
    Label,
    NativeTabs
} from 'expo-router/unstable-native-tabs';
import React from 'react';

export default function TabLayout() {
    const [headerHeight, setHeaderHeight] = useState(0);
    const insets = useSafeAreaInsets();

    const pathname = usePathname();
    const headerMap: Record<string, string> = {
        '/': 'Home',
        '/chat': 'Chat',
        '/games': 'Games',
        '/settings': 'Settings',
        '/components': 'Components',
    }

    const headerTitle = headerMap[pathname] ?? 'Battery SOH Chatbot';

    return (
        <>
            <StatusBar style='light' translucent/>

            {/* global header */}
            <Header
                onHeightChange={setHeaderHeight}
                title={headerTitle}
            />

            <NativeTabs
                backgroundColor='transparent' // optional (for blur on iOS)
                indicatorColor={theme.colors.accent}
                iconColor={{ default: theme.colors.textSecondary, selected: theme.colors.accent }}
                labelStyle={{
                    default: { color: theme.colors.textSecondary },
                    selected: { color: theme.colors.accent },
                }}
            >
                
                
                <NativeTabs.Trigger name='index' >
                    <Label>Home</Label>
                    <Icon sf='house.fill' drawable='ic_menu_mylocation'></Icon>
                </NativeTabs.Trigger>

                <NativeTabs.Trigger name='chat'>
                    <Label>Chat</Label>
                    <Icon sf='bubble.left' drawable='chat'></Icon>
                </NativeTabs.Trigger>

                <NativeTabs.Trigger name='games'>
                    <Label>Games</Label>
                    <Icon sf='gamecontroller' drawable='ic_game_controller'></Icon>
                </NativeTabs.Trigger>

                <NativeTabs.Trigger name='settings'>
                    <Label>Settings</Label>
                    <Icon sf='gear' drawable='settings'></Icon>
                </NativeTabs.Trigger>

                {/* REMOVE IN PRODUCTION */}
                <NativeTabs.Trigger name='components'>
                    <Label>Components</Label>
                </NativeTabs.Trigger>

            </NativeTabs>
        </>

        
    );
}
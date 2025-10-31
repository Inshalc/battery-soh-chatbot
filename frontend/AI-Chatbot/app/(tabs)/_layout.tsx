import { theme } from '@/themes/theme';
import {
    Icon,
    Label,
    NativeTabs
} from 'expo-router/unstable-native-tabs';
import React from 'react';

export default function TabLayout() {
    return (
        <NativeTabs
            backgroundColor={null} // optional (for blur on iOS)
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

            <NativeTabs.Trigger name='settings'>
                <Label>Settings</Label>
                <Icon sf='gear' drawable='settings'></Icon>
            </NativeTabs.Trigger>

            {/* REMOVE IN PRODUCTION */}
            <NativeTabs.Trigger name='components'>
                <Label>Components</Label>
            </NativeTabs.Trigger>

        </NativeTabs>
    );
}
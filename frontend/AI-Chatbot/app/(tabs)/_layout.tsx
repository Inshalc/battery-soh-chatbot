import {
    Icon,
    Label,
    NativeTabs
} from 'expo-router/unstable-native-tabs';
import React from 'react';

export default function TabLayout() {
    return (
        <NativeTabs>
            
            <NativeTabs.Trigger name='index'>
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

        </NativeTabs>
    );
}
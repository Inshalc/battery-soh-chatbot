import { globalStyles } from '@/themes/globalStyles';
import { theme } from '@/themes/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import IconButton from '../ui/IconButton';

const ProfileHeader = () => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.positioningContainer, {top: insets.top}]}>
            <View style={styles.container}>

            <Text style={globalStyles.title}>Battery SOH Chatbot</Text>
            <View style={styles.iconContainer}>
                <IconButton name="person"/>
                <IconButton name="log-out"/>
            </View>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    positioningContainer: {
        position: 'absolute',
        left: 0, right: 0, 
    },

    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,

        backgroundColor: 'transparent',

        paddingBottom: theme.spacing.sm,
    },
    
    iconContainer: {
        display: 'flex',
        flexDirection: 'row',
        gap: theme.spacing.xs,
    }
});

export default ProfileHeader;
import { globalStyles } from '@/themes/globalStyles';
import { theme } from '@/themes/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import IconButton from '../ui/IconButton';

const ProfileHeader = () => {
    return (
        <View style={styles.container}>

            <Text style={globalStyles.title}>Battery SOH Chatbot</Text>
            <View style={styles.iconContainer}>
                <IconButton name="person"/>
                <IconButton name="log-out"/>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    
    iconContainer: {
        display: 'flex',
        flexDirection: 'row',
        gap: theme.spacing.xs,
    }
});

export default ProfileHeader;
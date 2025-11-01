import { globalStyles } from '@/themes/globalStyles';
import { theme } from '@/themes/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import IconButton from '../ui/IconButton';

const ProfileHeader = ({ onHeightChange }) => {
    const insets = useSafeAreaInsets();

    return (
        <View 
            onLayout={(event) => {
                const { height } = event.nativeEvent.layout;
                if (onHeightChange) {
                    onHeightChange(height);
                }
            }}
            
            style={[styles.positioningContainer]}>
            <View style={[styles.container, {paddingTop: 0}]}>

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
        left: 0, 
        right: 0, 
        top: 0,
        zIndex: 10,

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
        paddingHorizontal: 20,
    },
    
    iconContainer: {
        display: 'flex',
        flexDirection: 'row',
        gap: theme.spacing.xs,
    }
});

export default ProfileHeader;
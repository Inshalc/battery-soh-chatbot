import { globalStyles } from '@/themes/globalStyles';
import { theme } from '@/themes/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import IconButton from '../ui/IconButton';
import PropTypes from 'prop-types';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';

const ProfileHeader = ({ onHeightChange, title = '[Text]' }) => {
    const insets = useSafeAreaInsets();

    const router = useRouter();

    return (
        <View 
            onLayout={(event) => {
                const { height } = event.nativeEvent.layout;
                if (onHeightChange) {
                    onHeightChange(height);
                }
            }}
            
            style={[styles.positioningContainer]}
        >
            <View style={[styles.container, {paddingTop: 0}]}>
                <BlurView intensity={20} style={StyleSheet.absoluteFill} pointerEvents="none"/>

                <Text style={globalStyles.title}>{title}</Text>
                <View style={styles.iconContainer}>
                    <IconButton 
                        name="person" 
                        bgColor='transparent' 
                        size={theme.fontSize.lg} 
                        handlePress={() => {
                            router.push('/(tabs)/settings');
                        }}
                    />
                    <IconButton 
                        name="log-out" 
                        bgColor='transparent' 
                        size={theme.fontSize.lg}
                        handlePress={() => {
                            router.push('/landing');
                        }}
                    />
                </View>

            </View>
        </View>
    );
}

ProfileHeader.propTypes = {
    title: PropTypes.string,
};

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
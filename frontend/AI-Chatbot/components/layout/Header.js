import { globalStyles } from '@/themes/globalStyles';
import { theme } from '@/themes/theme';
import React from 'react';
import { StyleSheet, Text, View, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import IconButton from '../ui/IconButton';
import PropTypes from 'prop-types';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';
import { Alert } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';

const Header = ({ title = '[Text]', onHeightChange }) => {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    return (
        <View
            style={[
                styles.positioningContainer,
                Platform.OS === 'web'
                    ? { paddingTop: theme.spacing.md }   // or 0 if you want it flush
                    : { paddingTop: insets.top }         // keep safe-area behaviour on mobile
            ]}

            onLayout={(event) => {
                const { height } = event.nativeEvent.layout;
                if (onHeightChange) {
                    onHeightChange(height);
                }
            }}
        >
            <BlurView
                intensity={10}
                style={StyleSheet.absoluteFill}
                pointerEvents="none"
            />

            <View style={styles.inner} edges={['top']}>
                <Text
                    style={[globalStyles.title, styles.title]}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                >
                    {title}
                </Text>

                <View style={styles.iconContainer}>
                    <IconButton
                        name="person"
                        bgColor="transparent"
                        size={theme.fontSize.lg}
                        onPress={() => {
                            router.push('/(tabs)/settings');
                            // console.log('pressed');
                            // Alert.alert("LOG", "HEDER MOUNTED");
                        }}
                    />
                    <IconButton
                        name="log-out"
                        bgColor="transparent"
                        size={theme.fontSize.lg}
                        onPress={() => {
                            router.replace('/(auth)/Login');
                            // console.log('pressed');
                        }}
                    />
                </View>
            </View>
        </View>
    );
};

Header.propTypes = {
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

    inner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        paddingBottom: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,

        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,

        backgroundColor: 'transparent',
    },

    title: {
        flex: 1,
        marginRight: theme.spacing.sm,
    },

    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.xs,
    },
});

export default Header;
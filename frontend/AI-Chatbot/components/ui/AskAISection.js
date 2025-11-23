import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Animated } from 'react-native';
import { createScaleAnimation } from '@/themes/animation';
import ChatBubble from '../chat/ChatBubble.js';
import { globalStyles } from '@/themes/globalStyles';
import { theme } from '@/themes/theme';
import PropTypes from 'prop-types';
import { useRouter } from 'expo-router';
import { BlurView } from 'expo-blur';

const AskAISection = ({ header = '[Header]', messages, chips}) => {
    const router = useRouter();

    return (
        <View style={[globalStyles.card, styles.container]}>
            <BlurView intensity={10} style={StyleSheet.absoluteFill} />
            <Pressable
                onPress={() => {
                    router.push('/(tabs)/chat');
                }}
            >
                <View style={styles.headerContainer}>
                    <Text style={[styles.header]}>{header}</Text>
                </View>
                <View style={styles.chatContainer}>
                    {
                        messages.map((message) => (
                            <ChatBubble 
                                key={message.id} 
                                isUser={message.isUser}
                                text={message.text}
                            />
                        ))
                    }
                </View>
            </Pressable>

            <View style={styles.chipContainer}>
                <Text style={styles.chipPrompt}>Prompts: </Text>
                <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.chips}
                >
                    {
                        chips.map((chip) => {
                            const { scale, onPressIn, onPressOut } = createScaleAnimation();
                            return (
                                <Animated.View key={chip.id} style={{ transform: [{ scale }] }}>
                                    <Pressable
                                        style={globalStyles.chip}
                                        onPressIn={onPressIn}
                                        onPressOut={onPressOut}
                                        onPress={() => {
                                            router.push({
                                                pathname: '/(tabs)/chat',
                                                params: {
                                                    preLoadedMessage: chip.text
                                                }
                                            });
                                        }}
                                    >
                                        <Text style={styles.chipText}>{chip.text}</Text>
                                    </Pressable>
                                </Animated.View>
                            );
                        })
                    }
                </ScrollView>
            </View>

        </View>
    );
};

AskAISection.propTypes = {
    header: PropTypes.string,
    messages: PropTypes.array,
    chips: PropTypes.array,
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        padding: 0,
        overflow: 'hidden',
    },

    headerContainer: {
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.sm,

        borderBottomWidth: 1,
        borderColor: theme.colors.border,
    },

    header: {
        fontSize: theme.fontSize.md,
        fontWeight: '600',

        color: theme.colors.textPrimary,
    },

    chatContainer: {
        padding: theme.spacing.sm,
    },  

    chipContainer: {
        flexDirection: 'row',
        gap: theme.spacing.xs,

        padding: theme.spacing.sm,

        alignItems: 'center',

        borderTopWidth: 1,
        borderColor: theme.colors.border,
    },

    chipPrompt: {
        color: theme.colors.textPrimary,
        fontSize: theme.fontSize.md,
        fontWeight: '600',
    },

    chips: {
        gap: theme.spacing.xs,
    },

    chipText: {
        color: theme.colors.textPrimary,
    }
});

export default AskAISection;
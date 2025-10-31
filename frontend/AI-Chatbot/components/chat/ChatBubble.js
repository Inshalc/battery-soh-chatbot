import { globalStyles } from '@/themes/globalStyles';
import { theme } from '@/themes/theme';
import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const ChatBubble = ({text = 'Placeholder', isUser = true}) => {

    return (

        <View
            style={[
                styles.container,
                isUser ? styles.userContainer : styles.botContainer
            ]}
        
        >
            <View
                style={[isUser ? styles.userBubble : styles.BotBubble, styles.chatBubble]}
            >
                <Text style={globalStyles.textPrimary}>{text}</Text>
            </View>

            {/* Tail */}
            <View
                style={[
                    styles.tail,
                    isUser ? styles.tailUser : styles.tailBot
                ]}
            >

            </View>
        </View>
    );
};

ChatBubble.propTypes = {
    text: PropTypes.string,
    isUser: PropTypes.bool,
};

// ChatBubble.defaultProps = {
//     text: 'Placeholder',
//     isUser: true,
// };


const styles = StyleSheet.create({

    container: {
        marginVertical: theme.spacing.xs,
        flexDirection: 'row',
        alignItems: 'flex-end',
    },

    userContainer: {
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },

    botContainer: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },

    // general stlying fro bubble
    chatBubble: {
        borderRadius: theme.borderRadius.lg,
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,

        maxWidth: '75%',
    },

    userBubble: {
        backgroundColor: theme.colors.accent,
    },

    BotBubble: {
        backgroundColor: theme.colors.surface,
    },

    // stlying for tail, dependin on if for user or bot
    tail: {
        width: 12,
        height: 20,
        backgroundColor: 'transparent',
        position: 'absolute',
        bottom: 0,
    },

    tailUser: {
        right: -5,
        borderBottomRightRadius: 16,
        backgroundColor: theme.colors.accent,
        width: 14,
        height: 18,
        transform: [{ rotate: '25deg' }],
    },

      tailBot: {
        left: -5,
        borderBottomLeftRadius: 16,
        backgroundColor: theme.colors.surface,
        width: 14,
        height: 18,
        transform: [{ rotate: '-25deg' }],
    },
});

export default ChatBubble;
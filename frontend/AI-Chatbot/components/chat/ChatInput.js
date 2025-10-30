import { theme } from "@/themes/theme";
import PropTypes from "prop-types";
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import IconButton from '../ui/IconButton';

const ChatInput = ({placeholder = 'Placeholder'}) => {
    return (
        <View style={styles.container}>
            <TextInput 
                placeholderTextColor={theme.colors.textSecondary} 
                placeholder={placeholder} 
                style={styles.input}
            />
            <IconButton name="send" bgColor={theme.colors.accent} size={theme.fontSize.md}/>
        </View>
    );
};

ChatInput.propTypes = {
    placeholder: PropTypes.string,
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.sm,
    },

    input: {
        backgroundColor: theme.colors.surface,
        fontSize: theme.fontSize.md,
    },
});

export default ChatInput;
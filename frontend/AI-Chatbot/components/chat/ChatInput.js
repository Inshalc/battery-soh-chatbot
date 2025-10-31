import { theme } from "@/themes/theme";
import PropTypes from "prop-types";
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import IconButton from '../ui/IconButton';

const ChatInput = ({placeholder = 'Placeholder'}) => {
    return (
        <View style={styles.container}>
            <IconButton borderColor={theme.colors.accentSecondary} name="folder" bgColor={theme.colors.surface} size={theme.fontSize.md}/>
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
        flexGrow: 1,

        backgroundColor: theme.colors.surface,
        fontSize: theme.fontSize.md,

        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,

        borderRadius: theme.borderRadius.lg,
        borderColor: theme.colors.accentSecondary,
        borderWidth: 1,
    },

    fileButton: {
        borderWidth: 1,
        borderColor: theme.colors.accentSecondary,
    }
});

export default ChatInput;
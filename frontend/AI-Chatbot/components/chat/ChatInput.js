import { theme } from "@/themes/theme";
import PropTypes from "prop-types";
import React, { useState, useEffect} from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import IconButton from '../ui/IconButton';
import * as DocumentPicker from 'expo-document-picker';
import { BlurView } from 'expo-blur';

const ChatInput = ({ placeholder = 'Placeholder', onSend, onPick, preLoadedInput }) => {
    const [message, setMessage] = useState(preLoadedInput || '');

    useEffect(() => {
        // only set when a new non-empty value arrives
        if (typeof preLoadedInput === 'string') {
          setMessage(preLoadedInput);
        }
    }, [preLoadedInput]);

    const handlePick = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({ type: '*/*', copyToCacheDirectory: true, multiple: false });
            if (result.canceled) return;
            const file = result.assets?.[0];
            if (!file) return;

            // if parent provided a file handler, pass the whole file
            if (typeof onPick === 'function') {
                onPick(file);
                return;
            }

            // fallback: send a simple message stub
            if (typeof onSend === 'function') {
                onSend(`[File] ${file.name || 'attachment'}`);
            }
        } catch (e) {
            console.warn('Document pick failed:', e);
        }
    };

    const handleSend = () => {
        if (!message.trim()) return;
        onSend?.(message);
        setMessage('');
    }

    return (
        <View style={styles.container}>
            <IconButton 
                borderColor={theme.colors.accentSecondary} 
                name="folder" 
                bgColor={theme.colors.surface} 
                size={theme.fontSize.md}
                onPress={handlePick}
            />
            <View style={styles.inputWrapper}>
                <BlurView intensity={20} style={StyleSheet.absoluteFill} pointerEvents="none"/>
                <TextInput 
                    placeholderTextColor={theme.colors.textSecondary} 
                    placeholder={placeholder} 
                    style={styles.input}

                    value={message}
                    onChangeText={setMessage}
                    onSubmitEditing={handleSend}
                />
            </View>
            <IconButton 
                name="send" 
                bgColor={theme.colors.accent} 
                size={theme.fontSize.md}
                onPress={handleSend}
            />
        </View>
    );
};

ChatInput.propTypes = {
    placeholder: PropTypes.string,
    onSend: PropTypes.func,
    onPick: PropTypes.func,
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing.sm,
    },

    inputWrapper: {
        flex: 1,                 // ← lets it stretch in the row
        position: 'relative',    // ← needed for absoluteFill
        overflow: 'hidden',      // ← clip blur to rounded corners
        borderRadius: theme.borderRadius.lg,
        borderColor: theme.colors.border,
        borderWidth: 1,
        backgroundColor: 'transparent',
    },

    input: {
        flexGrow: 1,

        backgroundColor: 'transparent',
        fontSize: theme.fontSize.md,

        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,

        borderRadius: theme.borderRadius.lg,
        borderColor: theme.colors.border,
        borderWidth: 1,

        color: theme.colors.textPrimary,
    },

    fileButton: {
        borderWidth: 1,
        borderColor: theme.colors.accentSecondary,
    }
});

export default ChatInput;
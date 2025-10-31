import { createScaleAnimation } from '@/themes/animation';
import { globalStyles } from '@/themes/globalStyles';
import { theme } from '@/themes/theme';
import PropTypes from 'prop-types';
import React from 'react';
import { Animated, Pressable, Text } from 'react-native';

type GradientButtonProps = {
    text: string;
};

export default function GradientButton ({text}: GradientButtonProps) {
    const { scale, onPressIn, onPressOut } = createScaleAnimation();

    return (
        <Animated.View style={{transform: [{ scale }] }}>
            <Pressable 
                onPressIn={onPressIn}
                onPressOut={onPressOut}

                style={({ pressed }) => [
                    globalStyles.button,
                    {
                        backgroundColor: pressed ? theme.colors.accentSecondary : theme.colors.accent,
                    },
                ]}
            >
                <Text style={globalStyles.textPrimary}>{text}</Text>
            </Pressable>
        </Animated.View>
    );
};

GradientButton.propTypes = {
    // text must be a string and required
    text: PropTypes.string,
};

GradientButton.defaultProps = {
    text: "Placeholder",
};

const styles = {

}
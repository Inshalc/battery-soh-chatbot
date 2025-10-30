import { createScaleAnimation } from '@/themes/animation';
import { globalStyles } from '@/themes/globalStyles';
import { theme } from "@/themes/theme";
import PropTypes from 'prop-types';
import React from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const IconButton = ({bgColor = theme.colors.accent, name = "image-outline", size, iconColor = theme.colors.textPrimary}) => {

    const { scale, onPressIn, onPressOut } = createScaleAnimation();

    return (
        <Animated.View style={{transform: [{ scale }] }}>
            <Pressable 
                onPressIn={onPressIn}
                onPressOut={onPressOut}

                style={[
                    globalStyles.button, 
                    styles.container, 
                    { backgroundColor: bgColor },
            ]}>

                <Icon
                    name={name}
                    size={size}
                    color={iconColor}
                ></Icon>
            </Pressable>
        </Animated.View>
    );

}

IconButton.propTypes = {
    bgColor: PropTypes.string,
    name: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
    color: PropTypes.string,
}

const styles = StyleSheet.create({
    container: {
        borderRadius: theme.borderRadius.lg,
        width: 56
    },

    blur: {
        overflow: 'hidden',

    }
});

export default IconButton
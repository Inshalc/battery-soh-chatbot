import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { globalStyles } from '../../themes/globalStyles';
import { theme } from '@/themes/theme';
import PropTypes from 'prop-types';
import { BlurView } from 'expo-blur';

const FilterCard = ({ mainText = '[Main Text]', subText = '[Sub Text]' }) => {
    return (
        <View style={ [globalStyles.card, styles.container] }>
            <BlurView intensity={20} style={StyleSheet.absoluteFill} />

            <Text style={styles.mainText}>{mainText}</Text>
            <Text style={styles.subText}>{subText}</Text>
        </View>
    );
};

FilterCard.propTypes = {
    mainText: PropTypes.string,
    subText: PropTypes.string,
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        gap: theme.spacing.md,

        alignSelf: 'stretch',

        maxWidth: 200,

        backgroundColor: 'transparent',

        // get rid of shadow from globalStyles
        shadowColor: 'transparent',
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0, // Android
    },

    mainText: {
        color: theme.colors.textPrimary,
        fontSize: theme.fontSize.lg,
    },

    subText: {
        color: theme.colors.textSecondary,
        flexShrink: 1,
        // maxWidth: '70%',
    }
});

export default FilterCard;
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { globalStyles } from '../../themes/globalStyles';
import { theme } from '@/themes/theme';
import PropTypes from 'prop-types';

const FilterCard = ({ mainText = '[Main Text]', subText = '[Sub Text]' }) => {
    return (
        <View style={ [globalStyles.card, styles.container] }>
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

        alignSelf: 'flex-start',
    },

    mainText: {
        color: theme.colors.textPrimary,
        fontSize: theme.fontSize.lg,
    },

    subText: {
        color: theme.colors.textSecondary,
    }
});

export default FilterCard;
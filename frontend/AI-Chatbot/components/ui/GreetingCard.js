import { globalStyles } from '@/themes/globalStyles';
import { theme } from '@/themes/theme';
import { PropTypes } from 'prop-types';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const GreetingCard = ({name = '[Name]'}) => {
    return (
        <View style={[globalStyles.card, styles.container]}>
            <Text style={globalStyles.title}>Welcome {name}! </Text>
            <Text style={[globalStyles.textSecondary, styles.subtext]}>This is the homepage, view information about your output below!</Text>
        </View>
    );
};

GreetingCard.propTypes = {
    name: PropTypes.string,
}

const styles = StyleSheet.create({
    subtext: {
        fontSize: theme.fontSize.md,
    },

    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing.md,
    },
});

export default GreetingCard;
import { globalStyles } from '@/themes/globalStyles';
import { theme } from '@/themes/theme';
import { PropTypes } from 'prop-types';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';

const GreetingCard = ({name = '[Name]'}) => {
    return (
        <View style={[globalStyles.card, styles.container]}>
            <BlurView intensity={10} style={StyleSheet.absoluteFill} />

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

        backgroundColor: 'transparent',

        overflow: 'hidden',
    },
});

export default GreetingCard;
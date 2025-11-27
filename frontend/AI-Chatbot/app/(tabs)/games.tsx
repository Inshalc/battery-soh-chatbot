import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Game1 from '../../components/games/Game1';
import Game2 from '../../components/games/Game2';
import Screen from '../../components/layout/Screen';
import { theme } from '../../themes/theme';
import { globalStyles } from '../../themes/globalStyles';

export default function GamesScreen() {
    const [screen, setScreen] = useState<'menu' | 'game1' | 'game2'>('menu');
    const [finalScore, setFinalScore] = useState(0);
    const [missedQuestions, setMissedQuestions] = useState([]);

    if (screen === 'game1') {
        return (
            <Game1
                setScreen={setScreen}
                setFinalScore={setFinalScore}
                setMissedQuestions={setMissedQuestions}
            />
        );
    }

    if (screen === 'game2') {
        return (
            <Game2
                setScreen={setScreen}
                finalScore={finalScore}
                missedQuestions={missedQuestions}
            />
        );
    }

    // Default "Games hub" menu
    return (

        <Screen>
            <View style={styles.container}>
                <Text style={styles.title}>Games</Text>

                <TouchableOpacity
                    style={[globalStyles.button, styles.button]}
                    onPress={() => setScreen('game1')}
                >
                    <Text style={styles.buttonText}>Play Battery Master</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[globalStyles.button, styles.button]}
                    onPress={() => setScreen('game2')}
                >
                    <Text style={styles.buttonText}>Play Battery Charge Challenge</Text>
                </TouchableOpacity>
            </View>
        </Screen>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        padding: theme.spacing.lg,
        justifyContent: 'center',

        gap: theme.spacing.lg,
    },
    title: {
        color: theme.colors.textPrimary,
        fontSize: theme.fontSize.xl,
        fontWeight: 'bold',
        marginBottom: theme.spacing.lg,
        textAlign: 'center',
    },
    button: {
        backgroundColor: theme.colors.accent,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        marginBottom: theme.spacing.md,
        alignItems: 'center',
    },
    buttonText: {
        color: theme.colors.textPrimary,
        fontSize: theme.fontSize.md,
        fontWeight: '600',
    },
});
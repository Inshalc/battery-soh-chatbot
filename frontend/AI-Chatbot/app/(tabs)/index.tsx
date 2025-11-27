import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, ScrollView } from "react-native";
import Screen from '@/components/layout/Screen';
import GreetingCard from "@/components/ui/GreetingCard";
import FilterSection from '@/components/ui/FilterSection';
import { theme } from '@/themes/theme';
import AskAISection from '@/components/ui/AskAISection';
import { globalStyles } from '@/themes/globalStyles';

export default function Index() {
    // fro header height padding
    const [headerHeight, setHeaderHeight] = useState(0);

    // for output section, change cards to change text inside cards, change categories for text inside chips, and make sure id's match up (0 is for all)
    const categories = [
        { id: 0, label: 'All'},
        { id: 1, label: 'R²' },
        { id: 2, label: 'MSE' },
        { id: 3, label: 'MAE' },
        { id: 4, label: 'Training Time' },
    ];

    const cards = [
        {
            categoryId: 1,
            mainText: 'R²: 0.5081',
            subText: 'This score shows how much of the battery’s behaviour the model can explain. Higher means better prediction accuracy overall.'
        },
        {
            categoryId: 2,
            mainText: 'MSE: 0.0021',
            subText: 'Mean Squared Error measures how far predictions are from the true values. Lower values mean the model is making fewer large mistakes.'
        },
        {
            categoryId: 3,
            mainText: 'MAE: 0.0359',
            subText: 'Mean Absolute Error tracks the average size of prediction errors. It’s a clean indicator of how much the model is off on each estimate.'
        },
        {
            categoryId: 4,
            mainText: 'Training Time: 0.0033 s',
            subText: 'This shows how long the model took to train. Fast training means lighter computation and quicker updates when retraining.'
        },
    ];

    // fro ask ai section, change messages fro messages, change cips for input chips, 
    const messages = [
        {id: 1, isUser: true, text: "What's my Battery SOH?"},
        {id: 2, isUser: false, text: "Tap here to find out!"},
    ];

    const chips = [
        {id: 1, text: "Check Battery SOH"},
        {id: 2, text: "How to extend battery lifespan?"},
        {id: 3, text: "Did we get first place?"},
        // {id: 4, text: "byebye"},
    ];

    return (
        <>
            <Screen>

                <ScrollView
                    showsVerticalScrollIndicator={false}

                    contentContainerStyle={
                        [
                            {paddingTop: headerHeight + theme.spacing.lg},
                            {paddingBottom: theme.spacing.lg},
                            {gap: theme.spacing.lg}
                        ]
                    }
                >
                    <GreetingCard greeting='Welcome!' description='This is the homepage, view information about your output below!'/>

                    <View style={styles.askAIContainer}>
                        <Text style={globalStyles.title}>Have Questions?</Text>
                        <AskAISection header="Chatbot.ai" messages={messages} chips={chips} />
                    </View>

                    <FilterSection header='Model Output' categories={categories} cards={cards} />
                </ScrollView>
            </Screen>
        </>
    );
}

const styles = {
    askAIContainer: {
        gap: theme.spacing.sm,
    },
};
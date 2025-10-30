import React from 'react';
import { Text, View } from 'react-native';

const GreetingCard = (name = 'Name') => {
    return (
        <View>
            <Text>Hello {name}! </Text>
        </View>
    );
};

export default GreetingCard;
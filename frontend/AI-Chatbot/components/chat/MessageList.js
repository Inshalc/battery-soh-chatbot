import React from 'react';
import { FlatList } from 'react-native';
import ChatBubble from './ChatBubble.js';
import { theme } from '@/themes/theme';

const renderMessage = ({ item }) => {
    return (
        <ChatBubble isUser={item.isUser} text={item.text}/>
    );
}

const MessageList = ({ messages }) => {
    return (
        <FlatList 
            data={messages}
            renderItem={renderMessage}
            keyExtractor={msg => msg.id}

            showsVerticalScrollIndicator={false}
        />
    );
}

export default MessageList;
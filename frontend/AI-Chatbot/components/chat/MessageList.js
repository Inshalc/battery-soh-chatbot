import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import ChatBubble from './ChatBubble';

const MessageList = ({ messages }) => {
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {messages.map((message) => (
        <ChatBubble
          key={message.id}
          isUser={message.isUser}
          text={message.text}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    gap: 12,
  },
});

export default MessageList;
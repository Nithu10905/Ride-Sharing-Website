
import React, { useState } from 'react';
import ChatBot from './ChatBot';

interface ChatBotToggleProps {
  isOpen: boolean;
  onToggle: () => void;
}

const ChatBotToggle: React.FC<ChatBotToggleProps> = ({ isOpen, onToggle }) => {
  return (
    <ChatBot 
      isOpen={isOpen} 
      onToggle={onToggle} 
    />
  );
};

export default ChatBotToggle;

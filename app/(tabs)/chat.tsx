import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { AppColors } from "@/constants/Colors";
import { Icon } from "@/components/Icon";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'How can I save money?',
      isUser: true,
      timestamp: new Date(Date.now() - 300000) // 5 minutes ago
    },
    {
      id: '2',
      text: 'Great question! Here are some practical tips to help you save money:\n\n1. Track your spending\n2. Set a budget\n3. Cut unnecessary expenses\n4. Save automatically\n5. Look for deals\n\nWould you like me to elaborate on any of these?',
      isUser: false,
      timestamp: new Date(Date.now() - 240000) // 4 minutes ago
    }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputText.trim(),
        isUser: true,
        timestamp: new Date()
      };
      setMessages([...messages, newMessage]);
      setInputText('');
      
      // Simulate AI response
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: 'Thanks for your message! I\'m here to help with your financial questions. What would you like to know more about?',
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 1000);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <ThemedView style={{ flex: 1, backgroundColor: AppColors.gray[0] }}>
      {/* Header */}
      <View style={{
        backgroundColor: AppColors.primary[300],
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 8
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <ThemedText style={{
            fontSize: 24,
            fontWeight: '700',
            color: AppColors.gray[0],
            marginRight: 8
          }}>
            AI Money Coach
          </ThemedText>
          <ThemedText style={{ fontSize: 24 }}>🐷</ThemedText>
        </View>
        <ThemedText style={{
          fontSize: 14,
          color: AppColors.gray[0],
          opacity: 0.8,
          textAlign: 'center',
          marginTop: 4
        }}>
          Your personal financial advisor
        </ThemedText>
      </View>

      {/* Chat Messages */}
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView 
          style={{ flex: 1, paddingHorizontal: 20 }}
          contentContainerStyle={{ paddingVertical: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((message) => (
            <View key={message.id} style={{
              marginBottom: 16,
              alignItems: message.isUser ? 'flex-end' : 'flex-start'
            }}>
              {/* Message Bubble */}
              <View style={{
                backgroundColor: message.isUser ? AppColors.primary[300] : AppColors.gray[100],
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderRadius: 20,
                maxWidth: '80%',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 2
              }}>
                {!message.isUser && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <ThemedText style={{ fontSize: 16, marginRight: 8 }}>🐷</ThemedText>
                    <ThemedText style={{
                      fontSize: 12,
                      color: AppColors.gray[400],
                      fontWeight: '600'
                    }}>
                      AI Assistant
                    </ThemedText>
                  </View>
                )}
                <ThemedText style={{
                  fontSize: 16,
                  color: message.isUser ? AppColors.gray[0] : AppColors.gray[500],
                  lineHeight: 22
                }}>
                  {message.text}
                </ThemedText>
                <ThemedText style={{
                  fontSize: 11,
                  color: message.isUser ? AppColors.gray[0] : AppColors.gray[400],
                  opacity: 0.7,
                  marginTop: 6,
                  textAlign: message.isUser ? 'right' : 'left'
                }}>
                  {formatTime(message.timestamp)}
                </ThemedText>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Input Field */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 20,
          paddingVertical: 16,
          backgroundColor: AppColors.gray[0],
          borderTopWidth: 1,
          borderTopColor: AppColors.gray[200]
        }}>
          <View style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: AppColors.gray[100],
            borderRadius: 25,
            paddingHorizontal: 16,
            paddingVertical: 12,
            marginRight: 12
          }}>
            <TextInput
              style={{
                flex: 1,
                fontSize: 16,
                color: AppColors.gray[500],
                padding: 0
              }}
              placeholder="Type your message..."
              placeholderTextColor={AppColors.gray[400]}
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
          </View>
          <TouchableOpacity
            onPress={handleSend}
            disabled={!inputText.trim()}
            style={{
              backgroundColor: inputText.trim() ? AppColors.primary[300] : AppColors.gray[300],
              width: 44,
              height: 44,
              borderRadius: 22,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: inputText.trim() ? 0.2 : 0,
              shadowRadius: 4,
              elevation: inputText.trim() ? 4 : 0
            }}
          >
            <Icon 
              name="sendIcon" 
              size={20} 
              color={inputText.trim() ? AppColors.gray[0] : AppColors.gray[400]} 
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

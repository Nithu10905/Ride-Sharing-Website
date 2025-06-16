
import { Message } from "@/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format, parseISO } from "date-fns";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useMessages } from "@/contexts/MessageContext";

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

export default function MessageList({ messages, currentUserId }: MessageListProps) {
  const [newMessage, setNewMessage] = useState("");
  const { sendMessage } = useMessages();
  
  // Group messages by conversation partner
  const conversations = messages.reduce<Record<string, { user: { id: string, name: string }, messages: Message[] }>>(
    (acc, message) => {
      const isIncoming = message.sender.id !== currentUserId;
      const partnerId = isIncoming ? message.sender.id : message.recipient.id;
      const partnerName = isIncoming ? message.sender.name : message.recipient.name;
      
      if (!acc[partnerId]) {
        acc[partnerId] = {
          user: { id: partnerId, name: partnerName },
          messages: []
        };
      }
      
      acc[partnerId].messages.push(message);
      return acc;
    },
    {}
  );
  
  // Sort conversations by latest message
  const sortedConversations = Object.values(conversations).sort((a, b) => {
    const latestA = new Date(a.messages[a.messages.length - 1].timestamp);
    const latestB = new Date(b.messages[b.messages.length - 1].timestamp);
    return latestB.getTime() - latestA.getTime();
  });
  
  const [activeConversation, setActiveConversation] = useState(
    sortedConversations.length > 0 ? sortedConversations[0].user.id : null
  );
  
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeConversation) return;
    
    try {
      await sendMessage(activeConversation, newMessage);
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };
  
  if (messages.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="w-24 h-24 mx-auto mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="text-gray-300 w-full h-full"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium mb-2">No messages right now</h3>
        <p className="text-gray-500">
          Book or publish a ride to contact other members. If you have already an upcoming ride, feel free to contact who you're travelling with!
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-[600px] bg-white rounded-lg overflow-hidden shadow">
      {/* Conversation list sidebar */}
      <div className="w-1/3 border-r overflow-y-auto">
        <div className="p-4 border-b">
          <h2 className="font-semibold text-lg">Inbox</h2>
        </div>
        {sortedConversations.map(({ user, messages }) => {
          const latestMessage = messages[messages.length - 1];
          const unread = messages.some(m => !m.read && m.sender.id !== currentUserId);
          
          return (
            <div
              key={user.id}
              className={`px-4 py-3 border-b cursor-pointer transition-colors ${
                activeConversation === user.id ? "bg-gray-100" : "hover:bg-gray-50"
              }`}
              onClick={() => setActiveConversation(user.id)}
            >
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className={`font-medium truncate ${unread ? "font-semibold" : ""}`}>
                      {user.name}
                    </p>
                    <span className="text-xs text-gray-500">
                      {format(parseISO(latestMessage.timestamp), "MMM d")}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {latestMessage.content}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Message area */}
      {activeConversation && (
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b bg-white">
            <h2 className="font-semibold">
              {conversations[activeConversation]?.user.name}
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {conversations[activeConversation]?.messages.map(message => {
              const isOutgoing = message.sender.id === currentUserId;
              return (
                <div
                  key={message.id}
                  className={`flex ${isOutgoing ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg ${
                      isOutgoing
                        ? "bg-primary text-white rounded-br-none"
                        : "bg-gray-100 text-gray-800 rounded-bl-none"
                    }`}
                  >
                    <p>{message.content}</p>
                    <p className={`text-xs mt-1 ${isOutgoing ? "text-blue-100" : "text-gray-500"}`}>
                      {format(parseISO(message.timestamp), "h:mm a")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
          
          <div className="p-4 border-t bg-white">
            <form
              className="flex items-center space-x-2"
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
            >
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

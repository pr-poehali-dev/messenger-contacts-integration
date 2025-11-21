import { useState, useEffect } from 'react';
import AuthScreen from '@/components/messenger/AuthScreen';
import Sidebar from '@/components/messenger/Sidebar';
import ChatList from '@/components/messenger/ChatList';
import ChatWindow from '@/components/messenger/ChatWindow';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: number;
  username: string;
  avatar_url?: string;
  status: string;
  email?: string;
}

interface Chat {
  id: number;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  avatar?: string;
}

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
  sender_id?: number;
}

interface Contact {
  id: number;
  username: string;
  avatar_url?: string;
  status: string;
}

interface FriendRequest {
  id: number;
  username: string;
  avatar_url?: string;
  timestamp: string;
}

export default function Messenger() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedChat, setSelectedChat] = useState<number | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const { toast } = useToast();

  const [chats] = useState<Chat[]>([
    { id: 1, name: 'Общий чат', lastMessage: 'Начните общение', timestamp: 'Сейчас', unread: 0, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chat1' },
  ]);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      const user = JSON.parse(savedUser);
      setCurrentUser(user);
      setIsLoggedIn(true);
      loadUserData(user.id);
    }
  }, []);

  const loadUserData = async (userId: number) => {
    try {
      const [contactsRes, requestsRes] = await Promise.all([
        fetch(`https://functions.poehali.dev/29f4ef98-c794-48fb-b8f0-0c8b21d9cfff?user_id=${userId}&type=contacts`),
        fetch(`https://functions.poehali.dev/29f4ef98-c794-48fb-b8f0-0c8b21d9cfff?user_id=${userId}&type=requests`)
      ]);

      if (contactsRes.ok) {
        const contactsData = await contactsRes.json();
        setContacts(contactsData.contacts || []);
      }

      if (requestsRes.ok) {
        const requestsData = await requestsRes.json();
        setFriendRequests(requestsData.requests || []);
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const loadMessages = async (chatId: number) => {
    try {
      const response = await fetch(`https://functions.poehali.dev/0526b83c-ef03-47e1-be22-12a0fa092318?chat_id=${chatId}`);
      if (response.ok) {
        const data = await response.json();
        const formattedMessages = data.messages.map((msg: any) => ({
          id: msg.id,
          sender: msg.sender,
          content: msg.content,
          timestamp: msg.timestamp,
          isOwn: msg.sender_id === currentUser?.id,
          sender_id: msg.sender_id
        }));
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  useEffect(() => {
    if (selectedChat && isLoggedIn) {
      loadMessages(selectedChat);
    }
  }, [selectedChat, isLoggedIn]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !currentUser || !selectedChat) return;

    try {
      const response = await fetch('https://functions.poehali.dev/0526b83c-ef03-47e1-be22-12a0fa092318', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: selectedChat,
          sender_id: currentUser.id,
          content: messageInput
        })
      });

      if (response.ok) {
        const data = await response.json();
        const newMessage: Message = {
          id: data.message_id,
          sender: currentUser.username,
          content: messageInput,
          timestamp: data.timestamp,
          isOwn: true,
          sender_id: currentUser.id
        };
        setMessages([...messages, newMessage]);
        setMessageInput('');
      } else {
        toast({ title: 'Ошибка', description: 'Не удалось отправить сообщение', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Ошибка', description: 'Не удалось подключиться к серверу', variant: 'destructive' });
    }
  };

  const handleAuthSuccess = (user: User, token: string) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    loadUserData(user.id);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setCurrentUser(null);
    setMessages([]);
    setContacts([]);
    setFriendRequests([]);
  };

  if (!isLoggedIn || !currentUser) {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="h-screen flex bg-background dark">
      <Sidebar currentUser={currentUser} setIsLoggedIn={handleLogout} />
      <ChatList
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        chats={chats}
        contacts={contacts}
        friendRequests={friendRequests}
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
      />
      <ChatWindow
        selectedChat={selectedChat}
        chats={chats}
        messages={messages}
        messageInput={messageInput}
        setMessageInput={setMessageInput}
        handleSendMessage={handleSendMessage}
      />
    </div>
  );
}

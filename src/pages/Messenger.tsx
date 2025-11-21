import { useState } from 'react';
import AuthScreen from '@/components/messenger/AuthScreen';
import Sidebar from '@/components/messenger/Sidebar';
import ChatList from '@/components/messenger/ChatList';
import ChatWindow from '@/components/messenger/ChatWindow';

interface User {
  id: number;
  username: string;
  avatar_url?: string;
  status: string;
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
  const [showRegister, setShowRegister] = useState(false);
  const [selectedChat, setSelectedChat] = useState<number | null>(1);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [currentUser] = useState<User>({
    id: 1,
    username: 'Иван Петров',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan',
    status: 'online'
  });

  const [chats] = useState<Chat[]>([
    { id: 1, name: 'Анна Смирнова', lastMessage: 'Привет! Как дела?', timestamp: '14:32', unread: 2, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna' },
    { id: 2, name: 'Петр Иванов', lastMessage: 'Встретимся завтра?', timestamp: '12:15', unread: 0, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Petr' },
    { id: 3, name: 'Дизайн Команда', lastMessage: 'Отправил новый макет', timestamp: 'Вчера', unread: 5, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Design' },
  ]);

  const [messages] = useState<Message[]>([
    { id: 1, sender: 'Анна Смирнова', content: 'Привет! Как дела?', timestamp: '14:30', isOwn: false },
    { id: 2, sender: 'Вы', content: 'Отлично! А у тебя?', timestamp: '14:31', isOwn: true },
    { id: 3, sender: 'Анна Смирнова', content: 'Тоже хорошо! Хочу обсудить новый проект', timestamp: '14:32', isOwn: false },
  ]);

  const [contacts] = useState<Contact[]>([
    { id: 1, username: 'Анна Смирнова', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna', status: 'online' },
    { id: 2, username: 'Петр Иванов', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Petr', status: 'offline' },
    { id: 3, username: 'Мария Козлова', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria', status: 'online' },
  ]);

  const [friendRequests] = useState<FriendRequest[]>([
    { id: 1, username: 'Алексей Волков', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alexey', timestamp: '2 часа назад' },
    { id: 2, username: 'Ольга Новикова', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olga', timestamp: '5 часов назад' },
  ]);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      console.log('Отправка сообщения:', messageInput);
      setMessageInput('');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  if (!isLoggedIn) {
    return (
      <AuthScreen
        showRegister={showRegister}
        setShowRegister={setShowRegister}
        handleLogin={handleLogin}
        handleRegister={handleRegister}
      />
    );
  }

  return (
    <div className="h-screen flex bg-background dark">
      <Sidebar currentUser={currentUser} setIsLoggedIn={setIsLoggedIn} />
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

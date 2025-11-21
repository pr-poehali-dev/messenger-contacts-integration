import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

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
      <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 space-y-6 animate-fade-in">
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="bg-primary text-primary-foreground p-4 rounded-full">
                <Icon name="MessageCircle" size={40} />
              </div>
            </div>
            <h1 className="text-3xl font-bold">Добро пожаловать!</h1>
            <p className="text-muted-foreground">
              {showRegister ? 'Создайте аккаунт' : 'Войдите в свой аккаунт'}
            </p>
          </div>

          {showRegister ? (
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reg-username">Имя пользователя</Label>
                <Input id="reg-username" type="text" placeholder="Введите имя" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-email">Email</Label>
                <Input id="reg-email" type="email" placeholder="your@email.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-password">Пароль</Label>
                <Input id="reg-password" type="password" placeholder="••••••••" required />
              </div>
              <Button type="submit" className="w-full" size="lg">
                Зарегистрироваться
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Или</span>
                </div>
              </div>
              <Button type="button" variant="outline" className="w-full" size="lg">
                <Icon name="Mail" className="mr-2" size={20} />
                Войти через Google
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Уже есть аккаунт?{' '}
                <button
                  type="button"
                  onClick={() => setShowRegister(false)}
                  className="text-primary hover:underline font-medium"
                >
                  Войти
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="your@email.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Пароль</Label>
                <Input id="password" type="password" placeholder="••••••••" required />
              </div>
              <Button type="submit" className="w-full" size="lg">
                Войти
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Или</span>
                </div>
              </div>
              <Button type="button" variant="outline" className="w-full" size="lg">
                <Icon name="Mail" className="mr-2" size={20} />
                Войти через Google
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Нет аккаунта?{' '}
                <button
                  type="button"
                  onClick={() => setShowRegister(true)}
                  className="text-primary hover:underline font-medium"
                >
                  Зарегистрироваться
                </button>
              </p>
            </form>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-background dark">
      <div className="w-20 bg-card border-r border-border flex flex-col items-center py-4 space-y-4">
        <div className="bg-primary text-primary-foreground p-3 rounded-full mb-2">
          <Icon name="MessageCircle" size={28} />
        </div>
        
        <Button variant="ghost" size="icon" className="rounded-full hover-scale">
          <Icon name="MessageSquare" size={24} />
        </Button>
        
        <Button variant="ghost" size="icon" className="rounded-full hover-scale">
          <Icon name="Users" size={24} />
        </Button>
        
        <Button variant="ghost" size="icon" className="rounded-full hover-scale">
          <Icon name="UserPlus" size={24} />
        </Button>
        
        <div className="flex-1" />
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full hover-scale">
              <Avatar className="h-10 w-10">
                <AvatarImage src={currentUser.avatar_url} />
                <AvatarFallback>{currentUser.username[0]}</AvatarFallback>
              </Avatar>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Профиль пользователя</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={currentUser.avatar_url} />
                  <AvatarFallback>{currentUser.username[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">{currentUser.username}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <span className="w-2 h-2 bg-secondary rounded-full"></span>
                    {currentUser.status}
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input type="email" defaultValue="ivan@example.com" />
              </div>
              <div className="space-y-2">
                <Label>Имя пользователя</Label>
                <Input defaultValue={currentUser.username} />
              </div>
              <Button className="w-full">Сохранить изменения</Button>
              <Button variant="outline" className="w-full" onClick={() => setIsLoggedIn(false)}>
                Выйти
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="w-80 bg-card border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Icon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Поиск..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="chats" className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3 mx-4 mt-2">
            <TabsTrigger value="chats">Чаты</TabsTrigger>
            <TabsTrigger value="contacts">Контакты</TabsTrigger>
            <TabsTrigger value="requests">Заявки</TabsTrigger>
          </TabsList>

          <TabsContent value="chats" className="flex-1 mt-0">
            <ScrollArea className="h-full">
              <div className="space-y-1 p-2">
                {chats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => setSelectedChat(chat.id)}
                    className={`w-full p-3 rounded-lg text-left transition-all hover-scale ${
                      selectedChat === chat.id ? 'bg-accent' : 'hover:bg-accent/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={chat.avatar} />
                        <AvatarFallback>{chat.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-sm truncate">{chat.name}</h3>
                          <span className="text-xs text-muted-foreground">{chat.timestamp}</span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                      </div>
                      {chat.unread > 0 && (
                        <div className="bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                          {chat.unread}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="contacts" className="flex-1 mt-0">
            <ScrollArea className="h-full">
              <div className="space-y-1 p-2">
                <div className="px-3 py-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full" size="sm">
                        <Icon name="UserPlus" className="mr-2" size={16} />
                        Добавить контакт
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Добавить контакт</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Email или имя пользователя</Label>
                          <Input placeholder="Введите email или имя" />
                        </div>
                        <Button className="w-full">Отправить заявку</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={contact.avatar_url} />
                        <AvatarFallback>{contact.username[0]}</AvatarFallback>
                      </Avatar>
                      <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-card ${
                        contact.status === 'online' ? 'bg-secondary' : 'bg-muted'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{contact.username}</h3>
                      <p className="text-xs text-muted-foreground">{contact.status}</p>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Icon name="MessageCircle" size={18} />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="requests" className="flex-1 mt-0">
            <ScrollArea className="h-full">
              <div className="space-y-2 p-2">
                {friendRequests.length > 0 ? (
                  friendRequests.map((request) => (
                    <Card key={request.id} className="p-3">
                      <div className="flex items-center space-x-3 mb-3">
                        <Avatar>
                          <AvatarImage src={request.avatar_url} />
                          <AvatarFallback>{request.username[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-medium text-sm">{request.username}</h3>
                          <p className="text-xs text-muted-foreground">{request.timestamp}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          <Icon name="Check" className="mr-1" size={16} />
                          Принять
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Icon name="X" className="mr-1" size={16} />
                          Отклонить
                        </Button>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <Icon name="Inbox" className="mx-auto mb-2" size={48} />
                    <p>Нет новых заявок</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            <div className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={chats.find(c => c.id === selectedChat)?.avatar} />
                  <AvatarFallback>{chats.find(c => c.id === selectedChat)?.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold">{chats.find(c => c.id === selectedChat)?.name}</h2>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <span className="w-2 h-2 bg-secondary rounded-full"></span>
                    онлайн
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon">
                  <Icon name="Phone" size={20} />
                </Button>
                <Button variant="ghost" size="icon">
                  <Icon name="Video" size={20} />
                </Button>
                <Button variant="ghost" size="icon">
                  <Icon name="MoreVertical" size={20} />
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1 p-6">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'} animate-fade-in`}
                  >
                    <div className={`flex items-end space-x-2 max-w-md ${message.isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
                      {!message.isOwn && (
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={chats.find(c => c.id === selectedChat)?.avatar} />
                          <AvatarFallback>{message.sender[0]}</AvatarFallback>
                        </Avatar>
                      )}
                      <div>
                        <div
                          className={`rounded-2xl px-4 py-2 ${
                            message.isOwn
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <p className={`text-xs text-muted-foreground mt-1 ${message.isOwn ? 'text-right' : ''}`}>
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-border bg-card">
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon">
                  <Icon name="Plus" size={20} />
                </Button>
                <Input
                  placeholder="Написать сообщение..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button variant="ghost" size="icon">
                  <Icon name="Smile" size={20} />
                </Button>
                <Button size="icon" onClick={handleSendMessage}>
                  <Icon name="Send" size={20} />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <Icon name="MessageCircle" className="mx-auto mb-4" size={64} />
              <h2 className="text-2xl font-semibold mb-2">Выберите чат</h2>
              <p>Начните общение с друзьями</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

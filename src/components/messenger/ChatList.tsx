import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface Chat {
  id: number;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  avatar?: string;
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

interface ChatListProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  chats: Chat[];
  contacts: Contact[];
  friendRequests: FriendRequest[];
  selectedChat: number | null;
  setSelectedChat: (id: number) => void;
}

export default function ChatList({
  searchQuery,
  setSearchQuery,
  chats,
  contacts,
  friendRequests,
  selectedChat,
  setSelectedChat
}: ChatListProps) {
  return (
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
  );
}

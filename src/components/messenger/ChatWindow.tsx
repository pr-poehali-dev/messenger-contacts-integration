import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import Icon from '@/components/ui/icon';

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

interface ChatWindowProps {
  selectedChat: number | null;
  chats: Chat[];
  messages: Message[];
  messageInput: string;
  setMessageInput: (value: string) => void;
  handleSendMessage: () => void;
}

export default function ChatWindow({
  selectedChat,
  chats,
  messages,
  messageInput,
  setMessageInput,
  handleSendMessage
}: ChatWindowProps) {
  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <Icon name="MessageCircle" className="mx-auto mb-4" size={64} />
          <h2 className="text-2xl font-semibold mb-2">Выберите чат</h2>
          <p>Начните общение с друзьями</p>
        </div>
      </div>
    );
  }

  const currentChat = chats.find(c => c.id === selectedChat);

  return (
    <div className="flex-1 flex flex-col">
      <div className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={currentChat?.avatar} />
            <AvatarFallback>{currentChat?.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold">{currentChat?.name}</h2>
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
                    <AvatarImage src={currentChat?.avatar} />
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
    </div>
  );
}

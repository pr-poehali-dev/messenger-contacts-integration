import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface User {
  id: number;
  username: string;
  avatar_url?: string;
  status: string;
}

interface SidebarProps {
  currentUser: User;
  setIsLoggedIn: (value: boolean) => void;
}

export default function Sidebar({ currentUser, setIsLoggedIn }: SidebarProps) {
  return (
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
  );
}

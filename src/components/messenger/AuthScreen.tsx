import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface AuthScreenProps {
  showRegister: boolean;
  setShowRegister: (value: boolean) => void;
  handleLogin: (e: React.FormEvent) => void;
  handleRegister: (e: React.FormEvent) => void;
}

export default function AuthScreen({ showRegister, setShowRegister, handleLogin, handleRegister }: AuthScreenProps) {
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

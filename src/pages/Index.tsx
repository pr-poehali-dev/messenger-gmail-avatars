import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

type UserRole = 'admin' | 'moderator' | 'observer' | 'user';
type UserStatus = 'online' | 'offline' | 'invisible' | 'busy';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  balance: number;
  decorations: string[];
}

interface Message {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: Date;
  channelId: string;
}

interface Channel {
  id: string;
  name: string;
  isPinned: boolean;
  isAdminOnly: boolean;
  icon: string;
  isDM?: boolean;
  recipientId?: string;
}

interface ShopItem {
  id: string;
  name: string;
  price: number;
  type: 'avatar-decoration' | 'emoji' | 'sticker' | 'gift';
  icon: string;
}

const Index = () => {
  const [currentUser] = useState<User>({
    id: '1',
    name: 'Космонавт',
    email: 'astronaut@example.com',
    avatar: undefined,
    role: 'admin',
    status: 'online',
    balance: 150,
    decorations: ['⭐', '🚀']
  });

  const [selectedChannel, setSelectedChannel] = useState<string>('rules');
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currencyAmount, setCurrencyAmount] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole>('user');
  const [isGiveCurrencyOpen, setIsGiveCurrencyOpen] = useState(false);
  const [isChangeRoleOpen, setIsChangeRoleOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'Космонавт', email: 'astronaut@example.com', role: 'admin', status: 'online', balance: 150, decorations: ['⭐', '🚀'] },
    { id: '2', name: 'Модератор', email: 'mod@example.com', role: 'moderator', status: 'busy', balance: 80, decorations: ['🛡️'] },
    { id: '3', name: 'Наблюдатель', email: 'observer@example.com', role: 'observer', status: 'invisible', balance: 50, decorations: ['👁️'] },
    { id: '4', name: 'Пользователь', email: 'user@example.com', role: 'user', status: 'online', balance: 20, decorations: [] },
  ]);

  const [channels, setChannels] = useState<Channel[]>([
    { id: 'rules', name: 'Правила', isPinned: true, isAdminOnly: true, icon: 'ScrollText' },
    { id: 'general', name: 'Общий', isPinned: false, isAdminOnly: false, icon: 'MessageSquare' },
    { id: 'announcements', name: 'Объявления', isPinned: false, isAdminOnly: true, icon: 'Megaphone' },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      userId: '1',
      userName: 'Космонавт',
      content: 'Добро пожаловать в наш мессенджер! Ознакомьтесь с правилами.',
      timestamp: new Date(Date.now() - 3600000),
      channelId: 'rules'
    },
    {
      id: '2',
      userId: '1',
      userName: 'Космонавт',
      content: '1. Уважайте других участников\n2. Запрещен спам\n3. Запрещен мат\n4. Будьте вежливы',
      timestamp: new Date(Date.now() - 3000000),
      channelId: 'rules'
    }
  ]);

  const shopItems: ShopItem[] = [
    { id: '1', name: 'Звёздная рамка', price: 50, type: 'avatar-decoration', icon: '⭐' },
    { id: '2', name: 'Огненная аура', price: 100, type: 'avatar-decoration', icon: '🔥' },
    { id: '3', name: 'Неоновое сердце', price: 30, type: 'emoji', icon: '💜' },
    { id: '4', name: 'Космический подарок', price: 80, type: 'gift', icon: '🎁' },
    { id: '5', name: 'Крутой стикер', price: 40, type: 'sticker', icon: '😎' },
  ];

  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'bg-[hsl(var(--neon-blue))] text-white';
      case 'moderator': return 'bg-[hsl(var(--neon-pink))] text-white';
      case 'observer': return 'bg-[hsl(var(--neon-green))] text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case 'online': return 'bg-[hsl(var(--neon-green))]';
      case 'busy': return 'bg-destructive';
      case 'invisible': return 'bg-muted';
      case 'offline': return 'bg-muted-foreground';
    }
  };

  const getRoleLabel = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'Админ';
      case 'moderator': return 'Модератор';
      case 'observer': return 'Наблюдатель';
      default: return 'Пользователь';
    }
  };

  const handleGiveCurrency = () => {
    const amount = parseInt(currencyAmount);
    if (!amount || amount <= 0) {
      toast({ title: 'Ошибка', description: 'Укажите корректную сумму', variant: 'destructive' });
      return;
    }

    setUsers(prev => prev.map(u => 
      u.id === selectedUserId 
        ? { ...u, balance: u.balance + amount }
        : u
    ));

    const user = users.find(u => u.id === selectedUserId);
    toast({ 
      title: 'Валюта выдана', 
      description: `${user?.name} получил ${amount} ⊂⊃` 
    });
    
    setCurrencyAmount('');
    setIsGiveCurrencyOpen(false);
  };

  const handleChangeRole = () => {
    setUsers(prev => prev.map(u => 
      u.id === selectedUserId 
        ? { ...u, role: selectedRole }
        : u
    ));

    const user = users.find(u => u.id === selectedUserId);
    toast({ 
      title: 'Роль изменена', 
      description: `${user?.name} теперь ${getRoleLabel(selectedRole)}` 
    });
    
    setIsChangeRoleOpen(false);
  };

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      content: messageInput,
      timestamp: new Date(),
      channelId: selectedChannel
    };

    setMessages(prev => [...prev, newMessage]);
    setMessageInput('');
  };

  const handleStartDM = (userId: string) => {
    const dmChannelId = `dm-${Math.min(parseInt(currentUser.id), parseInt(userId))}-${Math.max(parseInt(currentUser.id), parseInt(userId))}`;
    
    const existingDM = channels.find(c => c.id === dmChannelId);
    if (!existingDM) {
      const recipient = users.find(u => u.id === userId);
      const newChannel: Channel = {
        id: dmChannelId,
        name: recipient?.name || 'Личные сообщения',
        isPinned: false,
        isAdminOnly: false,
        icon: 'User',
        isDM: true,
        recipientId: userId
      };
      setChannels(prev => [...prev, newChannel]);
    }
    
    setSelectedChannel(dmChannelId);
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentChannelMessages = messages.filter(m => m.channelId === selectedChannel);
  const selectedChannelInfo = channels.find(c => c.id === selectedChannel);

  return (
    <div className="flex h-screen bg-[#0A0E27] text-foreground">
      <aside className="w-72 border-r border-border/50 flex flex-col glass-effect">
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <Avatar className="w-12 h-12 ring-2 ring-primary/50">
                <AvatarImage src={currentUser.avatar} />
                <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                  {currentUser.name[0]}
                </AvatarFallback>
              </Avatar>
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${getStatusColor(currentUser.status)}`} />
              {currentUser.decorations.length > 0 && (
                <div className="absolute -top-1 -right-1 text-lg">
                  {currentUser.decorations[0]}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate text-primary neon-glow">{currentUser.name}</p>
              <Badge className={`${getRoleBadgeColor(currentUser.role)} text-xs mt-1`}>
                {getRoleLabel(currentUser.role)}
              </Badge>
            </div>
          </div>
          <div className="flex items-center justify-between p-2 rounded-lg bg-card/50">
            <span className="text-sm text-muted-foreground">Баланс:</span>
            <span className="font-bold text-primary neon-glow">{currentUser.balance} ⊂⊃</span>
          </div>
        </div>

        <Tabs defaultValue="channels" className="flex-1 flex flex-col">
          <TabsList className="mx-4 mt-4 grid w-auto grid-cols-2 bg-card/50">
            <TabsTrigger value="channels" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="MessageSquare" size={16} className="mr-2" />
              Каналы
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Icon name="Users" size={16} className="mr-2" />
              Люди
            </TabsTrigger>
          </TabsList>

          <TabsContent value="channels" className="flex-1 mt-4">
            <ScrollArea className="h-full px-4">
              <div className="space-y-1">
                {channels.map(channel => (
                  <button
                    key={channel.id}
                    onClick={() => setSelectedChannel(channel.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                      selectedChannel === channel.id 
                        ? 'bg-primary text-primary-foreground neon-border' 
                        : 'hover:bg-card/50'
                    }`}
                  >
                    <Icon name={channel.icon as any} size={18} />
                    <span className="flex-1 text-left font-medium truncate">{channel.name}</span>
                    {channel.isPinned && <Icon name="Pin" size={14} className="text-primary" />}
                    {channel.isAdminOnly && <Icon name="Lock" size={14} className="text-muted-foreground" />}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="users" className="flex-1 mt-4">
            <div className="px-4 mb-4">
              <Input
                placeholder="Поиск по нику/почте..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-card/50 border-border/50"
              />
            </div>
            <ScrollArea className="h-full px-4">
              <div className="space-y-2">
                {filteredUsers.map(user => (
                  <Sheet key={user.id}>
                    <SheetTrigger asChild>
                      <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-card/50 transition-all">
                        <div className="relative">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback className="bg-primary/20 text-primary">
                              {user.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(user.status)}`} />
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <p className="font-medium truncate">{user.name}</p>
                          <Badge className={`${getRoleBadgeColor(user.role)} text-xs`}>
                            {getRoleLabel(user.role)}
                          </Badge>
                        </div>
                      </button>
                    </SheetTrigger>
                    <SheetContent className="glass-effect border-border/50">
                      <SheetHeader>
                        <SheetTitle className="text-primary neon-glow">Профиль пользователя</SheetTitle>
                        <SheetDescription>Информация о {user.name}</SheetDescription>
                      </SheetHeader>
                      <div className="mt-6 space-y-4">
                        <div className="flex justify-center">
                          <div className="relative">
                            <Avatar className="w-24 h-24 ring-4 ring-primary/50">
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback className="bg-primary/20 text-primary text-3xl">
                                {user.name[0]}
                              </AvatarFallback>
                            </Avatar>
                            {user.decorations.length > 0 && (
                              <div className="absolute -top-2 -right-2 text-3xl">
                                {user.decorations[0]}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Имя:</span>
                            <span className="font-semibold">{user.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Email:</span>
                            <span className="text-sm">{user.email}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Роль:</span>
                            <Badge className={getRoleBadgeColor(user.role)}>
                              {getRoleLabel(user.role)}
                            </Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Баланс:</span>
                            <span className="font-bold text-primary">{user.balance} ⊂⊃</span>
                          </div>
                        </div>
                        
                        {user.id !== currentUser.id && (
                          <Button 
                            className="w-full bg-primary hover:bg-primary/90"
                            onClick={() => handleStartDM(user.id)}
                          >
                            <Icon name="MessageCircle" size={16} className="mr-2" />
                            Написать сообщение
                          </Button>
                        )}

                        {currentUser.role === 'admin' && user.id !== currentUser.id && (
                          <div className="pt-4 space-y-2">
                            <Dialog open={isGiveCurrencyOpen} onOpenChange={setIsGiveCurrencyOpen}>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  className="w-full"
                                  onClick={() => setSelectedUserId(user.id)}
                                >
                                  <Icon name="Coins" size={16} className="mr-2" />
                                  Выдать валюту
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="glass-effect border-border/50">
                                <DialogHeader>
                                  <DialogTitle className="text-primary neon-glow">Выдать валюту</DialogTitle>
                                  <DialogDescription>Укажите количество ⊂⊃ для {user.name}</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="amount">Количество</Label>
                                    <Input
                                      id="amount"
                                      type="number"
                                      placeholder="100"
                                      value={currencyAmount}
                                      onChange={(e) => setCurrencyAmount(e.target.value)}
                                      className="bg-card/50"
                                    />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => setIsGiveCurrencyOpen(false)}>
                                    Отмена
                                  </Button>
                                  <Button onClick={handleGiveCurrency} className="bg-primary hover:bg-primary/90">
                                    Выдать
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>

                            <Dialog open={isChangeRoleOpen} onOpenChange={setIsChangeRoleOpen}>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  className="w-full"
                                  onClick={() => {
                                    setSelectedUserId(user.id);
                                    setSelectedRole(user.role);
                                  }}
                                >
                                  <Icon name="Shield" size={16} className="mr-2" />
                                  Изменить роль
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="glass-effect border-border/50">
                                <DialogHeader>
                                  <DialogTitle className="text-primary neon-glow">Изменить роль</DialogTitle>
                                  <DialogDescription>Выберите новую роль для {user.name}</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="role">Роль</Label>
                                    <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as UserRole)}>
                                      <SelectTrigger className="bg-card/50">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="user">Пользователь</SelectItem>
                                        <SelectItem value="observer">Наблюдатель</SelectItem>
                                        <SelectItem value="moderator">Модератор</SelectItem>
                                        <SelectItem value="admin">Администратор</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => setIsChangeRoleOpen(false)}>
                                    Отмена
                                  </Button>
                                  <Button onClick={handleChangeRole} className="bg-primary hover:bg-primary/90">
                                    Изменить
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>

                            <Button className="w-full bg-destructive hover:bg-destructive/90">
                              <Icon name="Ban" size={16} className="mr-2" />
                              Заблокировать
                            </Button>
                          </div>
                        )}
                      </div>
                    </SheetContent>
                  </Sheet>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <div className="p-4 border-t border-border/50 space-y-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full bg-secondary hover:bg-secondary/90 neon-border">
                <Icon name="ShoppingBag" size={16} className="mr-2" />
                Магазин
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-effect border-border/50 max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-primary neon-glow text-2xl">Магазин украшений</DialogTitle>
                <DialogDescription>Покупайте уникальные украшения за валюту ⊂⊃</DialogDescription>
              </DialogHeader>
              <ScrollArea className="h-96 pr-4">
                <div className="grid grid-cols-2 gap-4">
                  {shopItems.map(item => (
                    <Card key={item.id} className="p-4 glass-effect border-primary/30 hover:border-primary/60 transition-all">
                      <div className="text-center space-y-3">
                        <div className="text-5xl">{item.icon}</div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-xl font-bold text-primary neon-glow">{item.price} ⊂⊃</p>
                        <Button 
                          className="w-full bg-primary hover:bg-primary/90"
                          disabled={currentUser.balance < item.price}
                        >
                          Купить
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="h-16 border-b border-border/50 flex items-center justify-between px-6 glass-effect">
          <div className="flex items-center gap-3">
            <Icon name={selectedChannelInfo?.icon as any || 'MessageSquare'} size={24} className="text-primary" />
            <div>
              <h1 className="text-xl font-bold text-primary neon-glow">
                {selectedChannelInfo?.name}
              </h1>
              <p className="text-xs text-muted-foreground">
                {currentChannelMessages.length} сообщений
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="hover:bg-card/50">
              <Icon name="Search" size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-card/50">
              <Icon name="Settings" size={20} />
            </Button>
          </div>
        </header>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-4 max-w-4xl mx-auto">
            {currentChannelMessages.map(message => (
              <div key={message.id} className="flex gap-4 group">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={message.userAvatar} />
                  <AvatarFallback className="bg-primary/20 text-primary">
                    {message.userName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-semibold text-primary">{message.userName}</span>
                    <span className="text-xs text-muted-foreground">
                      {message.timestamp.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="text-sm whitespace-pre-wrap bg-card/30 p-3 rounded-lg">
                    {message.content}
                  </div>
                </div>
                {currentUser.role !== 'user' && (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/20">
                      <Icon name="Trash2" size={16} />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="border-t border-border/50 p-4 glass-effect">
          <div className="max-w-4xl mx-auto">
            {selectedChannelInfo?.isAdminOnly && !['admin'].includes(currentUser.role) ? (
              <div className="text-center py-4 text-muted-foreground">
                <Icon name="Lock" size={24} className="mx-auto mb-2" />
                <p>Только администраторы могут писать в этот канал</p>
              </div>
            ) : (
              <div className="flex gap-3">
                <Input
                  placeholder="Написать сообщение..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 bg-card/50 border-border/50 focus:border-primary/50"
                />
                <Button 
                  onClick={handleSendMessage}
                  className="bg-primary hover:bg-primary/90 neon-border"
                >
                  <Icon name="Send" size={18} />
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;

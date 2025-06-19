'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { services } from '@/lib/api';
import { Service, ServiceMessage } from '@/types';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Props {
  params: {
    id: string;
  };
}

type TempServiceMessage = Omit<ServiceMessage, 'id'> & { id: string | number };

const STATUS_COLORS = {
  'BEKLEMEDE': 'bg-amber-500 hover:bg-amber-600',
  'INCELEMEDE': 'bg-blue-500 hover:bg-blue-600',
  'TAMIR_EDILDI': 'bg-emerald-500 hover:bg-emerald-600',
  'TESLIM_EDILDI': 'bg-violet-500 hover:bg-violet-600',
  'IPTAL': 'bg-rose-500 hover:bg-rose-600'
};

const STATUS_TEXT = {
  'BEKLEMEDE': 'Beklemede',
  'INCELEMEDE': 'İncelemede',
  'TAMIR_EDILDI': 'Tamir Edildi',
  'TESLIM_EDILDI': 'Teslim Edildi',
  'IPTAL': 'İptal'
};

export default function ServiceDetailsPage({ params }: Props) {
  const [service, setService] = useState<Service | null>(null);
  const [messages, setMessages] = useState<TempServiceMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    const savedTab = localStorage.getItem(`status-tab-${params.id}`);
    if (savedTab) {
      setActiveTab(savedTab);
    } else if (window.location.hash === '#chat') {
      setActiveTab('chat');
    }
    
    const handleHashChange = () => {
      if (window.location.hash === '#chat') {
        setActiveTab('chat');
      } else if (window.location.hash === '') {
        setActiveTab('details');
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [params.id]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    localStorage.setItem(`status-tab-${params.id}`, value);
    
    if (value === 'chat') {
      window.history.replaceState(null, '', `#chat`);
      setTimeout(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else if (value === 'details') {
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
      
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    }, 100);
  };

  const getStatusBadgeClass = (status: string) => {
    return `${STATUS_COLORS[status as keyof typeof STATUS_COLORS] || 'bg-gray-500'} text-white font-medium`;
  };

  const getStatusText = (status: string) => {
    return STATUS_TEXT[status as keyof typeof STATUS_TEXT] || status;
  };

  const loadAllMessages = useCallback(async () => {
    try {
      if (!service?.id) return;
      
      const { data, error } = await supabase
        .from('service_messages')
        .select('*')
        .eq('service_id', service.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  }, [service?.id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const serviceData = await services.getById(Number(params.id));
        setService(serviceData);
        
        await loadAllMessages();
      } catch (error) {
        console.error('Servis bilgileri yüklenirken hata oluştu:', error);
        toast.error('Servis bilgileri yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id, loadAllMessages]);

  useEffect(() => {
    if (messages.length > 0 && activeTab === 'chat') {
      scrollToBottom();
    }
  }, [messages, activeTab]);

  useEffect(() => {
    if (!service) return;

    const interval = setInterval(() => {
      loadAllMessages();
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [service, params.id, activeTab, loadAllMessages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    try {
      setIsLoading(true);
      
      const timestamp = new Date().toISOString();
      
      const tempMessage: TempServiceMessage = {
        id: `temp-${Date.now()}`,
        service_id: Number(params.id),
        message: newMessage.trim(),
        is_from_customer: true,
        created_at: timestamp,
        updated_at: timestamp
      };
      
      setMessages(prev => [...prev, tempMessage]);
      setNewMessage('');
      
      scrollToBottom();
      
      const { error } = await supabase
        .from('service_messages')
        .insert([{
          service_id: Number(params.id),
          message: newMessage.trim(),
          is_from_customer: true,
          created_at: timestamp
        }]);

      if (error) throw error;
      
      setTimeout(scrollToBottom, 300);
      
      setTimeout(() => loadAllMessages(), 500);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Mesaj gönderilemedi');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Servis Kaydı Bulunamadı</h1>
        <Button onClick={() => window.history.back()}>Geri Dön</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Servis Detayları</h1>
        <Badge className={`${getStatusBadgeClass(service.status)} px-4 py-2 text-lg`}>
          {getStatusText(service.status)}
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="details">Detaylar</TabsTrigger>
          <TabsTrigger value="chat">Sohbet</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle>Cihaz Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm text-muted-foreground">Marka/Model</Label>
                <p className="text-lg font-medium">
                  {service.device?.brand} {service.device?.model}
                </p>
              </div>

              <div>
                <Label className="text-sm text-muted-foreground">Seri No</Label>
                <p className="font-medium">
                  {service.device?.serial_number}
                </p>
              </div>

              <div className="border-t pt-4">
                <Label className="text-sm text-muted-foreground">Sorun</Label>
                <p className="mt-1 bg-muted p-3 rounded-md">{service.problem}</p>
              </div>

              {service.diagnosis && (
                <div>
                  <Label className="text-sm text-muted-foreground">Teşhis</Label>
                  <p className="mt-1 bg-muted p-3 rounded-md">{service.diagnosis}</p>
                </div>
              )}

              {service.solution && (
                <div>
                  <Label className="text-sm text-muted-foreground">Çözüm</Label>
                  <p className="mt-1 bg-muted p-3 rounded-md">{service.solution}</p>
                </div>
              )}

              {service.price !== null && service.price !== undefined && (
                <div className="border-t pt-4">
                  <Label className="text-sm text-muted-foreground">Ücret</Label>
                  <p className="mt-1 text-2xl font-bold text-emerald-600">₺{service.price.toFixed(2)}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat">
          <Card className="h-[calc(100vh-16rem)] shadow-sm">
            <CardHeader className="border-b pb-3">
              <CardTitle>Servis Mesajları</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col h-[calc(100vh-20rem)] pt-4">
              <div className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2" ref={messagesContainerRef}>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.is_from_customer ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.is_from_customer
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted dark:bg-zinc-800 text-card-foreground'
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                      <p className={`text-xs mt-1 opacity-70`}>
                        {new Date(message.created_at).toLocaleString('tr-TR', {
                          hour: 'numeric',
                          minute: 'numeric',
                          day: 'numeric',
                          month: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef}></div>
              </div>

              <div className="border-t pt-4">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }} 
                  className="flex gap-2"
                >
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Mesajınızı yazın..."
                    className="flex-1 focus-visible:ring-primary"
                  />
                  <Button 
                    type="submit" 
                    disabled={!newMessage.trim() || isLoading}
                    className="px-4"
                  >
                    {isLoading ? 'Gönderiliyor...' : <Send className="h-4 w-4" />}
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
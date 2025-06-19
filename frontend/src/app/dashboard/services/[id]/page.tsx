'use client';

import { useEffect, useState, useRef } from 'react';
import { services, deviceParts, devices, customers } from '@/lib/api';
import type { Service, Device, Customer, DevicePart, ServiceMessage, AvailablePart, PartCategory, Message } from '@/types';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CalendarIcon, WrenchIcon, ClockIcon, CheckCircleIcon, BanIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type TempServiceMessage = Omit<ServiceMessage, 'id'> & { 
  id: string | number;
};

interface Props {
  params: {
    id: string;
  };
}

const STATUS_COLORS = {
  'BEKLEMEDE': 'bg-yellow-500',
  'INCELEMEDE': 'bg-blue-500',
  'TAMIR_EDILDI': 'bg-green-500',
  'TESLIM_EDILDI': 'bg-purple-500',
  'IPTAL': 'bg-red-500'
};

const STATUS_LABELS = {
  'BEKLEMEDE': 'Beklemede',
  'INCELEMEDE': 'İncelemede',
  'TAMIR_EDILDI': 'Tamir Edildi',
  'TESLIM_EDILDI': 'Teslim Edildi',
  'IPTAL': 'İptal'
};

interface EditServiceDialogProps {
  service: Service;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedService: Partial<Service>) => Promise<void>;
}

function EditServiceDialog({ service, isOpen, onClose, onSave }: EditServiceDialogProps) {
  const [editedService, setEditedService] = useState<Partial<Service>>({
    problem: service.problem || '',
    status: service.status || 'BEKLEMEDE',
    diagnosis: service.diagnosis || '',
    solution: service.solution || '',
    price: service.price || 0
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setEditedService({
        problem: service.problem || '',
        status: service.status || 'BEKLEMEDE',
        diagnosis: service.diagnosis || '',
        solution: service.solution || '',
        price: service.price || 0
      });
    }
  }, [isOpen, service]);

  const handleSave = async () => {
    try {
      setSaving(true);
      await onSave(editedService);
    } catch (error) {
      console.error('Servis kaydı güncellenirken hata oluştu:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
      }
    }}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Servis Kaydını Düzenle</DialogTitle>
          <DialogDescription>
            Servis bilgilerini güncellemek için aşağıdaki formu kullanın.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Durum</Label>
              <Select
                value={editedService.status}
                onValueChange={(value) => setEditedService({ ...editedService, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Durum seçin" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(STATUS_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Ücret</Label>
              <Input
                type="number"
                value={editedService.price}
                onChange={(e) => setEditedService({ ...editedService, price: Number(e.target.value) })}
              />
            </div>
          </div>
          <div>
            <Label>Problem</Label>
            <Textarea
              value={editedService.problem}
              onChange={(e) => setEditedService({ ...editedService, problem: e.target.value })}
              rows={3}
            />
          </div>
          <div>
            <Label>Teşhis</Label>
            <Textarea
              value={editedService.diagnosis}
              onChange={(e) => setEditedService({ ...editedService, diagnosis: e.target.value })}
              rows={3}
            />
          </div>
          <div>
            <Label>Çözüm</Label>
            <Textarea
              value={editedService.solution}
              onChange={(e) => setEditedService({ ...editedService, solution: e.target.value })}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            İptal
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function ServiceDetailPage({ params }: Props) {
  const router = useRouter();
  const [service, setService] = useState<Service | null>(null);
  const [device, setDevice] = useState<Device | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [parts, setParts] = useState<DevicePart[]>([]);
  const [selectedParts, setSelectedParts] = useState<DevicePart[]>([]);
  const [availableParts, setAvailableParts] = useState<PartCategory[]>([]);
  const [messages, setMessages] = useState<ServiceMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState('details');
  const { user: currentUser } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    localStorage.setItem(`dashboard-service-tab-${params.id}`, value);
    
    if (value === 'chat') {
      window.history.replaceState(null, '', `#chat`);
      setTimeout(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else if (value === 'parts') {
      window.history.replaceState(null, '', `#parts`);
    } else if (value === 'details') {
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  useEffect(() => {
    const savedTab = localStorage.getItem(`dashboard-service-tab-${params.id}`);
    if (savedTab) {
      setActiveTab(savedTab);
    } else if (window.location.hash === '#chat') {
      setActiveTab('chat');
    } else if (window.location.hash === '#parts') {
      setActiveTab('parts');
    }
    
    const handleHashChange = () => {
      if (window.location.hash === '#chat') {
        setActiveTab('chat');
      } else if (window.location.hash === '#parts') {
        setActiveTab('parts');
      } else if (window.location.hash === '') {
        setActiveTab('details');
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [params.id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const serviceData = await services.getById(Number(params.id));
        setService(serviceData);

        const storedPartsJson = localStorage.getItem(`selectedParts_${params.id}`);
        if (storedPartsJson) {
          const storedParts = JSON.parse(storedPartsJson);
          setSelectedParts(storedParts);
        }

        if (serviceData.device_id) {
          const [deviceData, devicePartsData] = await Promise.all([
            devices.getById(serviceData.device_id),
            deviceParts.getPricesForDevice(serviceData.device_id)
          ]);
          setDevice(deviceData);
          
          if (devicePartsData && Array.isArray(devicePartsData)) {
            const categorizedParts = devicePartsData.reduce((acc: any, part: any) => {
              const category = part.category || 'Diğer';
              if (!acc[category]) {
                acc[category] = [];
              }
              acc[category].push({
                id: part.id,
                partName: part.name,
                price: part.price
              });
              return acc;
            }, {});

            const formattedParts = Object.entries(categorizedParts).map(([category, parts]) => ({
              category,
              parts: parts as { id: number; partName: string; price: number }[]
            }));
            setAvailableParts(formattedParts);
          }
        }

        if (serviceData.customer_id) {
          const customerData = await customers.getById(serviceData.customer_id);
          setCustomer(customerData);
        }
      } catch (error) {
        console.error('Servis bilgileri yüklenirken hata oluştu:', error);
        toast.error('Servis bilgileri yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  useEffect(() => {
    if (params.id && selectedParts.length > 0) {
      localStorage.setItem(`selectedParts_${params.id}`, JSON.stringify(selectedParts));
    }
  }, [selectedParts, params.id]);

  useEffect(() => {
    const loadPartsFromStorage = () => {
      const storedPartsJson = localStorage.getItem(`selectedParts_${params.id}`);
      if (storedPartsJson) {
        try {
          const storedParts = JSON.parse(storedPartsJson);
          setSelectedParts(storedParts);
        } catch (error) {
          console.error('Parçalar yüklenirken hata oluştu:', error);
        }
      }
    };

    loadPartsFromStorage();
  }, [params.id]);

  useEffect(() => {
    if (!service?.id) return;

    const refreshService = async () => {
      const { data, error } = await supabase
        .from('service_messages')
        .select('*')
        .eq('service_id', params.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error refreshing messages:', error);
        return;
      }

      if (data) {
        setMessages(data);
        scrollToBottom();
      }
    };

    const channel = supabase
      .channel('service_messages')
      .on('postgres_changes', 
        {
          event: 'INSERT',
          schema: 'public',
          table: 'service_messages',
          filter: `service_id=eq.${service.id}`
        },
        async () => {
          await refreshService();
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [service?.id, params.id]);

  const refreshService = async () => {
    const { data, error } = await supabase
      .from('service_messages')
      .select('*')
      .eq('service_id', params.id)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error refreshing messages:', error);
      return;
    }

    if (data) {
      setMessages(data);
      scrollToBottom();
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
      
      const scrollViewport = document.querySelector('.chat-scroll-area [data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
      
      const scrollContainer = document.querySelector('.chat-scroll-area');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }, 100);
  };

  const handleSave = async (updatedService: Partial<Service>) => {
    try {
      if (!service) return;

      await services.update(service.id, {
        status: updatedService.status || 'BEKLEMEDE',
        problem: updatedService.problem || '',
        diagnosis: updatedService.diagnosis,
        solution: updatedService.solution,
        price: updatedService.price
      });

      const updatedServiceData = await services.getById(service.id);
      setService(updatedServiceData);

      setIsEditDialogOpen(false);
      toast.success('Servis kaydı başarıyla güncellendi');
    } catch (error) {
      console.error('Servis kaydı güncellenirken hata oluştu:', error);
      toast.error('Servis kaydı güncellenirken bir hata oluştu');
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!service) return;

    if (window.confirm('Bu servis kaydını silmek istediğinizden emin misiniz?')) {
      try {
        await services.delete(service.id);
        toast.success('Servis kaydı başarıyla silindi');
        router.push('/dashboard/services');
      } catch (error) {
        console.error('Servis kaydı silinirken hata oluştu:', error);
        toast.error('Servis kaydı silinirken bir hata oluştu');
      }
    }
  };

  const handleAddPart = async (part: AvailablePart) => {
    try {
      if (!service || !device) return;

      const newPart: DevicePart = {
        id: part.id,
        name: part.partName,
        category: availableParts.find(cat => 
          cat.parts.some((p: AvailablePart) => p.id === part.id)
        )?.category || '',
        price: part.price,
        device_id: device.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setSelectedParts(prevParts => {
        const updatedParts = [...prevParts, newPart];
        localStorage.setItem(`selectedParts_${params.id}`, JSON.stringify(updatedParts));
        return updatedParts;
      });
      
      toast.success('Parça başarıyla eklendi');
    } catch (error) {
      console.error('Parça eklenirken hata oluştu:', error);
      toast.error('Parça eklenirken bir hata oluştu');
    }
  };

  const handleRemovePart = async (part: DevicePart) => {
    try {
      if (!service) return;

      setSelectedParts(prevParts => {
        const updatedParts = prevParts.filter(p => p.id !== part.id);
        localStorage.setItem(`selectedParts_${params.id}`, JSON.stringify(updatedParts));
        return updatedParts;
      });
      
      toast.success('Parça başarıyla kaldırıldı');
    } catch (error) {
      console.error('Parça kaldırılırken hata oluştu:', error);
      toast.error('Parça kaldırılırken bir hata oluştu');
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const timestamp = new Date().toISOString();
      
      const tempMessage: ServiceMessage = {
        id: Date.now(),
        service_id: Number(params.id),
        message: newMessage.trim(),
        is_from_customer: false,
        created_at: timestamp,
        updated_at: timestamp
      };
      
      setMessages(prevMessages => [...prevMessages, tempMessage]);
      setNewMessage('');
      
      scrollToBottom();
      
      const { error } = await supabase
        .from('service_messages')
        .insert([{
          service_id: Number(params.id),
          message: newMessage.trim(),
          is_from_customer: false,
          created_at: timestamp
        }]);

      if (error) throw error;
      
      setTimeout(scrollToBottom, 300);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Mesaj gönderilemedi');
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
        <Button onClick={() => router.push('/dashboard/services')}>Servis Listesine Dön</Button>
      </div>
    );
  }

  const totalPartsPrice = selectedParts.reduce((sum, part) => sum + part.price, 0);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Servis Detayları</h1>
          <p className="text-muted-foreground mt-1">#{service.id}</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsEditDialogOpen(true)}>Düzenle</Button>
          <Button variant="destructive" onClick={handleDelete}>
            Sil
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Detaylar</TabsTrigger>
          <TabsTrigger value="parts">Parçalar</TabsTrigger>
          <TabsTrigger value="chat">Sohbet</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Müşteri Bilgileri</CardTitle>
              </CardHeader>
              <CardContent>
                {customer && (
                  <div className="space-y-2">
                    <div>
                      <Label>Ad Soyad</Label>
                      <p className="text-lg font-medium">{customer.name}</p>
                    </div>
                    <div>
                      <Label>Telefon</Label>
                      <p className="text-lg font-medium">{customer.phone}</p>
                    </div>
                    <div>
                      <Label>E-posta</Label>
                      <p className="text-lg font-medium">{customer.email}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cihaz Bilgileri</CardTitle>
              </CardHeader>
              <CardContent>
                {device && (
                  <div className="space-y-2">
                    <div>
                      <Label>Marka/Model</Label>
                      <p className="text-lg font-medium">{device.brand} {device.model}</p>
                    </div>
                    <div>
                      <Label>Seri No</Label>
                      <p className="text-lg font-medium">{device.serial_number}</p>
                    </div>
                    <div>
                      <Label>Tip</Label>
                      <p className="text-lg font-medium">{device.type}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Servis Durumu</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-4">
                    <Badge className={`${STATUS_COLORS[service.status as keyof typeof STATUS_COLORS]} text-lg px-4 py-2`}>
                      {STATUS_LABELS[service.status as keyof typeof STATUS_LABELS]}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Son Güncelleme</p>
                    <p className="text-lg font-medium">
                      {new Date(service.updated_at).toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Servis Bilgileri</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Ücret</Label>
                  <div className="mt-2 p-4 bg-muted rounded-lg">
                    <p className="text-3xl font-bold">Ücret: ₺{service.price?.toFixed(2) || '0.00'}</p>
                    {totalPartsPrice > 0 && (
                      <p className="text-base text-muted-foreground mt-2">
                        Parça Ücreti: ₺{totalPartsPrice.toFixed(2)}
                      </p>
                    )}
                    {/*totalPartsPrice > 0 && (
                      <p className="text-lg font-semibold mt-2 pt-2 border-t">
                        Toplam: ₺{((service.price || 0) + totalPartsPrice).toFixed(2)}
                      </p>
                    )*/}
                  </div>
                </div>

                <div>
                  <Label>Problem</Label>
                  <p className="mt-2 text-lg p-4 bg-muted rounded-lg">{service.problem}</p>
                </div>

                <div>
                  <Label>Teşhis</Label>
                  <p className="mt-2 text-lg p-4 bg-muted rounded-lg">{service.diagnosis || '-'}</p>
                </div>

                <div>
                  <Label>Çözüm</Label>
                  <p className="mt-2 text-lg p-4 bg-muted rounded-lg">{service.solution || '-'}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="parts">
          <Card>
            <CardHeader>
              <CardTitle>Parça Bilgileri</CardTitle>
              <CardDescription>
                Bu cihaz için kullanılabilir parçaların listesi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {selectedParts.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Seçilen Parçalar</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="px-4 py-2 text-left">Parça</th>
                            <th className="px-4 py-2 text-left">Kategori</th>
                            <th className="px-4 py-2 text-right">Fiyat</th>
                            <th className="px-4 py-2 text-right">İşlem</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedParts.map((part) => (
                            <tr key={part.id} className="border-b">
                              <td className="px-4 py-2">{part.name}</td>
                              <td className="px-4 py-2">{part.category}</td>
                              <td className="px-4 py-2 text-right">₺{part.price.toFixed(2)}</td>
                              <td className="px-4 py-2 text-right">
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleRemovePart(part)}
                                >
                                  Kaldır
                                </Button>
                              </td>
                            </tr>
                          ))}
                          <tr className="font-medium">
                            {/*<td colSpan={2} className="px-4 py-2 text-right">Toplam:</td>*/}
                            <td className="px-4 py-2 text-right">
                              ₺{selectedParts.reduce((sum, part) => sum + part.price, 0).toFixed(2)}
                            </td>
                            <td></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-lg font-medium mb-4">Kullanılabilir Parçalar</h3>
                  {availableParts.length > 0 ? (
                    <div className="space-y-6">
                      {availableParts.map((category) => (
                        <div key={category.category} className="rounded-lg border border-border p-4">
                          <h4 className="text-sm font-medium mb-4">{category.category}</h4>
                          <div className="overflow-x-auto">
                            <table className="w-full">
                              <thead>
                                <tr className="border-b">
                                  <th className="px-4 py-2 text-left">Parça</th>
                                  <th className="px-4 py-2 text-right">Fiyat</th>
                                  <th className="px-4 py-2 text-right">İşlem</th>
                                </tr>
                              </thead>
                              <tbody>
                                {category.parts.map((part) => (
                                  <tr key={part.id} className="border-b">
                                    <td className="px-4 py-2">{part.partName}</td>
                                    <td className="px-4 py-2 text-right">₺{part.price.toFixed(2)}</td>
                                    <td className="px-4 py-2 text-right">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleAddPart(part)}
                                        disabled={selectedParts.some(p => p.id === part.id)}
                                      >
                                        {selectedParts.some(p => p.id === part.id) ? 'Eklendi' : 'Ekle'}
                                      </Button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      Bu cihaz için henüz parça kaydı bulunmuyor
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Servis Sohbeti</CardTitle>
              <CardDescription>
                Servis hakkında notlar ve mesajlar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ScrollArea className="h-[400px] pr-4 chat-scroll-area">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.is_from_customer ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.is_from_customer
                            ? 'bg-muted'
                            : 'bg-primary text-primary-foreground'
                        }`}
                      >
                        <div className="text-sm">{message.message}</div>
                        <div className="text-xs opacity-70 mt-1">
                          {new Date(message.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              <div className="flex gap-2">
                <Input
                  placeholder="Mesajınızı yazın..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSendMessage();
                    }
                  }}
                />
                <Button onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {service && (
        <EditServiceDialog
          service={service}
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
} 
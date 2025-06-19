'use client';

import { useEffect, useState, useRef } from 'react';
import { services, deviceParts, devices, customers } from '@/lib/api';
import { Service, Device, Customer, DevicePart, ServiceMessage } from '@/types';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';

interface Props {
  params: {
    id: string;
  };
}

export default function ServiceMessagesPage({ params }: Props) {
  const router = useRouter();
  const [service, setService] = useState<Service | null>(null);
  const [device, setDevice] = useState<Device | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [parts, setParts] = useState<DevicePart[]>([]);
  const [messages, setMessages] = useState<ServiceMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const serviceData = await services.getById(Number(params.id));
        setService(serviceData);
        setMessages(serviceData.messages || []);

        if (serviceData.device_id) {
          const [deviceData, partsData] = await Promise.all([
            devices.getById(serviceData.device_id),
            deviceParts.getForDevice(serviceData.device_id)
          ]);
          setDevice(deviceData);
          setParts(partsData);
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
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!service || !newMessage.trim()) return;

    try {
      await services.sendMessage(service.id, newMessage.trim(), false);

      const updatedService = await services.getById(service.id);
      setMessages(updatedService.messages || []);
      setNewMessage('');
    } catch (error) {
      console.error('Mesaj gönderilirken hata oluştu:', error);
      toast.error('Mesaj gönderilirken bir hata oluştu');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Yükleniyor...</div>;
  }

  if (!service) {
    return <div className="flex justify-center items-center min-h-screen">Servis kaydı bulunamadı</div>;
  }

  const totalPartsPrice = parts.reduce((sum, part) => sum + part.price, 0);

  return (
    <div className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-[1fr,2fr] gap-6">
        <div className="space-y-6">
          <div className="bg-card rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Müşteri ve Cihaz Bilgileri</h2>
            <div className="space-y-4">
              <div>
                <Label>Müşteri</Label>
                <div className="mt-1">
                  {customer ? (
                    <div>
                      <p className="text-foreground font-medium">{customer.name}</p>
                      <p className="text-muted-foreground text-sm">{customer.phone}</p>
                      <p className="text-muted-foreground text-sm">{customer.email}</p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Müşteri bilgisi bulunamadı</p>
                  )}
                </div>
              </div>

              <div>
                <Label>Cihaz</Label>
                <div className="mt-1">
                  {device ? (
                    <div>
                      <p className="text-foreground font-medium">{device.brand} {device.model}</p>
                      <p className="text-muted-foreground text-sm">Seri No: {device.serial_number}</p>
                      <p className="text-muted-foreground text-sm">Tip: {device.type}</p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Cihaz bilgisi bulunamadı</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Servis Bilgileri</h2>
            <div className="space-y-4">
              <div>
                <Label>Durum</Label>
                <p className="mt-1">{service.status}</p>
              </div>

              <div>
                <Label>Sorun</Label>
                <p className="mt-1">{service.problem}</p>
              </div>

              {service.diagnosis && (
                <div>
                  <Label>Teşhis</Label>
                  <p className="mt-1">{service.diagnosis}</p>
                </div>
              )}

              {service.solution && (
                <div>
                  <Label>Çözüm</Label>
                  <p className="mt-1">{service.solution}</p>
                </div>
              )}

              <div>
                <Label>Ücret</Label>
                <div className="mt-1">
                  <p className="font-medium">₺{service.price?.toFixed(2) || '0.00'}</p>
                  {totalPartsPrice > 0 && (
                    <p className="text-sm text-muted-foreground">
                      (Parça: ₺{totalPartsPrice.toFixed(2)})
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {parts.length > 0 && (
            <div className="bg-card rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Parça Bilgileri</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-2 text-left">Parça</th>
                      <th className="px-4 py-2 text-left">Kategori</th>
                      <th className="px-4 py-2 text-right">Fiyat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parts.map((part) => (
                      <tr key={part.id} className="border-b">
                        <td className="px-4 py-2">{part.name}</td>
                        <td className="px-4 py-2">{part.category}</td>
                        <td className="px-4 py-2 text-right">₺{part.price.toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr className="font-medium">
                      <td colSpan={2} className="px-4 py-2 text-right">Toplam:</td>
                      <td className="px-4 py-2 text-right">₺{totalPartsPrice.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="bg-card rounded-lg shadow">
          <div className="flex flex-col h-[calc(100vh-8rem)]">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Mesajlar</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={messagesContainerRef}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.is_from_customer ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.is_from_customer
                        ? 'bg-muted text-muted-foreground'
                        : 'bg-primary text-primary-foreground'
                    }`}
                  >
                    <p className="text-sm">{message.message}</p>
                    <p className="text-xs mt-1 opacity-70">
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
            </div>

            <div className="p-4 border-t">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Mesajınızı yazın..."
                  className="flex-1"
                />
                <Button type="submit" disabled={!newMessage.trim()}>
                  Gönder
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
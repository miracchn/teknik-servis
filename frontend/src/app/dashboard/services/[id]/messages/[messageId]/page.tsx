'use client';

import { useEffect, useState } from 'react';
import { services, deviceParts, devices, customers } from '@/lib/api';
import { Service, Device, Customer, DevicePart, ServiceMessage } from '@/types';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';

interface Props {
  params: {
    id: string;
    messageId: string;
  };
}

export default function ServiceMessageDetailPage({ params }: Props) {
  const router = useRouter();
  const [service, setService] = useState<Service | null>(null);
  const [device, setDevice] = useState<Device | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [parts, setParts] = useState<DevicePart[]>([]);
  const [message, setMessage] = useState<ServiceMessage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const serviceData = await services.getById(Number(params.id));
        setService(serviceData);

        const messageData = serviceData.messages?.find(m => m.id === Number(params.messageId)) || null;
        setMessage(messageData);

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
        console.error('Mesaj bilgileri yüklenirken hata oluştu:', error);
        toast.error('Mesaj bilgileri yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id, params.messageId]);

  const handleDelete = async () => {
    if (!service || !message) return;

    if (window.confirm('Bu mesajı silmek istediğinizden emin misiniz?')) {
      try {
        await services.deleteMessage(message.id);
        toast.success('Mesaj başarıyla silindi');
        router.push(`/dashboard/services/${service.id}/messages`);
      } catch (error) {
        console.error('Mesaj silinirken hata oluştu:', error);
        toast.error('Mesaj silinirken bir hata oluştu');
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Yükleniyor...</div>;
  }

  if (!service || !message) {
    return <div className="flex justify-center items-center min-h-screen">Mesaj bulunamadı</div>;
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

        <div className="bg-card rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Mesaj Detayları</h2>
            <Button variant="destructive" onClick={handleDelete}>
              Sil
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <Label>Gönderen</Label>
              <p className="mt-1">
                {message.is_from_customer ? customer?.name || 'Müşteri' : 'Teknisyen'}
              </p>
            </div>

            <div>
              <Label>Tarih</Label>
              <p className="mt-1">
                {new Date(message.created_at).toLocaleString('tr-TR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric'
                })}
              </p>
            </div>

            <div>
              <Label>Mesaj</Label>
              <div className="mt-2 p-4 rounded-lg bg-muted">
                <p className="whitespace-pre-wrap">{message.message}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
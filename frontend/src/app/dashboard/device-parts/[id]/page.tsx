'use client';

import { useEffect, useState } from 'react';
import { deviceParts, devices } from '@/lib/api';
import { Device, DevicePart } from '@/types';
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

export default function DevicePartDetailPage({ params }: Props) {
  const router = useRouter();
  const [part, setPart] = useState<DevicePart | null>(null);
  const [device, setDevice] = useState<Device | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPart, setEditedPart] = useState<Partial<DevicePart>>({
    name: '',
    category: '',
    price: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const partData = await deviceParts.getById(Number(params.id));
        setPart(partData);
        setEditedPart({
          name: partData.name,
          category: partData.category,
          price: partData.price
        });

        if (partData.device_id) {
          const deviceData = await devices.getById(partData.device_id);
          setDevice(deviceData);
        }
      } catch (error) {
        console.error('Parça bilgileri yüklenirken hata oluştu:', error);
        toast.error('Parça bilgileri yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const handleSave = async () => {
    try {
      if (!part) return;

      if (!editedPart.name || !editedPart.category || editedPart.price === undefined) {
        toast.error('Lütfen tüm alanları doldurun');
        return;
      }

      await deviceParts.update(part.id, {
        ...part,
        ...editedPart
      });

      const updatedPart = await deviceParts.getById(part.id);
      setPart(updatedPart);
      setEditedPart({
        name: updatedPart.name,
        category: updatedPart.category,
        price: updatedPart.price
      });
      setIsEditing(false);
      toast.success('Parça başarıyla güncellendi');
    } catch (error) {
      console.error('Parça güncellenirken hata oluştu:', error);
      toast.error('Parça güncellenirken bir hata oluştu');
    }
  };

  const handleDelete = async () => {
    if (!part) return;

    if (window.confirm('Bu parçayı silmek istediğinizden emin misiniz?')) {
      try {
        await deviceParts.delete(part.id);
        toast.success('Parça başarıyla silindi');
        router.push('/dashboard/device-parts');
      } catch (error) {
        console.error('Parça silinirken hata oluştu:', error);
        toast.error('Parça silinirken bir hata oluştu');
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Yükleniyor...</div>;
  }

  if (!part) {
    return <div className="flex justify-center items-center min-h-screen">Parça bulunamadı</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Parça Detayları</h1>
        <div className="space-x-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave}>Kaydet</Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                İptal
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => setIsEditing(true)}>Düzenle</Button>
              <Button variant="destructive" onClick={handleDelete}>
                Sil
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="bg-card rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Cihaz</Label>
            <div className="mt-1">
              {device ? (
                <p className="text-foreground">{device.brand} {device.model}</p>
              ) : (
                <p className="text-muted-foreground">Cihaz bilgisi bulunamadı</p>
              )}
            </div>
          </div>

          <div>
            <Label>Parça Adı</Label>
            {isEditing ? (
              <Input
                value={editedPart.name}
                onChange={(e) => setEditedPart({ ...editedPart, name: e.target.value })}
                className="mt-1"
              />
            ) : (
              <p className="mt-1">{part.name}</p>
            )}
          </div>

          <div>
            <Label>Kategori</Label>
            {isEditing ? (
              <Input
                value={editedPart.category}
                onChange={(e) => setEditedPart({ ...editedPart, category: e.target.value })}
                className="mt-1"
              />
            ) : (
              <p className="mt-1">{part.category}</p>
            )}
          </div>

          <div>
            <Label>Fiyat</Label>
            {isEditing ? (
              <Input
                type="number"
                value={editedPart.price}
                onChange={(e) => setEditedPart({ ...editedPart, price: Number(e.target.value) })}
                className="mt-1"
              />
            ) : (
              <p className="mt-1">₺{part.price.toFixed(2)}</p>
            )}
          </div>

          <div>
            <Label>Oluşturulma Tarihi</Label>
            <p className="mt-1">
              {new Date(part.created_at).toLocaleDateString('tr-TR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
              })}
            </p>
          </div>

          <div>
            <Label>Son Güncelleme</Label>
            <p className="mt-1">
              {new Date(part.updated_at).toLocaleDateString('tr-TR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 
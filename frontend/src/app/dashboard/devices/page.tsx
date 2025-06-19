'use client';

import { useEffect, useState } from 'react';
import { devices, deviceParts } from '@/lib/api';
import { Device, DevicePart } from '@/types';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { ChevronDown, ChevronUp, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';

interface DeviceWithParts extends Device {
  parts?: {
    [category: string]: {
      id: number;
      name: string;
      price: number;
    }[];
  };
}

export default function DevicesPage() {
  const [deviceList, setDeviceList] = useState<DeviceWithParts[]>([]);
  const [filteredDevices, setFilteredDevices] = useState<DeviceWithParts[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'brand' | 'model' | 'type'>('brand');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [expandedDevices, setExpandedDevices] = useState<number[]>([]);
  const [deleteDeviceId, setDeleteDeviceId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [forceDelete, setForceDelete] = useState(false);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        setLoading(true);
        const data = await devices.getAll();
        
        const devicesWithParts = await Promise.all(
          data.map(async (device: Device) => {
            try {
              const parts = await deviceParts.getForDevice(device.id);
              console.log(`Device ${device.id} parts:`, parts);
              
              const groupedParts = parts.reduce<{ [key: string]: { id: number; name: string; price: number; }[] }>((acc, part: DevicePart) => {
                const category = part.category || 'Diğer';
                if (!acc[category]) {
                  acc[category] = [];
                }
                acc[category].push({
                  id: part.id,
                  name: part.name,
                  price: part.price
                });
                return acc;
              }, {});

              console.log(`Device ${device.id} grouped parts:`, groupedParts);

              return {
                ...device,
                parts: groupedParts
              } as DeviceWithParts;
            } catch (error) {
              console.error(`Could not fetch parts for device ${device.id}:`, error);
              return {
                ...device,
                parts: {}
              } as DeviceWithParts;
            }
          })
        );
        
        console.log('Devices with parts:', devicesWithParts);
        setDeviceList(devicesWithParts);
        setFilteredDevices(devicesWithParts);
      } catch (error) {
        console.error('Error loading devices:', error);
        toast.error('Cihazlar yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, []);

  useEffect(() => {
    let filtered = [...deviceList];

    if (searchTerm) {
      filtered = filtered.filter(device =>
        device.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        device.serial_number?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      const aValue = a[sortBy].toLowerCase();
      const bValue = b[sortBy].toLowerCase();
      
      if (sortOrder === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

    setFilteredDevices(filtered);
  }, [deviceList, searchTerm, sortBy, sortOrder]);

  const handleDelete = (id: number) => {
    setDeleteDeviceId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deleteDeviceId) return;

    try {
      setLoading(true);
      if (forceDelete) {
        await devices.deleteWithServices(deleteDeviceId);
        toast.success('Cihaz ve tüm servis kayıtları başarıyla silindi');
      } else {
        await devices.delete(deleteDeviceId);
        toast.success('Cihaz başarıyla silindi');
      }
      setDeviceList(deviceList.filter(device => device.id !== deleteDeviceId));
    } catch (error) {
      console.error('Cihaz silinirken hata oluştu:', error);
      const errorMessage = error instanceof Error ? error.message : 'Cihaz silinirken bir hata oluştu';
      
      if (errorMessage.includes('aktif servis kayıtları')) {
        toast.error(errorMessage + ' Tüm servis kayıtlarıyla birlikte silmek ister misiniz?');
        setForceDelete(true);
        return;
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
      setDeleteDeviceId(null);
      setForceDelete(false);
    }
  };

  const toggleExpand = (deviceId: number) => {
    setExpandedDevices(expandedDevices.includes(deviceId) 
      ? expandedDevices.filter(id => id !== deviceId) 
      : [...expandedDevices, deviceId]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="text-center">
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Cihazlar</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Sistemdeki tüm cihazların listesi
            </p>
          </div>
          <Link href="/dashboard/devices/new">
            <Button>Yeni Cihaz</Button>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Marka, model veya tür ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sıralama" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="brand">Marka</SelectItem>
                <SelectItem value="model">Model</SelectItem>
                <SelectItem value="type">Tür</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDevices.map((device) => (
            <Card key={device.id} className="overflow-hidden">
              <CardHeader className="space-y-1">
                <CardTitle className="flex items-center justify-between">
                  <span className="text-lg font-semibold">{device.brand} {device.model}</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleExpand(device.id)}
                    >
                      {expandedDevices.includes(device.id) ? 
                        <EyeOff className="h-4 w-4" /> : 
                        <Eye className="h-4 w-4" />
                      }
                    </Button>
                    <Link href={`/dashboard/devices/${device.id}`}>
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(device.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  <p>Tür: {device.type}</p>
                  <p>Seri No: {device.serial_number || '-'}</p>
                </div>
              </CardHeader>
              {expandedDevices.includes(device.id) && (
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    {device.parts && Object.keys(device.parts).length > 0 ? (
                      Object.entries(device.parts).map(([category, parts]) => (
                      <div key={category} className="space-y-2">
                        <h4 className="font-medium text-sm">{category}</h4>
                        <div className="space-y-1">
                            {parts && parts.length > 0 ? (
                              parts.map((part) => (
                            <div key={part.id} className="flex justify-between text-sm">
                              <span className="text-muted-foreground">{part.name}</span>
                              <span className="font-medium">₺{part.price.toFixed(2)}</span>
                            </div>
                              ))
                            ) : (
                              <p className="text-sm text-muted-foreground">Bu kategoride parça yok</p>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-2">
                        Henüz parça bilgisi eklenmemiş
                      </p>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {filteredDevices.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Cihaz bulunamadı</p>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setDeleteDeviceId(null);
          setForceDelete(false);
        }}
        onConfirm={confirmDelete}
        title={forceDelete ? "Cihazı Tüm Kayıtlarıyla Sil" : "Cihazı Sil"}
        description={forceDelete 
          ? "Bu cihazı tüm servis kayıtları ve mesajlarıyla birlikte silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!" 
          : "Bu cihazı silmek istediğinizden emin misiniz? Aktif servis kayıtları varsa önce onları silmeniz gerekir."
        }
        confirmText={forceDelete ? "Tümünü Sil" : "Sil"}
        cancelText="İptal"
        loading={loading}
        variant="destructive"
      />
    </div>
  );
} 
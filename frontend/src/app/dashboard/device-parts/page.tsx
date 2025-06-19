'use client';

import { useEffect, useState } from 'react';
import { deviceParts, devices } from '@/lib/api';
import { Device, DevicePart } from '@/types';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

export default function DevicePartsPage() {
  const [parts, setParts] = useState<DevicePart[]>([]);
  const [deviceList, setDeviceList] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPart, setNewPart] = useState<Partial<DevicePart>>({
    name: '',
    category: '',
    device_id: undefined,
    price: 0
  });
  const [editingPart, setEditingPart] = useState<DevicePart | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterDevice, setFilterDevice] = useState<number | ''>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [partsData, devicesData] = await Promise.all([
          deviceParts.getAll(),
          devices.getAll()
        ]);
        setParts(partsData);
        setDeviceList(devicesData);
      } catch (error) {
        console.error('Veriler yüklenirken hata oluştu:', error);
        toast.error('Veriler yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!newPart.name || !newPart.category || !newPart.device_id || newPart.price === undefined) {
        toast.error('Lütfen tüm alanları doldurun');
        return;
      }

      if (editingPart) {
        await deviceParts.update(editingPart.id, {
          ...newPart,
          price: Number(newPart.price)
        } as DevicePart);
        toast.success('Parça başarıyla güncellendi');
      } else {
        await deviceParts.create({
          ...newPart,
          price: Number(newPart.price)
        } as DevicePart);
        toast.success('Parça başarıyla eklendi');
      }

      const updatedParts = await deviceParts.getAll();
      setParts(updatedParts);
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Parça kaydedilirken hata oluştu:', error);
      toast.error('Parça kaydedilirken bir hata oluştu');
    }
  };

  const handleEdit = (part: DevicePart) => {
    setEditingPart(part);
    setNewPart({
      name: part.name,
      category: part.category,
      device_id: part.device_id,
      price: part.price
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Bu parçayı silmek istediğinizden emin misiniz?')) {
      try {
        await deviceParts.delete(id);
        const updatedParts = await deviceParts.getAll();
        setParts(updatedParts);
        toast.success('Parça başarıyla silindi');
      } catch (error) {
        console.error('Parça silinirken hata oluştu:', error);
        toast.error('Parça silinirken bir hata oluştu');
      }
    }
  };

  const resetForm = () => {
    setNewPart({
      name: '',
      category: '',
      device_id: undefined,
      price: 0
    });
    setEditingPart(null);
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const filteredParts = parts.filter(part => {
    const matchesSearch = part.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || part.category === filterCategory;
    const matchesDevice = !filterDevice || part.device_id === Number(filterDevice);
    return matchesSearch && matchesCategory && matchesDevice;
  });

  const categories = Array.from(new Set(parts.map(part => part.category)));

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Yükleniyor...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Cihaz Parçaları</h1>
        <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>
              Yeni Parça Ekle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingPart ? 'Parça Düzenle' : 'Yeni Parça Ekle'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="device">Cihaz</Label>
                <Select
                  value={newPart.device_id?.toString()}
                  onValueChange={(value) => setNewPart({ ...newPart, device_id: Number(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Cihaz seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {deviceList.map((device) => (
                      <SelectItem key={device.id} value={device.id.toString()}>
                        {device.brand} {device.model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Parça Adı</Label>
                <Input
                  id="name"
                  value={newPart.name}
                  onChange={(e) => setNewPart({ ...newPart, name: e.target.value })}
                  placeholder="Parça adını girin"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Kategori</Label>
                <Input
                  id="category"
                  value={newPart.category}
                  onChange={(e) => setNewPart({ ...newPart, category: e.target.value })}
                  placeholder="Kategori girin"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Fiyat</Label>
                <Input
                  id="price"
                  type="number"
                  value={newPart.price}
                  onChange={(e) => setNewPart({ ...newPart, price: Number(e.target.value) })}
                  placeholder="Fiyat girin"
                />
              </div>
              <Button type="submit" className="w-full">
                {editingPart ? 'Güncelle' : 'Ekle'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          placeholder="Parça ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:w-1/3"
        />
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="md:w-1/3">
            <SelectValue placeholder="Kategoriye göre filtrele" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tüm Kategoriler</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterDevice.toString()} onValueChange={(value) => setFilterDevice(value ? Number(value) : '')}>
          <SelectTrigger className="md:w-1/3">
            <SelectValue placeholder="Cihaza göre filtrele" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Tüm Cihazlar</SelectItem>
            {deviceList.map((device) => (
              <SelectItem key={device.id} value={device.id.toString()}>
                {device.brand} {device.model}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card rounded-lg shadow">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="px-6 py-3 text-left">Cihaz</th>
                <th className="px-6 py-3 text-left">Parça Adı</th>
                <th className="px-6 py-3 text-left">Kategori</th>
                <th className="px-6 py-3 text-left">Fiyat</th>
                <th className="px-6 py-3 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredParts.map((part) => {
                const device = deviceList.find(d => d.id === part.device_id);
                return (
                  <tr key={part.id} className="border-b">
                    <td className="px-6 py-4">
                      {device ? `${device.brand} ${device.model}` : 'Bilinmeyen Cihaz'}
                    </td>
                    <td className="px-6 py-4">{part.name}</td>
                    <td className="px-6 py-4">{part.category}</td>
                    <td className="px-6 py-4">₺{part.price.toFixed(2)}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(part)}
                      >
                        Düzenle
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(part.id)}
                      >
                        Sil
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 
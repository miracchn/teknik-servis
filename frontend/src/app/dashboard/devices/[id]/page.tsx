'use client';

import { useEffect, useState } from 'react';
import { devices, deviceParts } from '@/lib/api';
import { Device, DevicePart } from '@/types';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

interface DeviceFormData {
  type: string;
  brand: string;
  model: string;
  serial_number?: string;
}

interface PartForm {
  name: string;
  category: string;
  price: number;
}

interface PartPrice {
  id: number;
  partName: string;
  price: number;
}

interface GroupedPrices {
  [category: string]: PartPrice[];
}

interface EditPriceModalProps {
  isOpen: boolean;
  closeModal: () => void;
  currentPrice: number;
  onSave: (newPrice: number) => Promise<void>;
}

function EditPriceModal({ isOpen, closeModal, currentPrice, onSave }: EditPriceModalProps) {
  const [price, setPrice] = useState(currentPrice);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await onSave(price);
      closeModal();
    } catch (error) {
      console.error('Fiyat güncellenirken hata:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Parça Fiyatını Düzenle</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="price">Fiyat</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value))}
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={closeModal}>
              İptal
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function EditDevicePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [device, setDevice] = useState<Device | null>(null);
  const [formData, setFormData] = useState<DeviceFormData>({
    type: '',
    brand: '',
    model: '',
    serial_number: ''
  });
  const [partFormData, setPartFormData] = useState<PartForm>({
    name: '',
    category: '',
    price: 0
  });
  const [prices, setPrices] = useState<GroupedPrices>({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPriceId, setSelectedPriceId] = useState<number | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<number>(0);
  const [deletePartId, setDeletePartId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchDevice = async () => {
      try {
        const deviceData = await devices.getById(Number(params.id));
        setDevice(deviceData);
        setFormData({
          type: deviceData.type,
          brand: deviceData.brand,
          model: deviceData.model,
          serial_number: deviceData.serial_number || ''
        });
        const pricesData = await deviceParts.getPricesForDevice(Number(params.id));
        setPrices(pricesData);
      } catch (error) {
        console.error('Cihaz yüklenirken hata oluştu:', error);
        toast.error('Cihaz yüklenirken bir hata oluştu');
      }
    };

    fetchDevice();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type || !formData.brand || !formData.model) {
      toast.error('Lütfen gerekli alanları doldurun');
      return;
    }

    try {
      setLoading(true);
      await devices.update(Number(params.id), formData);
      toast.success('Cihaz başarıyla güncellendi');
      router.push('/dashboard/devices');
    } catch (error) {
      console.error('Cihaz güncellenirken hata oluştu:', error);
      toast.error('Cihaz güncellenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePartSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!partFormData.name || !partFormData.category || partFormData.price <= 0) {
      toast.error('Lütfen tüm parça bilgilerini doldurun');
      return;
    }

    try {
      setLoading(true);
      await deviceParts.create({
        device_id: Number(params.id),
        name: partFormData.name,
        category: partFormData.category,
        price: partFormData.price
      });

      const updatedPrices = await deviceParts.getPricesForDevice(Number(params.id));
      setPrices(updatedPrices);
      
      setPartFormData({
        name: '',
        category: '',
        price: 0
      });
      
      toast.success('Parça başarıyla eklendi');
    } catch (error: any) {
      console.error('Parça eklenirken hata oluştu:', error);
      toast.error(error.response?.data?.error || 'Parça eklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handlePartChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPartFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value
    }));
  };

  const handleDeletePart = async (partId: number) => {
    setDeletePartId(partId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deletePartId) return;

    try {
      setLoading(true);
      await deviceParts.delete(deletePartId);
      const updatedPrices = await deviceParts.getPricesForDevice(Number(params.id));
      setPrices(updatedPrices);
      toast.success('Parça başarıyla silindi');
    } catch (error: any) {
      console.error('Parça silinirken hata oluştu:', error);
      toast.error(error.response?.data?.error || 'Parça silinirken bir hata oluştu');
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
      setDeletePartId(null);
    }
  };

  const handleUpdatePart = async (partId: number, currentPrice: number) => {
    setSelectedPriceId(partId);
    setSelectedPrice(currentPrice);
    setIsEditModalOpen(true);
  };

  const handleSavePart = async (newPrice: number) => {
    if (!selectedPriceId) return;

    try {
      setLoading(true);
      await deviceParts.update(selectedPriceId, { price: newPrice });
      const updatedPrices = await deviceParts.getPricesForDevice(Number(params.id));
      setPrices(updatedPrices);
      toast.success('Parça fiyatı başarıyla güncellendi');
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Parça güncellenirken hata oluştu:', error);
      toast.error('Parça güncellenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (!device) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="text-center">
          <p className="text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-foreground">Cihaz Düzenle</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Cihaz bilgilerini güncellemek için aşağıdaki formu kullanın.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-foreground">
                Cihaz Türü
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md border-0 bg-background py-1.5 text-foreground shadow-sm ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="brand" className="block text-sm font-medium text-foreground">
                Marka
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md border-0 bg-background py-1.5 text-foreground shadow-sm ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="model" className="block text-sm font-medium text-foreground">
                Model
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="model"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  required
                  className="block w-full rounded-md border-0 bg-background py-1.5 text-foreground shadow-sm ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="serial_number" className="block text-sm font-medium text-foreground">
                Seri Numarası
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="serial_number"
                  name="serial_number"
                  value={formData.serial_number || ''}
                  onChange={handleChange}
                  className="block w-full rounded-md border-0 bg-background py-1.5 text-foreground shadow-sm ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="button"
              onClick={() => router.back()}
              className="text-sm font-semibold text-muted-foreground hover:text-foreground"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {loading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </form>

        <div className="mt-16">
          <h2 className="text-xl font-semibold text-foreground">Parça Fiyatları</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Bu cihaz için parça fiyatlarını görüntüleyin ve yönetin.
          </p>

          <div className="mt-6">
            <div className="rounded-lg border border-border bg-card">
              <div className="p-6">
                <h3 className="text-lg font-medium text-card-foreground">Yeni Parça Ekle</h3>
                <form onSubmit={handlePartSubmit} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-foreground">
                      Kategori
                    </label>
                    <input
                      type="text"
                      id="category"
                      name="category"
                      value={partFormData.category}
                      onChange={handlePartChange}
                      placeholder="Ekran, Batarya, vs."
                      required
                      className="mt-1 block w-full rounded-md border-0 bg-background py-1.5 text-foreground shadow-sm ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                    />
                  </div>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground">
                      Parça Adı
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={partFormData.name}
                      onChange={handlePartChange}
                      placeholder="İç Cam, Dış Cam, vs."
                      required
                      className="mt-1 block w-full rounded-md border-0 bg-background py-1.5 text-foreground shadow-sm ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                    />
                  </div>
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-foreground">
                      Fiyat (TL)
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={partFormData.price}
                      onChange={handlePartChange}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                      className="mt-1 block w-full rounded-md border-0 bg-background py-1.5 text-foreground shadow-sm ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                    />
                  </div>
                  <div className="sm:col-span-3 flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    >
                      {loading ? 'Ekleniyor...' : 'Parça Ekle'}
                    </button>
                  </div>
                </form>
              </div>

              {Object.entries(prices).length > 0 ? (
                <div className="border-t border-border">
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-card-foreground mb-4">Mevcut Parçalar</h3>
                    <div className="space-y-6">
                      {Object.entries(prices).map(([category, parts]) => (
                        <div key={category} className="rounded-lg border border-border bg-background p-4">
                          <h4 className="text-sm font-medium text-foreground mb-2">{category}</h4>
                          <div className="space-y-2">
                            {parts.map((part) => (
                              <div key={part.id} className="flex justify-between items-center text-sm bg-card p-2 rounded-md">
                                <span className="text-foreground">{part.partName}</span>
                                <div className="flex items-center gap-4">
                                  <span className="text-muted-foreground">{part.price.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' })}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdatePart(part.id, part.price)}
                                    className="text-primary hover:text-primary/80"
                                  >
                                    Düzenle
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeletePart(part.id)}
                                    className="text-destructive hover:text-destructive/80"
                                  >
                                    Sil
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="border-t border-border p-6">
                  <p className="text-center text-muted-foreground">Henüz parça fiyatı eklenmemiş.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <EditPriceModal
        isOpen={isEditModalOpen}
        closeModal={() => setIsEditModalOpen(false)}
        currentPrice={selectedPrice}
        onSave={handleSavePart}
      />

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setDeletePartId(null);
        }}
        onConfirm={confirmDelete}
        title="Parçayı Sil"
        description="Bu parçayı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
        confirmText="Sil"
        cancelText="İptal"
        loading={loading}
        variant="destructive"
      />
    </div>
  );
} 
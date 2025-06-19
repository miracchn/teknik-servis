'use client';

import { useEffect, useState } from 'react';
import { customers } from '@/lib/api';
import { Customer } from '@/types';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Phone, Mail, MapPin, Pencil, Trash2, History } from 'lucide-react';

export default function CustomersPage() {
  const [loading, setLoading] = useState(true);
  const [customerList, setCustomerList] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteCustomerId, setDeleteCustomerId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [forceDelete, setForceDelete] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const data = await customers.getAll();
      setCustomerList(data);
    } catch (error) {
      console.error('Müşteriler yüklenirken hata:', error);
      toast.error('Müşteriler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    setDeleteCustomerId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deleteCustomerId) return;

    try {
      setLoading(true);
      if (forceDelete) {
        await customers.deleteWithServices(deleteCustomerId);
        toast.success('Müşteri ve tüm servis kayıtları başarıyla silindi');
      } else {
        await customers.delete(deleteCustomerId);
        toast.success('Müşteri başarıyla silindi');
      }
      await fetchCustomers();
    } catch (error) {
      console.error('Müşteri silinirken hata:', error);
      const errorMessage = error instanceof Error ? error.message : 'Müşteri silinirken bir hata oluştu';
      
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
      setDeleteCustomerId(null);
      setForceDelete(false);
    }
  };

  const filteredCustomers = customerList.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <h1 className="text-2xl font-semibold text-foreground">Müşteriler</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Sistemdeki tüm müşterilerin listesi
            </p>
          </div>
          <Link href="/dashboard/customers/new">
            <Button>Yeni Müşteri</Button>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Müşteri adı, telefon veya e-posta ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((customer) => (
            <Card 
              key={customer.id} 
              className="group hover-card-effect"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1.5">
                    <CardTitle className="text-lg font-semibold link-hover-effect">
                      {customer.name}
                    </CardTitle>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Phone className="h-4 w-4 mr-2" />
                      <a href={`tel:${customer.phone}`} className="link-hover-effect">
                        {customer.phone}
                      </a>
                    </div>
                    {customer.email && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Mail className="h-4 w-4 mr-2" />
                        <a href={`mailto:${customer.email}`} className="link-hover-effect">
                          {customer.email}
                        </a>
                      </div>
                    )}
                    <div className="flex items-start text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2 mt-1 shrink-0" />
                      <span>{customer.address || 'Adres belirtilmemiş'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      className="icon-button-hover-effect card-action-button"
                    >
                      <Link href={`/dashboard/services?customer=${customer.id}`}>
                        <History className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      className="icon-button-hover-effect card-action-button"
                    >
                      <Link href={`/dashboard/customers/${customer.id}`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(customer.id)}
                      className="delete-button-hover card-action-button"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Müşteri bulunamadı</p>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setDeleteCustomerId(null);
          setForceDelete(false);
        }}
        onConfirm={confirmDelete}
        title={forceDelete ? "Müşteriyi Tüm Kayıtlarıyla Sil" : "Müşteriyi Sil"}
        description={forceDelete 
          ? "Bu müşteriyi tüm servis kayıtları ve mesajlarıyla birlikte silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!" 
          : "Bu müşteriyi silmek istediğinizden emin misiniz? Aktif servis kayıtları varsa önce onları silmeniz gerekir."
        }
        confirmText={forceDelete ? "Tümünü Sil" : "Sil"}
        cancelText="İptal"
        loading={loading}
        variant="destructive"
      />
    </div>
  );
} 
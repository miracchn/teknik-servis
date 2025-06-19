'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { customers } from '@/lib/api';
import { Customer } from '@/types';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface CustomerForm {
  name: string;
  phone: string;
  email?: string;
  address?: string;
}

export default function EditCustomerPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CustomerForm>();

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setLoading(true);
        const customer = await customers.getById(parseInt(params.id));
        reset({
          name: customer.name || '',
          phone: customer.phone || '',
          email: customer.email || '',
          address: customer.address || '',
        });
      } catch (error) {
        console.error('Müşteri bilgileri yüklenirken hata oluştu:', error);
        toast.error('Müşteri bilgileri yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [params.id, reset]);

  const onSubmit = async (data: CustomerForm) => {
    try {
      setSaving(true);
      await customers.update(parseInt(params.id), data);
      toast.success('Müşteri başarıyla güncellendi');
      router.push('/dashboard/customers');
    } catch (error) {
      console.error('Müşteri güncellenirken hata oluştu:', error);
      toast.error('Müşteri güncellenirken bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-12 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-foreground">Müşteri Düzenle</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Müşteri bilgilerini güncellemek için aşağıdaki formu kullanın.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground">
                Ad Soyad
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="name"
                  {...register('name', { required: 'Ad Soyad gerekli' })}
                  className="block w-full rounded-md border-0 bg-background py-1.5 text-foreground shadow-sm ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-destructive">{errors.name.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-foreground">
                Telefon
              </label>
              <div className="mt-2">
                <input
                  type="tel"
                  id="phone"
                  {...register('phone', { required: 'Telefon gerekli' })}
                  className="block w-full rounded-md border-0 bg-background py-1.5 text-foreground shadow-sm ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                />
                {errors.phone && (
                  <p className="mt-2 text-sm text-destructive">{errors.phone.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                Email
              </label>
              <div className="mt-2">
                <input
                  type="email"
                  id="email"
                  {...register('email')}
                  className="block w-full rounded-md border-0 bg-background py-1.5 text-foreground shadow-sm ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-foreground">
                Adres
              </label>
              <div className="mt-2">
                <textarea
                  id="address"
                  rows={3}
                  {...register('address')}
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
              disabled={saving}
              className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 
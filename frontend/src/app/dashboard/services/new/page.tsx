'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { services, customers, devices, handleAuthError } from '@/lib/api';
import { Customer, Device } from '@/types';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ServiceFormData {
  customer_id: number;
  device_id: number;
  problem: string;
}

export default function NewServicePage() {
  const [loading, setLoading] = useState(false);
  const [customerList, setCustomerList] = useState<Customer[]>([]);
  const [deviceList, setDeviceList] = useState<Device[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const router = useRouter();
  const { user, loading: authLoading, clearInvalidAuth } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<ServiceFormData>();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user || authLoading) return;

    const fetchData = async () => {
      try {
        const [customersData, devicesData] = await Promise.all([
          customers.getAll(),
          devices.getAll(),
        ]);
        setCustomerList(customersData);
        setDeviceList(devicesData);
      } catch (error) {
        console.error('Veriler yüklenirken hata oluştu:', error);
        toast.error('Veriler yüklenirken bir hata oluştu');
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [user, authLoading]);

  const onSubmit = async (data: ServiceFormData) => {
    if (!user) {
      toast.error('Oturum açmanız gerekiyor');
      router.push('/login');
      return;
    }

    console.log('Form data received:', data);
    console.log('Current user:', user);
    console.log('User ID:', user.id, 'Type:', typeof user.id);

    try {
      setLoading(true);
      
      const serviceData = {
        customer_id: Number(data.customer_id),
        device_id: Number(data.device_id),
        problem: data.problem.trim(),
        technician_id: Number(user.id),
        status: 'BEKLEMEDE'
      };
      
      console.log('Service data to be sent:', serviceData);
      console.log('Data types and values:', {
        customer_id: typeof serviceData.customer_id + ' - ' + serviceData.customer_id,
        device_id: typeof serviceData.device_id + ' - ' + serviceData.device_id,
        problem: typeof serviceData.problem + ' - length: ' + serviceData.problem.length,
        technician_id: typeof serviceData.technician_id + ' - ' + serviceData.technician_id,
        status: typeof serviceData.status + ' - ' + serviceData.status
      });
      
      if (!serviceData.customer_id || isNaN(serviceData.customer_id) || serviceData.customer_id <= 0) {
        toast.error('Geçerli bir müşteri seçin');
        return;
      }
      
      if (!serviceData.device_id || isNaN(serviceData.device_id) || serviceData.device_id <= 0) {
        toast.error('Geçerli bir cihaz seçin');
        return;
      }

      if (!serviceData.technician_id || isNaN(serviceData.technician_id) || serviceData.technician_id <= 0) {
        toast.error('Teknisyen bilgisi hatalı, lütfen tekrar giriş yapın');
        return;
      }
      
      if (!serviceData.problem || serviceData.problem.length === 0) {
        toast.error('Problem açıklaması gerekli');
        return;
      }
      
      console.log('All validations passed, calling API...');
      
      await services.create(serviceData);
      toast.success('Servis kaydı başarıyla oluşturuldu');
      router.push('/dashboard/services');
    } catch (error) {
      console.error('Servis kaydı oluşturulurken hata oluştu:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      
      if (handleAuthError(error, clearInvalidAuth)) {
        toast.error('Oturum verileriniz geçersiz. Lütfen tekrar giriş yapın.');
        router.push('/login');
        return;
      }
      
      if (error instanceof Error) {
        if (error.message.includes('invalid input syntax')) {
          toast.error('Veri formatı hatalı. Lütfen tüm alanları doğru doldurun.');
        } else if (error.message.includes('violates not-null constraint')) {
          toast.error('Gerekli alanlar eksik. Lütfen tüm alanları doldurun.');
        } else {
          toast.error(error.message);
        }
      } else {
      toast.error('Servis kaydı oluşturulurken bir hata oluştu');
      }
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (loadingData) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-foreground">Yeni Servis Kaydı</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Yeni bir servis kaydı oluşturmak için aşağıdaki formu doldurun.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
            <div>
              <label htmlFor="customer_id" className="block text-sm font-medium text-foreground">
                Müşteri
              </label>
              <div className="mt-2">
                <select
                  id="customer_id"
                  {...register('customer_id', { 
                    required: 'Müşteri seçimi gerekli',
                    valueAsNumber: true
                  })}
                  className="block w-full rounded-md border-0 bg-background py-1.5 text-foreground shadow-sm ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                >
                  <option value="">Müşteri Seçin</option>
                  {customerList.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
                {errors.customer_id && (
                  <p className="mt-2 text-sm text-destructive">{errors.customer_id.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="device_id" className="block text-sm font-medium text-foreground">
                Cihaz
              </label>
              <div className="mt-2">
                <select
                  id="device_id"
                  {...register('device_id', { 
                    required: 'Cihaz seçimi gerekli',
                    valueAsNumber: true
                  })}
                  className="block w-full rounded-md border-0 bg-background py-1.5 text-foreground shadow-sm ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                >
                  <option value="">Cihaz Seçin</option>
                  {deviceList.map((device) => (
                    <option key={device.id} value={device.id}>
                      {device.brand} {device.model}
                    </option>
                  ))}
                </select>
                {errors.device_id && (
                  <p className="mt-2 text-sm text-destructive">{errors.device_id.message}</p>
                )}
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="problem" className="block text-sm font-medium text-foreground">
                Problem
              </label>
              <div className="mt-2">
                <textarea
                  id="problem"
                  rows={3}
                  {...register('problem', { required: 'Problem açıklaması gerekli' })}
                  className="block w-full rounded-md border-0 bg-background py-1.5 text-foreground shadow-sm ring-1 ring-inset ring-border placeholder:text-muted-foreground focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6"
                />
                {errors.problem && (
                  <p className="mt-2 text-sm text-destructive">{errors.problem.message}</p>
                )}
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
      </div>
    </div>
  );
}
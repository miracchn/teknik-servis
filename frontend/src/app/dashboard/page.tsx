'use client';

import { useEffect, useState } from 'react';
import { services, customers, devices } from '@/lib/api';
import { Service, Customer, Device } from '@/types';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Smartphone, Wrench, Clock, ArrowRight } from 'lucide-react';

interface DashboardStats {
  totalCustomers: number;
  totalDevices: number;
  activeServices: number;
  completedServices: number;
}

interface RecentService extends Service {
  customer: Customer;
  device: Device;
}

const STATUS_COLORS = {
  'BEKLEMEDE': 'text-yellow-500',
  'INCELEMEDE': 'text-blue-500',
  'TAMIR_EDILDI': 'text-green-500',
  'TESLIM_EDILDI': 'text-purple-500',
  'IPTAL': 'text-red-500'
};

const STATUS_LABELS = {
  'BEKLEMEDE': 'Beklemede',
  'INCELEMEDE': 'İncelemede',
  'TAMIR_EDILDI': 'Tamir Edildi',
  'TESLIM_EDILDI': 'Teslim Edildi',
  'IPTAL': 'İptal'
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    totalDevices: 0,
    activeServices: 0,
    completedServices: 0
  });
  const [recentServices, setRecentServices] = useState<RecentService[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [customerData, deviceData, serviceData] = await Promise.all([
        customers.getAll(),
        devices.getAll(),
        services.getAll()
      ]);

      const activeServices = serviceData.filter(s => s.status !== 'TESLIM_EDILDI' && s.status !== 'IPTAL').length;
      const completedServices = serviceData.filter(s => s.status === 'TESLIM_EDILDI').length;

      setStats({
        totalCustomers: customerData.length,
        totalDevices: deviceData.length,
        activeServices,
        completedServices
      });

      setRecentServices(serviceData.slice(0, 5));
    } catch (error) {
      console.error('Dashboard verileri yüklenirken hata:', error);
      toast.error('Veriler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    return STATUS_COLORS[status as keyof typeof STATUS_COLORS] || 'text-muted-foreground';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Teknik servis sistemi genel durumu
          </p>
        </div>

        {/* İstatistikler */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Toplam Müşteri</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Toplam Cihaz</CardTitle>
              <Smartphone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDevices}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Aktif Servisler</CardTitle>
              <Wrench className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeServices}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tamamlanan Servisler</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedServices}</div>
            </CardContent>
          </Card>
        </div>

        {/* Son Servisler */}
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Son Servis Kayıtları</CardTitle>
              <Link href="/dashboard/services">
                <Button variant="ghost" size="sm" className="gap-2">
                  Tümünü Gör
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recentServices.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{service.customer.name}</span>
                        <span className="text-sm text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">
                          {service.device.brand} {service.device.model}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {service.problem}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(service.created_at)}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-sm font-medium ${getStatusColor(service.status)}`}>
                        {STATUS_LABELS[service.status as keyof typeof STATUS_LABELS]}
                      </span>
                      <Link href={`/dashboard/services/${service.id}`}>
                        <Button variant="ghost" size="icon">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}

                {recentServices.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">Henüz servis kaydı bulunmuyor</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 
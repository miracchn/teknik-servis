'use client';

import { useState } from 'react';
import { services } from '@/lib/api';
import { Service } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SearchIcon } from 'lucide-react';


const STATUS_COLORS = {
  'BEKLEMEDE': 'bg-amber-500 hover:bg-amber-600',
  'INCELEMEDE': 'bg-blue-500 hover:bg-blue-600',
  'TAMIR_EDILDI': 'bg-emerald-500 hover:bg-emerald-600',
  'TESLIM_EDILDI': 'bg-violet-500 hover:bg-violet-600',
  'IPTAL': 'bg-rose-500 hover:bg-rose-600'
};

const STATUS_TEXT = {
  'BEKLEMEDE': 'Beklemede',
  'INCELEMEDE': 'İncelemede',
  'TAMIR_EDILDI': 'Tamir Edildi',
  'TESLIM_EDILDI': 'Teslim Edildi',
  'IPTAL': 'İptal'
};

export default function StatusPage() {
  const [phone, setPhone] = useState('');
  const [searchResults, setSearchResults] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.startsWith('0') ? cleaned.substring(1) : cleaned;
  };

  const getStatusColor = (status: string) => {
    return STATUS_COLORS[status as keyof typeof STATUS_COLORS] || 'bg-gray-500';
  };

  const getStatusText = (status: string) => {
    return STATUS_TEXT[status as keyof typeof STATUS_TEXT] || status;
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;

    try {
      setLoading(true);
      const formattedPhone = formatPhoneNumber(phone.trim());
      const results = await services.getByPhone(formattedPhone);
      
      const sortedResults = results.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      
      setSearchResults(sortedResults);
      
      if (results.length === 0) {
        toast.error('Bu telefon numarasına ait servis kaydı bulunamadı');
      }
    } catch (error) {
      console.error('Servis kayıtları aranırken hata oluştu:', error);
      toast.error('Servis kayıtları aranırken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              Servis Durumu Sorgula
            </h1>
            <p className="text-muted-foreground text-lg">
              Cihazınızın servis durumunu öğrenmek için telefon numaranızı girin
            </p>
          </div>

          <Card className="mb-8 shadow-sm">
            <CardHeader>
              <CardTitle>Telefon Numarası ile Sorgula</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <div>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="05XX XXX XX XX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full focus-visible:ring-primary"
                  />
                  <p className="mt-2 text-sm text-muted-foreground">
                    Örnek format: 0534 649 67 48
                  </p>
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Aranıyor...' : (
                    <span className="flex items-center gap-2">
                      <SearchIcon className="h-4 w-4" /> Sorgula
                    </span>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {searchResults.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Servis Kayıtları</h2>
              <div className="grid gap-4">
                {searchResults.map((service) => (
                  <Link
                    key={service.id}
                    href={`/status/${service.id}`}
                    className="block"
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="space-y-2">
                            <h3 className="text-xl font-semibold">
                              {service.device?.brand} {service.device?.model}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              Servis No: #{service.id}
                            </p>
                            <Badge className={`${getStatusColor(service.status)} text-white font-medium`}>
                              {getStatusText(service.status)}
                            </Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(service.created_at).toLocaleDateString('tr-TR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                        <div className="mt-4">
                          <p className="text-card-foreground">{service.problem}</p>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <span className="text-primary font-medium hover:underline transition-colors">
                            Detayları Görüntüle →
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 
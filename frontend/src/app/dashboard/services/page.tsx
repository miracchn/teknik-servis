'use client';

import { useEffect, useState } from 'react';
import { services } from '@/lib/api';
import { Service, Customer, Device } from '@/types';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { 
  Wrench, Phone, Smartphone, User, Calendar, Pencil, Trash2, AlertCircle,
  Filter, ArrowUpDown, Check, X
} from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

const STATUS_COLORS = {
  'BEKLEMEDE': 'dark:bg-zinc-900 text-yellow-500 hover:bg-zinc-800',
  'INCELEMEDE': 'dark:bg-zinc-900 text-blue-500 hover:bg-zinc-800',
  'TAMIR_EDILDI': 'dark:bg-zinc-900 text-green-500 hover:bg-zinc-800',
  'TESLIM_EDILDI': 'dark:bg-zinc-900 text-purple-500 hover:bg-zinc-800',
  'IPTAL': 'dark:bg-zinc-900 text-red-500 hover:bg-zinc-800'
};

const STATUS_LABELS = {
  'BEKLEMEDE': 'Beklemede',
  'INCELEMEDE': 'İncelemede',
  'TAMIR_EDILDI': 'Tamir Edildi',
  'TESLIM_EDILDI': 'Teslim Edildi',
  'IPTAL': 'İptal'
};

const getStatusColor = (status: string) => {
  return `${STATUS_COLORS[status as keyof typeof STATUS_COLORS]} px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 hover:opacity-90`;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

type SortOption = {
  label: string;
  value: keyof Service | 'customer.name' | 'device.brand';
  direction: 'asc' | 'desc';
};

const SORT_OPTIONS: SortOption[] = [
  { label: 'En Yeni', value: 'created_at', direction: 'desc' },
  { label: 'En Eski', value: 'created_at', direction: 'asc' },
  { label: 'Son Güncellenen', value: 'updated_at', direction: 'desc' },
  { label: 'Müşteri Adı (A-Z)', value: 'customer.name', direction: 'asc' },
  { label: 'Müşteri Adı (Z-A)', value: 'customer.name', direction: 'desc' },
  { label: 'Cihaz Markası (A-Z)', value: 'device.brand', direction: 'asc' },
  { label: 'Cihaz Markası (Z-A)', value: 'device.brand', direction: 'desc' },
];

export default function ServicesPage() {
  const [loading, setLoading] = useState(true);
  const [serviceList, setServiceList] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['ALL']);
  const [sortBy, setSortBy] = useState<SortOption>(SORT_OPTIONS[0]);
  const [deleteServiceId, setDeleteServiceId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [showStatusSelect, setShowStatusSelect] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [advancedSearch, setAdvancedSearch] = useState({
    id: '',
    customerName: '',
    deviceInfo: '',
    problem: '',
    startDate: '',
    endDate: '',
  });
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.filter-menu') && !target.closest('.filter-button')) {
        setShowFilters(false);
      }
      if (!target.closest('.sort-menu') && !target.closest('.sort-button')) {
        setShowSort(false);
      }
      if (!target.closest('.status-select') && !target.closest('.status-button')) {
        setShowStatusSelect(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchServices = async () => {
    try {
      const data = await services.getAll();
      setServiceList(data);
    } catch (error) {
      console.error('Servis kayıtları yüklenirken hata:', error);
      toast.error('Servis kayıtları yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    setDeleteServiceId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deleteServiceId) return;

    try {
      setLoading(true);
      await services.delete(deleteServiceId);
      await fetchServices();
      toast.success('Servis kaydı başarıyla silindi');
    } catch (error) {
      console.error('Servis silinirken hata:', error);
      toast.error('Servis silinirken bir hata oluştu');
    } finally {
      setLoading(false);
      setShowDeleteConfirm(false);
      setDeleteServiceId(null);
    }
  };

  const handleStatusChange = async (serviceId: number, newStatus: string) => {
    try {
      await services.update(serviceId, { status: newStatus });
      await fetchServices();
      setShowStatusSelect(null);
      toast.success('Durum başarıyla güncellendi');
    } catch (error) {
      console.error('Durum güncellenirken hata:', error);
      toast.error('Durum güncellenirken bir hata oluştu');
    }
  };

  const handleStatusToggle = (status: string) => {
    setSelectedStatuses(prev => {
      if (status === 'ALL') {
        return ['ALL'];
      }
      
      const newStatuses = prev.filter(s => s !== 'ALL');
      if (newStatuses.includes(status)) {
        return newStatuses.filter(s => s !== status);
      } else {
        return [...newStatuses, status];
      }
    });
  };

  const sortServices = (services: Service[]) => {
    return [...services].sort((a, b) => {
      const { value, direction } = sortBy;
      
      let aValue: string | number | Date;
      let bValue: string | number | Date;

      if (value.includes('.')) {
        const [obj, prop] = value.split('.');
        if (obj === 'customer' && prop === 'name') {
          aValue = (a.customer as Customer).name;
          bValue = (b.customer as Customer).name;
        } else if (obj === 'device' && prop === 'brand') {
          aValue = (a.device as Device).brand;
          bValue = (b.device as Device).brand;
        } else {
          aValue = '';
          bValue = '';
        }
      } else {
        const val = value as keyof Service;
        if (val === 'created_at' || val === 'updated_at') {
          aValue = new Date(a[val]);
          bValue = new Date(b[val]);
        } else {
          aValue = a[val] as string;
          bValue = b[val] as string;
        }
      }

      if (aValue instanceof Date && bValue instanceof Date) {
        return direction === 'asc'
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime();
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return direction === 'asc' 
        ? (aValue > bValue ? 1 : -1)
        : (bValue > aValue ? 1 : -1);
    });
  };

  const filteredServices = sortServices(
    serviceList.filter(service => {
      const searchMatch = !searchTerm || 
        service.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.device.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.device.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.problem.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.id.toString().includes(searchTerm);

      const idMatch = !advancedSearch.id || 
        service.id.toString().includes(advancedSearch.id);

      const customerMatch = !advancedSearch.customerName || 
        service.customer.name.toLowerCase().includes(advancedSearch.customerName.toLowerCase());

      const deviceMatch = !advancedSearch.deviceInfo || 
        `${service.device.brand} ${service.device.model}`.toLowerCase().includes(advancedSearch.deviceInfo.toLowerCase());

      const problemMatch = !advancedSearch.problem || 
        service.problem.toLowerCase().includes(advancedSearch.problem.toLowerCase());

      const dateMatch = (!advancedSearch.startDate && !advancedSearch.endDate) || 
        ((!advancedSearch.startDate || new Date(service.created_at) >= new Date(advancedSearch.startDate)) &&
        (!advancedSearch.endDate || new Date(service.created_at) <= new Date(advancedSearch.endDate)));

      const statusMatch = 
        selectedStatuses.includes('ALL') ||
        selectedStatuses.includes(service.status);

      return searchMatch && idMatch && customerMatch && deviceMatch && problemMatch && dateMatch && statusMatch;
    })
  );

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    <div className="min-h-screen bg-white dark:bg-zinc-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">Servis Kayıtları</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              Sistemdeki tüm servis kayıtlarının listesi
            </p>
          </div>
          <Link 
            href="/dashboard/services/new"
            className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-100 rounded-md shadow-sm hover:shadow-md transition-all"
          >
            <Wrench className="h-4 w-4 mr-2" />
            Yeni Servis Kaydı
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            {!showAdvancedSearch ? (
              <div className="relative">
                <input
                  type="search"
                  placeholder="Müşteri, cihaz, ID veya problem ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-800 rounded-md bg-white dark:bg-background text-zinc-900 dark:text-white placeholder-zinc-500 dark:placeholder-zinc-400 shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
                />
                <button
                  onClick={() => setShowAdvancedSearch(true)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                >
                  <Filter className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="bg-white dark:bg-background border border-zinc-200 dark:border-zinc-800 rounded-md p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-zinc-900 dark:text-white">Detaylı Arama</h3>
                  <button
                    onClick={() => {
                      setShowAdvancedSearch(false);
                      setAdvancedSearch({
                        id: '',
                        customerName: '',
                        deviceInfo: '',
                        problem: '',
                        startDate: '',
                        endDate: '',
                      });
                    }}
                    className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-zinc-600 dark:text-zinc-400 mb-1">Servis ID</label>
                    <input
                      type="text"
                      value={advancedSearch.id}
                      onChange={(e) => setAdvancedSearch(prev => ({ ...prev, id: e.target.value }))}
                      placeholder="ID ile ara..."
                      className="w-full px-3 py-1.5 text-sm border border-zinc-200 dark:border-zinc-800 rounded-md bg-white dark:bg-background text-zinc-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-600 dark:text-zinc-400 mb-1">Müşteri Adı</label>
                    <input
                      type="text"
                      value={advancedSearch.customerName}
                      onChange={(e) => setAdvancedSearch(prev => ({ ...prev, customerName: e.target.value }))}
                      placeholder="Müşteri adı ile ara..."
                      className="w-full px-3 py-1.5 text-sm border border-zinc-200 dark:border-zinc-800 rounded-md bg-white dark:bg-background text-zinc-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-600 dark:text-zinc-400 mb-1">Cihaz Bilgisi</label>
                    <input
                      type="text"
                      value={advancedSearch.deviceInfo}
                      onChange={(e) => setAdvancedSearch(prev => ({ ...prev, deviceInfo: e.target.value }))}
                      placeholder="Marka veya model ile ara..."
                      className="w-full px-3 py-1.5 text-sm border border-zinc-200 dark:border-zinc-800 rounded-md bg-white dark:bg-background text-zinc-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-600 dark:text-zinc-400 mb-1">Problem</label>
                    <input
                      type="text"
                      value={advancedSearch.problem}
                      onChange={(e) => setAdvancedSearch(prev => ({ ...prev, problem: e.target.value }))}
                      placeholder="Problem ile ara..."
                      className="w-full px-3 py-1.5 text-sm border border-zinc-200 dark:border-zinc-800 rounded-md bg-white dark:bg-background text-zinc-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-600 dark:text-zinc-400 mb-1">Başlangıç Tarihi</label>
                    <input
                      type="date"
                      value={advancedSearch.startDate}
                      onChange={(e) => setAdvancedSearch(prev => ({ ...prev, startDate: e.target.value }))}
                      className="w-full px-3 py-1.5 text-sm border border-zinc-200 dark:border-zinc-800 rounded-md bg-white dark:bg-background text-zinc-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-600 dark:text-zinc-400 mb-1">Bitiş Tarihi</label>
                    <input
                      type="date"
                      value={advancedSearch.endDate}
                      onChange={(e) => setAdvancedSearch(prev => ({ ...prev, endDate: e.target.value }))}
                      className="w-full px-3 py-1.5 text-sm border border-zinc-200 dark:border-zinc-800 rounded-md bg-white dark:bg-background text-zinc-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 relative z-20">
            <div className="relative">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="filter-button inline-flex items-center justify-center px-4 py-2 text-sm font-medium border border-zinc-200 dark:border-zinc-800 rounded-md bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white hover-bg-light gap-2 shadow-sm hover:shadow-md transition-all"
              >
                <Filter className="h-4 w-4" />
                Filtrele
                {selectedStatuses.length > 0 && selectedStatuses[0] !== 'ALL' && (
                  <span className="ml-1 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 w-5 h-5 flex items-center justify-center shadow-sm">
                    {selectedStatuses.length}
                  </span>
                )}
              </button>
              {showFilters && (
                <div className="filter-menu absolute right-0 mt-2 w-60 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md shadow-lg z-50">
                  <div className="p-4 space-y-4">
                    <h4 className="font-medium text-zinc-900 dark:text-white">Durum Filtreleri</h4>
                    <hr className="border-zinc-200 dark:border-zinc-800" />
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer hover-bg-light p-1 rounded-md transition-colors">
                        <input
                          type="checkbox"
                          checked={selectedStatuses.includes('ALL')}
                          onChange={() => handleStatusToggle('ALL')}
                          className="rounded border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-blue-500 focus:ring-blue-500/20"
                        />
                        <span className="text-sm text-zinc-900 dark:text-zinc-300">Tümü</span>
                      </label>
                      {Object.entries(STATUS_LABELS).map(([value, label]) => (
                        <label key={value} className="flex items-center gap-2 cursor-pointer hover-bg-light p-1 rounded-md transition-colors">
                          <input
                            type="checkbox"
                            checked={selectedStatuses.includes(value)}
                            onChange={() => handleStatusToggle(value)}
                            className="rounded border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-blue-500 focus:ring-blue-500/20"
                          />
                          <span className="text-sm text-zinc-900 dark:text-zinc-300">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setShowSort(!showSort)}
                className="sort-button inline-flex items-center justify-center px-4 py-2 text-sm font-medium border border-zinc-200 dark:border-zinc-800 rounded-md bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white hover-bg-light gap-2 shadow-sm hover:shadow-md transition-all"
              >
                <ArrowUpDown className="h-4 w-4" />
                Sırala
              </button>
              {showSort && (
                <div className="sort-menu absolute right-0 mt-2 w-60 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md shadow-lg z-50">
                  <div className="p-4 space-y-4">
                    <h4 className="font-medium text-zinc-900 dark:text-white">Sıralama</h4>
                    <hr className="border-zinc-200 dark:border-zinc-800" />
                    <div className="space-y-1">
                      {SORT_OPTIONS.map((option) => (
                        <button
                          key={option.value + option.direction}
                          className={`w-full text-left px-3 py-2 text-sm rounded-md hover-bg-light flex items-center gap-2 transition-colors text-zinc-900 dark:text-zinc-300 ${
                            sortBy.value === option.value && sortBy.direction === option.direction
                              ? 'bg-zinc-200/90 dark:bg-zinc-800 text-zinc-900 dark:text-white'
                              : ''
                          }`}
                          onClick={() => {
                            setSortBy(option);
                            setShowSort(false);
                          }}
                        >
                          {sortBy.value === option.value && sortBy.direction === option.direction && (
                            <Check className="h-4 w-4" />
                          )}
                          <span>{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {paginatedServices.map((service) => (
            <div 
              key={service.id} 
              className="group bg-white dark:bg-background rounded-lg border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-lg transition-all"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-zinc-900 dark:text-white hover:text-blue-500 transition-colors">
                        {service.customer.name}
                      </h3>
                      <span className="text-sm text-zinc-400 dark:text-zinc-500">•</span>
                      <span className="text-sm text-zinc-400 dark:text-zinc-500">#{service.id}</span>
                    </div>
                    <div className="flex items-center text-sm text-zinc-600 dark:text-zinc-400">
                      <Smartphone className="h-4 w-4 mr-2" />
                      <span>
                        {service.device.brand} {service.device.model}
                      </span>
                    </div>
                    <div className="flex items-start text-sm text-zinc-600 dark:text-zinc-400">
                      <AlertCircle className="h-4 w-4 mr-2 mt-1 shrink-0" />
                      <span className="line-clamp-2">{service.problem}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="relative">
                      <Select
                        value={service.status}
                        onValueChange={(value) => handleStatusChange(service.id, value)}
                      >
                        <SelectTrigger className={`w-[140px] ${STATUS_COLORS[service.status as keyof typeof STATUS_COLORS]} border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all`}>
                          <SelectValue>
                            {STATUS_LABELS[service.status as keyof typeof STATUS_LABELS]}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800">
                          {Object.entries(STATUS_LABELS).map(([value, label]) => (
                            <SelectItem
                              key={value}
                              value={value}
                              className={`${STATUS_COLORS[value as keyof typeof STATUS_COLORS]} cursor-pointer`}
                            >
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/dashboard/services/${service.id}`}
                        className="p-2 hover-bg-light rounded-md transition-colors text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(service.id)}
                        className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-md transition-colors text-zinc-600 dark:text-zinc-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-400">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(service.created_at)}</span>
                  </div>
                  {service.technician && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{service.technician.name}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-8">
            <p className="text-zinc-400">Servis kaydı bulunamadı</p>
          </div>
        )}

        {filteredServices.length > 0 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Geri
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`inline-flex items-center justify-center w-8 h-8 text-sm font-medium rounded-md transition-colors ${
                  currentPage === page
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                    : 'text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              İleri
            </button>
          </div>
        )}
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-900 p-6 rounded-lg max-w-md w-full mx-4 border border-zinc-800">
            <h2 className="text-lg font-semibold text-white">Servis Kaydını Sil</h2>
            <p className="mt-2 text-zinc-400">
              Bu servis kaydını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz ve tüm servis mesajları da silinecektir.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteServiceId(null);
                }}
                className="px-4 py-2 text-sm font-medium rounded-md border border-zinc-800 text-white hover:bg-zinc-800 transition-colors"
                disabled={loading}
              >
                İptal
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
                disabled={loading}
              >
                {loading ? 'Siliniyor...' : 'Sil'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { User } from '@/types';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { Search, UserPlus, Trash2, Mail, Shield } from 'lucide-react';

interface NewUserFormData {
  name: string;
  email: string;
  password: string;
  role: 'ADMIN' | 'TEKNISYEN';
}

export default function UsersPage() {
  const [userList, setUserList] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const [newUser, setNewUser] = useState<NewUserFormData>({
    name: '',
    email: '',
    password: '',
    role: 'TEKNISYEN'
  });
  const { user: currentUser, register } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (currentUser?.role !== 'ADMIN') {
      router.push('/dashboard');
      return;
    }

    const fetchUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        if (data) setUserList(data);
      } catch (error) {
        console.error('Kullanıcılar yüklenirken hata oluştu:', error);
        toast.error('Kullanıcılar yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentUser, router]);

  const handleDelete = (id: number) => {
    if (id === currentUser?.id) {
      toast.error('Kendi hesabınızı silemezsiniz');
      return;
    }
    setDeleteUserId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deleteUserId) return;

    try {

      const { data: existingServices, error: checkError } = await supabase
        .from('services')
        .select('id')
        .eq('technician_id', deleteUserId)
        .limit(1);
        
      if (checkError) throw checkError;
      
      if (existingServices && existingServices.length > 0) {
        toast.error('Bu kullanıcıyı silemezsiniz çünkü kendisine atanmış servis kayıtları bulunmaktadır. Önce servisleri başka bir teknisyene atayın veya silin.');
        setShowDeleteConfirm(false);
        setDeleteUserId(null);
        return;
      }

      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', deleteUserId);

      if (error) throw error;

      setUserList(userList.filter(user => user.id !== deleteUserId));
      toast.success('Kullanıcı başarıyla silindi');
    } catch (error) {
      console.error('Kullanıcı silinirken hata oluştu:', error);
      toast.error('Kullanıcı silinirken bir hata oluştu');
    } finally {
      setShowDeleteConfirm(false);
      setDeleteUserId(null);
    }
  };

  const handleRoleChange = async (id: number, newRole: string) => {
    if (id === currentUser?.id) {
      toast.error('Kendi rolünüzü değiştiremezsiniz');
      return;
    }

    try {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', id);

      if (error) throw error;

      setUserList(userList.map(user =>
        user.id === id ? { ...user, role: newRole as 'ADMIN' | 'TEKNISYEN' } : user
      ));
      toast.success('Kullanıcı rolü güncellendi');
    } catch (error) {
      console.error('Kullanıcı rolü güncellenirken hata oluştu:', error);
      toast.error('Kullanıcı rolü güncellenirken bir hata oluştu');
    }
  };

  const handleAddUser = async () => {
    try {
      if (!newUser.name || !newUser.email || !newUser.password) {
        toast.error('Lütfen tüm alanları doldurun');
        return;
      }

      const registeredUser = await register(newUser.email, newUser.password, newUser.name);
      
      if (newUser.role !== 'TEKNISYEN') {
        const { error } = await supabase
          .from('users')
          .update({ role: newUser.role })
          .eq('id', registeredUser.id);

        if (error) throw error;
      }

      const { data: updatedUsers } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (updatedUsers) {
        setUserList(updatedUsers);
      }
      
      setIsAddDialogOpen(false);
      setNewUser({
        name: '',
        email: '',
        password: '',
        role: 'TEKNISYEN'
      });
      toast.success('Kullanıcı başarıyla eklendi');
    } catch (error) {
      console.error('Kullanıcı eklenirken hata oluştu:', error);
      toast.error('Kullanıcı eklenirken bir hata oluştu');
    }
  };

  const filteredUsers = userList.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="h-24 bg-muted" />
                <CardContent className="p-4">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (currentUser?.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Kullanıcılar</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Sistemdeki tüm kullanıcıların listesi
            </p>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Kullanıcı ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full sm:w-[250px]"
              />
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)} className="shrink-0">
              <UserPlus className="h-4 w-4 mr-2" />
              Yeni Kullanıcı
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="group hover:shadow-lg transition-all duration-300 hover:border-primary/20">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1.5">
                    <CardTitle className="text-lg font-semibold">{user.name}</CardTitle>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Mail className="h-4 w-4 mr-2" />
                      {user.email}
                    </div>
                  </div>
                  {user.id !== currentUser?.id && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(user.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <Select
                    value={user.role}
                    onValueChange={(value) => handleRoleChange(user.id, value)}
                    disabled={user.id === currentUser?.id}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="TEKNISYEN">Teknisyen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredUsers.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">Kullanıcı bulunamadı</p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Yeni Kullanıcı Ekle</DialogTitle>
            <DialogDescription>
              Sisteme yeni bir kullanıcı eklemek için aşağıdaki formu doldurun.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Ad Soyad</Label>
              <Input
                id="name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Şifre</Label>
              <Input
                id="password"
                type="password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Rol</Label>
              <Select
                value={newUser.role}
                onValueChange={(value) => setNewUser({ ...newUser, role: value as 'ADMIN' | 'TEKNISYEN' })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="TEKNISYEN">Teknisyen</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              İptal
            </Button>
            <Button onClick={handleAddUser}>
              Kullanıcı Ekle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Kullanıcıyı Sil"
        description="Bu kullanıcıyı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
        onConfirm={confirmDelete}
      />
    </div>
  );
} 
'use client';

import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Loader2, MoreVertical } from 'lucide-react';
import axios from '@/lib/axios';
import Link from 'next/link';
import Loader from '@/components/loader';
import { normalizeLogoUrl } from '@/lib/utils';
import { Switch } from '@/components/ui/switch';

type Page = {
  id: string;
  logo: string;
  mailId: string;
  contact: string;
  bannerImage: string;
  header: string;
  text: string;
  address: string;
  isActive: boolean;
};

const fetcher = (url: string) => axios.get(url).then(res => res.data.data);

export default function PageList() {
  const [pages, setPages] = useState<Page[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/pages');
      setPages(res.data.data);
    } catch {
      toast.error('Failed to fetch pages');
    } finally {
        setLoading(false);  
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    try {
      await axios.delete(`/pages/${deleteId}`);
      toast.success('Page deleted successfully');
      setPages(prev => prev.filter(p => p.id !== deleteId));
      setDeleteId(null);
    } catch (error) {
      console.log(error);
      // @ts-ignore
      toast.error(error?.response?.data?.message ?? 'Failed to delete page');
    } finally {
      setLoading(false);
    }
  };

  const [updatingPageId, setUpdatingPageId] = useState<string | null>(null);

  const handleToggleStatus = async (id: string, newStatus: boolean) => {
    try {
      setUpdatingPageId(id);
      await axios.patch(`/pages/${id}/status`, { isActive: newStatus });
      toast.success(`Page ${newStatus ? 'activated' : 'deactivated'}`);
      fetchPages(); 
    } catch (error) {
      //@ts-ignore
      toast.error(error?.response?.data?.message ?? 'Failed to delete page');
    } finally {
      setUpdatingPageId(null);
    }
  };
  
  useEffect(() => {
        fetchPages();
    }, []);
    
  return (
    <>
        { loading ?
            <Loader className="py-16" />
        :    
            <div className="p-6 max-w-6xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">All Pages</h2>
    
            <Table>
            <TableHeader>
                <TableRow>
                <TableHead>Logo</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Header</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {pages?.map((page) => (
                <TableRow key={page.id}>
                    <TableCell>
                    <img src={normalizeLogoUrl(page.logo)} alt="logo" className="h-10 w-10 rounded" />
                    </TableCell>
                    <TableCell>{page.mailId}</TableCell>
                    <TableCell>{page.contact}</TableCell>
                    <TableCell>{page.header}</TableCell>
                    <TableCell>
                    <>
                      {updatingPageId === page.id ? (
                        <Loader2 className="animate-spin w-5 h-5 text-gray-500" />
                      ) : (
                        <>
                          <Switch
                            checked={page.isActive}
                            onCheckedChange={() => handleToggleStatus(page.id, !page.isActive)}
                            />

                          <br />

                          <span className={page.isActive ? 'text-green-600' : 'text-red-600'}>
                            {page.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </>
                      )}
                    </>
                  </TableCell>
                    <TableCell className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="p-1 h-8 w-8">
                            <MoreVertical size={16} />
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link href={`/dashboard/pages/${page.id}`}>Edit</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setDeleteId(page.id)}>
                            Delete
                        </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    </TableCell>
                </TableRow>
                ))}
            </TableBody>
            </Table>
    
            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to delete this page?</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={loading}>
                    {loading ? 'Deleting...' : 'Delete'}
                </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
            </AlertDialog>
        </div>
        
        }
    </>
  );
}

'use client';
// ./app/dashboard/pages/[id]/page.tsx
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import axios from '@/lib/axios';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import Loader from '@/components/loader';
import { Loader2 } from 'lucide-react';

export default function EditPage() {
  const router = useRouter();
  const params = useParams();
  const [formData, setFormData] = useState({
    mailId: '',
    contact: '',
    header: '',
    text: '',
    address: '',
    isActive: true,
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null); // New state
  const [loading, setLoading] = useState(false);

  const fetchPage = async () => {
    try {
      const res = await axios.get(`/pages/${params.id}`);
      const page = res.data.data;

      setFormData({
        mailId: page.mailId,
        contact: page.contact,
        header: page.header,
        text: page.text,
        address: page.address,
        isActive: page.isActive,
      });
    } catch (err: unknown) {
      //@ts-expect-error: err is unknown and may not have a response property
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPage();
  }, [params.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = new FormData();
      const allowedFields = ['mailId', 'contact', 'header', 'text', 'address', 'isActive'];

      allowedFields.forEach(field => {
        const value = formData[field as keyof typeof formData];
        if (value !== undefined && value !== null) {
          payload.append(field, value.toString());
        }
      });

      if (logoFile) {
        payload.append('logo', logoFile);
      }

      if (bannerFile) {
        payload.append('bannerImage', bannerFile);
      }

      await axios.patch(`/pages/${params.id}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success('Page updated successfully');
      router.push('/dashboard/pages');
    } catch (err: unknown) {
      //@ts-expect-error: err is unknown and may not have a response property
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Loader className="py-16" />
      ) : (
        <div className="max-w-3xl mx-auto p-6">
          <h2 className="text-xl font-semibold mb-4">Edit Page</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input name="mailId" value={formData.mailId} onChange={handleChange} required />
            </div>

            <div>
              <Label>Contact</Label>
              <Input name="contact" value={formData.contact} onChange={handleChange} required />
            </div>

            <div>
              <Label>Header</Label>
              <Input name="header" value={formData.header} onChange={handleChange} />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea name="text" value={formData.text} onChange={handleChange} />
            </div>

            <div>
              <Label>Address</Label>
              <Input name="address" value={formData.address} onChange={handleChange} />
            </div>

            <div>
              <Label>Status</Label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
                Active
              </label>
            </div>

            <div>
              <Label>Upload New Logo (optional)</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={e => setLogoFile(e.target.files?.[0] || null)}
              />
            </div>

            <div>
              <Label>Upload New Banner Image (optional)</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={e => setBannerFile(e.target.files?.[0] || null)}
              />
            </div>

            <Button type="submit" disabled={loading} className="flex items-center gap-2">
              {loading && <Loader2 className="animate-spin h-4 w-4" />}
              Update Page
            </Button>
          </form>
        </div>
      )}
    </>
  );
}

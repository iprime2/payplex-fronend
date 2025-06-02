'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import axios from '@/lib/axios';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const formSchema = z.object({
  mailId: z.string().email(),
  contact: z.string().min(5),
  bannerImage: z.any(),
  header: z.string().min(3),
  slug: z.string().min(3),
  text: z.string().min(10),
  address: z.string().min(5),
  isActive: z.boolean(),
  logo: z.any()
});

type FormValues = z.infer<typeof formSchema>;

export default function CreatePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isActive: true
    }
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('mailId', data.mailId);
      formData.append('contact', data.contact);
      formData.append('header', data.header);
      formData.append('slug', data.slug); // new field
      formData.append('text', data.text);
      formData.append('address', data.address);
      formData.append('isActive', String(data.isActive));
      formData.append('logo', data.logo[0]);
      formData.append('bannerImage', data.bannerImage[0]);

      await axios.post('/pages', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Page created successfully');
      router.push('/dashboard/pages');
    } catch (error: unknown) {
      //@ts-expect-error: error may not have response
      toast.error(error?.response?.data?.message ?? 'Failed to create page');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Create New Page</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

        <div>
          <Label>Email</Label>
          <Input type="email" {...register('mailId')} />
          {errors.mailId && <p className="text-red-500 text-sm">{errors.mailId.message}</p>}
        </div>

        <div>
          <Label>Contact</Label>
          <Input type="text" {...register('contact')} />
          {errors.contact && <p className="text-red-500 text-sm">{errors.contact.message}</p>}
        </div>

        <div>
          <Label>Banner Image</Label>
          <Input type="file" accept="image/*" {...register('bannerImage')} />
          {errors.bannerImage && <p className="text-red-500 text-sm">{errors.bannerImage.message as string}</p>}
        </div>

        <div>
          <Label>Header</Label>
          <Input type="text" {...register('header')} />
          {errors.header && <p className="text-red-500 text-sm">{errors.header.message}</p>}
        </div>

        <div>
          <Label>Slug</Label>
          <Input type="text" {...register('slug')} />
          {errors.slug && <p className="text-red-500 text-sm">{errors.slug.message}</p>}
        </div>

        <div>
          <Label>Text</Label>
          <Textarea {...register('text')} />
          {errors.text && <p className="text-red-500 text-sm">{errors.text.message}</p>}
        </div>

        <div>
          <Label>Address</Label>
          <Input type="text" {...register('address')} />
          {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
        </div>

        <div>
          <Label>Logo</Label>
          <Input type="file" accept="image/*" {...register('logo')} />
          {errors.logo && <p className="text-red-500 text-sm">{errors.logo.message as string}</p>}
        </div>

        <div className="flex items-center gap-4">
          <Label>Active</Label>
          <Switch
            checked={watch('isActive')}
            onCheckedChange={(val) => setValue('isActive', val)}
          />
        </div>

        <Button type="submit" disabled={loading} className="flex items-center gap-2">
          {loading && <Loader2 className="animate-spin h-4 w-4" />}
          Create Page
        </Button>
      </form>
    </div>
  );
}

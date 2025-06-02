'use client';

import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { normalizeLogoUrl } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface Page {
  id: string;
  header: string;
  slug: string;
  logo: string;
  bannerImage: string;
  mailId: string;
  contact: string;
  address: string;
  text: string;
  isActive: boolean;
}

export default function HomePage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);

  useEffect(() => {
    async function fetchPages() {
      try {
        const res = await axios.get('/pages');
        setPages(
          (res.data.data || []).sort((a: Page, b: Page) => a.header.localeCompare(b.header))
        );
      } catch (error) {
        console.error('Failed to fetch active pages', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPages();
  }, []);

  const handleSelect = (page: Page) => {
    setSelectedPage(page);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-950 transition-colors">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
          Available Pages
        </h1>
        <Link href="/login">
          <Button variant="outline" size="sm" className='hover:cursor-pointer'>
            Login
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin h-6 w-6 text-gray-500" />
        </div>
      ) : pages.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">No active pages available.</p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
            {pages.map(page => (
              <Card
                key={page.id}
                className={`transition relative p-1 ${
                  page.isActive
                    ? 'hover:shadow-md cursor-pointer'
                    : 'cursor-not-allowed opacity-60 grayscale'
                }`}
                onClick={() => page.isActive && handleSelect(page)}
              >
                <CardContent className="flex flex-col items-center gap-2 p-3">
                  <Image
                    src={normalizeLogoUrl(page.logo)}
                    alt="Logo"
                    width={40}
                    height={40}
                    className="rounded border"
                  />
                  <span className="text-sm text-center text-gray-800 dark:text-gray-100">
                    {page.header}
                  </span>
                </CardContent>
                {!page.isActive && (
                  <div className="absolute inset-0 bg-white/40 dark:bg-black/30 backdrop-blur-sm flex items-center justify-center text-xs text-gray-600 dark:text-gray-300 font-medium">
                    Inactive
                  </div>
                )}
              </Card>
            ))}
          </div>

          {selectedPage && (
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md">
              <Image
                src={normalizeLogoUrl(selectedPage.bannerImage)}
                alt="Banner"
                width={800}
                height={300}
                className="w-full h-64 object-cover rounded-md mb-4"
              />
              <div className="flex items-center gap-4 mb-4">
                <Image
                  src={normalizeLogoUrl(selectedPage.logo)}
                  alt="Logo"
                  width={80}
                  height={80}
                  className="rounded-full border"
                />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                  {selectedPage.header}
                </h2>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-2">{selectedPage.text}</p>
              <div className="text-gray-600 dark:text-gray-400 text-sm space-y-1">
                <p><strong>Email:</strong> {selectedPage.mailId}</p>
                <p><strong>Contact:</strong> {selectedPage.contact}</p>
                <p><strong>Address:</strong> {selectedPage.address}</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import AppLayout from '@/layouts/app-layout';
import { CompanySetting, Flash, MsgType, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';
import CDataSettings from './components/c-data-setings';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Configuración Empresa',
    href: '/company-settings',
  },
];

interface Props {
  companySettings: CompanySetting[]
}

export default function CompanySettings({ companySettings }: Props) {
  const { flash } = usePage<{ flash: Flash }>().props;

  useEffect(() => {
    if (!flash) return;
    toast[flash?.type as MsgType](flash.msg);
  }, [flash]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <h1>AJUSTES DE LA EMPRESA</h1>
        <div className='w-full'>
          <Accordion type='multiple' defaultValue={["empresa"]} className="max-w-4xl mx-auto">
            <AccordionItem value="empresa">
              <AccordionTrigger className='bg-amber-900 px-4 rounded'>EMPRESA</AccordionTrigger>
              <AccordionContent>
                <CDataSettings
                  companySettings={companySettings}
                />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="returns">
              <AccordionTrigger>What is your return policy?</AccordionTrigger>
              <AccordionContent>
                Returns accepted within 30 days. Items must be unused and in original
                packaging. Refunds processed within 5-7 business days.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="support">
              <AccordionTrigger>How can I contact customer support?</AccordionTrigger>
              <AccordionContent>
                Reach us via email, live chat, or phone. We respond within 24 hours
                during business days.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

      </div>
    </AppLayout>
  );
}

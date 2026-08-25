import { AlertDialogProvider } from '@/components/alert_dialog/use-alert-dialog-context';
import { Toaster } from '@/components/ui/sonner';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { useCatalogsStore } from '@/store/catalogs-store';
import { type BreadcrumbItem } from '@/types';
import AppHeaderLayout from './app/app-header-layout';

interface AppLayoutProps {
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {

    // const isDarkTheme = useCatalogsStore(state => state.isDarkTheme)
    
    return (
    <AlertDialogProvider>
        {/* <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
        </AppLayoutTemplate> */}
        <AppHeaderLayout breadcrumbs={breadcrumbs} {...props}>
            {children}
        </AppHeaderLayout>
        {/* <Toaster richColors position="top-center" theme={isDarkTheme ? 'dark' : 'light'}/> */}
    </AlertDialogProvider>
)};

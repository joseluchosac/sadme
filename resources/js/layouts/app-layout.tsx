import { AlertDialogProvider } from '@/components/alert_dialog/use-alert-dialog-context';
import { Toaster } from '@/components/ui/sonner';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { useCatalogsStore } from '@/store/catalogs-store';
import { type BreadcrumbItem } from '@/types';

interface AppLayoutProps {
    children: React.ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {

    const isDarkTheme = useCatalogsStore(state => state.isDarkTheme)
    
    return (
    <AlertDialogProvider>
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {children}
        </AppLayoutTemplate>
        <Toaster richColors position="top-center" theme={isDarkTheme ? 'dark' : 'light'}/>
    </AlertDialogProvider>
)};

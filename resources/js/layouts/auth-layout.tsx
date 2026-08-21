// import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';
import AuthLayoutTemplate from '@/layouts/auth/auth-card-layout';

export default function AuthLayout({ children, title, description, nombre_comercial,  ...props }: { children: React.ReactNode; title: string; description: string, nombre_comercial: string }) {
    return (
        <AuthLayoutTemplate nombre_comercial={nombre_comercial} title={title} description={description} {...props}>
            {children}
        </AuthLayoutTemplate>
    );
}

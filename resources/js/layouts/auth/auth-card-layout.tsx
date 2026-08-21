// import AppLogoIcon from '@/components/app-logo-icon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';

export default function AuthCardLayout({
    children,
    title,
    description,
    nombre_comercial
}: {
    children: React.ReactNode;
    name?: string;
    title?: string;
    description?: string;
    nombre_comercial?: string;
}) {
    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-md flex-col gap-6">
                <Link href={route('home')} className="flex items-center gap-2 self-center font-medium">
                    <div className="flex h-20 w-20 items-center justify-center">
                        {/* <AppLogoIcon className="size-9 fill-current text-black dark:text-white" /> */}
                        <img src='/virgen_prp_bw_192px.png' />
                    </div>
                </Link>

                <div className="flex flex-col lg:gap-6">
                    <Card className="rounded-xl">
                        <CardHeader className="lg:px-10 lg:pt-8 pb-0 text-center">
                            {/* <CardTitle className="text-xl">{nombre_comercial}</CardTitle> */}
                            <CardTitle className="text-xl">{title}</CardTitle>
                            <CardDescription>{description}</CardDescription>
                        </CardHeader>
                        <CardContent className="lg:px-10 lg:py-8">{children}</CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

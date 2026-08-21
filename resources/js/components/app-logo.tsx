import { usePage } from "@inertiajs/react";

export default function AppLogo() {
    const {company} = usePage().props.auth as any;
    return (
        <>
            {/* <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-md">
                <AppLogoIcon className="size-5 fill-current text-white dark:text-black" />
            </div> */}
            <div className="text-sidebar-primary-foreground flex aspect-square size-10 items-center justify-center rounded-md">
                <img src='/virgen_prp_bw_192px.png' />
            </div>
            <div className='flex flex-col text-blue-700 dark:text-blue-400 font-ptserif font-bold ml-4 text-[0.95rem]'>
                <span className="mb-0.5 truncate leading-none font-semibold text-center text-wrap">{company.nombre_comercial}</span>
            </div>
        </>
    );
}

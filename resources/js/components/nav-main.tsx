import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from '@/components/ui/sidebar';
import { Link, usePage } from '@inertiajs/react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { ChevronRight } from 'lucide-react';
import { useSidebarStore } from '@/store/sidebar-store';
import { useEffect } from 'react';
import { useCan } from '@/hooks/use-can';
import { MainNavItem } from '@/types';

export function NavMain() {
  const mainNavItems = useSidebarStore(state => state.mainNavItems);
  const setMainNavItems = useSidebarStore(state => state.setMainNavItems);
  const { url } = usePage();
  const can = useCan();

  const currentPage = url?.split('?')[0];

  const items = mainNavItems.filter((item) => {
    if (item.subItems === null) {
      return item.can === null ? true : can(item.can[0]);
    } else {
      if (item.subItems?.find(el => el.can === null)) {
        return true
      } else {
        const res = item.subItems?.filter(el => can(el.can ? el.can[0] : ''));
        return Boolean(res?.length)
      }
    }
  })

  const handleMainNavItems = (item: MainNavItem) => {
    const newMainNavItems = mainNavItems.map((mainNavItem) => {
      if (mainNavItem.title == item.title) {
        return { ...mainNavItem, isOpen: !mainNavItem.isOpen };
      } else {
        return mainNavItem;
      }
    });
    setMainNavItems(newMainNavItems);
  };

  useEffect(() => {
    const newMainNavItems = mainNavItems.map((item) => {
      if (!item.subItems) return item;
      const idx = item.subItems.findIndex(sItem => sItem.url == currentPage);
      return idx != -1 ? { ...item, isOpen: true, isActive: true } : { ...item, isActive: false };
    });
    setMainNavItems(newMainNavItems);
  }, [currentPage]);

  return (
    <SidebarGroup className="px-2 py-0">
      {/* <SidebarGroupLabel>Platform</SidebarGroupLabel> */}
      <SidebarMenu>
        {items.map((item) => (item.subItems ? (
          <Collapsible
            open={item.isOpen}
            key={item.title}
            asChild
            defaultOpen={item.isActive}
            className='group/collapsible'
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton
                  isActive={item.url === url}
                  tooltip={item.title}
                  onClick={() => handleMainNavItems(item)}
                  className={`${item.isActive ? 'dark:bg-slate-700/35 bg-slate-300/35' : ''}`}
                >
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {item.subItems?.filter((subItem) => {
                    return subItem.can === null ? true : can(subItem.can[0]);
                  }).map((subItem) => (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton
                        className={subItem.url === currentPage ? 'dark:bg-slate-700 bg-slate-300' : ''}
                        asChild
                      // isActive={subItem.url === url}
                      >
                        <Link href={subItem.url} prefetch>
                          <span>{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ) : (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              className={url.startsWith(item.rootUrl) ? 'dark:bg-slate-700 data-[active=true]:bg-slate-300' : ''}
              asChild
              isActive={url.startsWith(item.rootUrl)}
            >
              <Link href={item.url} prefetch>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

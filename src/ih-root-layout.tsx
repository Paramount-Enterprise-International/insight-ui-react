/* ih-root-layout.tsx */
import { useCallback, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { IHContent, IHSidebar, type Menu, type User } from './components/host';

/**
 * This component mimics Angular:
 *
 * <ih-root>
 *   <ih-sidebar ...></ih-sidebar>
 *   <ih-content> ... <router-outlet/> ... </ih-content>
 * </ih-root>
 *
 * In React it becomes:
 * <ih-root>
 *   <IHSidebar />
 *   <IHContent />  // includes <Outlet/>
 * </ih-root>
 */
export function IHRootLayout() {
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const onSidebarToggled = useCallback((visible: boolean) => {
    setSidebarVisible(visible);
  }, []);

  // TODO: replace with your real user + menus data source
  const user: User = useMemo(
    () => ({
      employeeCode: 'PL1378',
      fullName: 'Dylan',
      userImagePath:
        'https://insight-dev.paramount-land.com/api/v3/authentication/profile-picture/user.male.jpg',
    }),
    []
  );

  const menus: Menu[] = useMemo(() => {
    // TODO: plug in your real menu tree.
    // Keeping minimal example so structure works.
    return [];
  }, []);

  // Optional: hide sidebar on certain routes (like login)
  const location = useLocation();
  const hideSidebar = false; // e.g. location.pathname.startsWith('/login')

  return (
    <ih-root>
      {!hideSidebar ? (
        <IHSidebar
          user={user}
          menus={menus}
          visible={sidebarVisible}
          footerText="Insight Development v5.0.0"
        />
      ) : null}

      <IHContent onSidebarToggled={onSidebarToggled} />
    </ih-root>
  );
}

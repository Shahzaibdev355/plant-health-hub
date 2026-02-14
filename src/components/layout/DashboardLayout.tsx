import { useState, createContext, useContext, ReactNode } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Images,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Leaf,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { ProfileModal } from "@/components/dashboard/ProfileModal";


import { useEffect } from "react";
import api from "@/api/axios";
import { useAuthStore } from "@/store/auth-store";


interface SidebarContextType {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
  isProfileOpen: boolean;
  setIsProfileOpen: (value: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Images, label: "Saved Images", path: "/show-images" },
];

export const DashboardLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  
  
  const { logout, clearUserProfile } = useAuthStore();

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout"); // clears cookies on server
    } catch (err) {
      // even if request fails, still logout locally
      console.error("Logout error:", err);
    } finally {
      logout();               // clear Zustand state
      clearUserProfile();
      navigate("/login");     // redirect
    }
  };


  const { userProfile, setUserProfile } = useAuthStore();

  useEffect(() => {
    if (!userProfile) {
      api.get("/auth/userInfo")
        .then((res) => {
          const data = res.data.data;
          setUserProfile({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phoneNo: data.phoneNo,
            twoFactorActivated: data.twoFactorAuth.activated,
            createdAt: data.createdAt,
          });
        })
        .catch(() => {
          console.log("Failed to fetch user info");
        });
    }
  }, []);

  return (
    <SidebarContext.Provider
      value={{ isCollapsed, setIsCollapsed, isProfileOpen, setIsProfileOpen }}
    >
      <div className="h-screen bg-secondary flex overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-40 flex items-center px-4">
          <button
            onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
            className="p-2 text-foreground"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2 ml-4">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">PlantGuard</span>
          </div>
        </div>

        {/* Mobile Sidebar Overlay */}
        <AnimatePresence>
          {isMobileSidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-foreground/20 z-40 md:hidden"
                onClick={() => setIsMobileSidebarOpen(false)}
              />
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border z-50 md:hidden"
              >
                <SidebarContent
                  isCollapsed={false}
                  menuItems={menuItems}
                  currentPath={location.pathname}
                  onProfileClick={() => {
                    setIsProfileOpen(true);
                    setIsMobileSidebarOpen(false);
                  }}
                  onLogout={handleLogout}
                />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Desktop Sidebar */}
        <aside
          className={`hidden md:flex flex-col bg-card border-r border-border transition-all duration-300 ${isCollapsed ? "w-20" : "w-64"
            }`}
        >
          <SidebarContent
            isCollapsed={isCollapsed}
            menuItems={menuItems}
            currentPath={location.pathname}
            onProfileClick={() => setIsProfileOpen(true)}
            onLogout={handleLogout}
            onCollapse={() => setIsCollapsed(!isCollapsed)}
          />
        </aside>

        {/* Main Content */}
        <main className="flex-1 pt-16 md:pt-0 overflow-y-auto custom-scrollbar">
          <div className="p-6 md:p-8">
            <Outlet />
          </div>
        </main>

        {/* Profile Modal */}
        <ProfileModal
          isOpen={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
        />
      </div>
    </SidebarContext.Provider>
  );
};

interface SidebarContentProps {
  isCollapsed: boolean;
  menuItems: { icon: React.ElementType; label: string; path: string }[];
  currentPath: string;
  onProfileClick: () => void;
  onLogout: () => void;
  onCollapse?: () => void;
}

const SidebarContent = ({
  isCollapsed,
  menuItems,
  currentPath,
  onProfileClick,
  onLogout,
  onCollapse,
}: SidebarContentProps) => {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="h-16 md:h-20 flex items-center px-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <Leaf className="w-6 h-6 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <span className="text-lg font-semibold text-foreground">
              PlantGuard
            </span>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-item ${isActive ? "sidebar-item-active" : ""} ${isCollapsed ? "justify-center" : ""
                }`}
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
        <button
          onClick={onProfileClick}
          className={`sidebar-item w-full ${isCollapsed ? "justify-center" : ""}`}
          title={isCollapsed ? "Profile" : undefined}
        >
          <User className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>Profile</span>}
        </button>
      </nav>

      {/* Footer */}
      <div className="py-4 px-3 border-t border-border space-y-2">
        <button
          onClick={onLogout}
          className={`sidebar-item w-full text-destructive hover:bg-destructive/10 ${isCollapsed ? "justify-center" : ""
            }`}
          title={isCollapsed ? "Logout" : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>

        {/* Collapse Button (Desktop Only) */}
        {onCollapse && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onCollapse}
            className={`w-full ${isCollapsed ? "justify-center" : ""}`}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Collapse
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

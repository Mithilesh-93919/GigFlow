import React, { useState, useRef, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';
import { useThemeStore } from '../store/theme.store';
import { 
  LogOut, 
  LayoutDashboard, 
  Users, 
  Menu, 
  X, 
  ChevronDown, 
  User as UserIcon,
  Bell,
  Search,
  Sun,
  Moon
} from 'lucide-react';
import { cn } from '../utils/cn';

interface SidebarLinkProps {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
  onClick?: () => void;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon: Icon, label, active, onClick }) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group",
        active
          ? "bg-blue-50 text-blue-700 font-semibold shadow-sm dark:bg-blue-950/30 dark:text-blue-400"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-slate-400 dark:hover:bg-slate-850/40 dark:hover:text-slate-200"
      )}
    >
      <Icon
        className={cn(
          "w-5 h-5 mr-3 transition-colors duration-200",
          active ? "text-blue-700 dark:text-blue-400" : "text-gray-400 group-hover:text-gray-600 dark:text-slate-500 dark:group-hover:text-slate-350"
        )}
      />
      {label}
    </Link>
  );
};

const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/leads', icon: Users, label: 'Leads' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 font-sans overflow-hidden transition-colors duration-250">
      {/* ─── DESKTOP SIDEBAR ─── */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-colors duration-250">
        <div className="flex items-center h-16 px-6 border-b border-slate-200 dark:border-slate-800">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20">
              <span className="text-white font-extrabold text-lg">G</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">GigFlow</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1.5">
          {navLinks.map((link) => (
            <SidebarLink
              key={link.to}
              to={link.to}
              icon={link.icon}
              label={link.label}
              active={location.pathname === link.to}
            />
          ))}
        </nav>
      </aside>

      {/* ─── MOBILE SIDEBAR DRAWER ─── */}
      {/* Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
      
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 flex flex-col border-r border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out lg:hidden",
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-0 -left-72"
        )}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200 dark:border-slate-800">
          <Link to="/" className="flex items-center space-x-2" onClick={() => setIsMobileSidebarOpen(false)}>
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20">
              <span className="text-white font-extrabold text-lg">G</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-white">GigFlow</span>
          </Link>
          <button 
            onClick={() => setIsMobileSidebarOpen(false)}
            className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-1.5">
          {navLinks.map((link) => (
            <SidebarLink
              key={link.to}
              to={link.to}
              icon={link.icon}
              label={link.label}
              active={location.pathname === link.to}
              onClick={() => setIsMobileSidebarOpen(false)}
            />
          ))}
        </nav>
      </aside>

      {/* ─── MAIN CONTENT CONTAINER ─── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* ─── NAVBAR / HEADER ─── */}
        <header className="flex items-center justify-between h-16 px-4 sm:px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 relative z-30 transition-colors duration-250">
          <div className="flex items-center space-x-4">
            {/* Hamburger for mobile */}
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200 active:bg-slate-100 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            {/* Premium search placeholder */}
            <div className="hidden sm:flex items-center relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="pl-9 pr-4 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl w-60 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 transition-all duration-200"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Notifications */}
            <button className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white dark:ring-slate-900" />
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center space-x-2.5 p-1.5 pr-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200"
              >
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 flex items-center justify-center font-bold text-sm shadow-inner uppercase">
                  {user?.name.charAt(0) || <UserIcon className="w-4 h-4" />}
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-tight">{user?.name}</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user?.role}</div>
                </div>
                <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform duration-200", isProfileDropdownOpen && "transform rotate-180")} />
              </button>

              {/* Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl dark:shadow-slate-950/50 py-2 z-50 animate-fadeIn">
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Signed in as</p>
                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate mt-0.5">{user?.email}</p>
                    <span className="inline-flex items-center px-2 py-0.5 text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 rounded-full mt-2 capitalize">
                      {user?.role} Role
                    </span>
                  </div>
                  
                  <div className="px-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all duration-200 font-medium"
                    >
                      <LogOut className="w-4 h-4 mr-2.5" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ─── DASHBOARD CONTENT AREA ─── */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 dark:bg-slate-950 p-4 sm:p-6 lg:p-8 transition-colors duration-250">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

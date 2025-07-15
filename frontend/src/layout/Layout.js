import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from "../assets/desktop-logo.png";
import logo1 from "../assets/toggle-logo.png";

// Sidebar Item Component
const SidebarItem = ({ item, isActive, onSubMenuToggle, isCollapsed, isSubMenuOpen }) => {
    const location = useLocation();
    const hasChildren = Array.isArray(item.children) && item.children.length > 0;

    const toggleSubMenu = (e) => {
        e.preventDefault();
        if (hasChildren) {
            onSubMenuToggle(item.label);
        }
    };

    return (
        <li className="mb-1">
            {item.path && !hasChildren ? (
                <Link
                    to={item.path}
                    className={`flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 ${
                        isActive ? 'text-[#735dff] bg-gray-100 font-semibold' : 'text-gray-700'
                    } ${isCollapsed ? 'justify-center' : ''}`}
                >
                    {item.icon && <span className={`${isCollapsed ? 'mx-auto' : 'mr-3'}`}>{item.icon}</span>}
                    {!isCollapsed && <span>{item.label}</span>}
                </Link>
            ) : (
                <div
                    className={`flex items-center p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer ${
                        isActive ? 'text-[#735dff] bg-gray-100 font-semibold' : 'text-gray-700'
                    } ${isCollapsed ? 'justify-center' : ''}`}
                    onClick={toggleSubMenu}
                >
                    {item.icon && <span className={`${isCollapsed ? 'mx-auto' : 'mr-3'}`}>{item.icon}</span>}
                    {!isCollapsed && <span>{item.label}</span>}
                    {hasChildren && !isCollapsed && (
                        <span className={`ml-auto transition-transform duration-200 ${isSubMenuOpen ? 'rotate-180' : ''}`}>
                            ▼
                        </span>
                    )}
                </div>
            )}

            {hasChildren && isSubMenuOpen && !isCollapsed && (
                <ul className="ml-6 mt-1 space-y-1">
                    {item.children.map(child => {
                        const isChildActive = location.pathname === child.path;
                        return (
                            <li key={child.label}>
                                <Link
                                    to={child.path}
                                    className={`block p-2 text-sm rounded-lg hover:bg-gray-100 transition-colors duration-200 ${
                                        isChildActive ? 'text-[#735dff] bg-gray-100 font-medium' : 'text-gray-600'
                                    }`}
                                >
                                    {child.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            )}
        </li>
    );
};

// Sidebar Component
const Sidebar = ({ menuItems, isCollapsed }) => {
    const [openSubMenus, setOpenSubMenus] = useState({});
    const location = useLocation();

    const handleSubMenuToggle = (label) => {
        setOpenSubMenus(prev => ({
            [label]: !prev[label]
        }));
    };

    const isMenuItemActive = (item) => {
        if (item.path === location.pathname) return true;
        if (item.children) {
            return item.children.some(child => child.path === location.pathname);
        }
        return false;
    };

    useEffect(() => {
        const newOpenSubMenus = {};
        menuItems.forEach(item => {
            if (item.children && item.children.some(child => child.path === location.pathname)) {
                newOpenSubMenus[item.label] = true;
            }
        });
        setOpenSubMenus(newOpenSubMenus);
    }, [location.pathname, menuItems]);

    return (
        <div
            className={`bg-white shadow-lg flex-shrink-0 transition-all duration-300 ease-in-out ${
                isCollapsed ? 'w-16' : 'w-64'
            } h-screen sticky top-0`}
        >
            <div className="flex items-center justify-center h-16">
                <img
                    src={isCollapsed ? logo1 : logo}
                    alt="logo"
                    className={`${isCollapsed ? 'w-8' : 'w-32'} transition-all duration-300`}
                />
            </div>
            <div
                className="h-[calc(100vh-4rem)] overflow-y-auto no-scrollbar"
                style={{
                    // Hide scrollbar for WebKit browsers
                    scrollbarWidth: 'none', // Firefox
                    msOverflowStyle: 'none', // IE and Edge
                }}
            >
                <ul className="list-none p-3">
                    {menuItems.map(item => (
                        <SidebarItem
                            key={item.label}
                            item={item}
                            isActive={isMenuItemActive(item)}
                            onSubMenuToggle={handleSubMenuToggle}
                            isCollapsed={isCollapsed}
                            isSubMenuOpen={openSubMenus[item.label] || false}
                        />
                    ))}
                </ul>
            </div>
        </div>
    );
};

// Header Component
const Header = ({ onMenuToggle, isSidebarCollapsed }) => {
    const { user, logout, isMasterAdmin } = useAuth();
    
    const handleLogout = async () => {
        await logout();
    };
    
    return (
        <div className="bg-white shadow-md flex items-center justify-between h-16 px-4 sticky top-0 z-9">
            <div className="flex items-center">
                <button
                    className="text-gray-500 focus:outline-none mr-4"
                    onClick={onMenuToggle}
                >
                    <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <div className="text-sm text-gray-600">
                    <span>Dashboard</span>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-right">
                    <div className="text-sm font-medium text-gray-700">{user?.name || 'User'}</div>
                    <div className="text-xs text-gray-500 flex items-center gap-1">
                        <span className="capitalize">{user?.role || 'user'}</span>
                        {isMasterAdmin() && <span className="text-blue-600">👑</span>}
                    </div>
                </div>
                <button
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                    onClick={handleLogout}
                >
                    Logout
                </button>
            </div>
        </div>
    );
};

// Layout Component
function Layout({ children, menuItems }) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const handleMenuToggle = () => {
        setIsSidebarCollapsed(prev => !prev);
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar menuItems={menuItems} isCollapsed={isSidebarCollapsed} />
            <div className="flex flex-col flex-1">
                <Header onMenuToggle={handleMenuToggle} isSidebarCollapsed={isSidebarCollapsed} />
                <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default Layout;
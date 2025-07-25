import React from 'react';
import { Camera, User, LogOut, Home } from 'lucide-react';
import { User as UserType } from '../types';

interface NavbarProps {
  user: UserType | null;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  currentView: string;
}

const Navbar: React.FC<NavbarProps> = ({ user, onNavigate, onLogout, currentView }) => {
  if (!user) return null;

  const navItems = [
    { id: 'home', icon: Home, label: '홈' },
    { id: 'upload', icon: Camera, label: '업로드' },
    { id: 'profile', icon: User, label: '프로필' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200 z-50 md:top-0 md:bottom-auto md:border-b md:border-t-0">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="hidden md:flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
              Lechabo
            </span>
          </div>
          
          <div className="flex items-center justify-center flex-1 md:flex-none">
            <div className="flex items-center space-x-1 md:space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                    currentView === item.id
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-xs md:text-sm font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <img
                src={user.profilePic}
                alt={user.username}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-sm font-medium text-gray-700">{user.username}</span>
            </div>
            <button
              onClick={onLogout}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
              title="로그아웃"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
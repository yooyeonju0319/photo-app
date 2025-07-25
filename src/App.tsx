import React, { useState, useEffect } from 'react';
import { User, Photo } from './types';
import { getCurrentUser, clearCurrentUser } from './utils/storage';
import { getAllPhotos } from './utils/database';
import AuthScreen from './components/AuthScreen';
import Navbar from './components/Navbar';
import PhotoGallery from './components/PhotoGallery';
import PhotoUpload from './components/PhotoUpload';
import UserProfile from './components/UserProfile';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState('home');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing user session
    const user = getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    
    // Load photos
    loadPhotos();
    setIsLoading(false);
  }, []);

  const loadPhotos = async () => {
    const allPhotos = await getAllPhotos();
    setPhotos(allPhotos);
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCurrentView('home');
  };

  const handleLogout = () => {
    clearCurrentUser();
    setCurrentUser(null);
    setCurrentView('home');
  };

  const handleNavigate = (view: string) => {
    setCurrentView(view);
  };

  const handleUploadSuccess = () => {
    loadPhotos();
    setCurrentView('home');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-8 h-8 bg-white rounded opacity-50"></div>
          </div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <AuthScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <Navbar
        user={currentUser}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        currentView={currentView}
      />
      
      <main className="pt-20 pb-20 md:pt-24 md:pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          {currentView === 'home' && (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2">
                  Lechabo
                </h1>
                <p className="text-gray-600">
                  안녕하세요, <span className="font-semibold text-purple-600">@{currentUser.username}</span>님!
                </p>
              </div>
              <PhotoGallery
                photos={photos}
                currentUser={currentUser}
                onPhotosUpdate={loadPhotos}
              />
            </div>
          )}
          
          {currentView === 'upload' && (
            <PhotoUpload
              user={currentUser}
              onUploadSuccess={handleUploadSuccess}
            />
          )}
          
          {currentView === 'profile' && (
            <UserProfile
              user={currentUser}
              photos={photos}
            />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
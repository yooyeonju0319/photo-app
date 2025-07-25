import React from 'react';
import { Camera, Calendar, Heart, Image as ImageIcon } from 'lucide-react';
import { User, Photo } from '../types';

interface UserProfileProps {
  user: User;
  photos: Photo[];
}

const UserProfile: React.FC<UserProfileProps> = ({ user, photos }) => {
  const userPhotos = photos.filter(photo => photo.uploader === user.username);
  const totalLikes = userPhotos.reduce((sum, photo) => sum + (photo.likes?.length || 0), 0);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-pink-500 to-purple-600"></div>
        <div className="px-6 pb-6 -mt-16">
          <div className="flex flex-col md:flex-row items-center md:items-end space-y-4 md:space-y-0 md:space-x-6">
            <img
              src={user.profilePic}
              alt={user.username}
              className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
            />
            <div className="text-center md:text-left flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">@{user.username}</h1>
              <div className="flex items-center justify-center md:justify-start space-x-1 text-gray-600 mb-4">
                <Calendar className="w-4 h-4" />
                <span>가입일: {formatDate(user.createdAt)}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start space-x-6">
                <div className="text-center">
                  <div className="flex items-center space-x-1">
                    <ImageIcon className="w-5 h-5 text-purple-600" />
                    <span className="text-2xl font-bold text-gray-900">{userPhotos.length}</span>
                  </div>
                  <span className="text-sm text-gray-600">사진</span>
                </div>
                <div className="text-center">
                  <div className="flex items-center space-x-1">
                    <Heart className="w-5 h-5 text-red-500" />
                    <span className="text-2xl font-bold text-gray-900">{totalLikes}</span>
                  </div>
                  <span className="text-sm text-gray-600">좋아요</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Photos Grid */}
      <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Camera className="w-6 h-6 mr-2 text-purple-600" />
          내 사진들
        </h2>
        
        {userPhotos.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">아직 업로드한 사진이 없습니다</h3>
            <p className="text-gray-500">첫 번째 사진을 업로드해보세요!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {userPhotos.map((photo) => (
              <div key={photo.id} className="relative group cursor-pointer">
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-32 object-cover rounded-lg transition-transform duration-200 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                  <div className="text-white text-center">
                    <h4 className="font-semibold text-sm mb-1">{photo.title}</h4>
                    <div className="flex items-center justify-center space-x-2 text-xs">
                      <Heart className="w-3 h-3" />
                      <span>{photo.likes?.length || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
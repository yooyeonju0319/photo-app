import React, { useState } from 'react';
import { Heart, MessageCircle, Share, User, Calendar, Tag, X } from 'lucide-react';
import { Photo, User as UserType } from '../types';
import { updatePhotoLikes } from '../utils/database';

interface PhotoGalleryProps {
  photos: Photo[];
  currentUser: UserType;
  onPhotosUpdate: () => void;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos, currentUser, onPhotosUpdate }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const handleLike = async (photo: Photo) => {
    const likes = photo.likes || [];
    const isLiked = likes.includes(currentUser.username);
    
    const updatedLikes = isLiked 
      ? likes.filter(username => username !== currentUser.username)
      : [...likes, currentUser.username];

    const success = await updatePhotoLikes(photo.id, updatedLikes);
    if (success) {
      onPhotosUpdate();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {photos.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">아직 업로드된 사진이 없습니다</h3>
          <p className="text-gray-500">첫 번째 사진을 업로드해보세요!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo) => {
            const isLiked = photo.likes?.includes(currentUser.username) || false;
            const likeCount = photo.likes?.length || 0;

            return (
              <div key={photo.id} className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="relative">
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-64 object-cover cursor-pointer"
                    onClick={() => setSelectedPhoto(photo)}
                  />
                  <div className="absolute top-4 right-4">
                    <button
                      onClick={() => handleLike(photo)}
                      className={`p-2 rounded-full backdrop-blur-sm transition-all duration-200 shadow-lg ${
                        isLiked 
                          ? 'bg-red-500 text-white' 
                          : 'bg-white/80 text-gray-600 hover:bg-white hover:text-red-500'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
                
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900 truncate">{photo.title}</h3>
                    <span className="text-sm text-purple-600 font-medium">@{photo.uploader}</span>
                  </div>
                  
                  {photo.description && (
                    <p className="text-gray-600 text-sm line-clamp-2">{photo.description}</p>
                  )}
                  
                  {photo.tags && (
                    <div className="flex items-center space-x-1">
                      <Tag className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">{photo.tags}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center space-x-1 text-sm text-gray-500">
                        <Heart className="w-4 h-4" />
                        <span>{likeCount}</span>
                      </span>
                      <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                        <span>댓글</span>
                      </button>
                      <button className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                        <Share className="w-4 h-4" />
                        <span>공유</span>
                      </button>
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-gray-400">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(photo.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Photo Detail Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setSelectedPhoto(null)}>
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-col md:flex-row">
              <div className="flex-1">
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.title}
                  className="w-full h-64 md:h-96 object-cover"
                />
              </div>
              <div className="flex-1 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedPhoto.title}</h2>
                  <button
                    onClick={() => setSelectedPhoto(null)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="text-purple-600 font-medium">@{selectedPhoto.uploader}</span>
                </div>
                
                {selectedPhoto.description && (
                  <p className="text-gray-700">{selectedPhoto.description}</p>
                )}
                
                {selectedPhoto.tags && (
                  <div className="flex items-center space-x-2">
                    <Tag className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-600">{selectedPhoto.tags}</span>
                  </div>
                )}
                
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(selectedPhoto.createdAt)}</span>
                </div>
                
                <div className="flex items-center space-x-4 pt-4 border-t">
                  <button
                    onClick={() => handleLike(selectedPhoto)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      selectedPhoto.likes?.includes(currentUser.username)
                        ? 'bg-red-50 text-red-600'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${selectedPhoto.likes?.includes(currentUser.username) ? 'fill-current' : ''}`} />
                    <span>{selectedPhoto.likes?.length || 0}</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span>댓글</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                    <Share className="w-5 h-5" />
                    <span>공유</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
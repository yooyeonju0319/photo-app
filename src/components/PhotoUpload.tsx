import React, { useState, useRef } from 'react';
import { Upload, Image, X, Tag, FileText, Camera } from 'lucide-react';
import { User } from '../types';
import { uploadPhotoWithMetadata } from '../utils/upload';

interface PhotoUploadProps {
  user: User;
  onUploadSuccess: () => void;
}

const PhotoUpload: React.FC<PhotoUploadProps> = ({ user, onUploadSuccess }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    tags: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !formData.title) return;

    setLoading(true);
    try {
      const success = await uploadPhotoWithMetadata({
        file: selectedFile,
        uploader: user.username,
        title: formData.title,
        tags: formData.tags,
        description: formData.description,
      });

      if (success) {
        setSelectedFile(null);
        setPreviewUrl('');
        setFormData({ title: '', tags: '', description: '' });
        if (fileInputRef.current) fileInputRef.current.value = '';
        onUploadSuccess();
      } else {
        alert('사진 업로드 실패');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('에러가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Camera className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">새 사진 업로드</h2>
        <p className="text-gray-600">당신의 순간을 Lechabo에서 공유해보세요</p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 space-y-6"
      >
        <div
          className={`relative border-2 border-dashed rounded-xl transition-all duration-200 ${
            dragActive
              ? 'border-purple-500 bg-purple-50'
              : selectedFile
              ? 'border-green-500 bg-green-50'
              : 'border-gray-300 hover:border-purple-500 hover:bg-purple-50/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {previewUrl ? (
            <div className="relative">
              <img src={previewUrl} alt="Preview" className="w-full h-64 object-cover rounded-lg" />
              <button
                type="button"
                onClick={removeSelectedFile}
                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="text-center p-12">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">사진을 드래그하거나 클릭해서 업로드</h3>
              <p className="text-gray-500 mb-4">JPG, PNG, GIF 파일을 지원합니다</p>
              <label className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 cursor-pointer transition-all duration-200 transform hover:scale-105">
                <Image className="w-5 h-5 mr-2" />
                파일 선택
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4" />
              <span>제목 *</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="사진의 제목을 입력하세요"
            />
          </div>

          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Tag className="w-4 h-4" />
              <span>태그</span>
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="#자연 #여행"
            />
          </div>

          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <FileText className="w-4 h-4" />
              <span>설명</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              placeholder="사진에 대한 설명을 입력하세요"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={!selectedFile || !formData.title || loading}
          className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-3 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex justify-center items-center">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              업로드 중...
            </span>
          ) : (
            '사진 업로드'
          )}
        </button>
      </form>
    </div>
  );
};

export default PhotoUpload;

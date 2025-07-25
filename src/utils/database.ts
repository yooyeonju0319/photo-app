import { User, Photo } from '../types';
import { saveUser, validateUser, recoverUser, findUser, savePhoto, getPhotos, updatePhoto, generateId } from './storage';

// User functions
export const createUser = async (userData: {
  username: string;
  password: string;
  question: string;
  answer: string;
}): Promise<User | null> => {
  try {
    const profilePic = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`;
    
    const newUser: User = {
      id: generateId(),
      username: userData.username,
      profilePic,
      question: userData.question,
      createdAt: new Date().toISOString()
    };

    saveUser(newUser, userData.password, userData.answer);
    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
};

export const findUserByUsername = async (username: string): Promise<any | null> => {
  try {
    return findUser(username);
  } catch (error) {
    console.error('Error finding user:', error);
    return null;
  }
};

export const validateUserCredentials = async (username: string, password: string): Promise<User | null> => {
  try {
    return validateUser(username, password);
  } catch (error) {
    console.error('Error validating credentials:', error);
    return null;
  }
};

export const recoverUserAccount = async (username: string, answer: string): Promise<User | null> => {
  try {
    return recoverUser(username, answer);
  } catch (error) {
    console.error('Error recovering account:', error);
    return null;
  }
};

// Photo functions
export const createPhoto = async (photoData: {
  uploader: string;
  url: string;
  title: string;
  tags: string;
  description: string;
}): Promise<Photo | null> => {
  try {
    const newPhoto: Photo = {
      id: generateId(),
      uploader: photoData.uploader,
      url: photoData.url,
      title: photoData.title,
      tags: photoData.tags,
      description: photoData.description,
      likes: [],
      createdAt: new Date().toISOString()
    };

    savePhoto(newPhoto);
    return newPhoto;
  } catch (error) {
    console.error('Error creating photo:', error);
    return null;
  }
};

export const getAllPhotos = async (): Promise<Photo[]> => {
  try {
    return getPhotos();
  } catch (error) {
    console.error('Error fetching photos:', error);
    return [];
  }
};

export const updatePhotoLikes = async (photoId: string, likes: string[]): Promise<boolean> => {
  try {
    const photos = getPhotos();
    const photo = photos.find(p => p.id === photoId);
    if (photo) {
      photo.likes = likes;
      updatePhoto(photo);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error updating photo likes:', error);
    return false;
  }
};
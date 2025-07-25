import { User, Photo } from '../types';

const USERS_KEY = 'lechabo_users';
const PHOTOS_KEY = 'lechabo_photos';
const CURRENT_USER_KEY = 'lechabo_current_user';

// User storage functions
export const saveUser = (user: User, password: string, answer: string): void => {
  const users = getUsers();
  const userWithAuth = { ...user, password, answer };
  users.push(userWithAuth);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const getUsers = (): any[] => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

export const findUser = (username: string): any | null => {
  const users = getUsers();
  return users.find(user => user.username === username) || null;
};

export const validateUser = (username: string, password: string): User | null => {
  const user = findUser(username);
  if (user && user.password === password) {
    const { password: _, answer: __, ...userData } = user;
    return userData;
  }
  return null;
};

export const recoverUser = (username: string, answer: string): User | null => {
  const user = findUser(username);
  if (user && user.answer === answer) {
    const { password: _, answer: __, ...userData } = user;
    return userData;
  }
  return null;
};

// Current user functions
export const setCurrentUser = (user: User): void => {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
};

export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const clearCurrentUser = (): void => {
  localStorage.removeItem(CURRENT_USER_KEY);
};

// Photo storage functions
export const savePhoto = (photo: Photo): void => {
  const photos = getPhotos();
  photos.unshift(photo);
  localStorage.setItem(PHOTOS_KEY, JSON.stringify(photos));
};

export const getPhotos = (): Photo[] => {
  const photos = localStorage.getItem(PHOTOS_KEY);
  return photos ? JSON.parse(photos) : [];
};

export const updatePhoto = (updatedPhoto: Photo): void => {
  const photos = getPhotos();
  const index = photos.findIndex(p => p.id === updatedPhoto.id);
  if (index !== -1) {
    photos[index] = updatedPhoto;
    localStorage.setItem(PHOTOS_KEY, JSON.stringify(photos));
  }
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
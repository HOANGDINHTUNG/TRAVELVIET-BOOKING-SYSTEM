import React, { createContext, useState, useContext } from 'react';

// Định nghĩa kiểu dữ liệu cho Hồ sơ
type ProfileData = {
  name: string;
  phone: string;
  email: string;
  birthday: string;
  province: string;
  avatar: string;
};

type ProfileContextType = {
  profile: ProfileData;
  updateProfile: (newData: Partial<ProfileData>) => void;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const [profile, setProfile] = useState<ProfileData>({
    name: 'Nguyễn Công Trứ',
    phone: '0987654321',
    email: 'tru@gmail.com',
    birthday: '29/05/2003', // Lấy đúng ngày sinh của Trứ nhé
    province: 'TP. Hồ Chí Minh',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
  });

  const updateProfile = (newData: Partial<ProfileData>) => {
    setProfile(prev => ({ ...prev, ...newData }));
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) throw new Error('useProfile must be used within a ProfileProvider');
  return context;
};
// 'use client';

// import { createContext, useContext, useEffect, useState } from 'react';
// import axios from '@/utils/api';
// import { useRouter } from 'next/navigation';

// interface IUser {
//   _id: string;
//   name: string;
//   email: string;
//   role: 'admin' | 'user';
// }

// interface IUserContext {
//   user: IUser | null;
//   loading: boolean;
//   logout: () => void;
// }

// const UserContext = createContext<IUserContext>({
//   user: null,
//   loading: true,
//   logout: () => {},
// });

// export const useUser = () => useContext(UserContext);

// export const UserProvider = ({ children }: { children: React.ReactNode }) => {
//   const [user, setUser] = useState<IUser | null>(null);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   // const fetchUser = async () => {
//   //   try {
//   //     const res = await axios.get('/user/me');
//   //     setUser(res.data.data);
//   //   } catch (err) {
//   //     setUser(null);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   // useEffect(() => {
//   //   fetchUser();
//   // }, []);

//   const logout = async () => {
//     try {
//       setUser(null);
//       router.push('/');
//     } catch (err) {
//       router.push('/');
//     }
//   };

//   return (
//     <UserContext.Provider value={{user, loading, logout }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

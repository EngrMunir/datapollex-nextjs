// 'use client';

// import { useRouter } from 'next/navigation';
// import { useEffect } from 'react';

// export default function withAuth<T>(Component: React.ComponentType<T>) {
//   return function ProtectedComponent(props: T) {
//     const { user, loading } = useUser();
//     const router = useRouter();

//     useEffect(() => {
//       if (!loading && !user) {
//         router.push('/login');
//       }
//     }, [loading, user, router]);

//     if (loading || !user) return <div className="p-6">Checking authentication...</div>;

//     return <Component {...props} />;
//   };
// }

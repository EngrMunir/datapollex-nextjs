// import { UserProvider } from '@/context/UserContext';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata = { title: 'LMS App' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Toaster position="top-right" />
        {/* <UserProvider></UserProvider> */}
        {children}
      </body>
    </html>
  );
}

import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';
import SearchBanner from '@/components/layout/SearchBanner';
import Footer from '@/components/layout/Footer';

export const metadata = {
  title: 'MovieExplorer',
  description: 'Browse trending and popular movies powered by TMDB',
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <AuthProvider>
          <Navbar />
          <SearchBanner />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

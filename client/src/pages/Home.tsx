import Navbar from '@/features/home/components/Navbar';
import Hero from '@/features/home/components/Hero';
import Footer from '@/features/home/components/Footer';
import { Outlet } from 'react-router-dom';
const Home = () => {
  return (
    <div className='flex flex-col min-h-screen'>
      <div className='flex-1'>
        <Navbar />
        <Hero />
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Home;

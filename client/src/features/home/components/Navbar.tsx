import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Star, Moon, Sun } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { useTheme } from '@/app/context/ThemeContext';
import { getGithubStar } from '@/features/home/services/githubStarService';

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(theme === 'dark');
  const [starCount, setStarCount] = useState(0);

  const handleTheme = (isThemeDark: boolean) => {
    if (isDark === isThemeDark) return;
    setIsDark(isThemeDark);
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    getGithubStar().then((value) => setStarCount(value));
  }, []);

  return (
    <header className='fixed w-full z-50'>
      <nav className='backdrop-blur-lg bg-background dark:bg-background border-gray-200 py-2.5'>
        <div className='flex flex-wrap items-center justify-between max-w-screen-xl px-4 mx-auto'>
          <a href='/' className='flex items-center' aria-label='Taskmotion Home'>
            <img src='/favicon-128x128.png' className='w-8 mr-2' alt='Taskmotion Logo' />
            <span className='self-center text-xl font-semibold whitespace-nowrap dark:text-white text-neutral-600 hidden sm:inline-block'>
              Taskmotion
            </span>
          </a>
          <div className='flex items-center lg:order-2 gap-x-3'>
            <button
              className='relative w-14 h-7 rounded-full bg-background/95 border border-foreground/10 dark:border-input/40 cursor-pointer'
              onClick={() => handleTheme(!isDark)}
            >
              <div
                className={`absolute top-[1px] h-6 w-6 rounded-full transition-all duration-300 ease-in-out flex items-center justify-center
                ${isDark ? 'left-[calc(100%-1.6rem)]' : 'left-0.5'} 
                ${isDark ? 'bg-neutral-800' : 'bg-neutral-100'}`}
              >
                {isDark ? (
                  <Moon className='h-4 w-4 text-neutral-50' />
                ) : (
                  <Sun className='h-4 w-4 text-neutral-800' />
                )}
              </div>
            </button>
            <a
              className='flex items-center text-gray-300 hover:text-gray-500 transition-colors'
              href='https://github.com/jonpena/taskmotion'
              target='_blank'
              rel='noopener noreferrer'
            >
              <div className='h-9 pl-3 flex items-center rounded-md bg-gray-200 dark:bg-neutral-800 dark:hover:bg-neutral-700/60 cursor-pointer shadow-sm transition-transform transform'>
                <Star className='w-4 h-4 mr-2 text-gray-800 dark:text-gray-200' />
                <div className='hidden mr-2 sm:inline-block text-gray-800 dark:text-white'>
                  stars
                </div>
                <span className='h-9 font-medium text-sm bg-gray-500 text-white dark:text-gray-800 dark:bg-gray-400 rounded-r-md border-gray-700 px-3 flex items-center'>
                  {starCount}
                </span>
              </div>
            </a>
            <Button
              variant='outline'
              onClick={() => navigate('/login')}
              className='font-medium transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 
                dark:text-white dark:bg-neutral-900 dark:border-neutral-700
                shadow-sm'
            >
              Login
            </Button>
          </div>
          <div
            className='items-center justify-between hidden w-full lg:flex lg:w-auto lg:order-1'
            id='mobile-menu-2'
          ></div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

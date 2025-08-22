import { ListTodo, Target, Zap, Calendar, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <main className='grid grid-cols-1 md:grid-cols-3 gap-4 p-4 max-w-7xl mx-auto pt-28'>
      <div className='md:col-span-2 bg-gradient-to-br from-primary to-primary/80 rounded-xl p-8 text-primary-foreground'>
        <h1 className='text-4xl font-bold mb-4'>Organize Your Life</h1>
        <p className='text-lg mb-6 text-primary-foreground/90'>
          Transform your daily tasks into achievable goals with our intuitive todo app.
        </p>
        <button
          onClick={() => navigate('/login')}
          className='bg-background text-primary hover:bg-accent px-6 py-3 rounded-xl font-semibold transition-all'
        >
          Get Started
        </button>
      </div>

      {/* Stats Card - Updated background and text colors */}
      <div className='bg-card/60 dark:bg-neutral-950/60 backdrop-blur-lg rounded-xl p-6 text-card-foreground border border-border/50'>
        <div className='flex flex-col h-full justify-center items-center'>
          <h3 className='text-2xl font-semibold mb-2'>Trusted by Users</h3>
          <p className='text-5xl font-bold text-primary'>10k+</p>
          <p className='text-muted-foreground mt-2'>Active Users</p>
        </div>
      </div>

      {/* Features Grid - Updated styling for all feature cards */}
      <div className='bg-card/60 dark:bg-neutral-950/60  backdrop-blur-lg rounded-xl p-6 text-card-foreground border border-border/50'>
        <ListTodo className='h-8 w-8 text-primary mb-4' />
        <h3 className='text-xl font-semibold mb-2'>Smart Lists</h3>
        <p className='text-muted-foreground'>Organize tasks with intelligent categorization</p>
      </div>

      <div className='bg-card/60 dark:bg-neutral-950/60  backdrop-blur-lg rounded-xl p-6 text-card-foreground border border-border/50'>
        <Target className='h-8 w-8 text-primary mb-4' />
        <h3 className='text-xl font-semibold mb-2'>Goal Tracking</h3>
        <p className='text-muted-foreground'>Set and achieve your personal milestones</p>
      </div>

      <div className='bg-card/60 dark:bg-neutral-950/60  backdrop-blur-lg rounded-xl p-6 text-card-foreground border border-border/50'>
        <Zap className='h-8 w-8 text-primary mb-4' />
        <h3 className='text-xl font-semibold mb-2'>Quick Actions</h3>
        <p className='text-muted-foreground'>Complete tasks with minimal interaction</p>
      </div>

      {/* Testimonial - Updated styling */}
      <div className='md:col-span-2 bg-card/60 dark:bg-neutral-950/60  backdrop-blur-lg rounded-xl p-6 text-card-foreground border border-border/50'>
        <Star className='h-6 w-6 text-yellow-500 mb-4' />
        <p className='text-lg mb-4'>
          "This todo app has completely transformed how I manage my daily tasks. The interface is
          beautiful and intuitive!"
        </p>
        <p className='font-semibold'>- Jonathan Peña</p>
        <p className='text-sm text-muted-foreground'>Full Stack Developer</p>
      </div>

      {/* Calendar Preview */}
      <div className='bg-card/60 dark:bg-neutral-950/60  backdrop-blur-lg rounded-xl p-6 text-card-foreground border border-border/50'>
        <Calendar className='h-8 w-8 text-primary mb-4' />
        <h3 className='text-xl font-semibold mb-2'>Calendar View</h3>
        <p className='text-muted-foreground'>Visualize your tasks in a beautiful calendar layout</p>
      </div>
    </main>
  );
};

export default Hero;

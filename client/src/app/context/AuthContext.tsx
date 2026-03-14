import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/supabase/supabase.config';
import { UserProps } from '@/shared/types/user.types';
import { useNavigate } from 'react-router';

const AuthContext = createContext({
  signInWithGoogle: () => {},
  signInWithGithub: () => {},
  signout: async () => {},
  user: {
    email: '',
    fullname: '',
    picture: '',
  } as UserProps,
  loading: true,
});

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState({} as UserProps);
  const [loading, setLoading] = useState(true);

  async function signInWithGoogle() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw new Error('A ocurrido un error durante la autenticación');
      return data;
    } catch (error) {
      throw new Error('A ocurrido un error durante la autenticación');
    }
  }

  async function signInWithGithub() {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw new Error('A ocurrido un error durante la autenticación');
      return data;
    } catch (error) {
      throw new Error('A ocurrido un error durante la autenticación');
    }
  }

  const signout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) throw new Error('A ocurrido un error durante el cierre de sesión');
  };

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (_, session) => {
      if (session === null) {
        const isLoginPage = window.location.pathname.includes('login');
        navigate(isLoginPage ? '/login' : '/');
        setUser({} as UserProps);
      } else {
        setUser({
          email: session.user.user_metadata.email,
          fullname: session.user.user_metadata.full_name,
          picture: session.user.user_metadata.picture,
        });
      }
      setLoading(false);
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ signInWithGoogle, signInWithGithub, signout, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};

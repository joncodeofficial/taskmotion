import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/supabase/supabase.config';
import { UserProps } from '@/shared/types/user.types';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext({
  signInWithGoogle: () => {},
  signInWithGithub: () => {},
  signout: async () => {},
  user: {
    email: '',
    fullname: '',
    picture: '',
  } as UserProps,
});

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState({} as UserProps);
  const location = useLocation();

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
        navigate(location.pathname.includes('login') ? '/login' : '/');
        setUser({} as UserProps);
      } else {
        setUser({
          email: session.user.user_metadata.email,
          fullname: session.user.user_metadata.full_name,
          picture: session.user.user_metadata.picture,
        });
      }
    });
    return () => {
      authListener.subscription;
    };
  }, [location.pathname, navigate]);

  return (
    <AuthContext.Provider value={{ signInWithGoogle, signInWithGithub, signout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};

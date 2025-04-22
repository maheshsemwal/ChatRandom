import { LoginForm } from '@/components/login-form';
import { useUser } from '@/context/UserProvider';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      console.log(user);
      navigate('/chat');
    }
  }, [user, navigate]);
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-background p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;

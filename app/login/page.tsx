import { LoginForm } from '@/components/auth/login-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login • CBT Platform',
  description: 'Sign in to access your exams and dashboard',
};

export default function LoginPage() {
  return <LoginForm />;
}
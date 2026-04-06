import { redirectIfSessionOnAuthPage } from '@/lib/auth/redirectIfSessionOnAuthPage';

import LoginForm from '../_features/LoginForm';

type LoginPageProps = {
  searchParams: Promise<{ callbackUrl?: string | string[]; error?: string | string[] }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  await redirectIfSessionOnAuthPage(await searchParams);
  return <LoginForm />;
}

import { redirectIfSessionOnAuthPage } from '@/lib/auth/redirectIfSessionOnAuthPage';

import SignupForm from '../_features/SignupForm';

type SignupPageProps = {
  searchParams: Promise<{ callbackUrl?: string | string[]; error?: string | string[] }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  await redirectIfSessionOnAuthPage(await searchParams);
  return <SignupForm />;
}

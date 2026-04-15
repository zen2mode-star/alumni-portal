import { getOpenRegistrationStatus } from '@/actions/admin';
import RegisterClient from './RegisterClient';

export const dynamic = 'force-dynamic';

export default async function RegisterPage() {
  const isOpen = await getOpenRegistrationStatus();

  return <RegisterClient isOpen={isOpen} />;
}

import { useApp } from '@/context/app-context';
import { AuthScreen } from '@/screens/auth-screen';
import { DashboardScreen } from '@/screens/dashboard-screen';

export default function IndexScreen() {
  const { currentUser } = useApp();
  return currentUser ? <DashboardScreen /> : <AuthScreen />;
}

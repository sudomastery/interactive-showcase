import { Header } from '@/components/layout/Header';
import { TransactionDashboard } from '@/components/dashboard/TransactionDashboard';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <TransactionDashboard />
    </div>
  );
}

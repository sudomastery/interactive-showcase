import { Header } from '@/components/layout/Header';
import { PaymentVerification } from '@/components/payment/PaymentVerification';

export default function Verify() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <PaymentVerification />
    </div>
  );
}

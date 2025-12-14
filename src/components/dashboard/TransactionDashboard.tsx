import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { mockTransactions } from '@/data/mockData';
import { Transaction } from '@/types/auth';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  MapPin, 
  Clock, 
  RefreshCw,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Users,
  Building2
} from 'lucide-react';

export function TransactionDashboard() {
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const successCount = transactions.filter((t) => t.status === 'success').length;
  const failedCount = transactions.filter((t) => t.status === 'failed').length;
  const pendingCount = transactions.filter((t) => t.status === 'pending').length;
  const totalAmount = transactions
    .filter((t) => t.status === 'success')
    .reduce((sum, t) => sum + t.amount, 0);
  const successRate = ((successCount / transactions.length) * 100).toFixed(1);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsRefreshing(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-KE', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getStatusIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-success" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-destructive" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4 text-warning" />;
    }
  };

  const getStatusBadge = (status: Transaction['status']) => {
    switch (status) {
      case 'success':
        return <Badge variant="success">Success</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'pending':
        return <Badge variant="warning">Pending</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-6 lg:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
        >
          <div>
            <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground mb-2">
              Transaction Dashboard
            </h1>
            <p className="text-muted-foreground">
              Monitor payment activity and verification logs
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            variant="outline"
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card variant="elevated">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Disbursed</p>
                    <p className="text-2xl font-bold font-display">
                      KES {(totalAmount / 1000).toFixed(0)}K
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-primary-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card variant="elevated">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Success Rate</p>
                    <p className="text-2xl font-bold font-display text-success">
                      {successRate}%
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl gradient-success flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-success-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card variant="elevated">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Failed</p>
                    <p className="text-2xl font-bold font-display text-destructive">
                      {failedCount}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-xl gradient-destructive flex items-center justify-center">
                    <TrendingDown className="w-6 h-6 text-destructive-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Card variant="elevated">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Transactions</p>
                    <p className="text-2xl font-bold font-display">{transactions.length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                    <Activity className="w-6 h-6 text-secondary-foreground" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Transactions Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card variant="elevated">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Recent Transactions
              </CardTitle>
              <CardDescription>
                Last 10 payment verification attempts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Time</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Agent</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Supplier</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Amount</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Distance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction, index) => (
                      <motion.tr
                        key={transaction.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * index }}
                        className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(transaction.status)}
                            {getStatusBadge(transaction.status)}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            {formatDate(transaction.timestamp)}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                              <Users className="w-3 h-3 text-primary" />
                            </div>
                            <span className="text-sm font-medium">{transaction.agentName}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-3 h-3 text-muted-foreground" />
                            <span className="text-sm">{transaction.supplierName}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="font-medium">
                            KES {transaction.amount.toLocaleString()}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <MapPin className="w-3 h-3 text-muted-foreground" />
                            <span
                              className={`text-sm font-medium ${
                                transaction.distance <= 20
                                  ? 'text-success'
                                  : 'text-destructive'
                              }`}
                            >
                              {transaction.distance.toFixed(1)}m
                            </span>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

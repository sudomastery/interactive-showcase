import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LocationMap } from '@/components/map/LocationMap';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { mockSuppliers } from '@/data/mockData';
import { Supplier, PaymentStatus } from '@/types/auth';
import { 
  MapPin, 
  Navigation, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Wallet, 
  Building2,
  Phone,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

// Haversine formula to calculate distance between two points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

export function PaymentVerification() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<PaymentStatus>('idle');
  const [distance, setDistance] = useState<number | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const getLocation = () => {
    setStatus('locating');
    setLocationError(null);
    
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setStatus('failed');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
        setStatus('idle');
        toast.success('Location captured!', {
          description: `Accuracy: ${Math.round(position.coords.accuracy)}m`,
        });
      },
      (error) => {
        let message = 'Unable to retrieve location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location permission denied. Please enable GPS access.';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Location information unavailable.';
            break;
          case error.TIMEOUT:
            message = 'Location request timed out.';
            break;
        }
        setLocationError(message);
        setStatus('failed');
        toast.error('Location Error', { description: message });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    if (userLocation && selectedSupplier) {
      const dist = calculateDistance(
        userLocation.lat,
        userLocation.lon,
        selectedSupplier.lat,
        selectedSupplier.lon
      );
      setDistance(dist);
    } else {
      setDistance(null);
    }
  }, [userLocation, selectedSupplier]);

  const handlePayment = async () => {
    if (!userLocation || !selectedSupplier || !amount) {
      toast.error('Missing information', {
        description: 'Please ensure location, supplier, and amount are provided',
      });
      return;
    }

    setStatus('verifying');
    await new Promise((r) => setTimeout(r, 1500));

    if (distance && distance > 20) {
      setStatus('failed');
      toast.error('Verification Failed', {
        description: `You are ${distance.toFixed(1)}m away. Must be within 20m of the supplier hub.`,
      });
      return;
    }

    setStatus('processing');
    await new Promise((r) => setTimeout(r, 2000));

    setStatus('success');
    toast.success('Payment Sent!', {
      description: `KES ${Number(amount).toLocaleString()} sent to ${selectedSupplier.name}`,
    });
  };

  const resetPayment = () => {
    setStatus('idle');
    setAmount('');
  };

  const isWithinRange = distance !== null && distance <= 20;
  const canPay = userLocation && selectedSupplier && amount && status === 'idle';

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-6 lg:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground mb-2">
            Location Verification & Payment
          </h1>
          <p className="text-muted-foreground">
            Verify your location at the supplier hub to initiate M-Pesa payment
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="h-[400px] lg:h-[500px]"
            >
              <LocationMap
                userLocation={userLocation}
                suppliers={mockSuppliers}
                selectedSupplier={selectedSupplier}
                onSupplierSelect={setSelectedSupplier}
              />
            </motion.div>

            {/* Location Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4"
            >
              <Button
                onClick={getLocation}
                disabled={status === 'locating'}
                variant={userLocation ? 'secondary' : 'default'}
                size="lg"
                className="w-full sm:w-auto"
              >
                {status === 'locating' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Capturing Location...
                  </>
                ) : userLocation ? (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Refresh Location
                  </>
                ) : (
                  <>
                    <Navigation className="w-4 h-4" />
                    Capture My Location
                  </>
                )}
              </Button>

              {userLocation && (
                <p className="text-sm text-muted-foreground mt-2">
                  <MapPin className="inline w-3 h-3 mr-1" />
                  {userLocation.lat.toFixed(6)}, {userLocation.lon.toFixed(6)}
                </p>
              )}

              {locationError && (
                <p className="text-sm text-destructive mt-2">
                  <XCircle className="inline w-3 h-3 mr-1" />
                  {locationError}
                </p>
              )}
            </motion.div>
          </div>

          {/* Payment Panel */}
          <div className="lg:col-span-2 space-y-4">
            {/* Supplier Selection */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card variant={selectedSupplier ? 'success' : 'default'}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Select Supplier Hub
                  </CardTitle>
                  <CardDescription>
                    Click on a marker on the map or select below
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {mockSuppliers.map((supplier) => (
                    <motion.button
                      key={supplier.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => setSelectedSupplier(supplier)}
                      className={`w-full p-3 rounded-lg text-left transition-all border ${
                        selectedSupplier?.id === supplier.id
                          ? 'border-success bg-success/10'
                          : 'border-border bg-secondary/30 hover:bg-secondary/50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm">{supplier.name}</p>
                          <p className="text-xs text-muted-foreground">{supplier.address}</p>
                        </div>
                        {selectedSupplier?.id === supplier.id && (
                          <CheckCircle2 className="w-5 h-5 text-success" />
                        )}
                      </div>
                    </motion.button>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Distance Indicator */}
            <AnimatePresence>
              {distance !== null && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <Card variant={isWithinRange ? 'success' : 'destructive'}>
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {isWithinRange ? (
                            <div className="w-10 h-10 rounded-full gradient-success flex items-center justify-center">
                              <CheckCircle2 className="w-5 h-5 text-success-foreground" />
                            </div>
                          ) : (
                            <div className="w-10 h-10 rounded-full gradient-destructive flex items-center justify-center">
                              <XCircle className="w-5 h-5 text-destructive-foreground" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium">
                              {isWithinRange ? 'Within Range' : 'Out of Range'}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {distance.toFixed(1)}m from hub (max 20m)
                            </p>
                          </div>
                        </div>
                        <Badge variant={isWithinRange ? 'success' : 'destructive'}>
                          {distance.toFixed(0)}m
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Payment Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Wallet className="w-5 h-5" />
                    Payment Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedSupplier && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-secondary/50">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">M-Pesa: {selectedSupplier.mpesaPhone}</span>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (KES)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Enter amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      disabled={status !== 'idle'}
                    />
                  </div>

                  {/* Payment Status Button */}
                  <AnimatePresence mode="wait">
                    {status === 'success' ? (
                      <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="space-y-3"
                      >
                        <div className="flex items-center justify-center gap-2 p-4 rounded-lg gradient-success text-success-foreground">
                          <CheckCircle2 className="w-6 h-6" />
                          <span className="font-semibold">Payment Successful!</span>
                        </div>
                        <Button variant="outline" className="w-full" onClick={resetPayment}>
                          Make Another Payment
                        </Button>
                      </motion.div>
                    ) : status === 'failed' && distance && distance > 20 ? (
                      <motion.div
                        key="failed"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="space-y-3"
                      >
                        <div className="flex items-center justify-center gap-2 p-4 rounded-lg gradient-destructive text-destructive-foreground">
                          <XCircle className="w-6 h-6" />
                          <span className="font-semibold">Verification Failed</span>
                        </div>
                        <Button variant="outline" className="w-full" onClick={() => setStatus('idle')}>
                          Try Again
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="button"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <Button
                          onClick={handlePayment}
                          disabled={!canPay || status !== 'idle'}
                          size="lg"
                          variant={canPay ? 'glow' : 'secondary'}
                          className="w-full"
                        >
                          {status === 'verifying' ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Verifying Location...
                            </>
                          ) : status === 'processing' ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Processing M-Pesa...
                            </>
                          ) : (
                            <>
                              Verify & Pay
                              <ArrowRight className="w-4 h-4" />
                            </>
                          )}
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

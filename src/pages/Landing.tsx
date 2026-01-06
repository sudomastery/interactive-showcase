import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Shield, Smartphone, Users, CheckCircle, ArrowRight, Zap, Globe } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const features = [
  {
    icon: MapPin,
    title: 'GPS Verification',
    description: 'Ensure payments happen at verified supplier locations with real-time geolocation tracking.',
  },
  {
    icon: Shield,
    title: 'Secure Transactions',
    description: 'End-to-end encrypted M-Pesa integration for safe and reliable mobile payments.',
  },
  {
    icon: Smartphone,
    title: 'Mobile First',
    description: 'Optimized for field agents with intuitive mobile interface and offline support.',
  },
  {
    icon: Users,
    title: 'Role-Based Access',
    description: 'Separate dashboards for field agents and administrators with custom permissions.',
  },
];

const stats = [
  { value: '99.9%', label: 'Uptime' },
  { value: '50ms', label: 'Avg Response' },
  { value: '10K+', label: 'Transactions' },
  { value: '500+', label: 'Suppliers' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-card/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg gradient-primary">
              <MapPin className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-display font-bold text-foreground">GeoVend Pay</h1>
              <p className="text-xs text-muted-foreground">Geo-Verified Payments</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/login">
              <Button className="gradient-primary">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-success/10 rounded-full blur-3xl animate-pulse-slow" />
        </div>

        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <Badge variant="secondary" className="mb-6">
              <Zap className="w-3 h-3 mr-1" />
              Trusted by 500+ Suppliers in Kenya
            </Badge>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6 leading-tight">
              Geo-Verified
              <span className="text-primary"> M-Pesa </span>
              Payments for Field Operations
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Streamline supplier payments with GPS verification. Ensure transactions happen at the right location, every time.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button size="lg" className="gradient-primary w-full sm:w-auto">
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <Globe className="w-4 h-4 mr-2" />
                View Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-border/50 bg-card/50">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-display font-bold text-primary mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-4">Features</Badge>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Everything You Need for Field Payments
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Built for organizations that need reliable, verifiable payment disbursements to suppliers in the field.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow border-border/50 bg-card/50">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 lg:py-32 bg-card/50 border-y border-border/50">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-4">How It Works</Badge>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Simple 3-Step Payment Process
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: '01', title: 'Capture Location', description: 'Field agent arrives at supplier hub and captures GPS coordinates' },
              { step: '02', title: 'Verify Proximity', description: 'System verifies agent is within 100m of registered supplier location' },
              { step: '03', title: 'Process Payment', description: 'M-Pesa payment is sent directly to supplier\'s registered number' },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.15 }}
                className="text-center"
              >
                <div className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4 text-xl font-bold text-primary-foreground">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="p-8 md:p-12 rounded-2xl gradient-primary relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10" />
              <div className="relative z-10">
                <h2 className="text-2xl md:text-3xl font-display font-bold text-primary-foreground mb-4">
                  Ready to Streamline Your Field Payments?
                </h2>
                <p className="text-primary-foreground/80 mb-6">
                  Join hundreds of organizations already using GeoVend Pay for reliable, verifiable supplier payments.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/login">
                    <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                      Get Started Free
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center justify-center gap-6 mt-6 text-sm text-primary-foreground/70">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> No setup fees
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> 14-day trial
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border/50">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <MapPin className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display font-semibold text-foreground">GeoVend Pay</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 GeoVend Pay. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, LogOut, User } from 'lucide-react';
import { motion } from 'framer-motion';

export function Header() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 w-full border-b border-border/50 bg-card/80 backdrop-blur-md"
    >
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

        {isAuthenticated && user && (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-medium text-foreground">{user.name}</span>
                <Badge 
                  variant={user.role === 'administrator' ? 'default' : 'success'}
                  className="text-[10px]"
                >
                  {user.role === 'administrator' ? 'Administrator' : 'Field Agent'}
                </Badge>
              </div>
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-secondary">
                <User className="w-4 h-4 text-secondary-foreground" />
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="text-muted-foreground hover:text-destructive"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </motion.header>
  );
}

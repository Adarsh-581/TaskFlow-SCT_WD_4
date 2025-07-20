import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, Mail, Lock, User, Target, Chrome, Check } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { RegisterCredentials } from '@/types';

export function RegisterPage() {
  const { register, user, isLoading, error, clearError } = useAuthStore();
  const [credentials, setCredentials] = useState<RegisterCredentials>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!agreeToTerms) {
      return;
    }
    
    await register(credentials);
  };

  const handleGoogleRegister = () => {
    // Mock Google register - replace with real OAuth implementation
    console.log('Google register clicked');
  };

  const passwordStrength = {
    hasLength: credentials.password.length >= 8,
    hasNumber: /\d/.test(credentials.password),
    hasLetter: /[a-zA-Z]/.test(credentials.password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(credentials.password),
  };

  const isPasswordStrong = Object.values(passwordStrength).every(Boolean);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero p-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="shadow-elegant border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-6">
            <motion.div
              className="flex justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
                <Target className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            <div>
              <CardTitle className="text-2xl font-bold">Create your account</CardTitle>
              <CardDescription className="text-muted-foreground">
                Join TaskFlow and boost your productivity
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={credentials.name}
                  onChange={(e) =>
                    setCredentials({ ...credentials, name: e.target.value })
                  }
                  required
                  className="transition-all focus:shadow-glow"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={credentials.email}
                  onChange={(e) =>
                    setCredentials({ ...credentials, email: e.target.value })
                  }
                  required
                  className="transition-all focus:shadow-glow"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    value={credentials.password}
                    onChange={(e) =>
                      setCredentials({ ...credentials, password: e.target.value })
                    }
                    required
                    className="pr-10 transition-all focus:shadow-glow"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                
                {credentials.password && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-2 text-xs"
                  >
                    <div className="grid grid-cols-2 gap-2">
                      <div className={`flex items-center gap-1 ${passwordStrength.hasLength ? 'text-success' : 'text-muted-foreground'}`}>
                        <Check className="w-3 h-3" />
                        8+ characters
                      </div>
                      <div className={`flex items-center gap-1 ${passwordStrength.hasNumber ? 'text-success' : 'text-muted-foreground'}`}>
                        <Check className="w-3 h-3" />
                        Number
                      </div>
                      <div className={`flex items-center gap-1 ${passwordStrength.hasLetter ? 'text-success' : 'text-muted-foreground'}`}>
                        <Check className="w-3 h-3" />
                        Letter
                      </div>
                      <div className={`flex items-center gap-1 ${passwordStrength.hasSpecial ? 'text-success' : 'text-muted-foreground'}`}>
                        <Check className="w-3 h-3" />
                        Special char
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Confirm Password
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={credentials.confirmPassword}
                    onChange={(e) =>
                      setCredentials({ ...credentials, confirmPassword: e.target.value })
                    }
                    required
                    className="pr-10 transition-all focus:shadow-glow"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {credentials.confirmPassword && credentials.password !== credentials.confirmPassword && (
                  <p className="text-xs text-destructive">Passwords do not match</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-primary hover:bg-gradient-accent text-white shadow-glow"
                disabled={isLoading || !agreeToTerms || !isPasswordStrong || credentials.password !== credentials.confirmPassword}
              >
                {isLoading ? (
                  <motion.div
                    className="flex items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating account...
                  </motion.div>
                ) : (
                  'Create account'
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full hover:bg-muted"
              onClick={handleGoogleRegister}
            >
              <Chrome className="mr-2 h-4 w-4" />
              Google
            </Button>
          </CardContent>

          <CardFooter className="justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/auth/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
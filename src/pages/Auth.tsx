import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Loader2, Fingerprint, ShieldCheck, Scan } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArayorLogo } from "@/components/brand/ArayorLogo";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  // Check if user is already logged in
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        navigate("/");
      }
    });

    // Check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const validateForm = () => {
    if (!email || !password) {
      toast({
        title: t("common.error"),
        description: t("auth.email") + " " + t("auth.password"),
        variant: "destructive",
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: t("common.error"),
        description: "Invalid email address",
        variant: "destructive",
      });
      return false;
    }

    if (password.length < 6) {
      toast({
        title: t("common.error"),
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return false;
    }

    if (!isLogin && password !== confirmPassword) {
      toast({
        title: t("common.error"),
        description: "Passwords do not match",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            throw new Error("Invalid email or password");
          }
          throw error;
        }

        toast({
          title: t("common.success"),
          description: "Login successful!",
        });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
          },
        });

        if (error) {
          if (error.message.includes("User already registered")) {
            throw new Error("This email is already registered");
          }
          throw error;
        }

        toast({
          title: t("common.success"),
          description: "Account created successfully!",
        });
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      toast({
        title: t("common.error"),
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setGoogleLoading(true);

    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });

      if (result.error) {
        throw result.error instanceof Error ? result.error : new Error(String(result.error));
      }

      if (result.redirected) {
        return;
      }

      // Session already set — navigate home
      navigate("/");
    } catch (error: any) {
      console.error("Google auth error:", error);
      toast({
        title: t("common.error"),
        description: "Google ile giriş yapılamadı. Lütfen tekrar deneyin.",
        variant: "destructive",
      });
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#030508]">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* Back Button */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            {t("auth.backToHome")}
          </Link>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8">
            <ArayorLogo size="sm" />
          </Link>

          {/* Security Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" strokeWidth={2} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">AI Sentinel Korumalı Giriş</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-50">
            {isLogin ? t("auth.welcome") : t("auth.createAccount")}
          </h1>
          <p className="mt-2 text-slate-400">
            {isLogin ? t("auth.loginDesc") : t("auth.signupDesc")}
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          {/* Google Button */}
          <Button
            variant="outline"
            className="w-full h-12 gap-3 mb-6"
            onClick={handleGoogleAuth}
            disabled={googleLoading}
          >
            {googleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            {isLogin ? t("auth.googleLogin") : t("auth.googleSignup")}
          </Button>

          <div className="relative mb-6">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-4 text-sm text-muted-foreground">
              {t("auth.or")}
            </span>
          </div>

          {/* Email Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            <div>
              <Label htmlFor="email">{t("auth.email")}</Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">{t("auth.password")}</Label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-12"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <Label htmlFor="confirmPassword">{t("auth.confirmPassword")}</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 h-12"
                    disabled={loading}
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 gradient-primary border-0"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isLogin ? (
                t("auth.login")
              ) : (
                t("auth.signup")
              )}
            </Button>
          </form>

          {/* Toggle Login/Signup */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isLogin ? t("auth.noAccount") : t("auth.hasAccount")}{" "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setPassword("");
                setConfirmPassword("");
              }}
              className="text-primary font-medium hover:underline"
            >
              {isLogin ? t("auth.signup") : t("auth.login")}
            </button>
          </p>
        </div>
      </div>

      {/* Right Side - Security Fortress Visual */}
      <div className="hidden lg:flex lg:flex-1 relative bg-[#050810] items-center justify-center overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: "linear-gradient(rgba(6,182,212,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.3) 1px, transparent 1px)",
            backgroundSize: "40px 40px"
          }} />
        </div>

        {/* Fingerprint scan animation */}
        <div className="relative">
          <motion.div
            initial={{ opacity: 0.3 }}
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Fingerprint className="w-48 h-48 text-cyan-500/20" strokeWidth={0.5} />
          </motion.div>
          {/* Scan line */}
          <motion.div
            className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"
            animate={{ top: ["10%", "90%", "10%"] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
          />
          {/* Center lock */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center"
            >
              <Scan className="w-8 h-8 text-cyan-400" strokeWidth={1} />
            </motion.div>
          </div>
        </div>

        {/* Bottom text */}
        <div className="absolute bottom-12 text-center px-12">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Güvenlik Katmanı Aktif</p>
          <p className="text-[10px] text-slate-600">256-bit AES Şifreleme • Biyometrik Doğrulama • AI İzleme</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;

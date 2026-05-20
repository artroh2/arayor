import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await signIn(email, password);
    if (error) setError(error.message);
    else onOpenChange(false);
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await signUp(email, password, fullName);
    if (error) setError(error.message);
    else onOpenChange(false);
    setLoading(false);
  };

  const handleGoogle = async () => {
    setLoading(true);
    await signInWithGoogle();
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Hesabına Giriş Yap</DialogTitle>
        </DialogHeader>

        <Button
          variant="outline"
          className="w-full gap-2"
          onClick={handleGoogle}
          disabled={loading}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Google ile Giriş Yap
        </Button>

        <div className="relative my-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">veya</span>
          </div>
        </div>

        <Tabs defaultValue="signin">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Giriş Yap</TabsTrigger>
            <TabsTrigger value="signup">Kayıt Ol</TabsTrigger>
          </TabsList>

          <TabsContent value="signin">
            <form onSubmit={handleSignIn} className="space-y-3 mt-3">
              <div>
                <Label htmlFor="email">E-posta</Label>
                <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="password">Şifre</Label>
                <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-3 mt-3">
              <div>
                <Label htmlFor="name">Ad Soyad</Label>
                <Input id="name" value={fullName} onChange={e => setFullName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="email2">E-posta</Label>
                <Input id="email2" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="password2">Şifre</Label>
                <Input id="password2" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Kayıt olunuyor..." : "Kayıt Ol"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

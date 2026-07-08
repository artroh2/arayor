import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { Menu, X, Search, User, LogOut, Users, UserCircle, Crown, Landmark, Star, Sparkles, Shield } from "lucide-react";
import { ArayorLogo } from "@/components/brand/ArayorLogo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { usePremium } from "@/hooks/usePremium";
import { vehicles } from "@/data/mockData";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";

const getNavLinks = (t: (key: string) => string) => [
  { href: "/", label: t("nav.home") },
  { href: "/araclar", label: t("nav.vehicles") },
  { href: "/incelemeler", label: t("nav.reviews") },
  { href: "/karsilastir", label: t("nav.compare") },
  { href: "/komunite", label: t("nav.communities") },
  { href: "/finans", label: t("nav.finance") || "Finans", icon: Landmark, hasBadge: true },
  { href: "/sigorta", label: "Sigorta", icon: Shield, hasBadge: true },
  { href: "/degerleme", label: "AI Değerleme", icon: Sparkles, hasBadge: true },
  { href: "/bayi", label: "Bayi Pro", icon: Landmark, hasBadge: true },
  { href: "/kurumsal", label: "Kurumsal" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<typeof vehicles>([]);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { isPremium, loading: premiumLoading } = usePremium();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { t } = useLanguage();
  
  const navLinks = getNavLinks(t);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    // Check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = vehicles.filter(
      (vehicle) =>
        vehicle.brand.toLowerCase().includes(query) ||
        vehicle.model.toLowerCase().includes(query) ||
        vehicle.category.toLowerCase().includes(query) ||
        `${vehicle.brand} ${vehicle.model}`.toLowerCase().includes(query)
    );
    setSearchResults(filtered.slice(0, 6)); // Limit to 6 results
  }, [searchQuery]);

  // Focus input when search dialog opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isSearchOpen]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate("/");
  };

  const getUserDisplayName = () => {
    if (!user) return "";
    if (user.user_metadata?.full_name) return user.user_metadata.full_name;
    if (user.user_metadata?.name) return user.user_metadata.name;
    if (user.email) return user.email.split("@")[0];
    return "Kullanıcı";
  };

  const getUserAvatar = () => {
    if (!user) return null;
    return user.user_metadata?.avatar_url || user.user_metadata?.picture || null;
  };

  const handleSearchResultClick = (vehicleId: string) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    navigate(`/arac/${vehicleId}`);
  };

  return (
    <>
      <header className="sticky top-0 z-50 glass">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <ArayorLogo size="sm" />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-colors relative whitespace-nowrap",
                    location.pathname === link.href
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                  )}
                >
                  {link.label}
                  {link.hasBadge && (
                    <Star className="w-3 h-3 absolute -top-1 -right-1 fill-amber-400 text-amber-400" />
                  )}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Premium Badge/Button - Reserve space to prevent layout shift */}
              {user && (
                <div className="hidden sm:block min-w-[120px]">
                  {premiumLoading ? (
                    <div className="h-8" />
                  ) : isPremium ? (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-medium shadow-lg">
                      <Crown className="w-4 h-4" />
                      <span>Premium</span>
                    </div>
                  ) : (
                    <Link to="/premium">
                      <Button variant="outline" size="sm" className="flex gap-1.5 border-amber-500/50 text-amber-600 hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-amber-950">
                        <Crown className="w-4 h-4" />
                        <span>Be Premium</span>
                      </Button>
                    </Link>
                  )}
                </div>
              )}

              {/* Language Selector */}
              <LanguageSelector />

              <Button 
                variant="ghost" 
                size="icon" 
                className="hidden lg:flex"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="w-5 h-5" />
              </Button>
              
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
                      {getUserAvatar() ? (
                        <img 
                          src={getUserAvatar()!} 
                          alt={getUserDisplayName()} 
                          className="w-5 h-5 rounded-full"
                        />
                      ) : (
                        <User className="w-4 h-4" />
                      )}
                      <span className="max-w-[120px] truncate">{getUserDisplayName()}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link to="/profil" className="flex items-center cursor-pointer">
                        <UserCircle className="w-4 h-4 mr-2" />
                        {t("auth.profile")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/komut-merkezi" className="flex items-center cursor-pointer">
                        <Sparkles className="w-4 h-4 mr-2" />
                        AI Komut Merkezi
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                      <LogOut className="w-4 h-4 mr-2" />
                      {t("auth.logout")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/auth">
                  <Button variant="outline" size="sm" className="hidden sm:flex gap-2">
                    <User className="w-4 h-4" />
                    {t("auth.login")}
                  </Button>
                </Link>
              )}
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="lg:hidden py-4 border-t border-border animate-fade-in">
              <div className="flex flex-col gap-1">
                {/* Mobile Search Button */}
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2 mb-2"
                  onClick={() => {
                    setIsSearchOpen(true);
                    setIsMenuOpen(false);
                  }}
                >
                  <Search className="w-4 h-4" />
                  {t("search.mobile")}
                </Button>
                
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                      location.pathname === link.href
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-4 mt-2 border-t border-border">
                  {user ? (
                    <div className="space-y-2">
                      <div className="px-4 py-2 text-sm">
                        <span className="font-medium">{getUserDisplayName()}</span>
                      </div>
                      {/* Mobile Premium Badge/Button */}
                      {!premiumLoading && (
                        isPremium ? (
                          <div className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white text-sm font-medium">
                            <Crown className="w-4 h-4" />
                            <span>{t("premium.member")}</span>
                          </div>
                        ) : (
                          <Link to="/premium" onClick={() => setIsMenuOpen(false)}>
                            <Button variant="outline" className="w-full gap-2 border-amber-500/50 text-amber-600">
                              <Crown className="w-4 h-4" />
                              {t("premium.button")}
                            </Button>
                          </Link>
                        )
                      )}
                      <Link to="/profil" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="outline" className="w-full gap-2 mb-2">
                          <UserCircle className="w-4 h-4" />
                          {t("auth.profile")}
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        className="w-full gap-2"
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                      >
                        <LogOut className="w-4 h-4" />
                        {t("auth.logout")}
                      </Button>
                    </div>
                  ) : (
                    <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                      <Button className="w-full gap-2">
                        <User className="w-4 h-4" />
                        {t("auth.login")}
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Search Dialog */}
      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="sm:max-w-2xl p-0 gap-0 overflow-hidden">
          <VisuallyHidden>
            <DialogTitle>{t("search.title")}</DialogTitle>
          </VisuallyHidden>
          <div className="flex items-center border-b px-4">
            <Search className="w-5 h-5 text-muted-foreground shrink-0" />
            <Input
              ref={searchInputRef}
              type="text"
              placeholder={t("search.placeholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-0 focus-visible:ring-0 text-lg py-6 px-3"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchQuery("")}
                className="shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
          
          {/* Search Results */}
          <div className="max-h-[400px] overflow-y-auto">
            {searchQuery.trim() === "" ? (
              <div className="p-8 text-center text-muted-foreground">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p>{t("search.hint")}</p>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                <p>"{searchQuery}" {t("search.noResults")}</p>
              </div>
            ) : (
              <div className="py-2">
                {searchResults.map((vehicle) => (
                  <button
                    key={vehicle.id}
                    onClick={() => handleSearchResultClick(vehicle.id)}
                    className="w-full flex items-center gap-4 px-4 py-3 hover:bg-secondary transition-colors text-left"
                  >
                    <div className="w-16 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                      <img
                        src={vehicle.image}
                        alt={`${vehicle.brand} ${vehicle.model}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">
                        {vehicle.brand} {vehicle.model}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {vehicle.year} • {vehicle.category}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-semibold text-primary">
                        {vehicle.price}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

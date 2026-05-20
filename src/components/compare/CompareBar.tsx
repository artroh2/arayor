import { Link } from "react-router-dom";
import { ArrowLeftRight, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompare } from "@/contexts/CompareContext";
import { cn } from "@/lib/utils";

export function CompareBar() {
  const { vehicle1, vehicle2, removeFromCompare, clearCompare } = useCompare();
  
  // Only show if at least one vehicle is selected
  if (!vehicle1 && !vehicle2) return null;
  
  const hasTwo = vehicle1 && vehicle2;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-card/95 backdrop-blur-md border-t border-border shadow-lg">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            {/* Vehicle 1 */}
            <div className={cn(
              "flex-1 flex items-center gap-3 p-2 rounded-xl border transition-all min-w-0",
              vehicle1 ? "bg-secondary/50 border-primary/30" : "border-dashed border-muted-foreground/30"
            )}>
              {vehicle1 ? (
                <>
                  <img 
                    src={vehicle1.image} 
                    alt={vehicle1.model} 
                    className="w-12 h-8 sm:w-16 sm:h-10 object-cover rounded-lg shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {vehicle1.brand} {vehicle1.model}
                    </p>
                    <p className="text-xs text-muted-foreground">{vehicle1.year}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0"
                    onClick={() => removeFromCompare(1)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <div className="flex-1 text-center py-2">
                  <p className="text-sm text-muted-foreground">1. aracı seçin</p>
                </div>
              )}
            </div>

            {/* VS Badge */}
            <div className="hidden sm:flex items-center justify-center">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all",
                hasTwo 
                  ? "gradient-primary text-primary-foreground" 
                  : "bg-muted text-muted-foreground"
              )}>
                VS
              </div>
            </div>

            {/* Vehicle 2 */}
            <div className={cn(
              "flex-1 flex items-center gap-3 p-2 rounded-xl border transition-all min-w-0",
              vehicle2 ? "bg-secondary/50 border-primary/30" : "border-dashed border-muted-foreground/30"
            )}>
              {vehicle2 ? (
                <>
                  <img 
                    src={vehicle2.image} 
                    alt={vehicle2.model} 
                    className="w-12 h-8 sm:w-16 sm:h-10 object-cover rounded-lg shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">
                      {vehicle2.brand} {vehicle2.model}
                    </p>
                    <p className="text-xs text-muted-foreground">{vehicle2.year}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0"
                    onClick={() => removeFromCompare(2)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <div className="flex-1 text-center py-2">
                  <p className="text-sm text-muted-foreground">2. aracı seçin</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0 justify-end">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
                onClick={clearCompare}
              >
                Temizle
              </Button>
              <Link to="/karsilastir">
                <Button 
                  className={cn(
                    "gap-2 transition-all",
                    hasTwo 
                      ? "gradient-primary border-0" 
                      : "bg-muted text-muted-foreground"
                  )}
                  disabled={!hasTwo}
                >
                  <ArrowLeftRight className="w-4 h-4" />
                  <span className="hidden sm:inline">Karşılaştır</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

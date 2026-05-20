import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Vehicle } from "@/data/mockData";
import { toast } from "sonner";

interface CompareContextType {
  vehicle1: Vehicle | null;
  vehicle2: Vehicle | null;
  addToCompare: (vehicle: Vehicle) => void;
  removeFromCompare: (slot: 1 | 2) => void;
  clearCompare: () => void;
  isInCompare: (vehicleId: string) => boolean;
  getCompareSlot: (vehicleId: string) => 1 | 2 | null;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

const STORAGE_KEY = "compare_vehicles";

export function CompareProvider({ children }: { children: ReactNode }) {
  const [vehicle1, setVehicle1] = useState<Vehicle | null>(null);
  const [vehicle2, setVehicle2] = useState<Vehicle | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const { v1, v2 } = JSON.parse(stored);
        setVehicle1(v1 || null);
        setVehicle2(v2 || null);
      }
    } catch (e) {
      console.error("Failed to load compare vehicles from storage", e);
    }
  }, []);

  // Save to localStorage when vehicles change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ v1: vehicle1, v2: vehicle2 }));
    } catch (e) {
      console.error("Failed to save compare vehicles to storage", e);
    }
  }, [vehicle1, vehicle2]);

  const addToCompare = (vehicle: Vehicle) => {
    // Check if already in compare
    if (vehicle1?.id === vehicle.id || vehicle2?.id === vehicle.id) {
      toast.info("Bu araç zaten karşılaştırmada");
      return;
    }

    if (!vehicle1) {
      setVehicle1(vehicle);
      toast.success("1. araç seçildi. Şimdi 2. aracı seçin.");
    } else if (!vehicle2) {
      setVehicle2(vehicle);
      toast.success("2. araç seçildi! Karşılaştırma sayfasına yönlendiriliyorsunuz...");
    } else {
      // Both slots full - replace vehicle2
      setVehicle2(vehicle);
      toast.info("2. araç değiştirildi");
    }
  };

  const removeFromCompare = (slot: 1 | 2) => {
    if (slot === 1) {
      setVehicle1(null);
    } else {
      setVehicle2(null);
    }
    toast.success("Araç karşılaştırmadan kaldırıldı");
  };

  const clearCompare = () => {
    setVehicle1(null);
    setVehicle2(null);
  };

  const isInCompare = (vehicleId: string) => {
    return vehicle1?.id === vehicleId || vehicle2?.id === vehicleId;
  };

  const getCompareSlot = (vehicleId: string): 1 | 2 | null => {
    if (vehicle1?.id === vehicleId) return 1;
    if (vehicle2?.id === vehicleId) return 2;
    return null;
  };

  return (
    <CompareContext.Provider
      value={{
        vehicle1,
        vehicle2,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        getCompareSlot,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
}

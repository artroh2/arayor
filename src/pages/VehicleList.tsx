import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, Grid3X3, List, ChevronDown, X, PenLine } from "lucide-react";
import { Layout } from "@/components/layout";
import { VehicleCard, AddVehicleCard, AddVehicleDialog, WriteReviewDialog } from "@/components/vehicles";
import { BrandLogo } from "@/components/brands";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { vehicles, brands, categories, getFuelType } from "@/data/mockData";
import { useLanguage } from "@/contexts/LanguageContext";

const VehicleList = () => {
  const { t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get("kategori");
  const brandFromUrl = searchParams.get("marka");
  const searchFromUrl = searchParams.get("arama");
  
  const [searchQuery, setSearchQuery] = useState(searchFromUrl || "");
  const [selectedBrand, setSelectedBrand] = useState<string>(brandFromUrl || "all");
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryFromUrl || "all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedFuelType, setSelectedFuelType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [showAddVehicleDialog, setShowAddVehicleDialog] = useState(false);
  const [showWriteReviewDialog, setShowWriteReviewDialog] = useState(false);
  
  const fuelTypes = [
    { id: "benzin", name: "Benzin" },
    { id: "dizel", name: "Dizel" },
    { id: "elektrik", name: "Elektrik" },
    { id: "hibrit", name: "Hibrit" },
    { id: "lpg", name: "LPG" },
  ];
  // URL parametreleri değiştiğinde state'leri güncelle
  useEffect(() => {
    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    } else {
      setSelectedCategory("all");
    }
  }, [categoryFromUrl]);

  useEffect(() => {
    if (brandFromUrl) {
      setSelectedBrand(brandFromUrl);
    } else {
      setSelectedBrand("all");
    }
  }, [brandFromUrl]);

  useEffect(() => {
    if (searchFromUrl) {
      setSearchQuery(searchFromUrl);
    }
  }, [searchFromUrl]);

  const years = ["2026", "2025", "2024", "2023", "2022", "2021", "2020"];

  const filteredVehicles = useMemo(() => {
    let result = [...vehicles];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (v) =>
          v.brand.toLowerCase().includes(query) ||
          v.model.toLowerCase().includes(query) ||
          v.category.toLowerCase().includes(query)
      );
    }

    // Brand filter
    if (selectedBrand !== "all") {
      result = result.filter((v) => v.brandId === selectedBrand);
    }

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter(
        (v) => v.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Year filter
    if (selectedYear !== "all") {
      result = result.filter((v) => v.year.toString() === selectedYear);
    }

    // Fuel type filter
    if (selectedFuelType !== "all") {
      result = result.filter((v) => 
        getFuelType(v).toLowerCase() === selectedFuelType.toLowerCase()
      );
    }

    // Sort
    switch (sortBy) {
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "reviews":
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case "newest":
        result.sort((a, b) => b.year - a.year);
        break;
      default:
        // popular - sort by reviewCount
        result.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    return result;
  }, [searchQuery, selectedBrand, selectedCategory, selectedYear, selectedFuelType, sortBy]);

  const activeFiltersCount = [selectedBrand, selectedCategory, selectedYear, selectedFuelType].filter(
    (f) => f !== "all"
  ).length;

  const clearFilters = () => {
    setSelectedBrand("all");
    setSelectedCategory("all");
    setSelectedYear("all");
    setSelectedFuelType("all");
    setSearchQuery("");
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="max-w-2xl">
              <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
                {t("vehicleList.title")}
              </h1>
              <p className="text-muted-foreground">
                {vehicles.length}{t("vehicleList.subtitle")}
              </p>
            </div>
            <Button 
              size="lg" 
              className="gap-2 self-start md:self-auto"
              onClick={() => setShowWriteReviewDialog(true)}
            >
              <PenLine className="w-4 h-4" />
              Yorum Yaz
            </Button>
          </div>
        </div>
      </section>

      <section className="py-6 md:py-8">
        <div className="container mx-auto px-4">
          {/* Search & Filter Bar */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t("search.searchBrandModel")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 rounded-xl"
              />
            </div>

            {/* Filter Toggle (Mobile) */}
            <Button
              variant="outline"
              className="lg:hidden gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="w-4 h-4" />
              {t("vehicleList.filters")}
              {activeFiltersCount > 0 && (
                <Badge className="ml-1">{activeFiltersCount}</Badge>
              )}
            </Button>

            {/* Desktop Filters */}
            <div className="hidden lg:flex items-center gap-3">
              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger className="w-40 h-12 rounded-xl">
                  <SelectValue placeholder={t("vehicleList.allBrands")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("vehicleList.allBrands")}</SelectItem>
                  {brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id}>
                      <span className="flex items-center gap-2">
                        <BrandLogo brandId={brand.id} className="h-4 w-6" />
                        {brand.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40 h-12 rounded-xl">
                  <SelectValue placeholder={t("vehicleList.allCategories")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("vehicleList.allCategories")}</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-32 h-12 rounded-xl">
                  <SelectValue placeholder={t("vehicleList.allYears")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("vehicleList.allYears")}</SelectItem>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedFuelType} onValueChange={setSelectedFuelType}>
                <SelectTrigger className="w-36 h-12 rounded-xl">
                  <SelectValue placeholder="Tüm Yakıtlar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Yakıtlar</SelectItem>
                  {fuelTypes.map((fuel) => (
                    <SelectItem key={fuel.id} value={fuel.id}>
                      {fuel.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40 h-12 rounded-xl">
                  <SelectValue placeholder={t("vehicleList.sortPopular")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">{t("vehicleList.sortPopular")}</SelectItem>
                  <SelectItem value="rating">{t("vehicleList.sortRating")}</SelectItem>
                  <SelectItem value="reviews">{t("vehicleList.sortReviews")}</SelectItem>
                  <SelectItem value="newest">{t("vehicleList.sortNewest")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* View Mode Toggle */}
            <div className="hidden lg:flex items-center gap-1 p-1 bg-secondary rounded-xl">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                className="rounded-lg"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                className="rounded-lg"
                onClick={() => setViewMode("list")}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Mobile Filters Panel */}
          {showFilters && (
            <div className="lg:hidden bg-card border border-border rounded-2xl p-4 mb-6 animate-fade-in space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{t("vehicleList.filters")}</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowFilters(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("vehicleList.allBrands")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("vehicleList.allBrands")}</SelectItem>
                  {brands.map((brand) => (
                    <SelectItem key={brand.id} value={brand.id}>
                      <span className="flex items-center gap-2">
                        <BrandLogo brandId={brand.id} className="h-4 w-6" />
                        {brand.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("vehicleList.allCategories")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("vehicleList.allCategories")}</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("vehicleList.allYears")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("vehicleList.allYears")}</SelectItem>
                  {years.map((year) => (
                    <SelectItem key={year} value={year}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedFuelType} onValueChange={setSelectedFuelType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Tüm Yakıtlar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Yakıtlar</SelectItem>
                  {fuelTypes.map((fuel) => (
                    <SelectItem key={fuel.id} value={fuel.id}>
                      {fuel.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("vehicleList.sortPopular")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">{t("vehicleList.sortPopular")}</SelectItem>
                  <SelectItem value="rating">{t("vehicleList.sortRating")}</SelectItem>
                  <SelectItem value="reviews">{t("vehicleList.sortReviews")}</SelectItem>
                  <SelectItem value="newest">{t("vehicleList.sortNewest")}</SelectItem>
                </SelectContent>
              </Select>

              {activeFiltersCount > 0 && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={clearFilters}
                >
                  {t("vehicleList.clearFilters")}
                </Button>
              )}
            </div>
          )}

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-sm text-muted-foreground">{t("vehicleList.activeFilters")}</span>
              {selectedBrand !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  {brands.find((b) => b.id === selectedBrand)?.name}
                  <button onClick={() => setSelectedBrand("all")}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {selectedCategory !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  {categories.find((c) => c.id === selectedCategory)?.name}
                  <button onClick={() => setSelectedCategory("all")}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {selectedYear !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  {selectedYear}
                  <button onClick={() => setSelectedYear("all")}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {selectedFuelType !== "all" && (
                <Badge variant="secondary" className="gap-1">
                  {fuelTypes.find((f) => f.id === selectedFuelType)?.name}
                  <button onClick={() => setSelectedFuelType("all")}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                {t("vehicleList.clearAll")}
              </Button>
            </div>
          )}

          {/* Results Count */}
          <p className="text-sm text-muted-foreground mb-6">
            {filteredVehicles.length} {t("vehicleList.found")}
          </p>

          {/* Vehicle Grid */}
          {filteredVehicles.length > 0 ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {filteredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
              {/* Add Vehicle Card - Always at the end */}
              {viewMode === "grid" && (
                <AddVehicleCard onClick={() => setShowAddVehicleDialog(true)} />
              )}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg mb-4">
                {t("vehicleList.noResults")}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button variant="outline" onClick={clearFilters}>
                  {t("vehicleList.clearFilters")}
                </Button>
                <Button onClick={() => setShowAddVehicleDialog(true)}>
                  {t("vehicleList.suggestVehicle")}
                </Button>
              </div>
            </div>
          )}

          {/* List view add vehicle option */}
          {viewMode === "list" && filteredVehicles.length > 0 && (
            <div className="mt-6">
              <AddVehicleCard onClick={() => setShowAddVehicleDialog(true)} />
            </div>
          )}
        </div>
      </section>

      {/* Add Vehicle Dialog */}
      <AddVehicleDialog 
        open={showAddVehicleDialog} 
        onOpenChange={setShowAddVehicleDialog} 
      />

      {/* Write Review Dialog */}
      <WriteReviewDialog
        open={showWriteReviewDialog}
        onOpenChange={setShowWriteReviewDialog}
      />
    </Layout>
  );
};

export default VehicleList;

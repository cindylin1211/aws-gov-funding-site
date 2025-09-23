import { useState } from "react";
import { useGrantsData } from "@/hooks/useGrantsData";
import SearchBar from "@/components/SearchBar";
import FilterSection from "@/components/FilterSection";
import GrantCard from "@/components/GrantCard";
import GrantModal from "@/components/GrantModal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Search as SearchIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Grant } from "@/types/grant";

const Index = () => {
  const { grantsData, filteredGrants, filters, loading, error, updateFilter, sortGrants } = useGrantsData();
  const [selectedGrant, setSelectedGrant] = useState<Grant | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState('default');

  const handleGrantClick = (grant: Grant) => {
    setSelectedGrant(grant);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedGrant(null);
  };

  const sortedGrants = sortGrants(filteredGrants, sortBy);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header Skeleton */}
          <div className="text-center mb-8">
            <Skeleton className="h-12 w-96 mx-auto mb-4" />
            <Skeleton className="h-6 w-64 mx-auto" />
          </div>
          
          {/* Search Skeleton */}
          <div className="max-w-2xl mx-auto mb-8">
            <Skeleton className="h-12 w-full" />
          </div>
          
          {/* Content Skeletons */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <Skeleton className="h-96 w-full" />
            </div>
            <div className="lg:col-span-3 space-y-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="bg-gradient-hero text-white py-16 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
            政府補助計畫搜尋器
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            快速找到適合您企業的政府補助計畫，加速業務發展與創新轉型
          </p>
          
          {/* Search Bar */}
          <div className="max-w-3xl mx-auto">
            <SearchBar
              value={filters.search}
              onChange={(value) => updateFilter('search', value)}
              placeholder="搜尋補助計畫名稱、關鍵字或主辦機關..."
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            {grantsData && (
              <FilterSection
                filters={filters}
                onFilterChange={updateFilter}
                categoriesData={grantsData.categories}
                filtersData={grantsData.filters}
                totalGrantsCount={grantsData.grants?.length || 0}
              />
            )}
          </aside>

          {/* Results Section */}
          <section className="lg:col-span-3">
            <Card className="bg-gradient-card border-border/50">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle className="text-xl font-heading flex items-center gap-2">
                    <SearchIcon className="h-5 w-5 text-primary" />
                    搜尋結果
                    <span className="text-muted-foreground font-normal">
                      (共 {filteredGrants.length} 項補助計畫)
                    </span>
                  </CardTitle>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground whitespace-nowrap">排序：</span>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default">預設順序</SelectItem>
                        <SelectItem value="amount-desc">補助金額高到低</SelectItem>
                        <SelectItem value="amount-asc">補助金額低到高</SelectItem>
                        <SelectItem value="deadline">申請截止日期</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {filteredGrants.length === 0 ? (
                  <div className="text-center py-12">
                    <SearchIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      沒有找到符合條件的補助計畫
                    </h3>
                    <p className="text-muted-foreground">
                      請嘗試調整篩選條件或搜尋關鍵字
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    {sortedGrants.map((grant) => (
                      <GrantCard
                        key={grant.id}
                        grant={grant}
                        onClick={() => handleGrantClick(grant)}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        </div>
      </main>

      {/* Grant Details Modal */}
      <GrantModal
        grant={selectedGrant}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Index;

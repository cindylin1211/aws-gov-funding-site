import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface FilterSectionProps {
  filters: {
    mainCategory: string;
    subCategory: string;
    companySize: string;
    grantAmount: string;
    agency: string;
  };
  onFilterChange: (filterType: string, value: string) => void;
  categoriesData: any;
  filtersData: any;
  totalGrantsCount: number;
  allGrants: any[];
}

const FilterSection = ({ filters, onFilterChange, categoriesData, filtersData, totalGrantsCount, allGrants }: FilterSectionProps) => {
  const handleMainCategoryChange = (category: string) => {
    onFilterChange('mainCategory', category);
    if (category !== filters.mainCategory) {
      onFilterChange('subCategory', ''); // Reset subcategory when main category changes
    }
  };

  const getCurrentSubcategories = () => {
    if (filters.mainCategory === 'all') return [];
    const mainCat = categoriesData.main.find((cat: any) => cat.name === filters.mainCategory);
    return mainCat?.subcategories || [];
  };

  const getCategoryCount = (categoryName: string) => {
    return allGrants.filter(grant => grant.補助類別 === categoryName).length;
  };

  return (
    <Card className="bg-gradient-card border-border/50">
      <CardHeader>
        <CardTitle className="text-xl font-heading text-foreground flex items-center gap-2">
          <span className="w-1 h-6 bg-gradient-primary rounded-full"></span>
          篩選條件
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Main Categories */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">補助類型</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filters.mainCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleMainCategoryChange('all')}
              className="h-9"
            >
              全部 ({totalGrantsCount})
            </Button>
            {categoriesData.main.map((category: any) => (
              <Button
                key={category.id}
                variant={filters.mainCategory === category.name ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleMainCategoryChange(category.name)}
                className="h-9"
              >
                {category.name} ({getCategoryCount(category.name)})
              </Button>
            ))}
          </div>
        </div>

        {/* Sub Categories */}
        {getCurrentSubcategories().length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">細分類別</h3>
              <div className="flex flex-wrap gap-2">
                {getCurrentSubcategories().map((subcategory: any) => (
                  <Badge
                    key={subcategory.id}
                    variant={filters.subCategory === subcategory.name ? "default" : "outline"}
                    className="cursor-pointer transition-all duration-fast hover:scale-105"
                    onClick={() => onFilterChange('subCategory', 
                      filters.subCategory === subcategory.name ? '' : subcategory.name
                    )}
                  >
                    {subcategory.name} ({subcategory.count})
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}

        <Separator />

        {/* Other Filters */}
        <div className="space-y-4">
          {/* Company Size */}
          <div className="space-y-3">
            <h4 className="font-medium text-foreground">企業規模</h4>
            <div className="flex flex-wrap gap-2">
              {filtersData.companySize.map((option: any) => (
                <Badge
                  key={option.id}
                  variant={filters.companySize === option.value ? "default" : "secondary"}
                  className="cursor-pointer transition-all duration-fast hover:scale-105"
                  onClick={() => onFilterChange('companySize', option.value)}
                >
                  {option.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Grant Amount */}
          <div className="space-y-3">
            <h4 className="font-medium text-foreground">補助金額</h4>
            <div className="flex flex-wrap gap-2">
              {filtersData.grantAmount.map((option: any) => (
                <Badge
                  key={option.id}
                  variant={filters.grantAmount === option.value ? "default" : "secondary"}
                  className="cursor-pointer transition-all duration-fast hover:scale-105"
                  onClick={() => onFilterChange('grantAmount', option.value)}
                >
                  {option.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Agency */}
          <div className="space-y-3">
            <h4 className="font-medium text-foreground">主辦機關</h4>
            <div className="flex flex-wrap gap-2">
              {filtersData.agency.map((option: any) => (
                <Badge
                  key={option.id}
                  variant={filters.agency === option.value ? "default" : "secondary"}
                  className="cursor-pointer transition-all duration-fast hover:scale-105"
                  onClick={() => onFilterChange('agency', option.value)}
                >
                  {option.name}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterSection;

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface FilterSectionProps {
  filters: {
    mainCategory: string;
    subCategory: string;
    companySize: string[];  // 改為陣列以支援多重選取
    grantAmount: string[];  // 改為陣列以支援多重選取
    agency: string[];       // 改為陣列以支援多重選取
  };
  onFilterChange: (filterType: string, value: string | string[]) => void;  // 支援陣列值
  categoriesData: any;
  filtersData: any;
  totalGrantsCount: number;
  allGrants: any[];
}

const FilterSection = ({ filters, onFilterChange, categoriesData, filtersData, totalGrantsCount, allGrants }: FilterSectionProps) => {
  const handleMainCategoryChange = (category: string) => {
    // 如果點擊已選中的類別，則取消選擇（回到 'all'）
    if (filters.mainCategory === category && category !== 'all') {
      onFilterChange('mainCategory', 'all');
      onFilterChange('subCategory', '');
    } else {
      onFilterChange('mainCategory', category);
      if (category !== filters.mainCategory) {
        onFilterChange('subCategory', ''); // Reset subcategory when main category changes
      }
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
            {categoriesData.main.map((category: any) => {
              const isSelected = filters.mainCategory === category.name;
              let colorClass = '';
              
              // 根據類別設定不同顏色
              if (category.name === '數位轉型') {
                colorClass = isSelected 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white border-blue-500' 
                  : 'border-blue-300 text-blue-600 hover:bg-blue-50';
              } else if (category.name === '創新研發') {
                colorClass = isSelected 
                  ? 'bg-purple-500 hover:bg-purple-600 text-white border-purple-500' 
                  : 'border-purple-300 text-purple-600 hover:bg-purple-50';
              } else if (category.name === '人才培訓') {
                colorClass = isSelected 
                  ? 'bg-green-500 hover:bg-green-600 text-white border-green-500' 
                  : 'border-green-300 text-green-600 hover:bg-green-50';
              }
              
              return (
                <Button
                  key={category.id}
                  variant="outline"
                  size="sm"
                  onClick={() => handleMainCategoryChange(category.name)}
                  className={`h-9 ${colorClass}`}
                >
                  {category.name} ({getCategoryCount(category.name)})
                </Button>
              );
            })}
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
          {/* Company Size - 藍色 */}
          <div className="space-y-3">
            <h4 className="font-medium text-foreground">企業規模</h4>
            <div className="flex flex-wrap gap-2">
              {filtersData.companySize.map((option: any) => {
                const isSelected = filters.companySize.includes(option.value);
                return (
                  <Badge
                    key={option.id}
                    variant="outline"
                    className={`cursor-pointer transition-all duration-fast hover:scale-105 ${
                      isSelected 
                        ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600' 
                        : 'border-blue-300 text-blue-600 hover:bg-blue-50'
                    }`}
                    onClick={() => {
                      // 切換選取狀態
                      const newSelection = isSelected
                        ? filters.companySize.filter(size => size !== option.value)  // 取消選取
                        : [...filters.companySize, option.value];  // 加入選取
                      onFilterChange('companySize', newSelection);
                    }}
                  >
                    {option.name}
                  </Badge>
                );
              })}
            </div>
          </div>

          {/* Grant Amount - 綠色 */}
          <div className="space-y-3">
            <h4 className="font-medium text-foreground">補助金額</h4>
            <div className="flex flex-wrap gap-2">
              {filtersData.grantAmount.map((option: any) => {
                const isSelected = filters.grantAmount.includes(option.value);
                return (
                  <Badge
                    key={option.id}
                    variant="outline"
                    className={`cursor-pointer transition-all duration-fast hover:scale-105 ${
                      isSelected 
                        ? 'bg-green-500 text-white border-green-500 hover:bg-green-600' 
                        : 'border-green-300 text-green-600 hover:bg-green-50'
                    }`}
                    onClick={() => {
                      // 切換選取狀態
                      const newSelection = isSelected
                        ? filters.grantAmount.filter(amount => amount !== option.value)  // 取消選取
                        : [...filters.grantAmount, option.value];  // 加入選取
                      onFilterChange('grantAmount', newSelection);
                    }}
                  >
                    {option.name}
                  </Badge>
                );
              })}
            </div>
          </div>

          {/* Agency - 橙色 */}
          <div className="space-y-3">
            <h4 className="font-medium text-foreground">主辦機關</h4>
            <div className="flex flex-wrap gap-2">
              {filtersData.agency.map((option: any) => {
                const isSelected = filters.agency.includes(option.value);
                return (
                  <Badge
                    key={option.id}
                    variant="outline"
                    className={`cursor-pointer transition-all duration-fast hover:scale-105 ${
                      isSelected 
                        ? 'bg-orange-500 text-white border-orange-500 hover:bg-orange-600' 
                        : 'border-orange-300 text-orange-600 hover:bg-orange-50'
                    }`}
                    onClick={() => {
                      // 切換選取狀態
                      const newSelection = isSelected
                        ? filters.agency.filter(agency => agency !== option.value)  // 取消選取
                        : [...filters.agency, option.value];  // 加入選取
                      onFilterChange('agency', newSelection);
                    }}
                  >
                    {option.name}
                  </Badge>
                );
              })}
            </div>
          </div>
        </div>

        <Separator />

        {/* 懶人包按鈕 */}
        <div className="pt-2">
          <Button
            variant="default"
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-semibold shadow-lg"
            onClick={() => window.open('https://d5vc2tehf6g33.cloudfront.net/2025GovFundeBook.pdf', '_blank')}
          >
            📚 點我看懶人包
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterSection;

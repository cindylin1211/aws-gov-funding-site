import { useState, useEffect, useMemo } from "react";

interface Grant {
  id: string;
  計畫名稱: string;
  補助類別: string;
  子分類: string;
  補助重點: string;
  補助對象: string[];
  補助金額: string;
  補助比例上限: string;
  計畫時程: string;
  主辦單位: string;
  參考資料: string[];
  企業規模: string[];
  金額分類: string;
  主辦機關分類: string;
}

interface GrantsDatabase {
  grants: Grant[];
  categories: any;
  filters: any;
}

interface Filters {
  search: string;
  mainCategory: string;
  subCategory: string;
  companySize: string;
  grantAmount: string;
  agency: string;
}

// Helper function to match company size
const matchesCompanySize = (grant: Grant, sizeFilter: string) => {
  switch (sizeFilter) {
    case '大型企業':
      return grant.企業規模.includes('大型企業');
    case '中小企業':
      return grant.企業規模.includes('中小企業');
    case '微型企業':
      return grant.企業規模.includes('微型企業');
    case '新創企業':
      return grant.企業規模.includes('新創企業');
    default:
      return true;
  }
};

// Helper function to match agency
const matchesAgency = (grant: Grant, agencyFilter: string) => {
  switch (agencyFilter) {
    case '經濟部':
      return grant.主辦機關分類 === '經濟部';
    case '數位發展部':
      return grant.主辦機關分類 === '數位發展部';
    case '勞動部':
      return grant.主辦機關分類 === '勞動部';
    case '地方政府':
      return grant.主辦機關分類 === '地方政府';
    default:
      return true;
  }
};

export const useGrantsData = () => {
  const [grantsData, setGrantsData] = useState<GrantsDatabase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    search: '',
    mainCategory: 'all',
    subCategory: '',
    companySize: '',
    grantAmount: '',
    agency: ''
  });

  // Load grants data
  useEffect(() => {
    const loadGrantsData = async () => {
      try {
        console.log('開始載入補助資料...');
        const API_URL = import.meta.env.VITE_GRANTS_API_URL;
        
        if (!API_URL) {
          // Fallback to JSON file if API not configured
          const response = await fetch('/grants-database.json');
          if (!response.ok) {
            throw new Error('無法載入補助資料');
          }
          const data = await response.json();
          setGrantsData(data);
        } else {
          // Load from DynamoDB via API
          const response = await fetch(`${API_URL}/grants`);
          if (!response.ok) {
            throw new Error('無法載入補助資料');
          }
          const data = await response.json();
          
          // Transform API response to match expected format
          const transformedData = {
            grants: data.grants || [],
            categories: {
              main: [
                {
                  id: "digital-transformation",
                  name: "數位轉型",
                  count: data.grants?.filter((g: Grant) => g.補助類別 === "數位轉型").length || 0,
                  subcategories: []
                },
                {
                  id: "innovation-rd",
                  name: "創新研發",
                  count: data.grants?.filter((g: Grant) => g.補助類別 === "創新研發").length || 0,
                  subcategories: []
                },
                {
                  id: "talent-training",
                  name: "人才培訓",
                  count: data.grants?.filter((g: Grant) => g.補助類別 === "人才培訓").length || 0,
                  subcategories: []
                }
              ]
            },
            filters: {
              companySize: [
                { id: "all", name: "不限", value: "" },
                { id: "large", name: "大型企業", value: "大型企業" },
                { id: "sme", name: "中小企業", value: "中小企業" },
                { id: "micro", name: "微型企業", value: "微型企業" },
                { id: "startup", name: "新創企業", value: "新創企業" }
              ],
              grantAmount: [
                { id: "all", name: "不限", value: "" },
                { id: "small", name: "100萬以下", value: "小額補助" },
                { id: "medium", name: "100-500萬", value: "中額補助" },
                { id: "large", name: "500-1000萬", value: "大額補助" },
                { id: "extra-large", name: "1000萬以上", value: "超大額補助" },
                { id: "unlimited", name: "無上限", value: "無上限補助" }
              ],
              agency: [
                { id: "all", name: "不限", value: "" },
                { id: "moea", name: "經濟部體系", value: "經濟部" },
                { id: "moda", name: "數位發展部", value: "數位發展部" },
                { id: "mol", name: "勞動部", value: "勞動部" },
                { id: "local", name: "地方政府", value: "地方政府" }
              ]
            }
          };
          
          setGrantsData(transformedData);
        }
        console.log('補助資料載入完成');
      } catch (err) {
        console.error('載入資料錯誤:', err);
        setError(err instanceof Error ? err.message : '載入資料時發生錯誤');
      } finally {
        setLoading(false);
      }
    };

    loadGrantsData();
  }, []);

  // Filter grants based on current filters
  const filteredGrants = useMemo(() => {
    if (!grantsData) return [];

    return grantsData.grants.filter(grant => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const searchableText = `${grant.計畫名稱} ${grant.補助重點} ${grant.主辦單位}`.toLowerCase();
        if (!searchableText.includes(searchTerm)) {
          return false;
        }
      }

      // Main category filter
      if (filters.mainCategory !== 'all') {
        if (grant.補助類別 !== filters.mainCategory) {
          return false;
        }
      }

      // Sub category filter  
      if (filters.subCategory) {
        if (grant.子分類 !== filters.subCategory) {
          return false;
        }
      }

      // Company size filter
      if (filters.companySize) {
        if (!grant.企業規模 || !grant.企業規模.includes(filters.companySize)) {
          return false;
        }
      }

      // Grant amount filter
      if (filters.grantAmount) {
        if (grant.金額分類 !== filters.grantAmount) {
          return false;
        }
      }

      // Agency filter
      if (filters.agency) {
        if (grant.主辦機關分類 !== filters.agency) {
          return false;
        }
      }

      return true;
    });
  }, [grantsData, filters]);

  // Update filters
  const updateFilter = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  // Sort grants
  const sortGrants = (grants: Grant[], sortBy: string): Grant[] => {
    switch (sortBy) {
      case 'amount-desc':
        return [...grants].sort((a, b) => extractAmount(b.補助金額) - extractAmount(a.補助金額));
      case 'amount-asc':
        return [...grants].sort((a, b) => extractAmount(a.補助金額) - extractAmount(b.補助金額));
      case 'deadline':
        return [...grants].sort((a, b) => a.計畫時程.localeCompare(b.計畫時程));
      default:
        return grants;
    }
  };

  // Extract amount for sorting
  const extractAmount = (amountStr: string): number => {
    const matches = amountStr.match(/(\d+)萬/g);
    if (!matches) return 0;
    
    const amounts = matches.map(match => parseInt(match.replace('萬', '')));
    return Math.max(...amounts);
  };

  return {
    grantsData,
    filteredGrants,
    filters,
    loading,
    error,
    updateFilter,
    sortGrants
  };
};
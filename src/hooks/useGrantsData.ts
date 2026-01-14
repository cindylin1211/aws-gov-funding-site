import { useState, useEffect, useMemo } from "react";
import { Grant } from "@/types/grant";

interface GrantsDatabase {
  grants: Grant[];
  categories: any;
  filters: any;
}

interface Filters {
  search: string;
  mainCategory: string;
  subCategory: string;
  companySize: string[];  // 改為陣列以支援多重選取
  grantAmount: string[];  // 改為陣列以支援多重選取
  agency: string[];       // 改為陣列以支援多重選取
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
    companySize: [],    // 初始化為空陣列
    grantAmount: [],    // 初始化為空陣列
    agency: []          // 初始化為空陣列
  });

  // Load grants data
  useEffect(() => {
    const loadGrantsData = async () => {
      try {
        console.log('開始載入補助資料...');
        
        // 動態導入 Supabase（避免在不需要時載入）
        const { supabase } = await import('@/integrations/supabase/client');
        
        // 先嘗試從 Supabase 載入
        const { data: supabaseData, error: supabaseError } = await supabase
          .from('grants')
          .select('*')
          .order('created_at', { ascending: true }) as any;

        let grants: Grant[] = [];

        if (!supabaseError && supabaseData && supabaseData.length > 0) {
          console.log('從 Supabase 載入資料');
          grants = supabaseData.flatMap((row: any) => row.data as Grant[]);
        } else {
          // 如果 Supabase 沒有資料，從 JSON 檔案載入
          console.log('從 JSON 檔案載入資料');
          const response = await fetch('/grants-database.json');
          if (!response.ok) {
            throw new Error('無法載入補助資料');
          }
          const jsonData = await response.json();
          grants = jsonData.grants;
        }

        // 重新計算分類統計
        const categoryCounts = grants.reduce((acc: any, grant: Grant) => {
          const category = grant.補助類別;
          if (!acc[category]) {
            acc[category] = { count: 0, subcategories: {} };
          }
          acc[category].count++;
          
          const subCategory = grant.子分類;
          if (!acc[category].subcategories[subCategory]) {
            acc[category].subcategories[subCategory] = 0;
          }
          acc[category].subcategories[subCategory]++;
          
          return acc;
        }, {});

        // 重建完整資料結構
        const data = {
          grants,
          categories: {
            main: Object.entries(categoryCounts).map(([name, info]: [string, any]) => ({
              id: name.toLowerCase().replace(/\s+/g, '-'),
              name,
              count: info.count,
              subcategories: Object.entries(info.subcategories).map(([subName, count]) => ({
                id: subName.toLowerCase().replace(/\s+/g, '-'),
                name: subName,
                count
              }))
            }))
          },
          filters: {
            companySize: [...new Set(grants.flatMap((g: Grant) => g.企業規模))].map(size => ({
              id: size.toLowerCase().replace(/\s+/g, '-'),
              name: size,
              value: size
            })),
            grantAmount: [...new Set(grants.map((g: Grant) => g.金額分類))].map(amount => ({
              id: amount.toLowerCase().replace(/\s+/g, '-'),
              name: amount,
              value: amount
            })),
            agency: [...new Set(grants.map((g: Grant) => g.主辦機關分類))].map(agency => ({
              id: agency.toLowerCase().replace(/\s+/g, '-'),
              name: agency,
              value: agency
            }))
          }
        };

        console.log('補助數量:', grants.length);
        setGrantsData(data);
      } catch (err) {
        console.error('載入資料錯誤:', err);
        setError(err instanceof Error ? err.message : '載入資料時發生錯誤');
      } finally {
        setLoading(false);
      }
    };

    loadGrantsData();

    // 設定定期輪詢（每 5 秒檢查一次更新）
    const pollInterval = setInterval(() => {
      loadGrantsData();
    }, 5000);

    return () => {
      clearInterval(pollInterval);
    };
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

      // Company size filter - 支援多重選取（OR 邏輯）
      if (filters.companySize.length > 0) {
        // 檢查補助計畫的企業規模陣列是否與任一選取的企業規模有交集
        const hasMatch = filters.companySize.some(selectedSize => 
          grant.企業規模 && grant.企業規模.includes(selectedSize)
        );
        if (!hasMatch) {
          return false;
        }
      }

      // Grant amount filter - 支援多重選取（OR 邏輯）
      if (filters.grantAmount.length > 0) {
        if (!filters.grantAmount.includes(grant.金額分類)) {
          return false;
        }
      }

      // Agency filter - 支援多重選取（OR 邏輯）
      if (filters.agency.length > 0) {
        if (!filters.agency.includes(grant.主辦機關分類)) {
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

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      search: '',
      mainCategory: 'all',
      subCategory: '',
      companySize: [],    // 清除為空陣列
      grantAmount: [],    // 清除為空陣列
      agency: []          // 清除為空陣列
    });
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
    clearAllFilters,
    sortGrants
  };
};
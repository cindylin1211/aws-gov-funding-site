import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Grant } from "@/types/grant";
import { useToast } from "@/hooks/use-toast";

export const useSupabaseGrants = () => {
  const [grants, setGrants] = useState<Grant[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // 載入資料
  const loadGrants = async () => {
    try {
      setLoading(true);
      
      // 嘗試從 Supabase 載入
      try {
        const { data, error } = await supabase
          .from('grants')
          .select('*')
          .order('created_at', { ascending: true }) as any;

        if (!error && data && data.length > 0) {
          // 如果 Supabase 有資料，優先使用 Supabase 的資料
          const grantsData = data.flatMap((row: any) => row.data as Grant[]);
          console.log('從 Supabase 載入資料，共', grantsData.length, '個計畫');
          setGrants(grantsData);
        } else if (!error && (!data || data.length === 0)) {
          // 只有在 Supabase 完全是空的時候，才從 JSON 初始化
          console.log('Supabase 是空的，從 JSON 初始化');
          const response = await fetch('/grants-database.json');
          const jsonData = await response.json();
          setGrants(jsonData.grants);
          // 將 JSON 資料同步到 Supabase（只執行一次）
          await saveToSupabase(jsonData.grants, false);
        } else {
          throw error;
        }
      } catch (supabaseError) {
        console.error('Supabase 連接失敗:', supabaseError);
        // 如果 Supabase 失敗，才使用 JSON 備用
        const response = await fetch('/grants-database.json');
        const jsonData = await response.json();
        setGrants(jsonData.grants);
        toast({
          title: "使用本地資料",
          description: "無法連接雲端資料庫，使用本地備份資料",
        });
      }
    } catch (error) {
      console.error('載入資料錯誤:', error);
      toast({
        title: "載入失敗",
        description: "無法載入補助資料",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // 儲存到 Supabase
  const saveToSupabase = async (grantsData: Grant[], showToast = true) => {
    try {
      console.log('開始儲存到 Supabase，共', grantsData.length, '個計畫');
      
      // 使用 upsert 來更新或插入資料
      const { error } = await (supabase
        .from('grants') as any)
        .upsert({
          id: 'grants-data',
          data: grantsData,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        });

      if (error) {
        console.error('Supabase 儲存錯誤:', error);
        throw error;
      }

      console.log('成功儲存到 Supabase');

      if (showToast) {
        toast({
          title: "儲存成功",
          description: "資料已同步到雲端",
        });
      }
    } catch (error) {
      console.error('儲存錯誤:', error);
      if (showToast) {
        toast({
          title: "儲存失敗",
          description: "無法同步資料到雲端",
          variant: "destructive",
        });
      }
      throw error; // 重新拋出錯誤以便上層處理
    }
  };

  // 新增補助計畫
  const addGrant = async (grant: Grant) => {
    const newGrants = [...grants, grant];
    setGrants(newGrants);
    await saveToSupabase(newGrants);
  };

  // 更新補助計畫
  const updateGrant = async (id: string, updatedGrant: Grant) => {
    const newGrants = grants.map(g => g.id === id ? updatedGrant : g);
    setGrants(newGrants);
    await saveToSupabase(newGrants);
  };

  // 刪除補助計畫
  const deleteGrant = async (id: string) => {
    const newGrants = grants.filter(g => g.id !== id);
    setGrants(newGrants);
    await saveToSupabase(newGrants);
  };

  useEffect(() => {
    loadGrants();

    // 訂閱即時更新
    const channel = supabase
      .channel('grants-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'grants'
        },
        () => {
          loadGrants();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    grants,
    loading,
    addGrant,
    updateGrant,
    deleteGrant,
    refreshGrants: loadGrants
  };
};

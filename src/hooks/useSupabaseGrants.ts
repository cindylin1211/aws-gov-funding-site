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
      
      // 從 Supabase 載入
      const { data, error } = await supabase
        .from('grants')
        .select('*')
        .order('created_at', { ascending: true }) as any;

      if (error) throw error;

      if (data && data.length > 0) {
        // 使用資料庫的資料
        const grantsData = data.flatMap((row: any) => row.data as Grant[]);
        setGrants(grantsData);
      } else {
        // 如果資料庫是空的，從 JSON 檔案初始化
        const response = await fetch('/grants-database.json');
        const jsonData = await response.json();
        setGrants(jsonData.grants);
        
        // 將初始資料存入資料庫
        await saveToSupabase(jsonData.grants);
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
  const saveToSupabase = async (grantsData: Grant[]) => {
    try {
      // 先刪除舊資料
      await (supabase.from('grants') as any).delete().neq('id', '');

      // 插入新資料
      const { error } = await (supabase
        .from('grants') as any)
        .insert({
          id: 'grants-data',
          data: grantsData
        });

      if (error) throw error;

      toast({
        title: "儲存成功",
        description: "資料已同步到雲端",
      });
    } catch (error) {
      console.error('儲存錯誤:', error);
      toast({
        title: "儲存失敗",
        description: "無法同步資料到雲端",
        variant: "destructive",
      });
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

import { useState, useEffect } from "react";
import { Grant } from "@/types/grant";
import { useToast } from "@/hooks/use-toast";

const API_URL = import.meta.env.VITE_GRANTS_API_URL || 'https://03rc0jt6dg.execute-api.us-west-2.amazonaws.com/prod';

export const useDynamoDBGrants = () => {
  const [grants, setGrants] = useState<Grant[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // 載入資料
  const loadGrants = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/grants`);
      
      if (!response.ok) {
        throw new Error('無法載入補助資料');
      }
      
      const data = await response.json();
      setGrants(data.grants || []);
      console.log('從 DynamoDB 載入資料，共', data.grants?.length || 0, '個計畫');
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

  // 新增補助計畫
  const addGrant = async (grant: Grant) => {
    try {
      const response = await fetch(`${API_URL}/grants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(grant),
      });

      if (!response.ok) {
        throw new Error('新增失敗');
      }

      await loadGrants(); // 重新載入資料
    } catch (error) {
      console.error('新增錯誤:', error);
      toast({
        title: "新增失敗",
        description: "無法新增補助計畫",
        variant: "destructive",
      });
      throw error;
    }
  };

  // 更新補助計畫
  const updateGrant = async (id: string, updatedGrant: Grant) => {
    try {
      const response = await fetch(`${API_URL}/grants`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedGrant),
      });

      if (!response.ok) {
        throw new Error('更新失敗');
      }

      await loadGrants(); // 重新載入資料
    } catch (error) {
      console.error('更新錯誤:', error);
      toast({
        title: "更新失敗",
        description: "無法更新補助計畫",
        variant: "destructive",
      });
      throw error;
    }
  };

  // 刪除補助計畫
  const deleteGrant = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/grants/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('刪除失敗');
      }

      await loadGrants(); // 重新載入資料
    } catch (error) {
      console.error('刪除錯誤:', error);
      toast({
        title: "刪除失敗",
        description: "無法刪除補助計畫",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    loadGrants();
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

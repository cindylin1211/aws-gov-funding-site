import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Grant } from "@/types/grant";
import { Download, Plus, Edit, Trash2, Save, X, Home, RefreshCw } from "lucide-react";
import { useSupabaseGrants } from "@/hooks/useSupabaseGrants";

export default function Admin() {
  const { grants, loading, addGrant, updateGrant, deleteGrant, refreshGrants } = useSupabaseGrants();
  const [editingGrant, setEditingGrant] = useState<Grant | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  const handleExport = () => {
    const dataStr = JSON.stringify({ grants }, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `grants-database-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "匯出成功",
      description: "資料已下載",
    });
  };

  const handleEdit = (grant: Grant) => {
    setEditingGrant(grant);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("確定要刪除這個補助計畫嗎？")) {
      await deleteGrant(id);
      toast({
        title: "刪除成功",
        description: "補助計畫已刪除並同步到雲端",
      });
    }
  };

  const handleSave = async (grant: Grant) => {
    if (editingGrant) {
      // 更新
      await updateGrant(grant.id, grant);
      toast({
        title: "更新成功",
        description: "補助計畫已更新並同步到雲端",
      });
    } else {
      // 新增
      await addGrant(grant);
      toast({
        title: "新增成功",
        description: "補助計畫已新增並同步到雲端",
      });
    }
    setIsFormOpen(false);
    setEditingGrant(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold">補助計畫管理</h1>
            <p className="text-sm text-gray-600 mt-2">
              共 {grants.length} 個補助計畫 • 資料自動儲存到瀏覽器
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => window.location.href = '/'} variant="outline">
              <Home className="mr-2 h-4 w-4" />
              返回首頁
            </Button>
            <Button onClick={refreshGrants} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />
              重新載入
            </Button>
            <Button onClick={() => { setEditingGrant(null); setIsFormOpen(true); }} disabled={loading}>
              <Plus className="mr-2 h-4 w-4" />
              新增補助計畫
            </Button>
            <Button onClick={handleExport} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              匯出資料
            </Button>
          </div>
        </div>

        <Card className="p-4 mb-6 bg-green-50 border-green-200">
          <div className="flex items-start gap-3">
            <div className="text-green-600 mt-0.5">☁️</div>
            <div className="flex-1 text-sm">
              <p className="font-semibold text-green-900 mb-1">雲端同步已啟用</p>
              <ul className="text-green-800 space-y-1">
                <li>• 所有變更會<strong>即時同步到雲端資料庫</strong></li>
                <li>• <strong>所有使用者</strong>都會看到最新資料（包括部署後的網站）</li>
                <li>• 資料會<strong>自動即時更新</strong>，無需重新整理</li>
                <li>• 點擊「匯出資料」可下載備份檔案</li>
              </ul>
            </div>
          </div>
        </Card>

        {isFormOpen && (
          <GrantForm
            grant={editingGrant}
            onSave={handleSave}
            onCancel={() => { setIsFormOpen(false); setEditingGrant(null); }}
          />
        )}

        <div className="grid gap-4">
          {grants.map((grant) => (
            <Card key={grant.id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">{grant.計畫名稱}</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">補助類別：</span>
                      <span className="font-medium">{grant.補助類別} - {grant.子分類}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">補助金額：</span>
                      <span className="font-medium">{grant.補助金額}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">主辦單位：</span>
                      <span className="font-medium">{grant.主辦單位}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">計畫時程：</span>
                      <span className="font-medium">{grant.計畫時程}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(grant)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(grant.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function GrantForm({ grant, onSave, onCancel }: {
  grant: Grant | null;
  onSave: (grant: Grant) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Grant>(
    grant || {
      id: `grant-${Date.now()}`,
      計畫名稱: "",
      補助類別: "數位轉型",
      子分類: "",
      補助重點: "",
      補助對象: [],
      補助金額: "",
      補助比例上限: "",
      計畫時程: "",
      主辦單位: "",
      參考資料: [],
      企業規模: [],
      金額分類: "中額補助",
      主辦機關分類: "經濟部",
    }
  );

  // 參考資料狀態
  const [refLinks, setRefLinks] = useState<Array<{text: string, url: string}>>(
    grant?.參考資料 || []
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 過濾掉空的參考資料
    const validRefLinks = refLinks.filter(link => link.text.trim() && link.url.trim());
    onSave({ ...formData, 參考資料: validRefLinks });
  };

  const addRefLink = () => {
    setRefLinks([...refLinks, { text: "", url: "" }]);
  };

  const removeRefLink = (index: number) => {
    setRefLinks(refLinks.filter((_, i) => i !== index));
  };

  const updateRefLink = (index: number, field: 'text' | 'url', value: string) => {
    const newRefLinks = [...refLinks];
    newRefLinks[index][field] = value;
    setRefLinks(newRefLinks);
  };

  return (
    <Card className="p-6 mb-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            {grant ? "編輯補助計畫" : "新增補助計畫"}
          </h2>
          <div className="flex gap-2">
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              儲存
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              <X className="mr-2 h-4 w-4" />
              取消
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">計畫名稱 *</label>
            <Input
              required
              value={formData.計畫名稱}
              onChange={(e) => setFormData({ ...formData, 計畫名稱: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">補助類別 *</label>
            <select
              required
              className="w-full p-2 border rounded"
              value={formData.補助類別}
              onChange={(e) => setFormData({ ...formData, 補助類別: e.target.value })}
            >
              <option value="數位轉型">數位轉型</option>
              <option value="創新研發">創新研發</option>
              <option value="人才培訓">人才培訓</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">子分類 *</label>
            <Input
              required
              value={formData.子分類}
              onChange={(e) => setFormData({ ...formData, 子分類: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">補助金額 *</label>
            <Input
              required
              value={formData.補助金額}
              onChange={(e) => setFormData({ ...formData, 補助金額: e.target.value })}
              placeholder="例：最高1000萬元"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">補助比例上限 *</label>
            <Input
              required
              value={formData.補助比例上限}
              onChange={(e) => setFormData({ ...formData, 補助比例上限: e.target.value })}
              placeholder="例：50%"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">計畫時程 *</label>
            <Input
              required
              value={formData.計畫時程}
              onChange={(e) => setFormData({ ...formData, 計畫時程: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">主辦單位 *</label>
            <Input
              required
              value={formData.主辦單位}
              onChange={(e) => setFormData({ ...formData, 主辦單位: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">金額分類 *</label>
            <select
              required
              className="w-full p-2 border rounded"
              value={formData.金額分類}
              onChange={(e) => setFormData({ ...formData, 金額分類: e.target.value })}
            >
              <option value="小額補助">小額補助 (100萬以下)</option>
              <option value="中額補助">中額補助 (100-500萬)</option>
              <option value="大額補助">大額補助 (500-1000萬)</option>
              <option value="超大額補助">超大額補助 (1000萬以上)</option>
              <option value="無上限補助">無上限補助</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">補助重點 *</label>
          <Textarea
            required
            rows={3}
            value={formData.補助重點}
            onChange={(e) => setFormData({ ...formData, 補助重點: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">補助對象 (每行一個) *</label>
          <Textarea
            required
            rows={3}
            value={formData.補助對象.join("\n")}
            onChange={(e) => setFormData({ ...formData, 補助對象: e.target.value.split("\n").filter(Boolean) })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">企業規模 (用逗號分隔) *</label>
          <Input
            required
            value={formData.企業規模.join(", ")}
            onChange={(e) => setFormData({ ...formData, 企業規模: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
            placeholder="例：中小企業, 大型企業"
          />
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-medium">參考資料 (選填)</label>
            <Button type="button" size="sm" variant="outline" onClick={addRefLink}>
              <Plus className="mr-2 h-4 w-4" />
              新增連結
            </Button>
          </div>
          <div className="space-y-3">
            {refLinks.map((link, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-start">
                <div className="col-span-3">
                  <Input
                    placeholder="連結名稱 (例：計畫官網)"
                    value={link.text}
                    onChange={(e) => updateRefLink(index, 'text', e.target.value)}
                  />
                </div>
                <div className="col-span-8">
                  <Input
                    placeholder="網址 (例：https://...)"
                    value={link.url}
                    onChange={(e) => updateRefLink(index, 'url', e.target.value)}
                  />
                </div>
                <div className="col-span-1">
                  <Button 
                    type="button" 
                    size="sm" 
                    variant="destructive"
                    onClick={() => removeRefLink(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {refLinks.length === 0 && (
              <p className="text-sm text-gray-500">尚未新增參考資料連結</p>
            )}
          </div>
        </div>
      </form>
    </Card>
  );
}

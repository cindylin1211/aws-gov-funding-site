import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Plus, Home, RefreshCw, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

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

const API_ENDPOINT = import.meta.env.VITE_GRANTS_API_URL || 'https://YOUR_API_GATEWAY_URL';

const Admin = () => {
  const [grants, setGrants] = useState<Grant[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingGrant, setEditingGrant] = useState<Grant | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Partial<Grant>>({
    計畫名稱: '',
    補助類別: '數位轉型',
    子分類: '',
    補助重點: '',
    補助對象: [],
    補助金額: '',
    補助比例上限: '',
    計畫時程: '',
    主辦單位: '',
    參考資料: [],
    企業規模: [],
    金額分類: '中額補助',
    主辦機關分類: '經濟部'
  });

  useEffect(() => {
    loadGrants();
  }, []);

  const loadGrants = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_ENDPOINT}/grants`);
      if (!response.ok) throw new Error('載入失敗');
      const data = await response.json();
      setGrants(data.grants || []);
    } catch (error) {
      toast({
        title: "載入失敗",
        description: error instanceof Error ? error.message : "無法載入補助資料",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const grantData = {
        ...formData,
        id: editingGrant?.id || `grant-${Date.now()}`
      };

      const method = editingGrant ? 'PUT' : 'POST';
      const response = await fetch(`${API_ENDPOINT}/grants`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(grantData)
      });

      if (!response.ok) throw new Error('儲存失敗');

      toast({
        title: "儲存成功",
        description: editingGrant ? "補助計畫已更新" : "新補助計畫已建立"
      });

      setIsDialogOpen(false);
      setEditingGrant(null);
      resetForm();
      loadGrants();
    } catch (error) {
      toast({
        title: "儲存失敗",
        description: error instanceof Error ? error.message : "無法儲存資料",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('確定要刪除此補助計畫嗎？')) return;

    try {
      const response = await fetch(`${API_ENDPOINT}/grants/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('刪除失敗');

      toast({
        title: "刪除成功",
        description: "補助計畫已刪除"
      });

      loadGrants();
    } catch (error) {
      toast({
        title: "刪除失敗",
        description: error instanceof Error ? error.message : "無法刪除資料",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (grant: Grant) => {
    setEditingGrant(grant);
    setFormData(grant);
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      計畫名稱: '',
      補助類別: '數位轉型',
      子分類: '',
      補助重點: '',
      補助對象: [],
      補助金額: '',
      補助比例上限: '',
      計畫時程: '',
      主辦單位: '',
      參考資料: [],
      企業規模: [],
      金額分類: '中額補助',
      主辦機關分類: '經濟部'
    });
  };

  const handleNewGrant = () => {
    setEditingGrant(null);
    resetForm();
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-gradient-hero text-white py-8 px-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold">補助計畫管理</h1>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => navigate('/')}>
              <Home className="h-4 w-4 mr-2" />
              回到首頁
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                共 {grants.length} 個補助計畫 • 資料自動儲存到雲端資料庫
              </CardTitle>
              <div className="flex gap-2">
                <Button onClick={loadGrants} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  重新載入
                </Button>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={handleNewGrant}>
                      <Plus className="h-4 w-4 mr-2" />
                      新增補助計畫
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingGrant ? '編輯補助計畫' : '新增補助計畫'}
                      </DialogTitle>
                    </DialogHeader>
                    <GrantForm
                      formData={formData}
                      setFormData={setFormData}
                      onSave={handleSave}
                      onCancel={() => {
                        setIsDialogOpen(false);
                        setEditingGrant(null);
                        resetForm();
                      }}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">載入中...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>計畫名稱</TableHead>
                    <TableHead>補助類別</TableHead>
                    <TableHead>子分類</TableHead>
                    <TableHead>主辦單位</TableHead>
                    <TableHead>補助金額</TableHead>
                    <TableHead className="text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grants.map((grant) => (
                    <TableRow key={grant.id}>
                      <TableCell className="font-medium">{grant.計畫名稱}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{grant.補助類別}</Badge>
                      </TableCell>
                      <TableCell>{grant.子分類}</TableCell>
                      <TableCell>{grant.主辦單位}</TableCell>
                      <TableCell>{grant.補助金額}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(grant)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(grant.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

const GrantForm = ({ formData, setFormData, onSave, onCancel }: any) => {
  const updateField = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const updateArrayField = (field: string, value: string) => {
    const items = value.split('\n').filter(item => item.trim());
    updateField(field, items);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label>計畫名稱</Label>
          <Input
            value={formData.計畫名稱}
            onChange={(e) => updateField('計畫名稱', e.target.value)}
          />
        </div>

        <div>
          <Label>補助類別</Label>
          <Select value={formData.補助類別} onValueChange={(v) => updateField('補助類別', v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="數位轉型">數位轉型</SelectItem>
              <SelectItem value="創新研發">創新研發</SelectItem>
              <SelectItem value="人才培訓">人才培訓</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>子分類</Label>
          <Input
            value={formData.子分類}
            onChange={(e) => updateField('子分類', e.target.value)}
          />
        </div>

        <div className="col-span-2">
          <Label>補助重點</Label>
          <Textarea
            value={formData.補助重點}
            onChange={(e) => updateField('補助重點', e.target.value)}
            rows={3}
          />
        </div>

        <div>
          <Label>補助金額</Label>
          <Input
            value={formData.補助金額}
            onChange={(e) => updateField('補助金額', e.target.value)}
            placeholder="例：最高500萬元"
          />
        </div>

        <div>
          <Label>補助比例上限</Label>
          <Input
            value={formData.補助比例上限}
            onChange={(e) => updateField('補助比例上限', e.target.value)}
            placeholder="例：50%"
          />
        </div>

        <div>
          <Label>計畫時程</Label>
          <Input
            value={formData.計畫時程}
            onChange={(e) => updateField('計畫時程', e.target.value)}
          />
        </div>

        <div>
          <Label>主辦單位</Label>
          <Input
            value={formData.主辦單位}
            onChange={(e) => updateField('主辦單位', e.target.value)}
          />
        </div>

        <div>
          <Label>金額分類</Label>
          <Select value={formData.金額分類} onValueChange={(v) => updateField('金額分類', v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="小額補助">小額補助</SelectItem>
              <SelectItem value="中額補助">中額補助</SelectItem>
              <SelectItem value="大額補助">大額補助</SelectItem>
              <SelectItem value="超大額補助">超大額補助</SelectItem>
              <SelectItem value="無上限補助">無上限補助</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>主辦機關分類</Label>
          <Select value={formData.主辦機關分類} onValueChange={(v) => updateField('主辦機關分類', v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="經濟部">經濟部</SelectItem>
              <SelectItem value="數位發展部">數位發展部</SelectItem>
              <SelectItem value="勞動部">勞動部</SelectItem>
              <SelectItem value="地方政府">地方政府</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-2">
          <Label>補助對象（每行一項）</Label>
          <Textarea
            value={formData.補助對象?.join('\n') || ''}
            onChange={(e) => updateArrayField('補助對象', e.target.value)}
            rows={3}
          />
        </div>

        <div className="col-span-2">
          <Label>企業規模（每行一項）</Label>
          <Textarea
            value={formData.企業規模?.join('\n') || ''}
            onChange={(e) => updateArrayField('企業規模', e.target.value)}
            rows={2}
          />
        </div>

        <div className="col-span-2">
          <Label>參考資料（每行一項）</Label>
          <Textarea
            value={formData.參考資料?.join('\n') || ''}
            onChange={(e) => updateArrayField('參考資料', e.target.value)}
            rows={2}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          取消
        </Button>
        <Button onClick={onSave}>
          儲存
        </Button>
      </div>
    </div>
  );
};

export default Admin;

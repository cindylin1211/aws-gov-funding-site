import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  DollarSign, 
  Users, 
  Clock, 
  Building2, 
  Target, 
  FileText,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Grant } from "@/types/grant";

interface GrantModalProps {
  grant: Grant | null;
  isOpen: boolean;
  onClose: () => void;
}

const GrantModal = ({ grant, isOpen, onClose }: GrantModalProps) => {
  if (!grant) return null;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "數位轉型":
        return "bg-primary text-primary-foreground";
      case "創新研發":
        return "bg-secondary text-secondary-foreground";
      case "人才培訓":
        return "bg-accent text-accent-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-card">
        <DialogHeader className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <DialogTitle className="text-2xl font-heading text-foreground leading-tight">
              {grant.計畫名稱}
            </DialogTitle>
            <div className="flex gap-2 shrink-0">
              <Badge className={getCategoryColor(grant.補助類別)}>
                {grant.補助類別}
              </Badge>
              {grant.子分類 && (
                <Badge variant="outline">
                  {grant.子分類}
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Key Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-success" />
              <div>
                <p className="text-sm text-muted-foreground">補助金額</p>
                <p className="font-semibold text-foreground">{grant.補助金額}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">補助比例</p>
                <p className="font-semibold text-foreground">{grant.補助比例上限}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-accent" />
              <div>
                <p className="text-sm text-muted-foreground">計畫時程</p>
                <p className="font-semibold text-foreground">{grant.計畫時程}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">主辦單位</p>
                <p className="font-semibold text-foreground">{grant.主辦單位}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Detailed Information */}
          <div className="space-y-6">
            {/* 補助重點 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">補助重點</h3>
              </div>
              <p className="text-muted-foreground leading-relaxed pl-7">
                {grant.補助重點}
              </p>
            </div>

            {/* 補助對象 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-secondary" />
                <h3 className="text-lg font-semibold text-foreground">補助對象</h3>
              </div>
              <ul className="space-y-2 pl-7">
                {grant.補助對象.map((target, index) => (
                  <li key={index} className="flex items-start gap-2 text-muted-foreground">
                    <span className="w-1.5 h-1.5 bg-secondary rounded-full mt-2 shrink-0"></span>
                    <span>{target}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 企業規模標籤 */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">適用企業規模</h3>
              <div className="flex flex-wrap gap-2 pl-7">
                {grant.企業規模.map((size, index) => (
                  <Badge key={index} variant="outline">
                    {size}
                  </Badge>
                ))}
              </div>
            </div>

            {/* 參考資料 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-accent" />
                <h3 className="text-lg font-semibold text-foreground">參考資料</h3>
              </div>
              <div className="space-y-2 pl-7">
                {grant.參考資料.map((reference, index) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors"
                    onClick={() => {
                      window.open(reference.url, '_blank');
                    }}
                  >
                    <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground hover:text-primary transition-colors">{reference.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={onClose}>
              關閉
            </Button>
            <Button 
              className="bg-gradient-primary"
              onClick={() => {
                // 使用第一個參考資料連結
                if (grant.參考資料 && grant.參考資料.length > 0) {
                  window.open(grant.參考資料[0].url, '_blank');
                } else {
                  alert('暫無申請連結');
                }
              }}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              前往申請
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GrantModal;

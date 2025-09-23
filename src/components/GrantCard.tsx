import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Building2, DollarSign, Users } from "lucide-react";

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

interface GrantCardProps {
  grant: Grant;
  onClick: () => void;
}

const GrantCard = ({ grant, onClick }: GrantCardProps) => {
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

  const getAmountColor = (amount: string) => {
    if (amount.includes("1000萬") || amount.includes("2000萬") || amount.includes("4000萬")) {
      return "text-destructive font-bold";
    }
    if (amount.includes("500萬") || amount.includes("700萬")) {
      return "text-warning font-semibold";
    }
    return "text-success font-medium";
  };

  return (
    <Card 
      className="group cursor-pointer transition-all duration-normal hover:shadow-lg hover:-translate-y-1 bg-gradient-card border-border/50"
      onClick={(e) => {
        console.log('Card clicked, event target:', e.target);
        console.log('Card onClick called');
        onClick();
      }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-heading font-semibold text-lg leading-tight text-foreground group-hover:text-primary transition-colors duration-fast">
            {grant.計畫名稱}
          </h3>
          <Badge className={`${getCategoryColor(grant.補助類別)} shrink-0 font-medium`}>
            {grant.補助類別}
          </Badge>
        </div>
        {grant.子分類 && (
          <Badge variant="outline" className="w-fit text-xs">
            {grant.子分類}
          </Badge>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
          {grant.補助重點}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-success shrink-0" />
            <span className="text-muted-foreground">補助金額:</span>
            <span className={getAmountColor(grant.補助金額)}>
              {grant.補助金額}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary shrink-0" />
            <span className="text-muted-foreground">補助比例:</span>
            <span className="text-foreground font-medium">
              {grant.補助比例上限}
            </span>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="text-muted-foreground truncate">
              {grant.主辦單位}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-accent shrink-0" />
            <span className="text-muted-foreground">
              {grant.計畫時程}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-4">
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-fast"
          onClick={(e) => {
            console.log('Button clicked, stopping propagation');
            e.stopPropagation();
            e.preventDefault();
            onClick();
          }}
        >
          查看詳細資訊
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GrantCard;
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar = ({ value, onChange, placeholder = "搜尋補助計畫名稱或關鍵字..." }: SearchBarProps) => {
  const [inputValue, setInputValue] = useState(value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onChange(inputValue);
  };

  const handleClear = () => {
    setInputValue("");
    onChange("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 max-w-2xl mx-auto">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-10 h-12 border-2 focus:border-primary transition-colors duration-fast bg-background/50 backdrop-blur-sm"
        />
        {inputValue && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Button 
        type="submit" 
        className="h-12 px-8 bg-gradient-primary hover:shadow-glow transition-all duration-normal"
      >
        <Search className="h-4 w-4 mr-2" />
        搜尋
      </Button>
    </form>
  );
};

export default SearchBar;
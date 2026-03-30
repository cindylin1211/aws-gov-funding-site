export interface Grant {
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
  參考資料: { text: string; url: string }[];
  企業規模: string[];
  金額分類: string;
  主辦機關分類: string;
}
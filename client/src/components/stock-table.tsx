import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { formatPrice, formatVolume, formatMarketCap } from "@/lib/utils";
import type { StockResponse } from "@shared/schema";

type SortColumn = "symbol" | "name" | "close" | "change" | "volume" | "marketCap" | "sector";
type SortDirection = "asc" | "desc";

interface StockTableProps {
  data: StockResponse["stocks"];
}

export function StockTable({ data }: StockTableProps) {
  const [sortColumn, setSortColumn] = useState<SortColumn | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortColumn) return 0;

    let aVal: any = a[sortColumn];
    let bVal: any = b[sortColumn];

    // Handle numeric sorting
    if (sortColumn === "close" || sortColumn === "change" || sortColumn === "volume" || sortColumn === "marketCap") {
      aVal = Number(aVal);
      bVal = Number(bVal);
    }

    if (sortDirection === "asc") {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });

  const getSortIcon = (column: SortColumn) => {
    if (sortColumn !== column) {
      return <ArrowUpDown className="ml-2 h-4 w-4 text-gray-400" />;
    }
    return sortDirection === "asc" ? 
      <ArrowUp className="ml-2 h-4 w-4 text-blue-500" /> : 
      <ArrowDown className="ml-2 h-4 w-4 text-blue-500" />;
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="px-6 py-3">
              <Button
                variant="ghost"
                className="h-auto p-0 font-medium text-xs text-gray-500 uppercase tracking-wider hover:bg-gray-100"
                onClick={() => handleSort("symbol")}
              >
                Symbol
                {getSortIcon("symbol")}
              </Button>
            </TableHead>
            <TableHead className="px-6 py-3 hidden sm:table-cell">
              <Button
                variant="ghost"
                className="h-auto p-0 font-medium text-xs text-gray-500 uppercase tracking-wider hover:bg-gray-100"
                onClick={() => handleSort("name")}
              >
                Company Name
                {getSortIcon("name")}
              </Button>
            </TableHead>
            <TableHead className="px-6 py-3">
              <Button
                variant="ghost"
                className="h-auto p-0 font-medium text-xs text-gray-500 uppercase tracking-wider hover:bg-gray-100"
                onClick={() => handleSort("close")}
              >
                Price
                {getSortIcon("close")}
              </Button>
            </TableHead>
            <TableHead className="px-6 py-3">
              <Button
                variant="ghost"
                className="h-auto p-0 font-medium text-xs text-gray-500 uppercase tracking-wider hover:bg-gray-100"
                onClick={() => handleSort("change")}
              >
                Change
                {getSortIcon("change")}
              </Button>
            </TableHead>
            <TableHead className="px-6 py-3 hidden md:table-cell">
              <Button
                variant="ghost"
                className="h-auto p-0 font-medium text-xs text-gray-500 uppercase tracking-wider hover:bg-gray-100"
                onClick={() => handleSort("volume")}
              >
                Volume
                {getSortIcon("volume")}
              </Button>
            </TableHead>
            <TableHead className="px-6 py-3 hidden lg:table-cell">
              <Button
                variant="ghost"
                className="h-auto p-0 font-medium text-xs text-gray-500 uppercase tracking-wider hover:bg-gray-100"
                onClick={() => handleSort("marketCap")}
              >
                Market Cap
                {getSortIcon("marketCap")}
              </Button>
            </TableHead>
            <TableHead className="px-6 py-3 hidden xl:table-cell">
              <Button
                variant="ghost"
                className="h-auto p-0 font-medium text-xs text-gray-500 uppercase tracking-wider hover:bg-gray-100"
                onClick={() => handleSort("sector")}
              >
                Sector
                {getSortIcon("sector")}
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((stock, index) => {
            const changeNum = Number(stock.change);
            const changeClass = changeNum >= 0 ? "text-green-600" : "text-red-600";
            const changeSign = changeNum >= 0 ? "+" : "";
            
            return (
              <TableRow key={`${stock.symbol}-${index}`} className="hover:bg-gray-50 transition-colors duration-150">
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => window.open(`https://in.tradingview.com/chart/?symbol=NSE:${stock.symbol}&interval=1D`, '_blank', 'noopener,noreferrer')}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer transition-colors"
                  >
                    {stock.symbol}
                  </button>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                  <div className="text-sm text-gray-900" title={stock.description}>{stock.name}</div>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {formatPrice(stock.close)}
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium ${changeClass}`}>
                    {changeSign}{stock.change.toFixed(2)}%
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                  <div className="text-sm text-gray-900">{formatVolume(stock.volume)}</div>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                  <div className="text-sm text-gray-900">{formatMarketCap(stock.marketCap)}</div>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap hidden xl:table-cell">
                  <div className="text-sm text-gray-600">{stock.sector}</div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

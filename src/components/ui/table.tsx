
import * as React from "react"

import { cn } from "@/lib/utils"

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

// Define specific monetary column names to help with detection
const MONETARY_COLUMNS = [
  'budget', 'funding', 'investment', 'cost', 'price', 'value', 
  'contribution', 'expense', 'revenue', 'income', 'total_budget', 
  'funding_amount', 'amount'
];

// Define specific non-monetary count column names
const COUNT_COLUMNS = [
  'count', 'number', 'total', 'qty', 'quantity', 'applications',
  'projects', 'startups', 'collaborations', 'patents', 'participants',
  'companies', 'users', 'submissions'
];

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement> & { 
    numeric?: boolean;
    currency?: boolean;
    align?: "left" | "center" | "right";
    percentage?: boolean;
    energy?: boolean;
    score?: boolean;
    count?: boolean;
    unit?: string;
  }
>(({ className, numeric, currency, percentage, energy, score, count, unit, align = "left", ...props }, ref) => {
  const alignmentClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right"
  }[align]

  // Apply specific formatting classes
  const formattingClass = cn(
    numeric && "font-mono tabular-nums",
    currency && "font-mono tabular-nums",
    percentage && "font-mono tabular-nums",
    energy && "font-mono tabular-nums",
    score && "font-mono tabular-nums",
    count && "font-mono tabular-nums"
  )
  
  // Format the content based on the cell type
  let content = props.children;
  
  if (content !== undefined && (typeof content === 'string' || typeof content === 'number')) {
    const valueStr = String(content).trim();
    
    // Check if the string represents a number (ignoring currency symbols)
    const numericRegex = /^[€$£\s]*([-+]?[\d.,]+)[€$£\s%]*$/;
    const match = valueStr.match(numericRegex);
    
    if (match) {
      // Replace comma with dot for correct parsing and remove any currency symbols
      const cleanNumericStr = match[1].replace(/,/g, '.');
      const value = parseFloat(cleanNumericStr);
      
      if (!isNaN(value)) {
        // Determine column name if available from DOM context
        const columnName = (props as any)['data-column']?.toLowerCase() || '';
        
        // Check if this column should be treated as currency
        const isCurrency = currency || 
          MONETARY_COLUMNS.some(term => columnName.includes(term)) ||
          (unit && (['EUR', '€', 'euro', 'euros', 'million EUR', 'billion EUR'].includes(unit) ||
                    unit.toLowerCase().includes('budget') ||
                    unit.toLowerCase().includes('funding') ||
                    unit.toLowerCase().includes('investment')));
        
        const isCount = count || 
          COUNT_COLUMNS.some(term => columnName.includes(term)) || 
          (unit && COUNT_COLUMNS.some(term => unit.toLowerCase().includes(term)));
        
        // Handle percentage values
        if (percentage || valueStr.includes('%') || (unit && (unit === 'percent' || unit === '%' || unit === 'percent YoY' || unit === 'percent of GDP'))) {
          content = `${value.toFixed(1)}%`;
        } 
        // Handle currency values with EUR symbol
        else if (isCurrency) {
          content = new Intl.NumberFormat('pt-PT', { 
            style: 'currency', 
            currency: 'EUR',
            maximumFractionDigits: 0
          }).format(value);
        } 
        // Handle counts and other numeric values without currency symbol
        else if (isCount || numeric || (unit && unit !== 'N/A')) {
          // Format the number without currency symbol
          content = value.toLocaleString('pt-PT', {
            style: 'decimal',
            maximumFractionDigits: 0
          });
          
          // Add the unit if provided and not N/A
          if (unit && unit !== 'N/A') {
            content = `${content} ${unit}`;
          }
        }
      }
    }
  }

  return (
    <td
      ref={ref}
      className={cn(
        "p-4 align-middle [&:has([role=checkbox])]:pr-0", 
        alignmentClass,
        formattingClass,
        className
      )}
      {...props}
    >
      {content}
    </td>
  )
})
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}

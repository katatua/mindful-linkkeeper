
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
    const value = Number(content);
    
    if (!isNaN(value)) {
      // Handle percentage units
      if (percentage || (unit && (unit === 'percent' || unit === 'percent YoY' || unit === 'percent of GDP'))) {
        content = `${value.toFixed(1)}%`;
      } 
      // Handle currency/monetary units - strictly only for actual currency values
      else if (currency || (unit && (
        unit === 'million EUR' || 
        unit === 'billion EUR' || 
        unit === 'EUR' || 
        unit.includes('budget') ||
        unit.includes('funding') ||
        unit.includes('investment')
      ))) {
        content = new Intl.NumberFormat('pt-PT', { 
          style: 'currency', 
          currency: 'EUR',
          maximumFractionDigits: 0
        }).format(value);
      } 
      // Handle scores and indexes
      else if (score || (unit && (unit === 'score' || unit.includes('index') || unit.includes('Index')))) {
        content = value.toFixed(1);
      } 
      // Handle count values
      else if (count || (unit && unit === 'count')) {
        content = value.toLocaleString('pt-PT');
      } 
      // Handle energy units
      else if (energy || (unit && unit.includes('MW'))) {
        content = `${value.toLocaleString('pt-PT')} MW`;
      }
      // Keep original value for other units
      else if (unit) {
        content = `${value.toLocaleString('pt-PT')} ${unit}`;
      }
      // No unit, just format the number
      else {
        content = value.toLocaleString('pt-PT');
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


import { Check, ChevronsUpDown, Settings, Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const models = [
  {
    value: "claude",
    label: "Claude-3-7-Sonnet",
    description: "Advanced reasoning with thinking capabilities",
    icon: <Sparkles className="h-4 w-4 mr-2 text-amber-500" />
  },
  {
    value: "gemini",
    label: "Gemini 2.0 Pro",
    description: "Fast responses for general tasks",
    icon: <Zap className="h-4 w-4 mr-2 text-emerald-500" />
  }
];

interface ModelSelectorProps {
  currentModel: string;
  onSelectModel: (model: 'claude' | 'gemini') => void;
}

export function ModelSelector({ currentModel, onSelectModel }: ModelSelectorProps) {
  const [open, setOpen] = useState(false);
  
  const selectedModel = models.find(model => model.value === currentModel);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1 h-8 px-2 border-muted-foreground/20"
              >
                {selectedModel?.icon}
                <span className="hidden sm:inline text-xs font-medium">{selectedModel?.label}</span>
                <ChevronsUpDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="text-xs">AI Models</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {models.map((model) => (
                <DropdownMenuItem
                  key={model.value}
                  className="flex items-start gap-2 py-2 cursor-pointer"
                  onClick={() => onSelectModel(model.value as 'claude' | 'gemini')}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {model.icon}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-sm flex items-center gap-2">
                      {model.label}
                      {currentModel === model.value && (
                        <Check className="h-3.5 w-3.5 text-primary" />
                      )}
                    </span>
                    <span className="text-xs text-muted-foreground">{model.description}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p className="text-xs">Switch AI model</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

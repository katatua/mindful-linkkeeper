
import { Check, ChevronsUpDown } from "lucide-react";
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

const models = [
  {
    value: "claude",
    label: "Claude-3-7-Sonnet",
    description: "Anthropic's most advanced model with reasoning capabilities"
  },
  {
    value: "gemini",
    label: "Gemini 2.0 Pro",
    description: "Google's large language model"
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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between text-xs"
        >
          {selectedModel?.label || "Select model..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandGroup>
            {models.map((model) => (
              <CommandItem
                key={model.value}
                value={model.value}
                onSelect={() => {
                  onSelectModel(model.value as 'claude' | 'gemini');
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    currentModel === model.value ? "opacity-100" : "opacity-0"
                  )}
                />
                <div className="flex flex-col">
                  <span>{model.label}</span>
                  <span className="text-xs text-muted-foreground">{model.description}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

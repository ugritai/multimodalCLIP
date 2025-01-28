import React, { useEffect, useState } from 'react';
import { Check, ChevronsUpDown } from "lucide-react"
 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function ComboBox({values, defaultText, outputValue} : {values:string[], defaultText:string, outputValue:React.Dispatch<React.SetStateAction<string>>}){
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState("")
    return (
        <div className="flex items-center space-x-4">
            <p className="text-sm">{defaultText}</p>
            <Popover open={open} onOpenChange={setOpen}>
                <div  className="text-foreground">
                <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {value
                    ? values.find((v: string) => v === value)
                    : `Select ${defaultText}`}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
                </PopoverTrigger>
                </div>
                <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search..." className="h-9" />
                    <CommandList>
                    <CommandEmpty>No framework found.</CommandEmpty>
                    <CommandGroup>
                        {values.map((v: string) => (
                        <CommandItem
                            key={v}
                            value={v}
                            onSelect={(currentValue) => {
                            setValue(currentValue === value ? "" : currentValue)
                            outputValue(currentValue === value ? "" : currentValue)
                            setOpen(false)
                            }}
                        >
                            {v}
                            <Check
                            className={cn(
                                "ml-auto",
                                value === v ? "opacity-100" : "opacity-0"
                            )}
                            />
                        </CommandItem>
                        ))}
                    </CommandGroup>
                    </CommandList>
                </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}
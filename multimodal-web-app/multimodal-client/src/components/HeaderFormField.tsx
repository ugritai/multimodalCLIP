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
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"

export function HeaderFormField({form, values, fieldName} : {form:any, values:string[], fieldName:string}) : JSX.Element {
    return <FormField
        control={form.control}
        name={fieldName}
        render={({ field }) => (
        <FormItem className="flex flex-col">
            <FormLabel>{fieldName}</FormLabel>
            <Popover>
            <PopoverTrigger asChild>
                <FormControl>
                <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                    "w-[200px] justify-between",
                    !field.value && "text-muted-foreground"
                    )}
                >
                    {field.value
                    ? values.find(
                        (v) => v === field.value
                        )
                    : `Select ${fieldName}`}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
                </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                <CommandInput
                    placeholder="Search..."
                    className="h-9"
                />
                <CommandList>
                    <CommandEmpty>No {fieldName} found.</CommandEmpty>
                    <CommandGroup>
                    {values.map((v) => (
                        <CommandItem
                        value={v}
                        key={v}
                        onSelect={() => {
                            form.setValue(fieldName, v)
                        }}
                        >
                        {v}
                        <Check
                            className={cn(
                            "ml-auto",
                            v === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                        />
                        </CommandItem>
                    ))}
                    </CommandGroup>
                </CommandList>
                </Command>
            </PopoverContent>
            </Popover>
            <FormMessage />
        </FormItem>
        )}
    />
}
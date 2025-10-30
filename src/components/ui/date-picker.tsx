'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils'; // if you have it in your setup

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  placeholder = 'Pick a date',
  className,
  buttonClassName,
}) => {
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(value);
  const [open, setOpen] = React.useState(false);

  const date = value ?? internalDate;

  const handleSelect = (selected?: Date) => {
    setInternalDate(selected);
    onChange?.(selected);
    setOpen(false); // ✅ Auto-close popover on select
  };

  const handleReset = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setInternalDate(undefined);
    onChange?.(undefined);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className={cn('relative w-[250px]', className)}>
          <Button
            type="button"
            variant="outline"
            mode="input"
            className={cn('w-full', buttonClassName)}
            onClick={() => setOpen(true)}
          >
            <CalendarIcon />
            {date ? format(date, 'PPP') : <span>{placeholder}</span>}
          </Button>

          {date && (
            <Button
              type="button"
              variant="dim"
              size="sm"
              className="absolute top-1/2 -end-0 -translate-y-1/2"
              onClick={handleReset}
            >
              <X />
            </Button>
          )}
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          timeZone="UTC"
          selected={date}
          onSelect={handleSelect}
          autoFocus
          captionLayout="dropdown"
          className="rounded-md border"
        />
      </PopoverContent>
    </Popover>
  );
};

'use client';

import React from 'react';
import { ToggleButtonGroup, ToggleButton, Slider, Box, Typography } from '@mui/material';
import { NotificationType } from '@/types/notification';

interface FilterButtonsProps {
  onFilterChange: (type: NotificationType | undefined) => void;
  onLimitChange?: (limit: number) => void;
}

export default function FilterButtons({ onFilterChange, onLimitChange }: FilterButtonsProps) {
  const [filter, setFilter] = React.useState<string>('all');

  const handleFilterChange = (event: React.MouseEvent<HTMLElement>, newFilter: string) => {
    if (newFilter !== null) {
      setFilter(newFilter);
      if (newFilter === 'all') {
        onFilterChange(undefined);
      } else {
        onFilterChange(newFilter as NotificationType);
      }
    }
  };

  return (
    <Box display="flex" gap={2} alignItems="center">
      <ToggleButtonGroup
        value={filter}
        exclusive
        onChange={handleFilterChange}
        size="small"
      >
        <ToggleButton value="all">All</ToggleButton>
        <ToggleButton value="Placement">Placement</ToggleButton>
        <ToggleButton value="Result">Result</ToggleButton>
        <ToggleButton value="Event">Event</ToggleButton>
      </ToggleButtonGroup>
      
      {onLimitChange && (
        <Box sx={{ width: 200 }}>
          <Typography variant="caption">Priority Limit</Typography>
          <Slider
            defaultValue={10}
            onChange={(_, v) => onLimitChange(v as number)}
            min={5}
            max={30}
            step={5}
            size="small"
          />
        </Box>
      )}
    </Box>
  );
}

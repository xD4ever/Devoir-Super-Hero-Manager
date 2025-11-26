import React from 'react';
import { TextField, Box, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';

interface SearchBarProps {
    searchTerm: string;
    onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    filterUnivers: string;
    onFilterChange: (event: SelectChangeEvent) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearchChange, filterUnivers, onFilterChange }) => {
    return (
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
            <TextField
                label="Search Heroes"
                variant="outlined"
                fullWidth
                value={searchTerm}
                onChange={onSearchChange}
            />
            <FormControl sx={{ minWidth: 120 }}>
                <InputLabel id="univers-select-label">Univers</InputLabel>
                <Select
                    labelId="univers-select-label"
                    id="univers-select"
                    value={filterUnivers}
                    label="Univers"
                    onChange={onFilterChange}
                >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Marvel">Marvel</MenuItem>
                    <MenuItem value="DC">DC</MenuItem>
                    <MenuItem value="Autre">Autre</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
};

export default SearchBar;

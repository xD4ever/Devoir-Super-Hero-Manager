import { useEffect, useRef, useState } from 'react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  delay?: number;
}

const SearchBar = ({
  onSearch,
  placeholder = 'Rechercher un héros…',
  delay = 250,
}: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const timeoutRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    },
    [],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      onSearch(value);
    }, delay);
  };

  return (
    <input
      className="search-input"
      type="search"
      placeholder={placeholder}
      value={query}
      onChange={handleChange}
    />
  );
};

export default SearchBar;

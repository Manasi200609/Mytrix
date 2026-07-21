import { useState } from "react";

export default function SearchBar({
  placeholder = "Search...",
  onSearch,
  defaultValue = "",
}) {
  const [query, setQuery] = useState(defaultValue);

  function handleChange(e) {
    const value = e.target.value;
    setQuery(value);
    if (onSearch) onSearch(value);
  }

  return (
    <div className="search-bar-wrap">
      <i className="ti ti-search search-bar-icon" aria-hidden="true"></i>

      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
      />

      {query && (
        <button
          type="button"
          className="search-bar-clear"
          onClick={() => {
            setQuery("");
            if (onSearch) onSearch("");
          }}
          aria-label="Clear search"
        >
          <i className="ti ti-x" style={{ fontSize: 14 }} aria-hidden="true"></i>
        </button>
      )}
    </div>
  );
}

/**
 * Props for the BlogFilters component.
 * 
 * @property selectedCategory - The currently selected blog category filter.
 * @property setSelectedCategory - Callback to update the selected category.
 * @property selectedDate - The currently selected date range filter.
 * @property setSelectedDate - Callback to update the selected date range.
 * @property onClearFilters - Callback to clear all applied filters.
 */

/**
 * BlogFilters is a UI component that renders filter controls for blog posts.
 * It allows users to filter blog posts by category and date range, and provides
 * an option to clear all applied filters. The component is designed to be used
 * in client-side rendered environments.
 *
 * @param selectedCategory - The currently selected category filter.
 * @param setSelectedCategory - Function to update the selected category.
 * @param selectedDate - The currently selected date range filter.
 * @param setSelectedDate - Function to update the selected date range.
 * @param onClearFilters - Function to clear all filters.
 * @returns A set of filter controls for blog posts.
 */
'use client';





interface BlogFiltersProps { //
  selectedCategory: string; // The currently selected category filter
  setSelectedCategory: (category: string) => void;   // Callback to update the selected category
  selectedDate: string; // The currently selected date range filter
  setSelectedDate: (date: string) => void;
  onClearFilters: () => void; // Callback to clear all filters
}



export default function BlogFilters({ 
  selectedCategory, 
  setSelectedCategory, 
  selectedDate, 
  setSelectedDate, 
  onClearFilters 
}: BlogFiltersProps) {
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'news', label: 'News' },
    { value: 'culture', label: 'Culture' },
    { value: 'events', label: 'Events' },
    { value: 'community', label: 'Community' },
  ];

  const dateRanges = [
    { value: 'all', label: 'All Time' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' },
  ];

  return (
    <div className="flex flex-wrap gap-4">
      {/* Category Filter */}
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/30"
      >
        {categories.map((category) => (
          <option key={category.value} value={category.value} className="bg-[#C61E1E] text-white">
            {category.label}
          </option>
        ))}
      </select>

      {/* Date Filter */}
      <select
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/30"
      >
        {dateRanges.map((range) => (
          <option key={range.value} value={range.value} className="bg-[#C61E1E] text-white">
            {range.label}
          </option>
        ))}
      </select>

      {/* Clear Filters */}
      {(selectedCategory !== 'all' || selectedDate !== 'all') && (
        <button
          onClick={onClearFilters}
          className="px-4 py-2 text-white/80 hover:text-white underline text-sm"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}

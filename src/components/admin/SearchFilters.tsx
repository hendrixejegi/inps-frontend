import { FilterConfig } from './AdvancedSearch';

interface SearchFiltersProps {
  filters: Record<string, any>;
  config: FilterConfig[];
  onChange: (field: string, value: any) => void;
  onClear?: () => void;
}

export default function SearchFilters({ filters, config, onChange, onClear }: SearchFiltersProps) {
  const hasActiveFilters = Object.values(filters).some(v => v !== undefined && v !== '' && v !== 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Filters</h3>
        {hasActiveFilters && onClear && (
          <button
            onClick={onClear}
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {config.map((config) => (
          <div key={config.field} className="space-y-2">
            <label className="text-sm font-medium">{config.label}</label>
            
            {config.type === 'text' && (
              <input
                type="text"
                placeholder={config.placeholder || `Search ${config.label.toLowerCase()}`}
                value={filters[config.field] || ''}
                onChange={(e) => onChange(config.field, e.target.value)}
                className="w-full border rounded-md px-3 py-2"
              />
            )}
            
            {config.type === 'select' && config.options && (
              <select
                value={filters[config.field] || ''}
                onChange={(e) => onChange(config.field, e.target.value)}
                className="w-full border rounded-md px-3 py-2"
              >
                <option value="">All {config.label}</option>
                {config.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            )}
            
            {config.type === 'chip' && config.options && (
              <div className="flex flex-wrap gap-2">
                {config.options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                      filters[config.field] === option.value
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-background hover:bg-muted'
                    }`}
                    onClick={() => onChange(
                      config.field,
                      filters[config.field] === option.value ? '' : option.value
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

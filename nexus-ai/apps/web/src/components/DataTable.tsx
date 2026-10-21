import { useMemo, useState, type ReactNode } from 'react';

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  sortValue?: (row: T) => string | number;
  align?: 'right';
}

/** Sortable, filterable table for dense enterprise data. */
export function DataTable<T>({
  rows,
  columns,
  rowKey,
  filterText,
  filterPlaceholder = 'Filter',
  onRowClick,
  empty = 'Nothing matches this filter.',
  toolbar,
}: {
  rows: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string;
  filterText?: (row: T) => string;
  filterPlaceholder?: string;
  onRowClick?: (row: T) => void;
  empty?: string;
  toolbar?: ReactNode;
}) {
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<{ key: string; dir: 1 | -1 } | null>(null);

  const view = useMemo(() => {
    let out = rows;
    if (q && filterText)
      out = out.filter((r) => filterText(r).toLowerCase().includes(q.toLowerCase()));
    if (sort) {
      const col = columns.find((c) => c.key === sort.key);
      if (col?.sortValue) {
        const sv = col.sortValue;
        out = [...out].sort((a, b) => (sv(a) > sv(b) ? 1 : sv(a) < sv(b) ? -1 : 0) * sort.dir);
      }
    }
    return out;
  }, [rows, q, sort, columns, filterText]);

  return (
    <div>
      {(filterText || toolbar) && (
        <div className="table-tools">
          {filterText && (
            <input
              className="input"
              type="search"
              placeholder={filterPlaceholder}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label={filterPlaceholder}
            />
          )}
          {toolbar}
        </div>
      )}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {columns.map((c) => {
                const active = sort?.key === c.key;
                return (
                  <th
                    key={c.key}
                    className={c.align === 'right' ? 'right' : ''}
                    aria-sort={active ? (sort!.dir === 1 ? 'ascending' : 'descending') : undefined}
                  >
                    {c.sortValue ? (
                      <button
                        onClick={() =>
                          setSort(
                            active
                              ? { key: c.key, dir: sort!.dir === 1 ? -1 : 1 }
                              : { key: c.key, dir: 1 },
                          )
                        }
                      >
                        {c.header}{' '}
                        <span aria-hidden="true">
                          {active ? (sort!.dir === 1 ? '↑' : '↓') : '↕'}
                        </span>
                      </button>
                    ) : (
                      c.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {view.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="muted">
                  {empty}
                </td>
              </tr>
            ) : (
              view.map((r) => (
                <tr
                  key={rowKey(r)}
                  className={onRowClick ? 'clickable' : ''}
                  onClick={() => onRowClick?.(r)}
                  onKeyDown={(e) => e.key === 'Enter' && onRowClick?.(r)}
                  tabIndex={onRowClick ? 0 : undefined}
                >
                  {columns.map((c) => (
                    <td key={c.key} className={c.align === 'right' ? 'right' : ''}>
                      {c.render(r)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

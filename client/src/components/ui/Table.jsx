/* eslint-disable react/prop-types */
import Skeleton from "./Skeleton";
import EmptyState from "./EmptyState";

const Table = ({ columns, data, isLoading = false, emptyTitle = "No records found", emptyDescription, rowKey = "_id" }) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-card shadow-soft">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="whitespace-nowrap px-5 py-3.5 font-medium text-fg-muted">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {isLoading &&
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={`skeleton-${i}`}>
                  {columns.map((col) => (
                    <td key={col.key} className="px-5 py-4">
                      <Skeleton height="1.1em" />
                    </td>
                  ))}
                </tr>
              ))}

            {!isLoading &&
              data.map((row) => (
                <tr key={row[rowKey]} className="transition-colors hover:bg-slate-50">
                  {columns.map((col) => (
                    <td key={col.key} className="whitespace-nowrap px-5 py-4 text-fg">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {!isLoading && data.length === 0 && (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      )}
    </div>
  );
};

export default Table;

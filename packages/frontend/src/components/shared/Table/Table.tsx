import React from 'react';

const Header: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <thead className="text-left">{children}</thead>
);
const Body: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <tbody className="text-left">{children}</tbody>
);
const Row: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <tr className="text-left">{children}</tr>
);
const ColumnHeaderCell: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
    {children}
  </th>
);
const RowHeaderCell: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <th
    scope="row"
    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
  >
    {children}
  </th>
);
const Cell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
    {children}
  </td>
);

const Table: React.FC<{ children: React.ReactNode }> & {
  Header: typeof Header;
  Body: typeof Body;
  Row: typeof Row;
  ColumnHeaderCell: typeof ColumnHeaderCell;
  RowHeaderCell: typeof RowHeaderCell;
  Cell: typeof Cell;
} = ({ children }) => <table className="min-w-full">{children}</table>;

Table.Header = Header;
Table.Body = Body;
Table.Row = Row;
Table.ColumnHeaderCell = ColumnHeaderCell;
Table.RowHeaderCell = RowHeaderCell;
Table.Cell = Cell;

export { Table };

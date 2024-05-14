import React from 'react';
import { tableTheme } from './Table.theme';

type TableComponentProps = {
  children: React.ReactNode;
  variant?: keyof typeof tableTheme;
};

const useTheme = (variant: 'primary' | 'secondary' = 'primary') =>
  tableTheme[variant];

const Table: React.FC<TableComponentProps> & {
  Header: typeof Header;
  Body: typeof Body;
  Row: typeof Row;
  ColumnHeaderCell: typeof ColumnHeaderCell;
  RowHeaderCell: typeof RowHeaderCell;
  Cell: typeof Cell;
} = ({ children, variant = 'primary' }) => {
  const theme = useTheme(variant);
  return <table className={theme.base}>{children}</table>;
};

const Header: React.FC<TableComponentProps> = ({ children, variant }) => {
  const theme = useTheme(variant);
  return <thead className={theme.header}>{children}</thead>;
};

const Body: React.FC<TableComponentProps> = ({ children }) => {
  return <tbody>{children}</tbody>;
};

const Row: React.FC<TableComponentProps> = ({ children, variant }) => {
  const theme = useTheme(variant);
  return <tr className={theme.row}>{children}</tr>;
};

const ColumnHeaderCell: React.FC<TableComponentProps> = ({
  children,
  variant,
}) => {
  const theme = useTheme(variant);
  return <th className={theme.columnHeaderCell}>{children}</th>;
};

const RowHeaderCell: React.FC<TableComponentProps> = ({
  children,
  variant,
}) => {
  const theme = useTheme(variant);
  return <th className={theme.rowHeaderCell}>{children}</th>;
};

const Cell: React.FC<TableComponentProps> = ({ children, variant }) => {
  const theme = useTheme(variant);
  return <td className={theme.cell}>{children}</td>;
};

Table.Header = Header;
Table.Body = Body;
Table.Row = Row;
Table.ColumnHeaderCell = ColumnHeaderCell;
Table.RowHeaderCell = RowHeaderCell;
Table.Cell = Cell;

export { Table };

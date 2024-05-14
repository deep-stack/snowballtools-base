import React from 'react';
import { tableTheme } from './Table.theme';

type TableComponentProps = {
  children: React.ReactNode;
};

const Table: React.FC<TableComponentProps> & {
  Header: typeof Header;
  Body: typeof Body;
  Row: typeof Row;
  ColumnHeaderCell: typeof ColumnHeaderCell;
  RowHeaderCell: typeof RowHeaderCell;
  Cell: typeof Cell;
} = ({ children }) => {
  const theme = tableTheme();
  return <table className={theme.root()}>{children}</table>;
};

const Header: React.FC<TableComponentProps> = ({ children }) => {
  const theme = tableTheme();
  return <thead className={theme.header()}>{children}</thead>;
};

const Body: React.FC<TableComponentProps> = ({ children }) => {
  const theme = tableTheme();
  return <tbody className={theme.body()}>{children}</tbody>;
};

const Row: React.FC<TableComponentProps> = ({ children }) => {
  const theme = tableTheme();
  return <tr className={theme.row()}>{children}</tr>;
};

const ColumnHeaderCell: React.FC<TableComponentProps> = ({ children }) => {
  const theme = tableTheme();
  return <th className={theme.columnHeaderCell()}>{children}</th>;
};

const RowHeaderCell: React.FC<TableComponentProps> = ({ children }) => {
  const theme = tableTheme();
  return <th className={theme.rowHeaderCell()}>{children}</th>;
};

const Cell: React.FC<TableComponentProps> = ({ children }) => {
  const theme = tableTheme();
  return <td className={theme.cell()}>{children}</td>;
};

Table.Header = Header;
Table.Body = Body;
Table.Row = Row;
Table.ColumnHeaderCell = ColumnHeaderCell;
Table.RowHeaderCell = RowHeaderCell;
Table.Cell = Cell;

export { Table };

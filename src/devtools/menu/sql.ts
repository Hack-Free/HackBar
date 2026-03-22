import type { MenuSection } from './types'

export const sqlMenu: MenuSection[] = [
  {
    title: 'CHAR & conversion',
    items: [
      { kind: 'action', id: 'sql_mysql_char', label: 'MySQL CHAR()' },
      { kind: 'action', id: 'sql_mssql_char', label: 'MSSQL CHAR()' },
      { kind: 'action', id: 'sql_oracle_char', label: 'Oracle CHAR()' },
      { kind: 'action', id: 'sql_postgres_char', label: 'PostgreSQL CHAR()' },
      { kind: 'action', id: 'sql_sqlite_char', label: 'SQLite CHAR()' },
      { kind: 'action', id: 'sql_convert_utf8', label: 'Convert UTF-8' },
      { kind: 'action', id: 'sql_convert_latin1', label: 'Convert Latin-1' },
    ],
  },
  {
    title: 'Union',
    items: [
      {
        kind: 'action',
        id: 'sql_union_statement',
        label: 'Union Select Statement',
      },
      { kind: 'action', id: 'sql_union_all_select', label: 'Union All Select' },
      {
        kind: 'action',
        id: 'sql_union_all_select_null',
        label: 'Union All Select NULL',
      },
    ],
  },
  {
    title: 'Others',
    items: [
      {
        kind: 'action',
        id: 'sql_basic_info_column',
        label: 'Basic info column',
      },
      {
        kind: 'action',
        id: 'sql_spaces_to_inline_comments',
        label: 'Spaces to inline comments',
      },
    ],
  },
]

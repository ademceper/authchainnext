export interface DataTableProps {
  payload: unknown[];
  pagination: PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
  searchName: string;
  setSearchName: React.Dispatch<React.SetStateAction<string>>;
  isActive?: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  select: string;
  setSelect: React.Dispatch<React.SetStateAction<string>>;
  placeholder: string;
}

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

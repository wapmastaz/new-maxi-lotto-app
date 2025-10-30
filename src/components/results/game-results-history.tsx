import { useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTable } from '@/components/ui/card';
import { DataGrid } from '@/components/ui/data-grid';
import {
  DataGridTable,
} from '@/components/ui/data-grid-table';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table';

import { columns } from './column';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { DatePicker } from '@/components/ui/date-picker';
import { fetchGameResults } from '@/services/GameService';
import { useFetchDailyGames } from '@/hooks/useGames';


interface PageProps {
  pageIndex: number;
  pageSize: number;
  startDate?: string;
  endDate?: string;
  gameId?: number
}


export const GameResultHistory = () => {

  const [pagination, setPagination] = useState<PageProps>({
    pageIndex: 0,
    pageSize: 10,
    startDate: '',
    endDate: '',
    gameId: 0
  });

  const { data: results, isFetching } = useQuery({
    queryKey: ['games_results', pagination],
    queryFn: () => fetchGameResults(pagination),
    placeholderData: keepPreviousData,
  })

  const { data: games } = useFetchDailyGames()

  const gameOptions = useMemo(() => games?.map((game) => ({ value: game.gameID, label: game.gameName })) || [], [games]);

  const defaultData = useMemo(() => [], [])

  const [sorting, setSorting] = useState<SortingState>([{ id: 'name', desc: true }]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [columnOrder, setColumnOrder] = useState<string[]>(columns.map((column) => column.id as string));

  const table = useReactTable({
    columns,
    data: results?.data ?? defaultData,
    rowCount: results?.totalCount,
    state: {
      pagination,
      sorting,
      // columnOrder,
    },
    columnResizeMode: 'onChange',
    onColumnOrderChange: setColumnOrder,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    debugTable: true,

  });

  return (
    <DataGrid
      table={table}
      recordCount={results?.totalCount || 0}
      tableLayout={{
        columnsPinnable: true,
        columnsResizable: true,
        columnsMovable: true,
        columnsVisibility: true,
        cellBorder: false,
        stripped: true,
        headerBorder: false,
      }}
      isLoading={isFetching}
      loadingMode="skeleton"
      loadingMessage="Loading Results..."
      emptyMessage="No Results Found."
    >
      <Card className="border-none shadow-none">
        <CardHeader className="flex flex-row border-b-0 flex-wrap gap-4 px-0 pb-4">
          <Select
            value={String(pagination.gameId ?? 0)}
            onValueChange={(gameId) =>
              setPagination((prev) => ({ ...prev, gameId: Number(gameId) }))
            }
          >
            <SelectTrigger className="w-full h-11">
              <SelectValue placeholder="Select Game" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="0">All Games</SelectItem>
              {gameOptions.map((game) => (
                <SelectItem key={game.value} value={String(game.value)}>
                  {game.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* start date */}
          <DatePicker
            value={pagination.startDate ? new Date(pagination.startDate) : undefined}
            onChange={(date) => setPagination((prev) => ({ ...prev, startDate: date?.toISOString() }))}
            placeholder="Select start date"
            className="w-full"
          />

          {/* end date */}
          <DatePicker
            value={pagination.endDate ? new Date(pagination.endDate) : undefined}
            onChange={(date) => setPagination((prev) => ({ ...prev, endDate: date?.toISOString() }))}
            placeholder="Select end date"
            className="w-full"
          />

        </CardHeader>
        <CardTable>
          <ScrollArea>
            <DataGridTable />
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardTable>
        <CardFooter className="p-0 flex items-center justify-between gap-2">


          <Pagination className="justify-start w-fit mx-0">
            <PaginationContent className='gap-2'>
              {/* Previous Button */}
              <PaginationItem>
                <Button
                  variant="outline"
                  className="text-muted-foreground"
                  shape="circle"
                  mode="icon"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <ChevronLeft className="rtl:rotate-180" />
                </Button>
              </PaginationItem>

              {/* Numbered Page Buttons */}
              {Array.from({ length: table.getPageCount() }, (_, i) => i).map((pageIndex) => (
                <PaginationItem key={pageIndex}>
                  <Button
                    shape={"circle"}
                    variant={table.getState().pagination.pageIndex === pageIndex ? 'primary' : 'outline'}
                    className={`${table.getState().pagination.pageIndex === pageIndex
                      ? 'bg-primary-900 text-background'
                      : 'border-border text-muted-foreground hover:bg-muted'
                      }`}
                    mode={"icon"}
                    onClick={() => table.setPageIndex(pageIndex)}
                  >
                    {pageIndex + 1}
                  </Button>
                </PaginationItem>
              ))}

              {/* Next Button */}
              <PaginationItem>
                <Button
                  variant="outline"
                  className="text-muted-background"
                  shape="circle"
                  mode="icon"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <ChevronRight className="rtl:rotate-180" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          <span className="flex items-center text-muted-foreground text-sm gap-1">
            <div>Page</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount().toLocaleString()}
            </strong>
          </span>

          <Select indicatorPosition="right" defaultValue={String(pagination.pageSize)} onValueChange={(e) => setPagination((prev) => ({ ...prev, pageSize: Number(e) }))}>
            <SelectTrigger className="w-fit" size={"sm"}>
              <SelectValue placeholder="Show" />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 40, 50].map((item) => (
                <SelectItem key={item} value={String(item)}>
                  Show {item}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardFooter>
      </Card>
    </DataGrid>
  );
}

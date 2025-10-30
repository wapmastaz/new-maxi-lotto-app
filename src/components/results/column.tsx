import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";
import { Skeleton } from "@/components/ui/skeleton";
import { fullDateFormat, getImageUrl } from "@/lib/utils";
import type { GameResultType } from "@/types/game";
import type { ColumnDef } from "@tanstack/react-table";
import { Image } from "@unpic/react";
import Ball from "../ball";
import { Badge } from "../ui/base-badge";

export const columns: ColumnDef<GameResultType>[] = [
  {
    accessorKey: "gameName",
    id: "gameName",
    header: ({ column }) => (
      <DataGridColumnHeader title="Game" visibility={true} column={column} />
    ),
    cell: ({ row }) => (
      <div className="font-medium flex gap-2 items-center">
        <Image src={getImageUrl(row.original.gameBackgroundImageUrl)} alt={row.original.gameName} width={30} height={30} />
        <span className="uppercase text-xs"> {row.original.gameName}</span>
      </div>),
    enableSorting: true,
    enableResizing: true,
    meta: { skeleton: <Skeleton className="w-28 h-7" /> },
  },

  {
    accessorKey: "winningNumbers",
    id: "winningNumbers",
    header: ({ column }) => (
      <DataGridColumnHeader title="Winning Numbers" visibility={true} column={column} />
    ),
    cell: ({ row }) => {
      const { result } = row.original;
      const winningBalls = [
        result.winningBall1,
        result.winningBall2,
        result.winningBall3,
        result.winningBall4,
        result.winningBall5,
      ];
      return (
        <div className="flex gap-2">
          {winningBalls.map((num) => (
            <Ball
              key={num}
              value={num}
              onClick={() => console}
              className="bg-gradient-to-b from-[#01B1A8] to-[#0185B6] rounded-full h-9 w-9"
            />
          ))}
        </div>
      );
    },
    enableSorting: false,
    meta: { skeleton: <Skeleton className="w-40 h-7" /> },
  },

  {
    accessorKey: "machineNumbers",
    id: "machineNumbers",
    header: ({ column }) => (
      <DataGridColumnHeader title="Machine Numbers" visibility={true} column={column} />
    ),
    cell: ({ row }) => {
      const { result } = row.original;
      const machineBalls = [
        result.machineBall1,
        result.machineBall2,
        result.machineBall3,
        result.machineBall4,
        result.machineBall5,
      ];
      return (
        <div className="flex gap-2">
          {machineBalls.map((num) => (
            <Ball
              key={num}
              value={num}
              onClick={() => console}
              isSelected
              className="rounded-full h-9 w-9"
            />
          ))}
        </div>
      );
    },
    enableSorting: false,
    meta: { skeleton: <Skeleton className="w-40 h-7" /> },
  },

  {
    accessorKey: "drawDate",
    id: "drawDate",
    header: ({ column }) => (
      <DataGridColumnHeader title="Draw Date" visibility={true} column={column} />
    ),
    cell: ({ row }) => (
      <div>{fullDateFormat(row.original.endDateTime)}</div>
    ),
    enableSorting: true,
    enableResizing: true,
    meta: { skeleton: <Skeleton className="w-28 h-7" /> },
  },

  {
    accessorKey: "status",
    id: "status",
    header: ({ column }) => (
      <DataGridColumnHeader title="Status" visibility={true} column={column} />
    ),
    cell: ({ row }) => {
      const status = row.original.isValidated
        ? { text: "Validated", variant: "success" }
        : { text: "Pending", variant: "secondary" };
      return (
        <Badge variant={"success"} appearance="outline">
          {status.text}
        </Badge>
      );
    },
    size: 100,
    enableSorting: true,
    meta: { skeleton: <Skeleton className="w-24 h-7" /> },
  },
];

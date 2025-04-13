"use client";

import React, { useState, useMemo } from 'react';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    useReactTable,
    SortingState,
    getSortedRowModel,
    ColumnFiltersState,
    PaginationState,
} from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getQuery } from "@/app/api/query/api.js";


const IconChevronDoubleLeft = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
    </svg>
);
const IconChevronLeft = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
);
const IconChevronRight = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
);
const IconChevronDoubleRight = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
    </svg>
);
const IconPencil = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
    </svg>
);

interface Post {
    boardId: number;
    title: string;
    managerId: string;
    createdAt: string;
    isNotice?: boolean;
}


const fetchBoardPosts = async (): Promise<Post[]> => {

    const rawPosts: any[] = await getQuery("/api/board");

    const formattedPosts = rawPosts.map(post => {
        const dateObject = new Date(post.createdAt);

        let formattedDate = '날짜 정보 없음';
        if (!isNaN(dateObject.getTime())) {
            formattedDate = dateObject.toLocaleDateString('ko-KR', {
                year: 'numeric', month: '2-digit', day: '2-digit'
            }).replace(/\./g, '-').replace(/ /g, '').slice(0, -1);

        } else {
            console.warn(`Invalid date format for post ID ${post.id}:`, post.createdAt);
        }

        return {
            ...post,
            createdAt: formattedDate,
            boardId: post.boardId,
            title: post.title,
            managerId: post.managerId && 'admin',
            isNotice: post.isNotice,
        };
    });
    debugger;
    return formattedPosts as Post[];
};


export default function BoardListTailwind() {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

    const router = useRouter();

    const {
        data: allPostsData,
        isLoading,
        error,

    } = useQuery<Post[], Error>({
        queryKey: ['posts'],
        queryFn: fetchBoardPosts,
    });

    const { pinnedPosts, regularPosts } = useMemo(() => {
        debugger;
        const posts = allPostsData ?? [];
        const pinned = posts.filter(post => post.isNotice);
        const regular = posts.filter(post => !post.isNotice);
        return { pinnedPosts: pinned, regularPosts: regular };
    }, [allPostsData]);


    const titleFilter = columnFilters.find(f => f.id === 'title')?.value as string || '';
    const setTitleFilter = (value: string) => {
        setColumnFilters(prev => {
            const titleFilterExists = prev.find(f => f.id === 'title');
            if (value) {
                if (titleFilterExists) { return prev.map(f => f.id === 'title' ? { ...f, value } : f); }
                else { return [...prev, { id: 'title', value }]; }
            } else { return prev.filter(f => f.id !== 'title'); }
        });
        setPagination(prev => ({ ...prev, pageIndex: 0 }));
    };

    const columns = useMemo<ColumnDef<Post>[]>(() => [
        {
            id: 'rowNumber',
            header: '번호',
            size: 80,
            cell: ({ row, table }) => {
                const pageIndex = table.getState().pagination.pageIndex;
                const pageSize = table.getState().pagination.pageSize;
                return pageIndex * pageSize + row.index + 1;
            },
            enableSorting: false,
        },
        {
            accessorKey: 'title',
            header: '제목',
            size: 450,
            enableSorting: true,
            cell: info => <div className="text-left truncate">{info.getValue<string>()}</div>
        },
        { accessorKey: 'managerId', header: '작성자', size: 120, enableSorting: true },
        { accessorKey: 'createdAt', header: '작성일', size: 150, enableSorting: true },
    ], []);

    const table = useReactTable({
        data: regularPosts,
        columns,
        state: { sorting, columnFilters, pagination },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    const handleRowClick = (post: Post) => {
        router.push(`/company/board/${post.boardId}`);
    };

    if (isLoading) {
        return <div className="p-10 text-center">데이터를 불러오는 중입니다...</div>;
    }

    if (error) {
        return <div className="p-10 text-center text-red-600">오류: {error.message}</div>;
    }

    const paginationButtonClasses = "p-2 border border-gray-300 bg-white text-gray-500 rounded-md cursor-pointer transition-colors duration-200 ease-in-out hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50";
    const shouldShowPinned = pinnedPosts.length > 0;
    const hasRegularRows = table.getRowModel().rows.length > 0;
    const showNoDataMessage = !isLoading && !shouldShowPinned && !hasRegularRows;


    return (
        <div className="pr-22 pl-22 p-10 bg-[#FFFBF5] text-[#333333] font-sans flex flex-col min-h-screen">

            <div className="mb-5 flex justify-between">
                <Link href="/company/board/create">
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out">
                        <IconPencil className="w-4 h-4" />
                        글쓰기
                    </button>
                </Link>
                <input
                    type="text"
                    value={titleFilter}
                    onChange={e => setTitleFilter(e.target.value)}
                    placeholder="제목으로 검색..."
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm min-w-[300px] shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition duration-150"
                />
            </div>

            <div className="flex-grow bg-white rounded-lg overflow-hidden shadow-lg">
                <table className="w-full table-auto border-collapse">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-sm font-semibold">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id}
                                        className="px-6 py-3 text-center tracking-wider cursor-pointer select-none transition-colors duration-200 ease hover:bg-gray-200"
                                        style={{ width: header.getSize() ? `${header.getSize()}px` : 'auto' }}
                                        onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                                    >
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                        {header.column.getCanSort() && { asc: ' ▲', desc: ' ▼' }[header.column.getIsSorted() as string] ? (
                                            { asc: ' ▲', desc: ' ▼' }[header.column.getIsSorted() as string]
                                        ) : null}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {shouldShowPinned && (
                            pinnedPosts.map(post => (
                                <tr key={`pinned-${post.boardId}`}
                                    className="bg-sky-50 hover:bg-sky-100 transition-colors duration-150 cursor-pointer"
                                    onClick={() => handleRowClick(post)}
                                >
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">공지</span>
                                    </td>
                                    <td className="px-6 py-4 text-left font-semibold text-sky-800 truncate">{post.title}</td>
                                    <td className="px-6 py-4 text-center text-sm text-gray-700">{(post.managerId ? 'admin' : '')}</td>
                                    <td className="px-6 py-4 text-center text-sm text-gray-700">{post.createdAt}</td>
                                </tr>
                            ))
                        )}

                        {hasRegularRows && (
                            table.getRowModel().rows.map(row => (
                                <tr key={row.id}
                                    className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                                    onClick={() => handleRowClick(row.original as Post)}
                                >
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id} className="px-6 py-4 text-center text-sm text-gray-800" style={{ width: cell.column.getSize() ? `${cell.column.getSize()}px` : 'auto' }}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}

                        {showNoDataMessage && (
                            <tr>
                                <td colSpan={columns.length} className="py-12 text-center text-gray-500 text-base">
                                    {titleFilter ? "검색 결과가 없습니다." : "게시글이 없습니다."}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {table.getPageCount() > 0 && (
                <div className="py-6 flex justify-center items-center gap-3">
                    <button
                        className={paginationButtonClasses}
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                        aria-label="첫 페이지로 이동"
                    >
                        <IconChevronDoubleLeft className="w-5 h-5" />
                    </button>
                    <button
                        className={paginationButtonClasses}
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        aria-label="이전 페이지로 이동"
                    >
                        <IconChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-medium text-gray-700">
                        페이지 {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
                    </span>
                    <button
                        className={paginationButtonClasses}
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        aria-label="다음 페이지로 이동"
                    >
                        <IconChevronRight className="w-5 h-5" />
                    </button>
                    <button
                        className={paginationButtonClasses}
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                        aria-label="마지막 페이지로 이동"
                    >
                        <IconChevronDoubleRight className="w-5 h-5" />
                    </button>

                    <select
                        value={table.getState().pagination.pageSize}
                        onChange={e => { table.setPageSize(Number(e.target.value)) }}
                        className="ml-4 pl-3 pr-8 py-2 border border-gray-300 rounded-md text-sm cursor-pointer bg-white shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition duration-150"
                    >
                        {[10, 20, 30, 50].map(pageSize => (<option key={pageSize} value={pageSize}>{pageSize}개씩 보기</option>))}
                    </select>
                </div>
            )}
        </div>
    );
}
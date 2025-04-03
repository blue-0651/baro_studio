"use client";

import React, { useState, useEffect, useMemo } from 'react';
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
    Row
} from '@tanstack/react-table';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
    id: number;
    title: string;
    author: string;
    createdAt: string;
    views: number;
    pinned?: boolean;
}

const initialData: Post[] = [
    // 고정 게시물
    { id: 999, title: "서비스 이용 약관 변경 안내", author: "관리자", createdAt: "2025-01-11", views: 1280, pinned: true },
    { id: 998, title: "개인정보 처리방침 개정", author: "관리자", createdAt: "2024-08-14", views: 950, pinned: true },
    { id: 997, title: "가을맞이 이벤트", author: "관리자", createdAt: "2024-08-10", views: 2100, pinned: true },
    // 일반 게시물
    { id: 20, title: "테스트 게시글 16", author: "익명", createdAt: "2024-08-20", views: 210 },
    { id: 19, title: "테스트 게시글 15", author: "익명", createdAt: "2024-08-19", views: 350 },
    { id: 18, title: "테스트 게시글 14", author: "익명", createdAt: "2024-08-19", views: 180 },
    { id: 17, title: "테스트 게시글 13", author: "익명", createdAt: "2024-08-18", views: 95 },
    { id: 16, title: "테스트 게시글 12", author: "익명", createdAt: "2024-08-17", views: 420 },
    { id: 15, title: "테스트 게시글 11", author: "익명", createdAt: "2024-08-16", views: 110 },
    { id: 14, title: "테스트 게시글 10", author: "익명", createdAt: "2024-08-16", views: 250 },
    { id: 13, title: "테스트 게시글 9", author: "익명", createdAt: "2024-08-15", views: 580 },
    { id: 12, title: "테스트 게시글 8", author: "익명", createdAt: "2024-08-14", views: 310 },
    { id: 11, title: "테스트 게시글 7", author: "익명", createdAt: "2024-08-13", views: 150 },
    { id: 10, title: "테스트 게시글 6", author: "익명", createdAt: "2024-08-13", views: 150 },
    { id: 9, title: "테스트 게시글 5", author: "익명", createdAt: "2024-08-13", views: 150 },
    { id: 8, title: "테스트 게시글 4", author: "익명", createdAt: "2024-08-13", views: 150 },
    { id: 7, title: "테스트 게시글 3", author: "익명", createdAt: "2024-08-13", views: 150 },
    { id: 6, title: "테스트 게시글 2", author: "익명", createdAt: "2024-08-13", views: 150 },
    { id: 5, title: "테스트 게시글 1", author: "익명", createdAt: "2024-08-13", views: 150 },
];

export default function BoardListTailwind() {
    const [allPosts] = useState<Post[]>(() => [...initialData]);
    const [pinnedPosts, setPinnedPosts] = useState<Post[]>([]);
    const [tableData, setTableData] = useState<Post[]>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

    useEffect(() => {
        setPinnedPosts(allPosts.filter(post => post.pinned));
        setTableData(allPosts.filter(post => !post.pinned));
    }, [allPosts]);

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
            accessorKey: 'id',
            header: '번호',
            size: 80,
            enableSorting: true,
        },
        {
            accessorKey: 'title',
            header: '제목',
            size: 450,
            enableSorting: true,
            cell: info => <div className="text-left truncate">{info.getValue<string>()}</div> // 제목 좌측 정렬 및 넘침 방지
        },
        { accessorKey: 'author', header: '작성자', size: 120, enableSorting: true },
        { accessorKey: 'createdAt', header: '작성일', size: 150, enableSorting: true },
        { accessorKey: 'views', header: '조회수', size: 100, enableSorting: true },
    ], []);

    const table = useReactTable({
        data: tableData,
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

    const paginationButtonClasses = "p-2 border border-gray-300 bg-white text-gray-500 rounded-md cursor-pointer transition-colors duration-200 ease-in-out hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50";

    const shouldShowPinned = pinnedPosts.length > 0;
    const hasRegularRows = table.getRowModel().rows.length > 0;
    const showNoDataMessage = !hasRegularRows;
    const router = useRouter();
    const handleRowClick = (row: Post) => {
        router.push(`/board/${row.id}`);
    };
    return (
        <div className="pt-35 pr-22 pl-22 p-10 bg-[#EFEFEF] text-[#333333] font-sans flex flex-col min-h-screen">

            {/* 검색 영역 */}
            <div className="mb-5 flex justify-between">
                <Link href="/write">
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
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                        {{ asc: ' ▲', desc: ' ▼' }[header.column.getIsSorted() as string] ?? null}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {shouldShowPinned && (
                            pinnedPosts.map(post => (
                                <tr key={`pinned-${post.id}`}
                                    className="bg-sky-50 hover:bg-sky-100 transition-colors duration-150 cursor-pointer"
                                    onClick={() => handleRowClick(post)}
                                >
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-block bg-blue-100 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">공지</span>
                                    </td>
                                    <td className="px-6 py-4 text-left font-semibold text-sky-800 truncate">{post.title}</td>
                                    <td className="px-6 py-4 text-center text-sm text-gray-700">{post.author}</td>
                                    <td className="px-6 py-4 text-center text-sm text-gray-700">{post.createdAt}</td>
                                    <td className="px-6 py-4 text-center text-sm text-gray-700">{post.views}</td>
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
                                        <td key={cell.id} className="px-6 py-4 text-center text-sm text-gray-800">
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
        </div>
    );
}
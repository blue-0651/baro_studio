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
    Row // Removed Row type import as we use row.original directly
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
const IconBriefcase = (props: React.SVGProps<SVGSVGElement>) => ( // Changed icon for "Post Job"
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.075c0 1.313-.964 2.475-2.25 2.754-1.286.279-2.606.421-3.975.421s-2.69-.142-3.975-.421C8.714 20.7 7.75 19.538 7.75 18.225v-4.075m12.5 0a48.5 48.5 0 00-3.56-1.138c-.962-.219-1.97-.341-3.006-.341s-2.044.122-3.006.341A48.501 48.501 0 007.75 14.15M20.25 14.15V9.75a3.75 3.75 0 00-3.75-3.75H15V4.563A2.063 2.063 0 0012.937 2.5H11.063a2.063 2.063 0 00-2.062 2.063V6H7.5A3.75 3.75 0 003.75 9.75v4.4M15 6V4.563A2.063 2.063 0 0012.937 2.5H11.063a2.063 2.063 0 00-2.062 2.063V6M15 6H9" />
    </svg>
);


interface JobPosting {
    id: number;
    position: string;
    experience: string;
    location: string;
    employmentType: string;
    deadline: string;
}
const initialJobData: JobPosting[] = [
    { id: 1, position: "하드웨어 개발자", experience: "3년 이상", location: "서울 강남구", employmentType: "정규직", deadline: "2024-09-30" },
    { id: 2, position: "전기 기술자", experience: "5년 이상", location: "서울 강남구", employmentType: "정규직", deadline: "2024-10-15" },
    { id: 3, position: "선반 가공", experience: "신입", location: "경기 성남시 분당구", employmentType: "인턴", deadline: "2024-09-20" },
    { id: 4, position: "3D CAD 기술자", experience: "2년 이상", location: "서울 강남구 (재택 가능)", employmentType: "정규직", deadline: "상시채용" },
    { id: 5, position: "PM", experience: "5년 이상", location: "경기 성남시 분당구", employmentType: "정규직", deadline: "2024-10-31" },
    { id: 6, position: "PL", experience: "경력 무관", location: "서울 강남구", employmentType: "계약직", deadline: "2024-09-25" },
    { id: 10, position: "마케터", experience: "신입", location: "서울 강남구", employmentType: "인턴", deadline: "2024-09-18" },
    { id: 11, position: "기술 영업 담당자", experience: "3년 이상", location: "서울 전체", employmentType: "정규직", deadline: "상시채용" },
];

export default function JobPostingListTailwind() {
    const [allJobPostings] = useState<JobPosting[]>(() => [...initialJobData]);
    const [tableData, setTableData] = useState<JobPosting[]>([]);
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });

    useEffect(() => {
        setTableData(allJobPostings);
    }, [allJobPostings]);

    const positionFilter = columnFilters.find(f => f.id === 'position')?.value as string || '';
    const setPositionFilter = (value: string) => {
        setColumnFilters(prev => {
            const positionFilterExists = prev.find(f => f.id === 'position');
            if (value) {
                if (positionFilterExists) { return prev.map(f => f.id === 'position' ? { ...f, value } : f); }
                else { return [...prev, { id: 'position', value }]; }
            } else { return prev.filter(f => f.id !== 'position'); }
        });
        setPagination(prev => ({ ...prev, pageIndex: 0 }));
    };

    const columns = useMemo<ColumnDef<JobPosting>[]>(() => [
        {
            accessorKey: 'id',
            header: '번호',
            size: 80,
            enableSorting: false,
        },
        {
            accessorKey: 'position',
            header: '직무',
            size: 250,
            enableSorting: true,
            cell: info => <div className="text-left truncate font-medium text-blue-700">{info.getValue<string>()}</div>
        },
        {
            accessorKey: 'experience',
            header: '경력',
            size: 120,
            enableSorting: true,
        },
        {
            accessorKey: 'location',
            header: '근무지역',
            size: 200,
            enableSorting: true,
            cell: info => <div className="text-left truncate">{info.getValue<string>()}</div>
        },
        {
            accessorKey: 'employmentType',
            header: '고용형태',
            size: 120,
            enableSorting: true,
        },
        {
            accessorKey: 'deadline',
            header: '마감일',
            size: 120,
            enableSorting: true,
            cell: info => {
                const value = info.getValue<string>();
                const isAlwaysRecruiting = value === '상시채용';
                return (
                    <span className={isAlwaysRecruiting ? 'font-semibold text-green-600' : ''}>
                        {value}
                    </span>
                );
            }
        },
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

    const hasRows = table.getRowModel().rows.length > 0;
    const showNoDataMessage = !hasRows;
    const router = useRouter();

    const handleRowClick = (job: JobPosting) => {
        router.push(`/jobs/${job.id}`);
    };

    return (
        <div className="pt-35 pr-22 pl-22 p-10 bg-[#EFEFEF] text-[#333333] font-sans flex flex-col min-h-screen">

            <div className="flex items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-800">채용 공고</h2>
            </div>

            <div className="mb-5 flex justify-between items-center">
                <Link href="/jobs/new">
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out">
                        <IconBriefcase className="w-4 h-4" />
                        공고 등록
                    </button>
                </Link>
                <input
                    type="text"
                    value={positionFilter}
                    onChange={e => setPositionFilter(e.target.value)}
                    placeholder="직무로 검색..."
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm min-w-[300px] shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition duration-150"
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
                        {hasRows && (
                            table.getRowModel().rows.map(row => (
                                <tr key={row.id}
                                    className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                                    onClick={() => handleRowClick(row.original as JobPosting)}
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
                                    {positionFilter ? "검색 결과가 없습니다." : "등록된 채용 공고가 없습니다."}
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
                    className="ml-4 pl-3 pr-8 py-2 border border-gray-300 rounded-md text-sm cursor-pointer bg-white shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition duration-150"
                >
                    {[10, 20, 30, 50].map(pageSize => (<option key={pageSize} value={pageSize}>{pageSize}개씩 보기</option>))}
                </select>
            </div>
        </div>
    );
}
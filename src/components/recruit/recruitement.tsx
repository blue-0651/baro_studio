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
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getQuery } from "@/app/api/query/api.js";
import { useSession } from "next-auth/react";

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
const IconBriefcase = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.075c0 1.313-.964 2.475-2.25 2.754-1.286.279-2.606.421-3.975.421s-2.69-.142-3.975-.421C8.714 20.7 7.75 19.538 7.75 18.225v-4.075m12.5 0a48.5 48.5 0 00-3.56-1.138c-.962-.219-1.97-.341-3.006-.341s-2.044.122-3.006.341A48.501 48.501 0 007.75 14.15M20.25 14.15V9.75a3.75 3.75 0 00-3.75-3.75H15V4.563A2.063 2.063 0 0012.937 2.5H11.063a2.063 2.063 0 00-2.062 2.063V6H7.5A3.75 3.75 0 003.75 9.75v4.4M15 6V4.563A2.063 2.063 0 0012.937 2.5H11.063a2.063 2.063 0 00-2.062 2.063V6M15 6H9" />
    </svg>
);

interface JobPosting {
    no: number;
    id: number;
    title: string;
    experience: string;
    location: string;
    employmentType: string;
    deadline: string | null;
    isAlwaysRecruiting: boolean;
    createdAt: string;
    content?: string | null;
}

// API로부터 채용 공고 데이터를 가져오는 함수
const fetchJobPostings = async (): Promise<JobPosting[]> => {
    const rawJobPostings = await getQuery("/api/recruite");

    // API 응답으로부터 필요한 데이터 형식으로 변환
    return rawJobPostings.map((job: any) => ({
        no: job.no,
        id: job.id,
        title: job.title,
        experience: job.experience,
        location: job.location,
        employmentType: job.employmentType,
        deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : null,
        isAlwaysRecruiting: job.isAlwaysRecruiting,
        createdAt: new Date(job.createdAt).toISOString().split('T')[0],
        content: job.content
    }));
};

export default function JobPostingListTailwind() {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 });
    const { data: session } = useSession();

    const router = useRouter();

    const {
        data: jobPostingsData,
        isLoading,
        error,
    } = useQuery<JobPosting[], Error>({
        queryKey: ['jobPostings'],
        queryFn: fetchJobPostings,
    });

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

    const columns = useMemo<ColumnDef<JobPosting>[]>(() => [
        {
            accessorKey: 'no',
            header: 'No',
            size: 20,
            enableSorting: false,
        },
        {
            accessorKey: 'title',
            header: 'Job',
            size: 280,
            enableSorting: true,
            cell: info => <div className="text-left truncate font-medium text-blue-700">{info.getValue<string>()}</div>
        },
        {
            accessorKey: 'experience',
            header: 'Career',
            size: 120,
            enableSorting: true,
        },
        {
            accessorKey: 'location',
            header: 'Job Location',
            size: 200,
            enableSorting: true,
            cell: info => <div className="text-left truncate">{info.getValue<string>()}</div>
        },
        {
            accessorKey: 'employmentType',
            header: 'Employment Type',
            size: 120,
            enableSorting: true,
        },
        {
            accessorKey: 'deadline',
            header: 'Deadline',
            size: 120,
            enableSorting: true,
            cell: info => {
                const job = info.row.original;
                const displayValue = job.isAlwaysRecruiting ? 'Rolling Recruitment' : (job.deadline || 'Undecided');

                return (
                    <span className={job.isAlwaysRecruiting ? 'font-semibold text-green-600' : ''}>
                        {displayValue}
                    </span>
                );
            }
        },
    ], []);

    const table = useReactTable({
        data: jobPostingsData || [],
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
    const showNoDataMessage = !isLoading && !hasRows;
    debugger;
    const handleRowClick = (job: JobPosting) => {
        router.push(`/company/recruitment/${job.id}`);
    };

    // 로딩 상태 처리
    if (isLoading) {
        return <div className="p-10 text-center">Loading data...</div>;
    }

    // 에러 상태 처리
    if (error) {
        return <div className="p-10 text-center text-red-600">Error: {error.message}</div>;
    }

    return (
        <div className="pr-22 pl-22 p-10 bg-[#FFFBF5] text-[#333333] font-sans flex flex-col min-h-[90vh]">

            <div className="mb-5 flex justify-between items-center">
                {session && (
                    <Link href="/company/recruitment/create">
                        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out">
                            <IconBriefcase className="w-4 h-4" />
                            Post Job
                        </button>
                    </Link>
                )}
                <input
                    type="text"
                    value={titleFilter}
                    onChange={e => setTitleFilter(e.target.value)}
                    placeholder="Search by job title..."
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm min-w-[300px] shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition duration-150"
                />
            </div>

            <div className="flex-grow bg-white rounded-lg overflow-hidden shadow-lg">
                <table className="min-w-full divide-y divide-gray-200 table-auto">
                    <thead className="bg-gray-100">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th
                                        key={header.id}
                                        style={{ width: header.getSize() }}
                                        className="px-6 py-3 text-left text-sm font-bold text-gray-1000 uppercase tracking-wider"
                                        onClick={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                        {header.column.getCanSort() && { asc: ' ▲', desc: ' ▼' }[header.column.getIsSorted() as string] ? (
                                            { asc: ' ▲', desc: ' ▼' }[header.column.getIsSorted() as string]
                                        ) : null}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {table.getRowModel().rows.map(row => (
                            <tr
                                key={row.id}
                                onClick={() => handleRowClick(row.original)}
                                className="hover:bg-gray-50 cursor-pointer transition"
                            >
                                {row.getVisibleCells().map(cell => (
                                    <td
                                        key={cell.id}
                                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                                    >
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>

                {showNoDataMessage && (
                    <div className="text-center py-10 text-gray-500">
                        {titleFilter ? "No search results found." : "No job postings are currently available."}
                    </div>
                )}
            </div>

            {table.getPageCount() > 0 && (
                <div className="py-6 flex justify-center items-center gap-3">
                    <button
                        className={paginationButtonClasses}
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                        aria-label="First page"
                    >
                        <IconChevronDoubleLeft className="w-5 h-5" />
                    </button>
                    <button
                        className={paginationButtonClasses}
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        aria-label="Previous page"
                    >
                        <IconChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="text-sm font-medium text-gray-700">
                        Page {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
                    </span>
                    <button
                        className={paginationButtonClasses}
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        aria-label="Next page"
                    >
                        <IconChevronRight className="w-5 h-5" />
                    </button>
                    <button
                        className={paginationButtonClasses}
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                        aria-label="Last page"
                    >
                        <IconChevronDoubleRight className="w-5 h-5" />
                    </button>

                    <select
                        value={table.getState().pagination.pageSize}
                        onChange={e => { table.setPageSize(Number(e.target.value)) }}
                        className="ml-4 pl-3 pr-8 py-2 border border-gray-300 rounded-md text-sm cursor-pointer bg-white shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition duration-150"
                    >
                        {[10, 20, 30, 50].map(pageSize => (<option key={pageSize} value={pageSize}>Show {pageSize} per page</option>))}
                    </select>
                </div>
            )}
        </div>
    );
}
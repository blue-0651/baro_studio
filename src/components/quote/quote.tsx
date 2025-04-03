'use client';
import { useState, useRef, type DragEvent, type ChangeEvent, type FormEvent } from "react";
import { useLang } from '@/context/LangContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCube,
    faCogs,
    faCompress,
    faIndustry,
    faHammer,
    faLayerGroup,
    faCheckCircle,
    faCloudUploadAlt,
    faFileImage,
    faFilePdf,
    faFileWord,
    faFileExcel,
    faFileArchive,
    faFile,
} from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

type Language = 'kr' | 'en';

type TranslationEntry = {
    [key in Language]: string;
};
type Translations = {
    selectServiceTitle: TranslationEntry;
    lastNameLabel: TranslationEntry;
    firstNameLabel: TranslationEntry;
    companyLabel: TranslationEntry;
    emailLabel: TranslationEntry;
    requestInfoLabel: TranslationEntry;
    fileUploadLabel: TranslationEntry;
    fileSelect: TranslationEntry;
    dragDrop: TranslationEntry;
    maxSize: TranslationEntry;
    uploadedFiles: TranslationEntry;
    excelDownloadLabel: TranslationEntry;
    rawMaterialDownload: TranslationEntry;
    tabDownload: TranslationEntry;
    submitButton: TranslationEntry;
    submittingButton: TranslationEntry;
    fileSizeError: TranslationEntry;
    requiredFieldError: TranslationEntry;
    submitSuccess: TranslationEntry;
    submitError: TranslationEntry;
}
type Service = {
    id: string;
    name: TranslationEntry;
    icon: IconDefinition;
}
const MAX_FILE_SIZE_MB = 20;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export default function QuoteForm() {
    const { lang } = useLang() as { lang: Language };

    const [selectedService, setSelectedService] = useState<string>("");
    const [files, setFiles] = useState<File[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [fileSizeError, setFileSizeError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const services: Service[] = [
        { id: "3d-printing", name: { kr: "3D 인쇄 외관 모델 및 엔지니어링 구성 요소", en: "3D Printing for Appearance Models & Engineering Components" }, icon: faCube },
        { id: "cnc", name: { kr: "CNC 가공", en: "CNC Machining" }, icon: faCogs },
        { id: "compression", name: { kr: "압축 성형", en: "Compression Molding" }, icon: faCompress },
        { id: "molding", name: { kr: "우레탄 주조 및 사출 성형", en: "Urethane Casting & Injection Molding" }, icon: faIndustry },
        { id: "stamping", name: { kr: "금속 스탬핑", en: "Metal Stamping" }, icon: faHammer },
        { id: "combined", name: { kr: "결합된 서비스", en: "Combined Services" }, icon: faLayerGroup },
    ];

    const translations: Translations = {
        selectServiceTitle: { kr: '관심 있는 서비스를 선택해 주세요 *', en: 'Please select the service you are interested in *' },
        lastNameLabel: { kr: '성 *', en: 'Last Name *' },
        firstNameLabel: { kr: '이름 *', en: 'First Name *' },
        companyLabel: { kr: '회사명 *', en: 'Company Name *' },
        emailLabel: { kr: '이메일 주소 *', en: 'Email Address *' },
        requestInfoLabel: { kr: '요청정보 (고객께서 원하시는 요청을 설명 주십시요.)', en: 'Request info. (whatever customers want to explain)' },
        fileUploadLabel: { kr: '파일 업로드', en: 'File Upload' },
        fileSelect: { kr: '파일 선택', en: 'Select file' },
        dragDrop: { kr: '또는 드래그 앤 드롭', en: 'or drag and drop' },
        maxSize: { kr: `최대 ${MAX_FILE_SIZE_MB}MB`, en: `Max ${MAX_FILE_SIZE_MB}MB` },
        uploadedFiles: { kr: '업로드된 파일:', en: 'Uploaded files:' },
        excelDownloadLabel: { kr: '엑셀 파일 다운로드', en: 'Download Excel Files' },
        rawMaterialDownload: { kr: 'Rawmaterial CNC 다운로드', en: 'Download Rawmaterial CNC' },
        tabDownload: { kr: 'TAB CNC 다운로드', en: 'Download TAB CNC' },
        submitButton: { kr: '견적 요청하기', en: 'Request Quote' },
        submittingButton: { kr: '제출 중...', en: 'Submitting...' }, // 추가
        fileSizeError: {
            kr: `파일 크기는 ${MAX_FILE_SIZE_MB}MB를 초과할 수 없습니다. 다음 파일은 추가되지 않았습니다:`,
            en: `File size cannot exceed ${MAX_FILE_SIZE_MB}MB. The following files were not added:`
        },
        requiredFieldError: { // 추가
            kr: '필수 입력 항목 (*)을 모두 채워주세요.',
            en: 'Please fill in all required fields (*).'
        },
        submitSuccess: { // 추가
            kr: '견적 요청이 성공적으로 제출되었습니다.',
            en: 'Quote request submitted successfully.'
        },
        submitError: { // 추가
            kr: '오류가 발생했습니다. 다시 시도해 주세요.',
            en: 'An error occurred. Please try again.'
        }
    };


    const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        setSubmitStatus(null);

        const droppedFiles = Array.from(e.dataTransfer.files);
        handleFiles(droppedFiles);
    };

    const handleServiceChange = (serviceId: string) => {
        setSelectedService(serviceId);
        setSubmitStatus(null);
    };

    const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSubmitStatus(null);
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            handleFiles(selectedFiles);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleFiles = (newFiles: File[]) => {
        setFileSizeError(null);
        const validFiles: File[] = [];
        const oversizedFiles: string[] = [];

        newFiles.forEach((file) => {
            if (file.size <= MAX_FILE_SIZE_BYTES) {
                validFiles.push(file);
            } else {
                oversizedFiles.push(file.name);
            }
        });

        if (validFiles.length > 0) {
            setFiles((prev) => {
                const existingNames = new Set(prev.map(f => f.name));
                const uniqueNewFiles = validFiles.filter(f => !existingNames.has(f.name));
                return [...prev, ...uniqueNewFiles];
            });
        }

        if (oversizedFiles.length > 0) {
            const errorMsg = `${translations.fileSizeError[lang]} ${oversizedFiles.join(', ')}`;
            setFileSizeError(errorMsg);
            setSubmitStatus({ type: 'error', message: errorMsg });
        } else {
            setSubmitStatus(null);
        }
    };

    const removeFile = (fileNameToRemove: string) => {
        setFiles(prevFiles => prevFiles.filter(file => file.name !== fileNameToRemove));
        setSubmitStatus(null);
    };
    const getFileIcon = (fileName: string): IconDefinition => {
        const extension = fileName.split(".").pop()?.toLowerCase();

        if (["jpg", "jpeg", "png", "gif", "svg", "webp"].includes(extension || "")) {
            return faFileImage;
        } else if (["pdf"].includes(extension || "")) {
            return faFilePdf;
        } else if (["doc", "docx"].includes(extension || "")) {
            return faFileWord;
        } else if (["xls", "xlsx"].includes(extension || "")) {
            return faFileExcel;
        } else if (["zip", "rar", "7z"].includes(extension || "")) {
            return faFileArchive;
        } else {
            return faFile;
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + " B";
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
        else return (bytes / 1048576).toFixed(1) + " MB";
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFileSizeError(null);

        const formData = new FormData(e.currentTarget);
        const lastName = formData.get('lastName');
        const firstName = formData.get('firstName');
        const email = formData.get('email');
        const requestInfo = formData.get('requestInfo');

        if (!selectedService || !lastName || !firstName || !email) {
            alert(lang === 'kr' ? '필수 입력 항목을 모두 채워주세요.' : 'Please fill in all required fields.');
            return;
        }


        console.log("Form submitted with data:", {
            selectedService,
            lastName: formData.get('lastName'),
            firstName: formData.get('firstName'),
            company: formData.get('company'),
            email: formData.get('email'),
            requestInfo: requestInfo, // Log request info
            files
        });

        // form action 미리 정의 나중에 사용할 것

        // fetch('/api/quote', {
        //     method: 'POST',
        //     body: formData,
        // })
        // .then(response => response.json())
        // .then(data => {
        //     console.log('Success:', data);
        //     alert(lang === 'kr' ? '견적 요청이 성공적으로 제출되었습니다.' : 'Quote request submitted successfully.');
        //     // Reset form? Clear state? Redirect?
        // })
        // .catch((error) => {
        //     console.error('Error:', error);
        //      alert(lang === 'kr' ? '오류가 발생했습니다. 다시 시도해 주세요.' : 'An error occurred. Please try again.');
        // });

        alert(lang === 'kr' ? '견적 요청이 제출되었습니다' : 'Quote request submitted (development).');
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Service Selection */}
            <div className="bg-white rounded-lg shadow p-8 space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    {translations.selectServiceTitle[lang]} {!selectedService && <span className="text-red-500">*</span>}
                </h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {services.map((service) => (
                        <label
                            key={service.id}
                            className={`relative flex p-4 border rounded-lg cursor-pointer transition-all ${selectedService === service.id
                                ? "border-2 border-orange-300 bg-orange-50 bg-opacity-20 shadow-md"
                                : "border-gray-300 bg-white hover:border-orange-300 hover:bg-orange-50 hover:bg-opacity-5"
                                }`}
                        >
                            {selectedService === service.id && (
                                <div className="absolute top-2 right-2">
                                    <FontAwesomeIcon icon={faCheckCircle} className="text-orange-400" />
                                </div>
                            )}
                            <input
                                type="radio"
                                name="service"
                                className="sr-only"
                                value={service.id}
                                checked={selectedService === service.id}
                                onChange={() => handleServiceChange(service.id)}
                                required
                            />
                            <div className="flex items-center">
                                <FontAwesomeIcon icon={service.icon} className="text-2xl text-orange-400 mr-3" />
                                <span className="text-sm">{service.name[lang]}</span>
                            </div>
                        </label>
                    ))}
                </div>
                <input type="hidden" name="selectedService" value={selectedService} />
            </div>

            {/* Personal Info, Request Info & File Upload */}
            <div className="bg-white rounded-lg shadow p-8 space-y-6">
                {/* 1행 : 이름 */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 ">
                            {translations.lastNameLabel[lang]}
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            required
                            placeholder="Enter your last name"
                            className="mt-1 block w-full h-10 p-3 rounded-md border-gray-300 shadow-sm focus:border-[#A6D6E7] focus:ring focus:ring-[#A6D6E7] focus:ring-opacity-50"
                        />
                    </div>
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                            {translations.firstNameLabel[lang]}
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            required
                            placeholder="Enter your first name"
                            className="mt-1 block w-full h-10 p-3 rounded-md border-gray-300 shadow-sm focus:border-[#A6D6E7] focus:ring focus:ring-[#A6D6E7] focus:ring-opacity-50"
                        />
                    </div>
                </div>

                {/* 2 행 : 회사이름름 */}
                <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700">
                        {translations.companyLabel[lang]}
                    </label>
                    <input
                        type="text"
                        id="company"
                        name="company"
                        required // Typically required
                        placeholder="Enter your company name"
                        className="mt-1 block h-10 p-3 w-full rounded-md border-gray-300 shadow-sm focus:border-[#A6D6E7] focus:ring focus:ring-[#A6D6E7] focus:ring-opacity-50"
                    />
                </div>

                {/* 3행 : 이메일 정보보 */}
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        {translations.emailLabel[lang]}
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        placeholder="Enter your email address"
                        className="mt-1 block h-10 p-3 w-full rounded-md border-gray-300 shadow-sm focus:border-[#A6D6E7] focus:ring focus:ring-[#A6D6E7] focus:ring-opacity-50"
                    />
                </div>

                {/* 4행 : 요청사항 */}
                <div>
                    <label htmlFor="requestInfo" className="block text-sm font-medium text-gray-700">
                        {translations.requestInfoLabel[lang]}
                    </label>
                    <textarea
                        id="requestInfo"
                        name="requestInfo"
                        rows={4}
                        className="mt-1 block w-full p-3 rounded-md border-gray-300 shadow-sm focus:border-[#A6D6E7] focus:ring focus:ring-[#A6D6E7] focus:ring-opacity-50"
                        placeholder={lang === 'kr' ? '여기에 요청 사항을 입력하세요...' : 'Enter your request details here...'}
                    />
                </div>

                {/* 5행 : 파일업로드 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        {translations.fileUploadLabel[lang]}
                    </label>
                    <div
                        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg transition-colors ${isDragging ? "border-[#A6D6E7]" : "border-gray-300 hover:border-[#A6D6E7]"
                            }`}
                        onDragEnter={handleDragEnter}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <div className="space-y-1 text-center w-full">
                            <FontAwesomeIcon icon={faCloudUploadAlt} className="text-3xl text-gray-400" />
                            <div className="flex text-sm text-gray-600 justify-center">
                                <label
                                    htmlFor="file-upload"
                                    className="relative cursor-pointer bg-white rounded-md font-medium text-[#A6D6E7] hover:text-[#7BBFD6] focus-within:outline-none"
                                >
                                    <span>{translations.fileSelect[lang]}</span>
                                    <input
                                        id="file-upload"
                                        name="file-upload"
                                        type="file"
                                        className="sr-only"
                                        multiple
                                        ref={fileInputRef}
                                        onChange={handleFileInputChange}
                                    />
                                </label>
                                <p className="pl-1">{translations.dragDrop[lang]}</p>
                            </div>
                            <p className="text-xs text-gray-500">{translations.maxSize[lang]}</p>

                            {fileSizeError && (
                                <p className="text-sm text-red-600 mt-1 text-left px-2">
                                    {fileSizeError}
                                </p>
                            )}

                            {files.length > 0 && (
                                <div className="mt-4 w-full ">
                                    <p className="text-sm font-medium text-gray-700 mb-2 text-left px-2">{translations.uploadedFiles[lang]}</p>
                                    <ul className="space-y-2 max-h-40 overflow-y-auto border rounded-md p-2">
                                        {files.map((file, index) => (
                                            <li
                                                key={index}
                                                className="grid grid-cols-[auto_1fr_auto] items-center gap-x-2 p-1"
                                            >
                                                <FontAwesomeIcon
                                                    icon={getFileIcon(file.name)}
                                                    className="text-gray-500"
                                                />
                                                <span className="text-sm text-gray-700 min-w-0" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', wordBreak: 'break-all' }}>
                                                    {file.name}
                                                </span>
                                                <span className="text-xs text-gray-500 whitespace-nowrap">
                                                    ({formatFileSize(file.size)})
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* 6행: 파일다운로드 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {translations.excelDownloadLabel[lang]}
                    </label>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <a
                            href="/quote/BARO_rawmaterial_CNC_Final.xlsx"
                            download
                            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A6D6E7]"
                        >
                            <FontAwesomeIcon icon={faFileExcel} className="text-green-600 mr-2" />
                            {translations.rawMaterialDownload[lang]}
                        </a>
                        <a
                            href="/quote/BARO_Tap_CNC.xlsx"
                            download
                            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A6D6E7]"
                        >
                            <FontAwesomeIcon icon={faFileExcel} className="text-green-600 mr-2" />
                            {translations.tabDownload[lang]}
                        </a>
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
                <button
                    type="submit"
                    className="rounded-lg px-8 py-3 bg-[#F68E1E] text-white font-medium hover:bg-[#E57D0D] hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A6D6E7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed" // Added disabled styles
                >
                    {translations.submitButton[lang]}
                </button>
            </div>
        </form>
    )
}
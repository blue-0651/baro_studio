"use client"

import { useEditor, EditorContent, type Editor as EditorType } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import { forwardRef, useImperativeHandle, useRef } from "react"
import { Bold, Italic, List, LinkIcon, ImageIcon } from "lucide-react"

interface TiptapEditorProps {
    initialValue?: string
    onChange?: (value: string) => void
    placeholder?: string
    minHeight?: string
    // 이미지 파일이 추가되었을 때 부모에게 알리는 콜백
    onImageFileAdd?: (file: File, dataUrl: string) => void
}

export interface TiptapEditorRef {
    getContent: () => string
    setContent: (content: string) => void
    getEditor: () => EditorType | null
}

const TiptapEditor = forwardRef<TiptapEditorRef, TiptapEditorProps>(
    ({ initialValue = "", onChange, placeholder = "내용을 입력하세요...", minHeight = "200px", onImageFileAdd }, ref) => {
        const editor = useEditor({
            extensions: [
                StarterKit,
                Image, // src 속성에 data:URL 또는 http URL 허용
                Link.configure({ openOnClick: false }),
                Placeholder.configure({ placeholder }),
            ],
            content: initialValue,
            onUpdate: ({ editor }) => {
                onChange?.(editor.getHTML())
            },
            editorProps: {
                attributes: {
                    class: 'prose prose-sm max-w-none focus:outline-none p-3', // 패딩 추가
                    style: `min-height: ${minHeight};`,
                },
            },
        })

        const imageInputRef = useRef<HTMLInputElement>(null)

        useImperativeHandle(ref, () => ({
            getContent: () => editor?.getHTML() ?? "",
            setContent: (content: string) => editor?.commands.setContent(content),
            getEditor: () => editor,
        }))

        // --- Image Handling ---
        const handleImageButtonClick = () => {
            imageInputRef.current?.click() // 숨겨진 input 클릭 트리거
        }

        const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0]
            event.target.value = '' // 같은 파일 다시 선택 가능하도록 초기화

            if (file && editor && file.type.startsWith("image/")) {
                const reader = new FileReader()

                reader.onload = (e) => {
                    const dataUrl = e.target?.result as string
                    if (dataUrl) {
                        // 1. 에디터에 data:URL로 이미지 삽입 (미리보기)
                        editor.chain().focus().setImage({ src: dataUrl }).run()
                        // 2. 부모 컴포넌트에 파일과 data:URL 전달
                        onImageFileAdd?.(file, dataUrl)
                    }
                }

                reader.onerror = (error) => {
                    console.error("Error reading file:", error)
                    alert("이미지 파일을 읽는 중 오류가 발생했습니다.")
                }

                reader.readAsDataURL(file) // 파일을 data:URL로 읽기 시작
            } else if (file && !file.type.startsWith("image/")) {
                alert("이미지 파일만 추가할 수 있습니다.")
            }
        }

        // --- Link Handling ---
        const addLink = () => {
            const url = window.prompt("링크 URL을 입력하세요")
            if (url && editor) {
                if (editor.isActive('link')) {
                    editor.chain().focus().unsetLink().run()
                }
                editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
            }
        }

        // --- Editor Focus ---
        const handleWrapperClick = () => {
            if (editor && !editor.isFocused) {
                editor.chain().focus().run()
            }
        }

        return (
            <div
                className="border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500" // 포커스 시 링 스타일 변경
                onClick={handleWrapperClick}
            >
                {/* Hidden File Input for Image Upload */}
                <input
                    type="file"
                    accept="image/*" // 이미지 파일만 선택 가능하도록
                    ref={imageInputRef}
                    onChange={handleImageFileChange}
                    style={{ display: 'none' }}
                />

                {/* Toolbar */}
                <div className="bg-gray-100 border-b border-gray-300 p-1.5 flex gap-1 sticky top-0 z-10"> {/* 스타일 약간 변경 */}
                    <button type="button" onClick={(e) => { e.stopPropagation(); editor?.chain().focus().toggleBold().run(); }} className={`p-1.5 rounded ${editor?.isActive("bold") ? "bg-gray-300" : "hover:bg-gray-200"}`} title="굵게" disabled={!editor}> <Bold size={16} /> </button>
                    <button type="button" onClick={(e) => { e.stopPropagation(); editor?.chain().focus().toggleItalic().run(); }} className={`p-1.5 rounded ${editor?.isActive("italic") ? "bg-gray-300" : "hover:bg-gray-200"}`} title="기울임" disabled={!editor}> <Italic size={16} /> </button>
                    <button type="button" onClick={(e) => { e.stopPropagation(); editor?.chain().focus().toggleBulletList().run(); }} className={`p-1.5 rounded ${editor?.isActive("bulletList") ? "bg-gray-300" : "hover:bg-gray-200"}`} title="목록" disabled={!editor}> <List size={16} /> </button>
                    <button type="button" onClick={(e) => { e.stopPropagation(); addLink(); }} className={`p-1.5 rounded ${editor?.isActive("link") ? "bg-gray-300" : "hover:bg-gray-200"}`} title="링크" disabled={!editor}> <LinkIcon size={16} /> </button>
                    <button type="button" onClick={(e) => { e.stopPropagation(); handleImageButtonClick(); }} className="p-1.5 rounded hover:bg-gray-200" title="이미지" disabled={!editor}> <ImageIcon size={16} /> </button>
                </div>

                {/* Editor Content Area */}
                <EditorContent editor={editor} className="cursor-text bg-white" /> {/* 배경색 추가 */}
            </div>
        )
    },
)

TiptapEditor.displayName = "TiptapEditor"

export default TiptapEditor
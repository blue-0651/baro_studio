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
    onImageFileAdd?: (file: File, dataUrl: string) => void
}

export interface TiptapEditorRef {
    getContent: () => string
    setContent: (content: string) => void
    getEditor: () => EditorType | null
}

const TiptapEditor = forwardRef<TiptapEditorRef, TiptapEditorProps>(
    ({ initialValue = "", onChange, placeholder = "Enter content...", minHeight = "200px", onImageFileAdd }, ref) => {
        const editor = useEditor({
            extensions: [
                StarterKit,
                Image,
                Link.configure({ openOnClick: false }),
                Placeholder.configure({ placeholder }),
            ],
            content: initialValue,
            onUpdate: ({ editor }) => {
                onChange?.(editor.getHTML())
            },
            editorProps: {
                attributes: {
                    class: 'prose prose-sm max-w-none focus:outline-none p-3',
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

        const handleImageButtonClick = () => {
            imageInputRef.current?.click()
        }

        const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0]
            event.target.value = '' // Reset input to allow selecting the same file again

            if (file && editor && file.type.startsWith("image/")) {
                const reader = new FileReader()

                reader.onload = (e) => {
                    const dataUrl = e.target?.result as string
                    if (dataUrl) {
                        editor.chain().focus().setImage({ src: dataUrl }).run()
                        onImageFileAdd?.(file, dataUrl)
                    }
                }

                reader.onerror = (error) => {
                    console.error("Error reading file:", error)
                    alert("Error reading image file.")
                }

                reader.readAsDataURL(file)
            } else if (file && !file.type.startsWith("image/")) {
                alert("Only image files can be added.")
            }
        }

        const addLink = () => {
            const url = window.prompt("Enter link URL")
            if (url && editor) {
                if (editor.isActive('link')) {
                    editor.chain().focus().unsetLink().run()
                }
                editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
            }
        }

        const handleWrapperClick = () => {
            if (editor && !editor.isFocused) {
                editor.chain().focus().run()
            }
        }

        return (
            <div
                className="border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500"
                onClick={handleWrapperClick}
            >
                <input
                    type="file"
                    accept="image/*"
                    ref={imageInputRef}
                    onChange={handleImageFileChange}
                    style={{ display: 'none' }}
                />

                <div className="bg-gray-100 border-b border-gray-300 p-1.5 flex gap-1 sticky top-0 z-10">
                    <button type="button" onClick={(e) => { e.stopPropagation(); editor?.chain().focus().toggleBold().run(); }} className={`p-1.5 rounded ${editor?.isActive("bold") ? "bg-gray-300" : "hover:bg-gray-200"}`} title="Bold" disabled={!editor}> <Bold size={16} /> </button>
                    <button type="button" onClick={(e) => { e.stopPropagation(); editor?.chain().focus().toggleItalic().run(); }} className={`p-1.5 rounded ${editor?.isActive("italic") ? "bg-gray-300" : "hover:bg-gray-200"}`} title="Italic" disabled={!editor}> <Italic size={16} /> </button>
                    <button type="button" onClick={(e) => { e.stopPropagation(); editor?.chain().focus().toggleBulletList().run(); }} className={`p-1.5 rounded ${editor?.isActive("bulletList") ? "bg-gray-300" : "hover:bg-gray-200"}`} title="List" disabled={!editor}> <List size={16} /> </button>
                    <button type="button" onClick={(e) => { e.stopPropagation(); addLink(); }} className={`p-1.5 rounded ${editor?.isActive("link") ? "bg-gray-300" : "hover:bg-gray-200"}`} title="Link" disabled={!editor}> <LinkIcon size={16} /> </button>
                    <button type="button" onClick={(e) => { e.stopPropagation(); handleImageButtonClick(); }} className="p-1.5 rounded hover:bg-gray-200" title="Image" disabled={!editor}> <ImageIcon size={16} /> </button>
                </div>

                <EditorContent editor={editor} className="cursor-text bg-white" />
            </div>
        )
    },
)

TiptapEditor.displayName = "TiptapEditor"

export default TiptapEditor
'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { useState, useEffect } from 'react'

interface RichEditorProps {
  value: string
  onChange: (content: string) => void
  placeholder?: string
  disabled?: boolean
  minHeight?: string
}

export default function RichEditor({
  value,
  onChange,
  placeholder = 'Write something…',
  disabled = false,
  minHeight = '300px',
}: RichEditorProps) {
  const [isMounted, setIsMounted] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: {
          languageClassPrefix: 'language-',
        },
      }),
      Link.configure({
        openOnClick: false,
      }),
      Image.configure({
        allowBase64: true,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editable: !disabled,
  })

  // Handle mounting and updates
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (editor && value && editor.getHTML() !== value) {
      editor.commands.setContent(value)
    }
  }, [value, editor])

  if (!isMounted) {
    return <div style={{ minHeight, background: '#f5f5f5', borderRadius: '6px' }} />
  }

  return (
    <div className="rich-editor-container">
      <div className="rich-editor-toolbar">
        <div className="toolbar-group">
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleBold().run()}
            disabled={disabled || !editor?.can().chain().focus().toggleBold().run()}
            className={`toolbar-btn ${editor?.isActive('bold') ? 'active' : ''}`}
            title="Bold (Ctrl+B)"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            disabled={disabled || !editor?.can().chain().focus().toggleItalic().run()}
            className={`toolbar-btn ${editor?.isActive('italic') ? 'active' : ''}`}
            title="Italic (Ctrl+I)"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleStrike().run()}
            disabled={disabled || !editor?.can().chain().focus().toggleStrike().run()}
            className={`toolbar-btn ${editor?.isActive('strike') ? 'active' : ''}`}
            title="Strikethrough"
          >
            <s>S</s>
          </button>
        </div>

        <div className="toolbar-group">
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
            disabled={disabled || !editor?.can().chain().focus().toggleHeading({ level: 1 }).run()}
            className={`toolbar-btn ${editor?.isActive('heading', { level: 1 }) ? 'active' : ''}`}
            title="Heading 1"
          >
            H1
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
            disabled={disabled || !editor?.can().chain().focus().toggleHeading({ level: 2 }).run()}
            className={`toolbar-btn ${editor?.isActive('heading', { level: 2 }) ? 'active' : ''}`}
            title="Heading 2"
          >
            H2
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
            disabled={disabled || !editor?.can().chain().focus().toggleHeading({ level: 3 }).run()}
            className={`toolbar-btn ${editor?.isActive('heading', { level: 3 }) ? 'active' : ''}`}
            title="Heading 3"
          >
            H3
          </button>
        </div>

        <div className="toolbar-group">
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            disabled={disabled || !editor?.can().chain().focus().toggleBulletList().run()}
            className={`toolbar-btn ${editor?.isActive('bulletList') ? 'active' : ''}`}
            title="Bullet List"
          >
            •
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleOrderedList().run()}
            disabled={disabled || !editor?.can().chain().focus().toggleOrderedList().run()}
            className={`toolbar-btn ${editor?.isActive('orderedList') ? 'active' : ''}`}
            title="Ordered List"
          >
            1.
          </button>
        </div>

        <div className="toolbar-group">
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
            disabled={disabled || !editor?.can().chain().focus().toggleCodeBlock().run()}
            className={`toolbar-btn ${editor?.isActive('codeBlock') ? 'active' : ''}`}
            title="Code Block"
          >
            {'<>'}
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().toggleCode().run()}
            disabled={disabled || !editor?.can().chain().focus().toggleCode().run()}
            className={`toolbar-btn ${editor?.isActive('code') ? 'active' : ''}`}
            title="Inline Code"
          >
            code
          </button>
        </div>

        <div className="toolbar-group">
          <button
            type="button"
            onClick={() => editor?.chain().focus().setLink({ href: '' }).run()}
            disabled={disabled || !editor?.can().chain().focus().setLink({ href: '' }).run()}
            className={`toolbar-btn ${editor?.isActive('link') ? 'active' : ''}`}
            title="Link"
          >
            🔗
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().setImage({ src: '' }).run()}
            disabled={disabled || !editor?.can().chain().focus().setImage({ src: '' }).run()}
            className="toolbar-btn"
            title="Image"
          >
            🖼️
          </button>
        </div>

        <div className="toolbar-group">
          <button
            type="button"
            onClick={() => editor?.chain().focus().undo().run()}
            disabled={disabled || !editor?.can().chain().focus().undo().run()}
            className="toolbar-btn"
            title="Undo (Ctrl+Z)"
          >
            ↶
          </button>
          <button
            type="button"
            onClick={() => editor?.chain().focus().redo().run()}
            disabled={disabled || !editor?.can().chain().focus().redo().run()}
            className="toolbar-btn"
            title="Redo (Ctrl+Y)"
          >
            ↷
          </button>
        </div>
      </div>

      <EditorContent
        editor={editor}
        className="rich-editor-content"
        style={{ minHeight }}
      />

      <style jsx>{`
        .rich-editor-container {
          border: 1px solid var(--border);
          border-radius: 6px;
          overflow: hidden;
        }

        .rich-editor-toolbar {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          padding: 0.75rem;
          background: var(--surface-light);
          border-bottom: 1px solid var(--border);
        }

        .toolbar-group {
          display: flex;
          gap: 0;
          border: 1px solid var(--border);
          border-radius: 4px;
          overflow: hidden;
        }

        .toolbar-btn {
          padding: 0.5rem 0.75rem;
          background: white;
          border: none;
          border-right: 1px solid var(--border);
          color: var(--text);
          cursor: pointer;
          font-size: 0.9rem;
          font-weight: 600;
          transition: background 0.2s;
        }

        .toolbar-btn:last-child {
          border-right: none;
        }

        .toolbar-btn:hover:not(:disabled) {
          background: var(--hover-bg);
        }

        .toolbar-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .toolbar-btn.active {
          background: var(--primary);
          color: white;
        }

        .rich-editor-content {
          padding: 1rem;
          background: var(--input-bg);
          color: var(--text);
        }

        :global(.rich-editor-content .ProseMirror) {
          outline: none;
          word-wrap: break-word;
          white-space: pre-wrap;
        }

        :global(.rich-editor-content h1) {
          font-size: 1.75rem;
          font-weight: 700;
          margin: 1rem 0 0.5rem;
        }

        :global(.rich-editor-content h2) {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0.875rem 0 0.375rem;
        }

        :global(.rich-editor-content h3) {
          font-size: 1.25rem;
          font-weight: 700;
          margin: 0.75rem 0 0.25rem;
        }

        :global(.rich-editor-content p) {
          margin: 0.5rem 0;
        }

        :global(.rich-editor-content ul) {
          margin: 0.5rem 0;
          padding-left: 2rem;
        }

        :global(.rich-editor-content ol) {
          margin: 0.5rem 0;
          padding-left: 2rem;
        }

        :global(.rich-editor-content li) {
          margin: 0.25rem 0;
        }

        :global(.rich-editor-content code) {
          background: var(--border);
          padding: 0.2rem 0.4rem;
          border-radius: 3px;
          font-family: monospace;
        }

        :global(.rich-editor-content pre) {
          background: var(--border);
          padding: 1rem;
          border-radius: 6px;
          overflow-x: auto;
          margin: 0.5rem 0;
        }

        :global(.rich-editor-content a) {
          color: var(--primary);
          text-decoration: underline;
        }

        :global(.rich-editor-content img) {
          max-width: 100%;
          height: auto;
          border-radius: 6px;
          margin: 0.5rem 0;
        }

        /* CSS variable fallbacks */
        @supports not (color: var(--primary)) {
          :root {
            --primary: #0066cc;
            --text: #000000;
            --border: #e0e0e0;
            --surface: #f5f5f5;
            --surface-light: #fafafa;
            --hover-bg: #efefef;
            --input-bg: #ffffff;
          }
        }
      `}</style>
    </div>
  )
}

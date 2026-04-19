'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Heading from '@tiptap/extension-heading'
import { useEffect } from 'react'

interface RichEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
}

function ToolbarBtn({ onClick, active, title, children }: {
  onClick: () => void; active?: boolean; title: string; children: React.ReactNode
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      style={{
        padding: '4px 8px', borderRadius: 4, border: 'none', cursor: 'pointer', fontSize: '.8rem',
        background: active ? '#6366f1' : 'transparent',
        color: active ? '#fff' : '#a1a1aa',
        transition: 'background .1s, color .1s',
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = '#27272a' }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
    >
      {children}
    </button>
  )
}

export default function RichEditor({ value, onChange, placeholder }: RichEditorProps) {
  const editor = useEditor({
    immediatelyRender: false, // Fix SSR hydration mismatch
    extensions: [
      StarterKit,
      Heading.configure({ levels: [1, 2, 3] }),
      Link.configure({ openOnClick: false }),
      Image,
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        style: 'min-height: 300px; outline: none; color: #fafafa; font-size: .875rem; line-height: 1.7; padding: 16px;',
        'data-placeholder': placeholder ?? 'Commencez à écrire…',
      },
    },
  })

  // Sync external value changes (e.g. language tab switch)
  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value)
    }
  }, [value]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!editor) return null

  const addLink = () => {
    const url = prompt('URL du lien')
    if (url) editor.chain().focus().setLink({ href: url }).run()
  }

  const addImage = () => {
    const url = prompt('URL de l\'image')
    if (url) editor.chain().focus().setImage({ src: url }).run()
  }

  return (
    <div style={{
      border: '1px solid #27272a', borderRadius: 8, overflow: 'hidden',
      background: '#09090b',
    }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex', gap: 2, padding: '6px 8px', flexWrap: 'wrap',
        borderBottom: '1px solid #27272a', background: '#18181b',
      }}>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Gras"><b>B</b></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italique"><i>I</i></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Barré"><s>S</s></ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Code inline">{'<>'}</ToolbarBtn>
        <span style={{ width: 1, background: '#27272a', margin: '2px 4px' }} />
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive('heading', { level: 1 })} title="Titre 1">H1</ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Titre 2">H2</ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Titre 3">H3</ToolbarBtn>
        <span style={{ width: 1, background: '#27272a', margin: '2px 4px' }} />
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Liste à puces">• —</ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Liste numérotée">1.</ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Citation">❝</ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Bloc code">{'{ }'}</ToolbarBtn>
        <span style={{ width: 1, background: '#27272a', margin: '2px 4px' }} />
        <ToolbarBtn onClick={addLink} active={editor.isActive('link')} title="Lien">🔗</ToolbarBtn>
        <ToolbarBtn onClick={addImage} active={false} title="Image">🖼</ToolbarBtn>
        <span style={{ flex: 1 }} />
        <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} active={false} title="Annuler">↩</ToolbarBtn>
        <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} active={false} title="Rétablir">↪</ToolbarBtn>
      </div>

      {/* Editor area */}
      <EditorContent editor={editor} />

      <style>{`
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left; height: 0; pointer-events: none; color: #52525b;
        }
        .ProseMirror h1 { font-size: 1.5rem; font-weight: 700; color: #fafafa; margin: 1em 0 .5em; }
        .ProseMirror h2 { font-size: 1.25rem; font-weight: 600; color: #fafafa; margin: .8em 0 .4em; }
        .ProseMirror h3 { font-size: 1.1rem; font-weight: 600; color: #fafafa; margin: .6em 0 .3em; }
        .ProseMirror a { color: #818cf8; }
        .ProseMirror code { background: #27272a; color: #f472b6; padding: 1px 5px; border-radius: 4px; font-size: .85em; }
        .ProseMirror pre { background: #27272a; color: #fafafa; padding: 12px 16px; border-radius: 8px; overflow-x: auto; font-size: .85rem; }
        .ProseMirror blockquote { border-left: 3px solid #6366f1; padding-left: 12px; color: #a1a1aa; margin: .5em 0; }
        .ProseMirror ul, .ProseMirror ol { padding-left: 1.5em; color: #d4d4d8; }
        .ProseMirror img { max-width: 100%; border-radius: 6px; }
      `}</style>
    </div>
  )
}

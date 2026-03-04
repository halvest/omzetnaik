import React, { useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { supabase } from "../utils/supabase";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Image as ImageIcon,
  Link as LinkIcon,
  Undo,
  Redo,
  Heading1,
  Heading2,
} from "lucide-react";

interface Props {
  content: string;
  onChange: (content: string) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const addImage = useCallback(async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      if (input.files && input.files[0]) {
        const file = input.files[0];
        const fileName = `blog-content/${Date.now()}-${file.name}`;

        // Upload ke Supabase
        const { data, error } = await supabase.storage
          .from("property-images")
          .upload(fileName, file);

        if (error) return alert("Gagal upload gambar");

        const {
          data: { publicUrl },
        } = supabase.storage.from("property-images").getPublicUrl(fileName);

        editor.chain().focus().setImage({ src: publicUrl }).run();
      }
    };
    input.click();
  }, [editor]);

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL link:", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const buttons = [
    {
      icon: <Heading1 size={18} />,
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      active: "heading",
      attr: { level: 1 },
    },
    {
      icon: <Heading2 size={18} />,
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      active: "heading",
      attr: { level: 2 },
    },
    {
      icon: <Bold size={18} />,
      action: () => editor.chain().focus().toggleBold().run(),
      active: "bold",
    },
    {
      icon: <Italic size={18} />,
      action: () => editor.chain().focus().toggleItalic().run(),
      active: "italic",
    },
    {
      icon: <List size={18} />,
      action: () => editor.chain().focus().toggleBulletList().run(),
      active: "bulletList",
    },
    {
      icon: <ListOrdered size={18} />,
      action: () => editor.chain().focus().toggleOrderedList().run(),
      active: "orderedList",
    },
    {
      icon: <Quote size={18} />,
      action: () => editor.chain().focus().toggleBlockquote().run(),
      active: "blockquote",
    },
    { icon: <LinkIcon size={18} />, action: setLink, active: "link" },
    { icon: <ImageIcon size={18} />, action: addImage, active: false },
  ];

  return (
    <div className="flex flex-wrap gap-1 p-2 bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
      {buttons.map((btn, i) => (
        <button
          key={i}
          type="button"
          onClick={btn.action}
          className={`p-2 rounded-lg transition-colors ${
            btn.active && editor.isActive(btn.active, btn.attr || {})
              ? "bg-[#0F1F4A] text-white"
              : "text-slate-500 hover:bg-slate-200"
          }`}
        >
          {btn.icon}
        </button>
      ))}
      <div className="flex gap-1 ml-auto">
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          className="p-2 text-slate-400 hover:text-slate-600"
        >
          <Undo size={18} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          className="p-2 text-slate-400 hover:text-slate-600"
        >
          <Redo size={18} />
        </button>
      </div>
    </div>
  );
};

export default function RichTextEditor({ content, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: "rounded-2xl border border-slate-200 my-8 max-w-full h-auto",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-[#FF3B3B] underline font-bold",
        },
      }),
      Placeholder.configure({
        placeholder: "Tuliskan isi artikel Anda di sini...",
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-slate max-w-none focus:outline-none min-h-[400px] p-6 text-slate-600 leading-relaxed",
      },
    },
  });

  return (
    <div className="border-2 border-slate-100 rounded-[2rem] overflow-hidden bg-white focus-within:border-[#0F1F4A] transition-all">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />

      <style>{`
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #cbd5e1;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror blockquote {
          border-left: 4px solid #FF3B3B;
          padding-left: 1rem;
          font-style: italic;
          color: #475569;
        }
      `}</style>
    </div>
  );
}

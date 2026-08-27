import ReactQuill from 'react-quill-new';
import Quill from 'quill';
import { StyleAttributor, ClassAttributor, Scope } from 'parchment';
import 'react-quill-new/dist/quill.snow.css';

const LineHeight = new StyleAttributor('line-height', 'line-height', {
    scope: Scope.BLOCK,
    whitelist: ['1', '1.15', '1.5', '2', '2.5', '3'],
});
Quill.register('formats/line-height', LineHeight, true);

const MarginBottom = new ClassAttributor('margin-bottom', 'mb', {
    scope: Scope.BLOCK,
    whitelist: ['0', '05em', '1em', '15em', '2em', '3em'],
});
Quill.register('formats/margin-bottom', MarginBottom, true);

interface QuillEditorProps {
    value: string;
    onChange: (content: string) => void;
    placeholder?: string;
    error?: string;
}

const quillIsolationStyles = `
  .ql-toolbar.ql-snow,
  .ql-container.ql-snow {
    border-color: #ccc !important;
    background: #fff !important;
    color: #000 !important;
    font-family: inherit !important;
  }

  .ql-toolbar.ql-snow .ql-stroke { stroke: #444 !important; }
  .ql-toolbar.ql-snow .ql-fill { fill: #444 !important; }
  .ql-toolbar.ql-snow .ql-picker { color: #444 !important; }
  .ql-toolbar.ql-snow .ql-picker-options {
    background: #fff !important;
    border-color: #ccc !important;
    color: #000 !important;
  }
  .ql-toolbar.ql-snow .ql-picker-label { color: #444 !important; }
  .ql-toolbar.ql-snow .ql-picker-label::before { color: #444 !important; }
  .ql-toolbar.ql-snow .ql-picker-label .ql-stroke { stroke: #444 !important; }

  .ql-toolbar.ql-snow button:hover .ql-stroke,
  .ql-toolbar.ql-snow .ql-picker-label:hover .ql-stroke { stroke: #06c !important; }
  .ql-toolbar.ql-snow button:hover .ql-fill,
  .ql-toolbar.ql-snow .ql-picker-label:hover .ql-fill { fill: #06c !important; }
  .ql-toolbar.ql-snow .ql-picker-label:hover { color: #06c !important; }
  .ql-toolbar.ql-snow .ql-picker-label:hover::before { color: #06c !important; }

  .ql-toolbar.ql-snow button.ql-active .ql-stroke,
  .ql-toolbar.ql-snow .ql-picker-label.ql-active .ql-stroke { stroke: #06c !important; }
  .ql-toolbar.ql-snow button.ql-active .ql-fill,
  .ql-toolbar.ql-snow .ql-picker-label.ql-active .ql-fill { fill: #06c !important; }
  .ql-toolbar.ql-snow button.ql-active { color: #06c !important; }
  .ql-toolbar.ql-snow .ql-picker-label.ql-active { color: #06c !important; }
  .ql-toolbar.ql-snow .ql-picker-label.ql-active::before { color: #06c !important; }

  .ql-toolbar.ql-snow .ql-formats button.ql-active .ql-stroke { stroke: #06c !important; }
  .ql-toolbar.ql-snow .ql-formats button.ql-active .ql-fill { fill: #06c !important; }
  .ql-toolbar.ql-snow .ql-formats button.ql-active { color: #06c !important; }

  .ql-toolbar.ql-snow .ql-formats .ql-picker-label.ql-active .ql-stroke { stroke: #06c !important; }
  .ql-toolbar.ql-snow .ql-formats .ql-picker-label.ql-active .ql-fill { fill: #06c !important; }
  .ql-toolbar.ql-snow .ql-formats .ql-picker-label.ql-active { color: #06c !important; }
  .ql-toolbar.ql-snow .ql-formats .ql-picker-label.ql-active::before { color: #06c !important; }

  .ql-toolbar.ql-snow .ql-formats .ql-picker.ql-expanded .ql-picker-label { color: #06c !important; }
  .ql-toolbar.ql-snow .ql-formats .ql-picker.ql-expanded .ql-picker-label::before { color: #06c !important; }
  .ql-toolbar.ql-snow .ql-formats .ql-picker.ql-expanded .ql-picker-label .ql-stroke { stroke: #06c !important; }
  .ql-toolbar.ql-snow .ql-formats .ql-picker.ql-expanded .ql-picker-label .ql-fill { fill: #06c !important; }

  .ql-snow .ql-picker.ql-margin-bottom .ql-picker-label::before {
    content: 'Espaciado' !important;
    margin-right: 15px;
    color: #444 !important;
    font-size: 13px !important;
  }

  .ql-snow .ql-picker.ql-margin-bottom .ql-picker-options {
    padding: 4px 0 !important;
    min-width: 70px !important;
  }

  .ql-snow .ql-picker.ql-margin-bottom .ql-picker-item {
    padding: 4px 10px !important;
    font-size: 13px !important;
    color: #333 !important;
  }

  .ql-snow .ql-picker.ql-margin-bottom .ql-picker-item::before {
    content: attr(data-value) !important;
    color: #333 !important;
    font-size: 13px !important;
  }

  .ql-snow .ql-picker.ql-margin-bottom .ql-picker-item:hover {
    color: #06c !important;
  }

  .ql-snow .ql-picker.ql-margin-bottom .ql-picker-item:hover::before {
    color: #06c !important;
  }

  .ql-snow .ql-picker.ql-margin-bottom .ql-picker-item.ql-selected {
    color: #06c !important;
  }

  .ql-snow .ql-picker.ql-margin-bottom .ql-picker-item.ql-selected::before {
    color: #06c !important;
  }

  .ql-editor .mb-0 { margin-bottom: 0 !important; }
  .ql-editor .mb-05em { margin-bottom: 0.5em !important; }
  .ql-editor .mb-1em { margin-bottom: 1em !important; }
  .ql-editor .mb-15em { margin-bottom: 1.5em !important; }
  .ql-editor .mb-2em { margin-bottom: 2em !important; }
  .ql-editor .mb-3em { margin-bottom: 3em !important; }

  .ql-container.ql-snow { color: #000 !important; }

  .ql-editor {
    color: #000 !important;
    background: #fff !important;
    font-family: inherit !important;
    padding: 1rem !important;
    overflow-wrap: break-word;
    word-wrap: break-word;
  }

  .ql-editor h1,
  .ql-editor h2,
  .ql-editor h3,
  .ql-editor h4,
  .ql-editor h5,
  .ql-editor h6 {
    display: block;
    font-weight: bold;
    margin-top: 0;
    margin-bottom: 0;
    line-height: 1.2;
  }

  .ql-editor h1 { font-size: 2em; margin-top: 0.67em; margin-bottom: 0.67em; }
  .ql-editor h2 { font-size: 1.5em; margin-top: 0.83em; margin-bottom: 0.83em; }
  .ql-editor h3 { font-size: 1.17em; margin-top: 1em; margin-bottom: 1em; }
  .ql-editor h4 { font-size: 1em; margin-top: 1.33em; margin-bottom: 1.33em; }

  .ql-editor p {
    display: block;
    margin-top: 0;
    margin-bottom: 1em;
    line-height: 1.5;
    min-height: 1.5em;
  }

  .ql-editor p:last-child {
    margin-bottom: 0;
  }

  .ql-editor ul {
    display: block;
    list-style-type: disc;
    margin: 1em 0;
    padding-left: 2em;
  }

  .ql-editor ol {
    display: block;
    list-style-type: decimal;
    margin: 1em 0;
    padding-left: 2em;
  }

  .ql-editor li {
    display: list-item;
    line-height: 1.5;
  }

  .ql-editor a {
    color: #06c !important;
    text-decoration: underline !important;
  }

  .ql-editor strong {
    font-weight: bold !important;
  }

  .ql-editor em {
    font-style: italic !important;
  }

  .ql-editor u {
    text-decoration: underline !important;
  }

  .ql-editor s {
    text-decoration: line-through !important;
  }

  .ql-editor blockquote {
    display: block;
    margin: 1em 40px;
    font-style: italic;
    color: #555;
  }

  .ql-editor pre {
    display: block;
    font-family: monospace;
    white-space: pre;
    margin: 1em 0;
    background: #f5f5f5;
    border: 1px solid #ccc !important;
    padding: 0.5em 1em;
    border-radius: 4px;
    overflow-x: auto;
  }

  .ql-editor code {
    font-family: monospace;
    background: #f0f0f0;
    padding: 0.1em 0.3em;
    border-radius: 3px;
    font-size: 0.9em;
    overflow-wrap: break-word;
    word-wrap: break-word;
  }

  .ql-editor img {
    max-width: 100%;
    height: auto;
  }

  .ql-editor table {
    border-collapse: collapse;
    width: 100%;
    margin: 1em 0;
    overflow-x: auto;
    display: block;
  }

  .ql-editor th,
  .ql-editor td {
    border: 1px solid #ccc !important;
    padding: 0.5em 0.75em;
    text-align: left;
  }

  .ql-editor th {
    font-weight: bold;
    background: #f5f5f5;
  }

  .ql-editor.ql-blank::before {
    color: rgba(0,0,0,.4) !important;
    font-style: normal !important;
  }

  .ql-snow .ql-tooltip {
    background: #fff !important;
    border-color: #ccc !important;
    color: #000 !important;
    box-shadow: 0 2px 4px rgba(0,0,0,.2) !important;
  }

  .ql-snow .ql-tooltip input[type=text] {
    border-color: #ccc !important;
    color: #000 !important;
  }

  .ql-snow .ql-tooltip a.ql-action::before,
  .ql-snow .ql-tooltip a.ql-remove::before { color: #06c !important; }

  .ql-snow a { color: #06c !important; }
`;

export default function QuillEditor({ value, onChange, placeholder, error }: QuillEditorProps) {
    const modules = {
        toolbar: {
            container: [
                [{ header: [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ color: [] }, { background: [] }],
                [{ list: 'ordered' }, { list: 'bullet' }],
                [{ align: [] }],
                [{ 'margin-bottom': ['0', '05em', '1em', '15em', '2em', '3em'] }],
                ['link', 'tab', 'clean'],
            ],
            handlers: {
                tab(this: Quill) {
                    const range = this.getSelection();
                    if (range) {
                        this.insertText(range.index, '\t', Quill.sources.USER);
                        this.setSelection(range.index + 1, Quill.sources.SILENT);
                    }
                },
            },
        },
    };

    return (
        <div className="flex flex-col gap-1">
            <style>{quillIsolationStyles}</style>
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                placeholder={placeholder || 'Escribe aquí...'}
            />
            {error && <span className="text-sm text-red-600">{error}</span>}
        </div>
    );
}

declare module "@toast-ui/editor" {
  interface EditorOptions {
    el: HTMLElement;
    previewStyle?: "vertical" | "tab";
    height?: string;
    initialValue?: string;
    initialEditType?: "markdown" | "wysiwyg";
    useCommandShortcut?: boolean;
    language?: string;
    toolbarItems?: any[];
  }

  class Editor {
    constructor(options: EditorOptions);
    getMarkdown(): string;
    getHTML(): string;
    on(event: string, callback: () => void): void;
    destroy(): void;
  }

  export { Editor };
}

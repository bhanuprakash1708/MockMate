import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";

interface CodeEditorWindowProps {
  onChange: (action: string, data: string) => void;
  language: string;
  code: string;
  theme: string;
}

const CodeEditorWindow = ({ onChange, language, code, theme }: CodeEditorWindowProps) => {
  const [value, setValue] = useState(code || "");

  useEffect(() => {
    setValue(code);
  }, [code]);

  const handleEditorChange = (value: string | undefined) => {
    const newValue = value || "";
    setValue(newValue);
    onChange("code", newValue);
  };

  return (
    <div className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl">
      <Editor
        height="85vh"
        width="100%"
        language={language || "javascript"}
        value={value}
        theme={theme}
        onChange={handleEditorChange}
        options={{
          selectOnLineNumbers: true,
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default CodeEditorWindow;

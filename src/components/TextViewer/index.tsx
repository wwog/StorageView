import { FC, useEffect, useState } from "react";
import type { ApplicationProps } from "../../types/application";

export const TextViewer: FC<ApplicationProps> = ({ filePath }) => {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        setError(null);
        const root = await navigator.storage.getDirectory();
        const fileHandle = await root.getFileHandle(filePath, {
          create: false,
        });

        const file = await fileHandle.getFile();
        const text = await file.text();
        setContent(text);
      } catch (err) {
        setError(err instanceof Error ? err.message : "加载文件失败");
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [filePath]);

  if (loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="h-full w-full overflow-auto p-4">
      <pre className="whitespace-pre-wrap font-mono text-sm">{content}</pre>
    </div>
  );
};

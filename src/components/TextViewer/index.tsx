import { FC, useEffect, useState } from "react";
import type { ApplicationProps } from "../../types/application";
import { normalizePath } from "../../utils/opfs/utils";

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
        // 规范化路径，移除开头的斜杠
        const normalizedPath = normalizePath(filePath).replace(/^\//, '');
        console.log('Trying to open file:', normalizedPath);
        const fileHandle = await root.getFileHandle(normalizedPath, {
          create: false,
        });

        const file = await fileHandle.getFile();
        const text = await file.text();
        setContent(text);
      } catch (err) {
        console.error('Error loading file:', err);
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

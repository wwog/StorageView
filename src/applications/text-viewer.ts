import type { Application } from "../types/application";
import { TextViewer } from "../components/TextViewer";

export const textViewerApp: Application = {
  id: "text-viewer",
  name: "文本查看器",
  description: "查看文本文件",
  icon: "📝",
  supportedFileTypes: ["txt", "log", "json", "md", "js", "ts", "tsx", "jsx", "css", "html"],
  component: TextViewer,
}; 
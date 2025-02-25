export interface Application {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  supportedFileTypes: string[];
  component: React.ComponentType<ApplicationProps>;
}

export interface ApplicationProps {
  fileId: string;
  filePath: string;
  fileName: string;
  fileType: string;
}

export interface ApplicationInstance {
  id: string;
  applicationId: string;
  fileId: string;
  filePath: string;
  fileName: string;
  fileType: string;
  active: boolean;
} 
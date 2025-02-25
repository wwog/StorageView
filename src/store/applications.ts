import { atom, useAtom } from "jotai";
import type { Application, ApplicationInstance } from "../types/application";

// 存储所有可用的应用
const applicationsAtom = atom<Application[]>([]);

// 存储当前打开的应用实例
const applicationInstancesAtom = atom<ApplicationInstance[]>([]);

// 存储当前活跃的应用实例ID
const activeApplicationInstanceAtom = atom<string | null>(null);

export const useApplications = () => {
  return useAtom(applicationsAtom);
};

export const useApplicationInstances = () => {
  return useAtom(applicationInstancesAtom);
};

export const useActiveApplicationInstance = () => {
  return useAtom(activeApplicationInstanceAtom);
};

// 应用管理类
export class ApplicationManager {
  private static instance: ApplicationManager;
  private applications: Application[] = [];

  private constructor() {}

  static getInstance(): ApplicationManager {
    if (!ApplicationManager.instance) {
      ApplicationManager.instance = new ApplicationManager();
    }
    return ApplicationManager.instance;
  }

  // 注册新应用
  registerApplication(application: Application) {
    if (!this.applications.find(app => app.id === application.id)) {
      this.applications.push(application);
    }
  }

  // 获取所有注册的应用
  getApplications(): Application[] {
    return this.applications;
  }

  // 根据文件类型获取支持的应用
  getApplicationsByFileType(fileType: string): Application[] {
    return this.applications.filter(app => 
      app.supportedFileTypes.includes(fileType)
    );
  }
} 
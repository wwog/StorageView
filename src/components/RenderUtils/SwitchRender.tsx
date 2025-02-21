import { FC, ReactNode, Children, isValidElement } from "react";

interface SwitchRenderProps<T> {
  children?: ReactNode;
  value: T; // 用泛型约束匹配值的类型
}

interface SwitchRenderCaseProps<T> {
  children?: ReactNode;
  value: T; // Case 的值类型必须与容器的值类型一致
}

interface SwitchRenderDefaultProps {
  children?: ReactNode;
}

// 使用泛型定义组件
export const SwitchRender = <T,>({ children, value }: SwitchRenderProps<T>) => {
  let matched = false;
  let defaultCase: ReactNode = null;

  const result = Children.map(children, (child) => {
    if (!isValidElement(child)) return null;

    if (child.type === SwitchRenderDefault) {
      defaultCase = child;
      return null;
    }

    if (child.type === SwitchRenderCase) {
      if (!matched && child.props.value === value) {
        matched = true;
        return child;
      }
    }
    return null;
  });

  if (!matched && defaultCase) {
    return defaultCase;
  }

  return result?.find(Boolean) || null;
};


 const SwitchRenderCase = <T,>({
  children,
}: SwitchRenderCaseProps<T>) => {
  return <>{children}</>;
};

 const SwitchRenderDefault: FC<SwitchRenderDefaultProps> = ({
  children,
}) => {
  return <>{children}</>;
};

SwitchRender.Case = SwitchRenderCase;
SwitchRender.Default = SwitchRenderDefault;

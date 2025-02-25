import { useLayoutEffect, useRef, type CSSProperties, type FC } from "react";
import { getTextWidth } from "../OpfsBrowser/utils";

export interface TruncateProps {
  children: string;
  style?: CSSProperties;
  ellipsis?: string;
  /**
   * 右边最少显示的字符数
   * @default 5
   */
  suffixMinLength?: number;
}
//#region component
interface TruncateRenderOptions {
  node: HTMLElement;
  text: string;
  ellipsis?: string;
  suffixMinLength?: number;
}
const render = (options: TruncateRenderOptions) => {
  const { node, text, ellipsis = "...", suffixMinLength = 5 } = options;
  const style = window.getComputedStyle(node);
  const width = parseFloat(style.width);
  console.log("fix::node-width", width);
  const fontSize = parseFloat(style.fontSize);
  const textWidth = getTextWidth(text, style.font);

  if (textWidth > width) {
    // 求出右边最少显示的字符宽度
    const suffix = text.slice(-suffixMinLength);
    const suffixWidth = getTextWidth(suffix, style.font);
    const ellipsisWidth = getTextWidth(ellipsis, style.font);
    const ellipsisSuffixWidth = ellipsisWidth + suffixWidth;
    const availableWidth = width - ellipsisSuffixWidth;

    //先进行猜测
    const guessPrefixLength = Math.floor(availableWidth / fontSize);

    // 进行二分查找
    let left = guessPrefixLength;
    let right = text.length;
    let mid = 0;
    while (left < right) {
      mid = Math.floor((left + right) / 2);
      const midText = text.slice(0, mid);
      const midWidth = getTextWidth(midText, style.font);
      if (midWidth > availableWidth) {
        right = mid;
      } else {
        left = mid + 1;
      }
    }

    // 确保不会出现前后重复的情况
    const result =
      text.slice(0, mid - 1).trimEnd() + ellipsis + suffix.trimStart();
    node.innerText = result;
  } else {
    node.innerText = text;
  }
};
/**
 * 用于将文字进行截断，中间部分用省略号代替
 * @param props
 * @returns
 */
export const Truncate: FC<TruncateProps> = (props) => {
  const { children, ellipsis, suffixMinLength, style } = props;
  const nodeRef = useRef<HTMLDivElement>(null);

  //代码限制children必须是字符串
  if (typeof children !== "string") {
    throw new Error("children must be string");
  }

  useLayoutEffect(() => {
    const node = nodeRef.current;
    if (!node) return;

    const resizeObserver = new ResizeObserver(() => {
      render({
        node,
        text: children,
        ellipsis,
        suffixMinLength,
      });
    });

    resizeObserver.observe(node);

    render({
      node,
      text: children,
      ellipsis,
      suffixMinLength,
    });

    return () => {
      resizeObserver.disconnect();
    };
  }, [children, suffixMinLength, ellipsis]);

  return <div ref={nodeRef} style={style}></div>;
};
//#endregion component

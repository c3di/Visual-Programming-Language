export interface WidgetProps {
  value: any;
  className?: string;
  onChange?: (value: any) => void;
  onBlur?: (htmlElement: HTMLElement) => void;
  onEnterKeyDown?: (element: HTMLElement | EventTarget) => void;
  options?: any;
}

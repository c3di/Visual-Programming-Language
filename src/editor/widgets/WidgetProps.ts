export interface WidgetProps {
  value: any;
  className?: string;
  onChange: (value: any) => void;
  onBlur?: (value: any) => void;
  onKeyDown?: (value: any) => void;
  options?: any;
}

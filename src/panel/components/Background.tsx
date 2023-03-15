import React from 'react';
import { Background as RfBackground, BackgroundVariant } from 'reactflow';

interface BackgroundProps {
  type: string;
  gap: number | [number, number];
  dotSize: number;
  crossSize: number;
  lineWidth: number;
  color: string;
  className: string | undefined;
}

export default function Background({
  type = BackgroundVariant.Dots,
  gap = 16,
  dotSize = 1,
  crossSize = 6,
  lineWidth = 1,
  color = '#8188a',
  className = undefined,
}: BackgroundProps): JSX.Element {
  const size = type === BackgroundVariant.Cross ? crossSize : dotSize;
  let element = <div />;
  if (type !== 'none')
    element = (
      <RfBackground
        variant={type as BackgroundVariant}
        gap={gap}
        size={size}
        lineWidth={lineWidth}
        color={color}
        className={className}
      />
    );

  return element;
}

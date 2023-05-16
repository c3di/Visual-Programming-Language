import React, { memo, useState } from 'react';
import './CommentNode.css';
import { type Comment } from '../../types';
import {
  NodeResizer,
  type ResizeDragEvent,
  type ResizeParamsWithDirection,
} from '@reactflow/node-resizer';
import '@reactflow/node-resizer/dist/style.css';
import { InPlaceTextArea } from '../../widgets';

function CommentNode({ data }: { data: Comment }): JSX.Element {
  const [commentWidth, setCommentWidth] = useState<number>(data.width ?? 250);
  const [commentHeight, setCommentHeight] = useState<number>(
    data.height ?? 150
  );
  return (
    <div
      title={data.tooltip}
      style={{ width: commentWidth, height: commentHeight }}
    >
      <NodeResizer
        color="#ffffff00"
        handleStyle={{ border: 'none' }}
        minWidth={200}
        minHeight={100}
        onResize={(
          event: ResizeDragEvent,
          params: ResizeParamsWithDirection
        ) => {
          setCommentWidth(params.width);
          setCommentHeight(params.height);
        }}
      />
      <div className="node__header" style={{ paddingBottom: '0px' }}>
        <InPlaceTextArea text={data.comment} />
      </div>
      <div className="node__body"></div>
      <div></div>
    </div>
  );
}

export default memo(CommentNode);

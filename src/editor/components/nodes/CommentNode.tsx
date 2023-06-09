import React, { memo, useCallback, useState } from 'react';
import { type Comment } from '../../types';
import {
  NodeResizer,
  type ResizeDragEvent,
  type ResizeParamsWithDirection,
} from '@reactflow/node-resizer';
import '@reactflow/node-resizer/dist/style.css';
import { InplaceInput } from '../../widgets';

function CommentNode({ data }: { data: Comment }): JSX.Element {
  const [commentWidth, setCommentWidth] = useState<number>(data.width ?? 250);
  const [commentHeight, setCommentHeight] = useState<number>(
    data.height ?? 150
  );
  const [enableDrag, setEnableDrag] = useState<boolean>(false);
  const [comment, setComment] = useState<string>(data.comment);
  const onStartEdit = useCallback(() => {
    setEnableDrag(false);
  }, []);
  const onStopEdit = useCallback(() => {
    setEnableDrag(true);
  }, []);
  const onEditChange = useCallback((text: string) => {
    setComment(text);
    data.comment = text;
  }, []);
  return (
    <div
      title={comment}
      className="vp-node-container"
      style={{
        width: commentWidth,
        height: commentHeight,
        overflow: 'auto',
        backgroundColor: 'var(--vp-node-background-color-lightgrey) !important',
      }}
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
      <div
        style={{
          padding: '4px',
          fontFamily: 'var(--vp-node-font-family)',
          fontSize: 'var( --vp-node-font-size1)',
          color: '#fff !important',
        }}
        className={
          enableDrag
            ? 'node__header node__header--enabled'
            : 'node__header node__header--disabled'
        }
      >
        <InplaceInput
          text={data.comment}
          onStartEdit={onStartEdit}
          onStopEdit={onStopEdit}
          onEditChange={onEditChange}
        />
      </div>
    </div>
  );
}

export default memo(CommentNode);

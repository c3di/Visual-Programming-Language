import React, { memo, useCallback, useState } from 'react';
import './StickyNoteNode.css';
import type StickyNote from '../../types/StickyNote';

import {
  NodeResizer,
  type ResizeDragEvent,
  type ResizeParamsWithDirection,
} from '@reactflow/node-resizer';
import '@reactflow/node-resizer/dist/style.css';
import { InPlaceTextArea } from '../../widgets';

function StickyNoteNode({ data }: { data: StickyNote }): JSX.Element {
  const [commentWidth, setCommentWidth] = useState<number>(data.width ?? 250);
  const [commentHeight, setCommentHeight] = useState<number>(
    data.height ?? 150
  );
  const [enableDrag, setEnableDrag] = useState<boolean>(false);
  const [comment, setComment] = useState<string>(data.stickyNote);
  const onStartEdit = useCallback(() => {
    setEnableDrag(false);
  }, []);
  const onStopEdit = useCallback(() => {
    setEnableDrag(true);
  }, []);
  const onEditChange = useCallback((text: string) => {
    setComment(text);
    data.stickyNote = text;
  }, []);
  return (
    <div
      title={comment}
      style={{ width: commentWidth, height: commentHeight, overflow: 'auto' }}
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
        className={
          enableDrag
            ? 'node__header node__header--enabled'
            : 'node__header node__header--disabled'
        }
      >
        <InPlaceTextArea
          text={data.stickyNote}
          onStartEdit={onStartEdit}
          onStopEdit={onStopEdit}
          onEditChange={onEditChange}
        />{' '}
      </div>
      <div className="node__body"></div>
      <div></div>
    </div>
  );
}

export default memo(StickyNoteNode);

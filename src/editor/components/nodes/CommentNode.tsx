import React, { memo, useCallback, useRef, useState } from 'react';
import './CommentNode.css';
import { type Comment } from '../../types';
import { useSceneState } from '../../Context';
import {
  NodeResizer,
  type ResizeDragEvent,
  type ResizeParamsWithDirection,
} from '@reactflow/node-resizer';
import '@reactflow/node-resizer/dist/style.css';
import { InplaceInput } from '../../widgets';
import ResizeIcon from './ResizeIcon';

function CommentNode({ id, data }: { id: string; data: Comment }): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  const [commentWidth, setCommentWidth] = useState<number>();
  const [commentHeight, setCommentHeight] = useState<number>();
  const [enableDrag, setEnableDrag] = useState<boolean>(false);
  const [comment, setComment] = useState<string>(data.comment);
  const { setNodes, sortZIndexOfComments } =
    useSceneState()?.sceneActions ?? {};
  const onStartEdit = useCallback(() => {
    setEnableDrag(false);
  }, []);
  const onStopEdit = useCallback(() => {
    setEnableDrag(true);
    if (data.defaultEditable) {
      setNodes?.((nds) => {
        const nodes = nds.map((n) => {
          if (n.id === id) {
            n.data = {
              ...n.data,
              defaultEditable: false,
            };
          }
          return n;
        });
        return nodes;
      });
    }
  }, []);

  const onEditChange = useCallback((text: string) => {
    setComment(text);
    data.comment = text;
  }, []);

  if (data.width !== commentWidth || data.height !== commentHeight) {
    const w = data.width ?? 250;
    const h = data.height ?? 150;
    setCommentWidth(w);
    setCommentHeight(h);
    const parent = ref.current?.parentElement;
    parent?.style.setProperty('width', String(w) + 'px');
    parent?.style.setProperty('height', String(h) + 'px');
  }

  return (
    <div
      ref={ref}
      title={comment}
      className="vp-node-container"
      style={{ width: commentWidth, height: commentHeight, overflow: 'auto' }}
    >
      <ResizeIcon />
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
          setNodes?.((nds) => {
            const nodes = nds.map((n) => {
              if (n.id === id) {
                n.data = {
                  ...n.data,
                  width: params.width,
                  height: params.height,
                };
              }
              return n;
            });
            return sortZIndexOfComments?.(nodes) ?? nodes;
          });
        }}
      />
      <div
        style={{ padding: '4px' }}
        className={
          enableDrag
            ? 'node__header node__header--enabled'
            : 'node__header node__header--disabled'
        }
      >
        <InplaceInput
          text={data.comment}
          defaultEditable={data.defaultEditable}
          onStartEdit={onStartEdit}
          onStopEdit={onStopEdit}
          onEditChange={onEditChange}
        />{' '}
      </div>
    </div>
  );
}

export default memo(CommentNode);

import React, { memo, useCallback, useState } from 'react';
import './StickyNoteNode.css';
import type StickyNote from '../../types/StickyNote';
import { BsPinAngleFill, BsPinAngle } from 'react-icons/bs';
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
    data.height ?? 200
  );
  const [enableDrag, setEnableDrag] = useState<boolean>(false);
  const [comment, setComment] = useState<string>(data.stickyNote);
  const [nodeBg, setNodeBg] = useState<string>('#eee');
  const [pinned, setPinned] = useState<boolean>(false);

  const onStartEdit = useCallback(() => {
    setEnableDrag(false);
  }, [enableDrag]);
  const onStopEdit = useCallback(() => {
    pinned ? setEnableDrag(false) : setEnableDrag(true);
  }, [enableDrag]);

  const onEditChange = useCallback((text: string) => {
    setComment(text);
    data.stickyNote = text;
  }, []);

  const handlePinClick = useCallback(() => {
    setPinned(!pinned);
    pinned ? setEnableDrag(true) : setEnableDrag(false);
  }, [pinned]);

  return (
    <div style={{ backgroundColor: nodeBg }}>
      <div className="button-group">
        <input
          className="button-group__button color-picker-button"
          type="color"
          value={nodeBg}
          onChange={(evt) => {
            setNodeBg(evt.target.value);
          }}
        ></input>

        <button
          className="button-group__button pin-button"
          onClick={handlePinClick}
        >
          {pinned ? <BsPinAngleFill /> : <BsPinAngle />}
        </button>
      </div>
      <div
        title={comment}
        style={{
          width: commentWidth,
          height: commentHeight,
          overflow: 'auto',
        }}
      >
        <NodeResizer
          color="#ffffff00"
          handleStyle={{ border: 'none' }}
          minWidth={150}
          minHeight={150}
          onResize={(
            event: ResizeDragEvent,
            params: ResizeParamsWithDirection
          ) => {
            setCommentWidth(params.width);
            const buttonGroup = document.getElementsByClassName(
              'button-group__button'
            );
            const buttonGroupHeight = buttonGroup[0].clientHeight;
            const borderWidth = 7;
            const modHeight = params.height - buttonGroupHeight - borderWidth;
            setCommentHeight(modHeight);
          }}
        />

        <div
          className={
            enableDrag
              ? 'stickyNote__node__body stickyNote__node__body--enabled'
              : 'stickyNote__node__body stickyNote__node__body--disabled'
          }
        >
          <InPlaceTextArea
            initialRow={7}
            text={data.stickyNote}
            onStartEdit={onStartEdit}
            onStopEdit={onStopEdit}
            onEditChange={onEditChange}
          />
        </div>
      </div>
    </div>
  );
}

export default memo(StickyNoteNode);

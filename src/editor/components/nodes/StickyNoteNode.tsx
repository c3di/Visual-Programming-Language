import React, { memo, useCallback, useState, useRef } from 'react';
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
  const buttonRef = useRef(null);

  const [nodeBg, setNodeBg] = useState('#eee');
  const [pinned, setPinned] = useState(false);

  return (
    <div style={{ backgroundColor: nodeBg }}>
      <div className="button-group">
        <div>
          <input
            ref={buttonRef}
            className="button-group__button color-picker-button"
            type="color"
            value={nodeBg}
            onChange={(evt) => {
              setNodeBg(evt.target.value);
            }}
            style={{
              float: 'right',
              width: '18px',
              height: '18px',
              marginTop: '4px',
              marginRight: '4px',
            }}
          ></input>
        </div>
        <button
          className="button-group__button pin-button"
          style={{
            float: 'right',
            border: 'none',
            backgroundColor: 'transparent',
            width: '30px',
            height: '30px',
            marginRight: '-5px',
            marginBottom: '-5px',
          }}
          onClick={() => {
            console.log('lock');
            setPinned(!pinned);
            setEnableDrag(!enableDrag);
            console.log('pinned: ', pinned);
            console.log('enableDrag: ', enableDrag);
          }}
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
            const borderWidth = 8;
            const modHeight = params.height - buttonGroupHeight - borderWidth;
            setCommentHeight(modHeight);
          }}
        />

        <div
          className={
            enableDrag
              ? ' node__body stickyNote__node__body--enabled'
              : ' node__body stickyNote__node__body--disabled'
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

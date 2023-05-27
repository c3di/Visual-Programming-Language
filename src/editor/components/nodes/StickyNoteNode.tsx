import React, { memo, useCallback, useState } from 'react';
import { BsPinAngleFill, BsPinAngle } from 'react-icons/bs';
import {
  NodeResizer,
  type ResizeDragEvent,
  type ResizeParamsWithDirection,
} from '@reactflow/node-resizer';
import '@reactflow/node-resizer/dist/style.css';
import { type StickyNote } from '../../types';
import { InPlaceTextArea } from '../../widgets';
import './StickyNoteNode.css';
import { Button, Toolbar } from '@mui/material';

function StickyNoteNode({ data }: { data: StickyNote }): JSX.Element {
  const [width, setWidth] = useState<number>(data.width ?? 250);
  const [height, setHeight] = useState<number>(data.height ?? 200);
  const [content, setContent] = useState<string>(data.stickyNote);
  const [nodeBg, setNodeBg] = useState<string>('#e06767');
  const [pinned, setPinned] = useState<boolean>(false);
  const [dragged, setDragged] = useState<boolean>(false);

  const onStartEdit = useCallback(() => {
    setDragged(false);
  }, []);

  const onStopEdit = useCallback(() => {
    pinned ? setDragged(false) : setDragged(true);
  }, [pinned]);

  const onEditChange = useCallback((text: string) => {
    setContent(text);
    data.stickyNote = text;
  }, []);

  const handlePinClick = useCallback(() => {
    setPinned(!pinned);
    setDragged(pinned);
  }, [pinned]);

  return (
    <div className="vp-node-containter">
      <div
        className={
          dragged
            ? 'stickyNote__node__body stickyNote__node__body--enabled'
            : 'stickyNote__node__body stickyNote__node__body--disabled'
        }
        style={{ width, height }}
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
            setWidth(params.width);
            setHeight(params.height);
          }}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
          }}
        >
          <Toolbar
            sx={{
              minHeight: '10px!important',
              paddingRight: '3px!important',
              justifyContent: 'flex-end',
              paddingTop: '2px',
              paddingBottom: '2px',
              borderBottom: '1px solid black',
            }}
          >
            <Button
              onClick={handlePinClick}
              disableRipple={true}
              sx={{
                padding: 0,
                minWidth: '10px',
                width: '14px',
                height: '14px',
                color: 'black',
              }}
            >
              {pinned ? (
                <BsPinAngleFill title="The node is pinned" />
              ) : (
                <BsPinAngle title="The node is not pinned" />
              )}
            </Button>{' '}
            <Button
              disableRipple={true}
              sx={{
                padding: 0,
                minWidth: '10px',
                width: '12px',
                height: '12px',
                borderRadius: '1.5px',
                border: '1.5px solid black',
                marginLeft: '5px',
              }}
              title="Color Picker"
            >
              <input
                type="color"
                style={{
                  border: 0,
                  padding: 0,
                  width: '100%',
                  height: '100%',
                }}
                value={nodeBg}
                onChange={(evt) => {
                  setNodeBg(evt.target.value);
                }}
              ></input>
            </Button>
          </Toolbar>

          <div
            title={content}
            style={{
              width: '100%',
              flexGrow: 1,
              overflow: 'auto',
              backgroundColor: nodeBg,
            }}
          >
            <div
              style={{
                height: '100%',
              }}
            >
              <InPlaceTextArea
                text={data.stickyNote}
                onStartEdit={onStartEdit}
                onStopEdit={onStopEdit}
                onEditChange={onEditChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(StickyNoteNode);

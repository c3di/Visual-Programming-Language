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
import { useSceneState } from '../../Context';
import ResizeIcon from './ResizeIcon';

function StickyNoteNode({
  id,
  data,
}: {
  id: string;
  data: StickyNote;
}): JSX.Element {
  const [width, setWidth] = useState<number>(data.width ?? 150);
  const [height, setHeight] = useState<number>(data.height ?? 150);
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

  const { setNodes } = useSceneState()?.sceneActions ?? {};
  return (
    <div className="vp-node-container stickyNote__node-container">
      <div
        className={
          dragged
            ? 'stickyNote__node__body stickyNote__node__body--enabled'
            : 'stickyNote__node__body stickyNote__node__body--disabled'
        }
        style={{
          width,
          height,
          minHeight: '100%',
          minWidth: '100%',
          border: 'none',
        }}
      >
        <ResizeIcon />
        <NodeResizer
          color="#ffffff00"
          handleStyle={{ border: 'none' }}
          minWidth={152}
          minHeight={150}
          onResize={(
            event: ResizeDragEvent,
            params: ResizeParamsWithDirection
          ) => {
            const w = params.width - 6;
            const h = params.height - 2;
            setWidth(w);
            setHeight(h);
            setNodes?.((nds) =>
              nds.map((n) => {
                if (n.id === id) {
                  n.data = {
                    ...n.data,
                    width: w,
                    height: h,
                  };
                }
                return n;
              })
            );
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
              height: 'auto',
            }}
          >
            <Button
              onClick={handlePinClick}
              disableRipple={true}
              sx={{
                padding: 0,
                minWidth: '10px',
                width: 'auto',
                height: 'auto',
                color: 'var(--vp-node-icon-color-black)',
              }}
            >
              {pinned ? (
                <BsPinAngleFill
                  title="The node is pinned"
                  style={{
                    width:
                      'calc(var(--vp-node-icon-size) / var(--vp-ui-font-scale-factor1))',
                    height:
                      'calc(var(--vp-node-icon-size) / var(--vp-ui-font-scale-factor1))',
                  }}
                />
              ) : (
                <BsPinAngle
                  title="The node is not pinned"
                  style={{
                    width:
                      'calc(var(--vp-node-icon-size) / var(--vp-ui-font-scale-factor1))',
                    height:
                      'calc(var(--vp-node-icon-size) / var(--vp-ui-font-scale-factor1))',
                  }}
                />
              )}
            </Button>
            <Button
              disableRipple={true}
              sx={{
                padding: 0,
                minWidth: '10px',
                width: 'auto',
                height: 'auto',
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
                  width:
                    'calc(var(--vp-node-icon-size) / var(--vp-ui-font-scale-factor2))',
                  height:
                    'calc(var(--vp-node-icon-size) / var(--vp-ui-font-scale-factor2))',
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
              borderBottomLeftRadius: 'var(--vp-node-border-radius)',
              borderBottomRightRadius: 'var(--vp-node-border-radius)',
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

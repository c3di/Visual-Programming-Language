import React, { memo } from 'react';
import './CommentNode.css';
import { type Comment } from '../../types';
import { NodeResizer } from '@reactflow/node-resizer';
import '@reactflow/node-resizer/dist/style.css';

function CommentNode({ data }: { data: Comment }): JSX.Element {
  return (
    <div title={data.tooltip}>
      <NodeResizer
        color="#ffffff00"
        handleStyle={{ border: 'none' }}
        minWidth={20}
        minHeight={10}
      />
      <div className="comment-node__header">
        This is a <strong>comment node</strong>
      </div>
      <div className="comment-node__body"></div>
    </div>
  );
}

export default memo(CommentNode);

import React, { memo } from 'react';
import './CommentNode.css';
import { type Comment } from '../../types';

function CommentNode({ data }: { data: Comment }): JSX.Element {
  return (
    <div title={data.tooltip}>
      <div className="comment-node__header">
        This is a <strong>comment node</strong>
      </div>
      <div className="comment-node__body"></div>
    </div>
  );
}

export default memo(CommentNode);

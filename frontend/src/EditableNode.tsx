import { useState, useCallback } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';

interface EditableNodeData {
  label: string;
  onTextChange?: (id: string, text: string) => void;
}

export default function EditableNode({ data, id }: NodeProps) {
  const nodeData = data as unknown as EditableNodeData;
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(nodeData.label || '');

  const handleDoubleClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setIsEditing(false);
    nodeData.onTextChange?.(id, text);
  }, [id, text, nodeData]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setText(nodeData.label || '');
    }
  }, [handleSubmit, nodeData.label]);

  return (
    <div
      onDoubleClick={handleDoubleClick}
      style={{
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        background: 'white',
        minWidth: '150px',
        cursor: isEditing ? 'text' : 'pointer',
      }}
    >
      {isEditing ? (
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSubmit}
            autoFocus
            style={{
              border: 'none',
              outline: 'none',
              width: '100%',
              background: 'transparent',
            }}
          />
        </form>
      ) : (
        <div>{text || 'Double-click to edit'}</div>
      )}
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
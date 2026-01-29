import { Handle, Position, type NodeProps } from '@xyflow/react';

interface OutputNodeData {
  label: string;
}

export default function ScrollableOutputNode({ data }: NodeProps) {
  const nodeData = data as unknown as OutputNodeData;
  return (
    <div
      style={{
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '5px',
        background: 'white',
        width: '300px',
        height: '200px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          fontSize: '12px',
          fontWeight: 'bold',
          marginBottom: '8px',
          color: '#666',
        }}
      >
        AI Response
      </div>
      <div
        style={{
          height: '160px',
          overflow: 'auto',
          padding: '8px',
          border: '1px solid #eee',
          borderRadius: '3px',
          fontSize: '14px',
          lineHeight: '1.4',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
        }}
      >
        {nodeData.label || 'Response will appear here...'}
      </div>
      <Handle type="target" position={Position.Left} />
    </div>
  );
}
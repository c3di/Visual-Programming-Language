import { Handle, Position, NodeProps } from 'reactflow';
import { HandleData } from '../types';

export interface NodeParameter {
    name: string;
    type: 'number' | 'text' | 'select' | 'boolean';
    defaultValue: any;
}

export interface NodeData {
    id: string;
    name: string;
    type: string;
    parameters: NodeParameter[];
    outputs: Record<string, HandleData>;
    inputs: Record<string, HandleData>;
}

interface CustomNodeProps extends NodeProps {
    data: NodeData;
}

function CustomNode({ data, isConnectable }: CustomNodeProps) {
    return (
        <div className="custom-node">
            <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
            {data.parameters.map((param, index: number) => (
                <div key={index}>{param.name}: {param.defaultValue}</div>
            ))}
            <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
        </div>
    );
}

export function InputNode(props: CustomNodeProps) {
    return <CustomNode {...props} />;
}

export function EffectNode(props: CustomNodeProps) {
    return <CustomNode {...props} />;
}

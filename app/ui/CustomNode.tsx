import { CustomNodeElementProps } from 'react-d3-tree';

export default function CustomNode({ nodeDatum }: CustomNodeElementProps) {
  const flag = nodeDatum.attributes?.flag;

  if (nodeDatum.name === '') {
    return (
      <g>
        <circle r={0} fill="lightgray" stroke="gray" strokeDasharray="4" />
        <text fill="gray" strokeWidth="0" x="20"></text>
      </g>
    );
  }
  return (
    <g>
      <circle r={40} fill="steelblue" />
      <text fill="black" strokeWidth="0.5" x="50" y="2.5" fontSize={'18px'}>
        {nodeDatum.name}
      </text>
      <text fill="grey" strokeWidth="0.5" x="50" y="25" fontSize={'18px'}>
        {nodeDatum.attributes?.tempStr}
      </text>
      {typeof flag === 'string' && flag !== '' && (
        <image
          href={flag}
          x={-20}
          y={-20}
          width={40}
          height={40}
          clipPath="circle(20px at center)"
        />
      )}
    </g>
  );
}

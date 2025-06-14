
import React from 'react';

interface ToolsHeaderProps {
  title: string;
}

export const ToolsHeader = ({ title }: ToolsHeaderProps) => {
  return (
    <div className="pb-2">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
    </div>
  );
};


import React from 'react';

interface PasswordStrengthIndicatorProps {
  password: string;
}

const PasswordStrengthIndicator = ({ password }: PasswordStrengthIndicatorProps) => {
  const getPasswordStrength = () => {
    if (password.length === 0) return '';
    if (password.length < 6) return 'weak';
    if (password.length < 8 || !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) return 'medium';
    return 'strong';
  };

  const strength = getPasswordStrength();

  if (!strength) return null;

  return (
    <div className="flex items-center space-x-2 mt-2">
      <div className="flex space-x-1">
        <div className={`h-1 w-8 rounded ${strength === 'weak' ? 'bg-red-500' : strength === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
        <div className={`h-1 w-8 rounded ${strength === 'medium' || strength === 'strong' ? strength === 'medium' ? 'bg-yellow-500' : 'bg-green-500' : 'bg-gray-200'}`}></div>
        <div className={`h-1 w-8 rounded ${strength === 'strong' ? 'bg-green-500' : 'bg-gray-200'}`}></div>
      </div>
      <span className={`text-xs ${strength === 'weak' ? 'text-red-500' : strength === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>
        {strength === 'weak' ? 'Weak' : strength === 'medium' ? 'Medium' : 'Strong'}
      </span>
    </div>
  );
};

export default PasswordStrengthIndicator;

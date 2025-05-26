
import React from 'react';
import { Link } from 'react-router-dom';

const LoginFooter = () => {
  return (
    <div className="text-center text-sm text-gray-600">
      Don't have an account?{' '}
      <Link
        to="/register"
        className="text-blue-600 hover:text-blue-800 transition-colors font-medium"
      >
        Sign up here
      </Link>
    </div>
  );
};

export default LoginFooter;

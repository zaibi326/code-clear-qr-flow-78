
import React from 'react';
import AuthLayout from '@/components/auth/AuthLayout';
import RegistrationForm from '@/components/auth/RegistrationForm';

const Register = () => {
  return (
    <AuthLayout
      title="Create your account"
      description="Join thousands of businesses using ClearQR.io"
    >
      <RegistrationForm />
    </AuthLayout>
  );
};

export default Register;

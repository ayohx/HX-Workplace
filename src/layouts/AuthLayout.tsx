import React, { ReactNode } from 'react';
import { CompanyLogo } from '../components/common/CompanyLogo';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <CompanyLogo className="h-12 mx-auto mb-4" />
          <h1 className="text-2xl font-display font-bold text-white">
            Holiday Extras Workplace
          </h1>
          <p className="text-primary-100 mt-2">
            Connect, collaborate, and communicate with your team
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
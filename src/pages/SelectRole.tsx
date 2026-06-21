import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BrandLogo from '../components/BrandLogo';
import Footer from '../components/Footer';
import PageLayout from '../components/PageLayout';
import FormContainer from '../components/FormContainer';
import LoadingButton from '../components/LoadingButton';
import { ROLE_DASHBOARD_PATHS } from '../constants/roles';

interface Membership {
  id: number;
  tenantId: number;
  membershipRoles: Array<{
    role: {
      roleName: string;
    };
  }>;
}

export default function SelectRole() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get memberships from localStorage
  const membershipsJson = localStorage.getItem('userMemberships');
  const selectedTenantId = localStorage.getItem('selectedTenantId');
  
  let memberships: Membership[] = [];
  if (membershipsJson) {
    try {
      memberships = JSON.parse(membershipsJson);
    } catch (e) {
      console.error('Failed to parse memberships:', e);
    }
  }

  // Filter memberships by selected tenant
  const tenantMemberships = selectedTenantId 
    ? memberships.filter(m => m.tenantId === parseInt(selectedTenantId))
    : memberships;

  // Get unique roles from memberships
  const rolesSet = new Set<string>();
  tenantMemberships.forEach((membership: Membership) => {
    membership.membershipRoles.forEach((mr) => {
      if (mr.role?.roleName) {
        rolesSet.add(mr.role.roleName);
      }
    });
  });

  const roles = Array.from(rolesSet);

  const handleSelectRole = (role: string) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (!selectedRole) return;
    
    setIsLoading(true);
    // Store selected role in localStorage
    localStorage.setItem('selectedRole', selectedRole);
    
    // Navigate to dashboard based on role
    const redirectPath = ROLE_DASHBOARD_PATHS[selectedRole] || '/student/dashboard';
    console.log('🚀 Redirecting to:', redirectPath);
    navigate(redirectPath);
  };

  const handleBack = () => {
    navigate('/select-tenant');
  };

  if (!selectedTenantId) {
    return (
      <PageLayout>
        <BrandLogo subtitle="Select your role" />
        <FormContainer>
          <div className="text-center py-8">
            <p className="text-gray-600">Please select an organization first</p>
            <button
              onClick={handleBack}
              className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
            >
              Go to Organization Selection
            </button>
          </div>
        </FormContainer>
        <Footer />
      </PageLayout>
    );
  }

  if (roles.length === 0) {
    return (
      <PageLayout>
        <BrandLogo subtitle="Select your role" />
        <FormContainer>
          <div className="text-center py-8">
            <p className="text-gray-600">No roles found for this organization</p>
            <p className="text-sm text-gray-500 mt-2">Contact administrator to assign you a role</p>
            <button
              onClick={handleBack}
              className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
            >
              Back to Organization Selection
            </button>
          </div>
        </FormContainer>
        <Footer />
      </PageLayout>
    );
  }

  if (roles.length === 1) {
    // Auto-select if only one role
    const singleRole = roles[0];
    localStorage.setItem('selectedRole', singleRole);
    const redirectPath = ROLE_DASHBOARD_PATHS[singleRole] || '/student/dashboard';
    navigate(redirectPath);
    return null;
  }

  const formatRoleLabel = (role: string) => {
    return role.charAt(0) + role.slice(1).toLowerCase();
  };

  return (
    <PageLayout>
      <BrandLogo subtitle="Select your role" />

      <FormContainer>
        <div className="space-y-4">
          <p className="text-sm text-gray-600 text-center">
            You have multiple roles. Please select one to continue.
          </p>

          {roles.map((role) => (
            <button
              key={role}
              onClick={() => handleSelectRole(role)}
              className={`w-full p-4 border-2 rounded-lg text-left transition-all duration-200 ${
                selectedRole === role
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-300 hover:border-purple-300'
              }`}
            >
              <div className="font-medium text-gray-900">{formatRoleLabel(role)}</div>
              <div className="text-sm text-gray-500">{role}</div>
            </button>
          ))}

          <LoadingButton
            loading={isLoading}
            onClick={handleContinue}
            disabled={!selectedRole}
            className="w-full"
          >
            Continue
          </LoadingButton>

          <button
            onClick={handleBack}
            className="w-full text-sm text-gray-600 hover:text-gray-900 py-2"
          >
            Back to Organization Selection
          </button>
        </div>
      </FormContainer>

      <Footer />
    </PageLayout>
  );
}

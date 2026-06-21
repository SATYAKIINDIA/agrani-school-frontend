import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BrandLogo from '../components/BrandLogo';
import Footer from '../components/Footer';
import PageLayout from '../components/PageLayout';
import FormContainer from '../components/FormContainer';
import LoadingButton from '../components/LoadingButton';

interface Membership {
  id: number;
  tenantId: number;
  tenant: {
    id: number;
    name: string;
    code: string;
  };
  membershipRoles: Array<{
    role: {
      roleName: string;
    };
  }>;
  isActive: boolean;
  effectiveFrom: string;
  effectiveTo: string | null;
}

export default function SelectTenant() {
  const { user, memberships } = useAuth();
  const navigate = useNavigate();
  const [selectedTenant, setSelectedTenant] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Group memberships by tenant
  const tenantsMap = new Map<number, { name: string; code: string; memberships: Membership[] }>();
  
  if (memberships) {
    memberships.forEach((membership: Membership) => {
      const tenantId = membership.tenantId;
      const tenantName = membership.tenant?.name || 'Unknown';
      const tenantCode = membership.tenant?.code || 'Unknown';
      
      if (!tenantsMap.has(tenantId)) {
        tenantsMap.set(tenantId, { name: tenantName, code: tenantCode, memberships: [] });
      }
      tenantsMap.get(tenantId)!.memberships.push(membership);
    });
  }

  const tenants = Array.from(tenantsMap.values());

  const handleSelectTenant = (tenantId: number) => {
    setSelectedTenant(tenantId);
  };

  const handleContinue = () => {
    if (!selectedTenant) return;
    
    // Check if selected tenant has any active memberships
    const selectedTenantData = tenants.find(t => t.memberships[0].tenantId === selectedTenant);
    const hasActiveMembership = selectedTenantData?.memberships.some(m => m.isActive);
    
    if (!hasActiveMembership) {
      alert('This membership has expired. Please contact administrator to renew your membership.');
      return;
    }
    
    setIsLoading(true);
    // Store selected tenant in localStorage or context
    localStorage.setItem('selectedTenantId', selectedTenant.toString());
    
    // Navigate to role selection
    navigate('/select-role');
  };

  const handleBack = () => {
    navigate('/login');
  };

  if (!user) {
    return (
      <PageLayout>
        <BrandLogo subtitle="Select your organization" />
        <FormContainer>
          <div className="text-center py-8">
            <p className="text-gray-600">Please log in first</p>
            <button
              onClick={handleBack}
              className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
            >
              Go to Login
            </button>
          </div>
        </FormContainer>
        <Footer />
      </PageLayout>
    );
  }

  if (tenants.length === 0) {
    return (
      <PageLayout>
        <BrandLogo subtitle="Select your organization" />
        <FormContainer>
          <div className="text-center py-8">
            <p className="text-gray-600">No organizations found</p>
            <p className="text-sm text-gray-500 mt-2">Contact administrator to assign you to an organization</p>
            <button
              onClick={handleBack}
              className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
            >
              Go to Login
            </button>
          </div>
        </FormContainer>
        <Footer />
      </PageLayout>
    );
  }

  if (tenants.length === 1) {
    // Auto-select if only one tenant
    const singleTenant = tenants[0];
    localStorage.setItem('selectedTenantId', singleTenant.memberships[0].tenantId.toString());
    navigate('/select-role');
    return null;
  }

  return (
    <PageLayout>
      <BrandLogo subtitle="Select your organization" />

      <FormContainer>
        <div className="space-y-4">
          <p className="text-sm text-gray-600 text-center">
            You belong to multiple organizations. Please select one to continue.
          </p>

          {tenants.map((tenant) => {
            const hasActiveMembership = tenant.memberships.some(m => m.isActive);
            return (
              <button
                key={tenant.memberships[0].tenantId}
                onClick={() => handleSelectTenant(tenant.memberships[0].tenantId)}
                className={`w-full p-4 border-2 rounded-lg text-left transition-all duration-200 ${
                  selectedTenant === tenant.memberships[0].tenantId
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-300 hover:border-purple-300'
                } ${!hasActiveMembership ? 'opacity-60' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-gray-900">{tenant.name}</div>
                    <div className="text-sm text-gray-500">{tenant.code}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {tenant.memberships.length} role{tenant.memberships.length > 1 ? 's' : ''} available
                    </div>
                  </div>
                  {!hasActiveMembership && (
                    <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded">
                      Expired
                    </span>
                  )}
                </div>
              </button>
            );
          })}

          <LoadingButton
            loading={isLoading}
            onClick={handleContinue}
            disabled={!selectedTenant}
            className="w-full"
          >
            Continue
          </LoadingButton>

          <button
            onClick={handleBack}
            className="w-full text-sm text-gray-600 hover:text-gray-900 py-2"
          >
            Back to Login
          </button>
        </div>
      </FormContainer>

      <Footer />
    </PageLayout>
  );
}

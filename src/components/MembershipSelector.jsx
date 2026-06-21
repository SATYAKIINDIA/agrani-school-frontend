import { useMembership } from '../context/MembershipContext';

/**
 * Membership Selector Component
 * Allows users to switch between their active memberships
 */
export function MembershipSelector() {
  const { memberships, activeMembership, switchMembership, loading } = useMembership();

  if (loading) {
    return <div className="text-sm text-gray-500">Loading memberships...</div>;
  }

  if (memberships.length <= 1) {
    return null; // Don't show selector if only one membership
  }

  const handleSwitch = async (membership) => {
    try {
      await switchMembership(membership);
    } catch (err) {
      console.error('Failed to switch membership:', err);
    }
  };

  return (
    <div className="relative">
      <select
        value={activeMembership?.id || ''}
        onChange={(e) => {
          const membership = memberships.find(m => m.id === parseInt(e.target.value));
          if (membership) handleSwitch(membership);
        }}
        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
      >
        {memberships.map((membership) => (
          <option key={membership.id} value={membership.id}>
            {membership.tenant?.tenantName || `Tenant ${membership.tenantId}`}
            {membership.isDefault && ' (Default)'}
          </option>
        ))}
      </select>
    </div>
  );
}

/**
 * Membership Badge Component
 * Displays current active membership as a badge
 */
export function MembershipBadge() {
  const { activeMembership, loading } = useMembership();

  if (loading || !activeMembership) {
    return null;
  }

  return (
    <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
      {activeMembership.tenant?.tenantName || `Tenant ${activeMembership.tenantId}`}
    </div>
  );
}

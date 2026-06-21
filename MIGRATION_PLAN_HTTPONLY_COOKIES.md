# Migration Plan: localStorage to HttpOnly Cookies

## Overview

Migrate authentication from localStorage token storage to httpOnly cookie-based authentication to eliminate XSS vulnerability.

**Current State**:
- Tokens stored in localStorage (XSS vulnerability)
- Token read in AuthContext (lines 11-12, 27-28, 33-34)
- Token read in axios interceptor (line 12)
- Token cleared in AuthContext (lines 19-20, 33-34)
- Token cleared in axios interceptor (lines 55-56)

**Target State**:
- Tokens stored in httpOnly cookies (backend-managed)
- Frontend no longer reads tokens from localStorage
- Frontend relies on backend cookies for authentication
- axios uses `withCredentials: true` (already configured)

**Files to Modify**:
- `src/context/AuthContext.jsx`
- `src/utils/axios.js`

## Migration Strategy

### Phase 1: Backend Preparation (Prerequisite)
**Status**: BLOCKED - Requires backend team coordination

**Backend Requirements**:
1. Configure httpOnly cookies for access tokens
   - `httpOnly: true` (prevents JavaScript access)
   - `Secure: true` (HTTPS only)
   - `SameSite: Strict` (CSRF protection)
   - `Path: /` (application-wide)
   - `Max-Age: 15 minutes` (access token expiration)

2. Configure httpOnly cookies for refresh tokens
   - `httpOnly: true`
   - `Secure: true`
   - `SameSite: Strict`
   - `Path: /`
   - `Max-Age: 7 days` (refresh token expiration)

3. Update login endpoint to set cookies instead of returning token in response body

4. Update logout endpoint to clear cookies

5. Update refresh-token endpoint to refresh cookies

6. Configure CORS to allow credentials:
   - `Access-Control-Allow-Credentials: true`
   - `Access-Control-Allow-Origin: <frontend-domain>` (must be specific, not wildcard)

**Coordination**: Start backend coordination 2 weeks before frontend implementation

---

### Phase 2: Frontend Refactoring

#### Step 1: Refactor AuthContext
**File**: `src/context/AuthContext.jsx`

**Changes**:
1. Remove localStorage reads (lines 11-12)
2. Remove localStorage writes (lines 27-28)
3. Remove localStorage clears (lines 19-20, 33-34)
4. Remove user_data from localStorage (user data should be fetched from API)
5. Simplify login to only set user state (backend sets cookies)
6. Simplify logout to only clear user state (backend clears cookies via API call)
7. Add API call to fetch user data on mount (since no longer in localStorage)

**Before**:
```javascript
useEffect(() => {
  const token = localStorage.getItem('auth_token');
  const userData = localStorage.getItem('user_data');
  if (token && userData) {
    try {
      setUser(JSON.parse(userData));
    } catch (e) {
      console.error('Failed to parse user data:', e);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    }
  }
  setLoading(false);
}, []);

const login = (userData, token) => {
  localStorage.setItem('auth_token', token);
  localStorage.setItem('user_data', JSON.stringify(userData));
  setUser(userData);
};

const logout = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user_data');
  setUser(null);
};
```

**After**:
```javascript
useEffect(() => {
  // Fetch user data from API (backend validates cookie)
  const fetchUserData = async () => {
    try {
      const res = await api.get('/api/v1/auth/me');
      setUser(res.data);
    } catch (e) {
      // No valid cookie, user not authenticated
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  fetchUserData();
}, []);

const login = async (credentials) => {
  // Backend sets httpOnly cookies on successful login
  const res = await api.post('/api/v1/auth/login', credentials);
  setUser(res.data.user);
};

const logout = async () => {
  // Backend clears httpOnly cookies
  await api.post('/api/v1/auth/logout');
  setUser(null);
};
```

---

#### Step 2: Refactor axios Client
**File**: `src/utils/axios.js`

**Changes**:
1. Remove localStorage token read from request interceptor (lines 11-16)
2. Remove localStorage clears from response interceptor (lines 55-56)
3. Keep `withCredentials: true` (already configured on line 7)
4. Update refresh logic to rely on cookies (already using `withCredentials: true` on line 26)

**Before**:
```javascript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

**After**:
```javascript
// No request interceptor needed - cookies sent automatically via withCredentials: true
```

**Response Interceptor Update**:
```javascript
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (!err.response) return Promise.reject(err);

    const { status } = err.response;
    const original = err.config;

    if (status === 401 && !original?._retry) {
      original._retry = true;
      try {
        await refreshAccessToken();
        return api(original);
      } catch (e) {
        // Dispatch auth expired event (AuthContext will handle logout)
        window.dispatchEvent(
          new CustomEvent("auth:expired", {
            detail: { redirect: window.location.pathname + window.location.search },
          })
        );
        return Promise.reject(e);
      }
    }

    return Promise.reject(err);
  }
);
```

---

#### Step 3: Refactor Login Flow
**Files**: All login components (e.g., `src/pages/Login.jsx`)

**Changes**:
1. Update login function to pass credentials only (not token)
2. Remove token handling from login component
3. Let AuthContext handle login via API call

**Before**:
```javascript
const handleLogin = async (values) => {
  const res = await api.post('/api/v1/auth/login', values);
  login(res.data.user, res.data.token); // Pass token to AuthContext
};
```

**After**:
```javascript
const handleLogin = async (values) => {
  await login(values); // AuthContext handles API call and cookie setting
};
```

---

#### Step 4: Refactor Logout Flow
**Files**: All logout components

**Changes**:
1. Update logout to call AuthContext logout (which calls backend API)
2. Remove direct localStorage clearing

**Before**:
```javascript
const handleLogout = () => {
  logout(); // AuthContext clears localStorage
};
```

**After**:
```javascript
const handleLogout = async () => {
  await logout(); // AuthContext calls backend to clear cookies
};
```

---

### Phase 3: Testing & Validation

#### Test Cases:
1. **Login Flow**:
   - User logs in successfully
   - Backend sets httpOnly cookies
   - Frontend receives user data
   - User state updated in AuthContext
   - No token in localStorage

2. **Authentication Persistence**:
   - User refreshes page
   - Frontend fetches user data from `/api/v1/auth/me`
   - Backend validates cookie
   - User remains authenticated

3. **Logout Flow**:
   - User logs out
   - Backend clears httpOnly cookies
   - User state cleared in AuthContext
   - No token in localStorage

4. **Token Refresh**:
   - Access token expires
   - Axios interceptor calls refresh endpoint
   - Backend refreshes cookies
   - Request retried successfully

5. **Security Validation**:
   - Verify no token in localStorage
   - Verify cookies are httpOnly (check browser dev tools)
   - Verify cookies are Secure (HTTPS only)
   - Verify cookies are SameSite=Strict

---

### Phase 4: Rollback Plan

**If Migration Fails**:
1. Revert AuthContext to localStorage implementation
2. Revert axios client to localStorage token handling
3. Revert login/logout flows
4. Clear feature flag
5. Notify backend team to revert cookie configuration

**Rollback Triggers**:
- > 5% auth failure rate during migration
- Backend cookie configuration issues
- CORS/SameSite cookie problems
- Browser compatibility issues

---

## Implementation Order

1. **Backend Coordination**: Start backend team coordination (2 weeks before implementation)
2. **Backend Implementation**: Backend team implements cookie configuration
3. **AuthContext Refactor**: Refactor AuthContext to remove localStorage
4. **Axios Refactor**: Refactor axios to remove localStorage token handling
5. **Login Flow Refactor**: Update login components
6. **Logout Flow Refactor**: Update logout components
7. **Testing**: Test all authentication flows
8. **Validation**: Verify no localStorage usage, verify cookies are httpOnly
9. **Deployment**: Deploy to staging
10. **Monitoring**: Monitor auth failure rates for 1 week
11. **Production Deployment**: Deploy to production if staging successful

---

## Dependencies

**Prerequisites**:
- Backend team implements httpOnly cookie configuration
- Backend team updates login/logout/refresh endpoints
- Backend team configures CORS for credentials

**Blocking Issues**:
- Backend team availability
- CORS/SameSite cookie configuration issues
- Browser compatibility testing

---

## Success Criteria

- ✅ No localStorage usage for tokens
- ✅ Tokens stored in httpOnly cookies
- ✅ Login flow works with cookies
- ✅ Logout flow works with cookies
- ✅ Token refresh works with cookies
- ✅ Authentication persists across page refreshes
- ✅ Auth failure rate < 1%
- ✅ All test cases pass

---

## Timeline

**Estimated Effort**: 16 hours (realistic)
- Backend coordination: 4 hours
- AuthContext refactor: 4 hours
- Axios refactor: 2 hours
- Login/logout refactor: 2 hours
- Testing: 4 hours

**Timeline**: 2 weeks (including backend coordination)

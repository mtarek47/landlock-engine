/**
 * ==============================================================================
 * LandLock Engine Security-Reviewed Token & Session Architecture
 * ==============================================================================
 * 
 * THREAT MODEL & STORAGE POLICY:
 * 1. Persistent Storage Restriction:
 *    - In accordance with GovTech security guidelines, authentication tokens and 
 *      passwords MUST NEVER be stored in persistent `localStorage`.
 *    - `localStorage` persists across browser sessions and tabs, making it vulnerable 
 *      to long-term cross-site script (XSS) exfiltration and unauthorized workstation reuse.
 * 
 * 2. In-Memory Primary State:
 *    - The active JWT access token and user identity are primarily stored in isolated 
 *      in-memory JavaScript closure variables (`_inMemoryToken`, `_inMemoryUser`).
 * 
 * 3. Scoped Session Continuity Bridge:
 *    - To support user page-refreshes within an authorized single browser tab session,
 *      an ephemeral `sessionStorage` fallback is maintained.
 *    - Unlike `localStorage`, `sessionStorage` is strictly scoped to the specific tab,
 *      is isolated from other windows, and is automatically destroyed when the tab is closed.
 * 
 * 4. Immediate Purge on Invalidation:
 *    - On explicit logout, HTTP 401 unauthorized response, or session timeout, both 
 *      the in-memory state and the tab-scoped session cache are wiped immediately.
 * 
 * 5. Password Prohibition:
 *    - Plaintext passwords and hashes are NEVER persisted in any storage medium.
 * ==============================================================================
 */

const SESSION_TOKEN_KEY = 'landlock_session_token'
const SESSION_USER_KEY = 'landlock_session_user'

let _inMemoryToken = null
let _inMemoryUser = null

/**
 * Initialize in-memory state from scoped sessionStorage if available
 */
function initializeFromSession() {
  if (typeof window === 'undefined') return
  try {
    const cachedToken = sessionStorage.getItem(SESSION_TOKEN_KEY)
    const cachedUser = sessionStorage.getItem(SESSION_USER_KEY)
    if (cachedToken) {
      _inMemoryToken = cachedToken
    }
    if (cachedUser) {
      _inMemoryUser = JSON.parse(cachedUser)
    }
  } catch (err) {
    console.warn('[Security] Could not access sessionStorage:', err)
  }
}

// Run initial hydration
initializeFromSession()

export const tokenManager = {
  /**
   * Retrieve active access token (prefer in-memory, fallback to sessionStorage)
   * @returns {string|null}
   */
  getToken() {
    if (_inMemoryToken) return _inMemoryToken
    try {
      const cached = sessionStorage.getItem(SESSION_TOKEN_KEY)
      if (cached) {
        _inMemoryToken = cached
        return cached
      }
    } catch {
      // Access denied / private browsing
    }
    return null
  },

  /**
   * Set authentication session
   * @param {string} token - JWT Access Token
   * @param {object} user - User profile object
   */
  setSession(token, user) {
    _inMemoryToken = token || null
    _inMemoryUser = user || null
    try {
      if (token) {
        sessionStorage.setItem(SESSION_TOKEN_KEY, token)
      } else {
        sessionStorage.removeItem(SESSION_TOKEN_KEY)
      }
      if (user) {
        sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(user))
      } else {
        sessionStorage.removeItem(SESSION_USER_KEY)
      }
      // Also clean up any legacy localStorage tokens if present from prior versions
      localStorage.removeItem('landlock_token')
      localStorage.removeItem('landlock_user')
    } catch (err) {
      console.warn('[Security] Failed to write to sessionStorage:', err)
    }
  },

  /**
   * Retrieve cached user profile
   * @returns {object|null}
   */
  getUser() {
    if (_inMemoryUser) return _inMemoryUser
    try {
      const cached = sessionStorage.getItem(SESSION_USER_KEY)
      if (cached) {
        _inMemoryUser = JSON.parse(cached)
        return _inMemoryUser
      }
    } catch {
      // JSON parse error or access denied
    }
    return null
  },

  /**
   * Update cached user profile
   * @param {object} user
   */
  setUser(user) {
    _inMemoryUser = user || null
    try {
      if (user) {
        sessionStorage.setItem(SESSION_USER_KEY, JSON.stringify(user))
      } else {
        sessionStorage.removeItem(SESSION_USER_KEY)
      }
    } catch (err) {
      console.warn('[Security] Failed to update user in sessionStorage:', err)
    }
  },

  /**
   * Completely purge authentication tokens and session data from all memory and storage
   */
  clearSession() {
    _inMemoryToken = null
    _inMemoryUser = null
    try {
      sessionStorage.removeItem(SESSION_TOKEN_KEY)
      sessionStorage.removeItem(SESSION_USER_KEY)
      // Purge legacy storage as defense-in-depth
      localStorage.removeItem('landlock_token')
      localStorage.removeItem('landlock_user')
    } catch (err) {
      console.warn('[Security] Failed to clear session:', err)
    }
  },

  /**
   * Check if a valid token exists
   * @returns {boolean}
   */
  hasToken() {
    return !!this.getToken()
  },
}

export default tokenManager

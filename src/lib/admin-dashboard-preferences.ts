export const ADMIN_DASHBOARD_PREFERENCES_STORAGE_KEY = 'sikopling_admin_dashboard_preferences'
export const ADMIN_DASHBOARD_PREFERENCES_CHANGED_EVENT = 'sikopling:admin-dashboard-preferences-changed'

export const RECENT_ITEMS_LIMIT_OPTIONS = [5, 8, 12] as const

export type RecentItemsLimit = (typeof RECENT_ITEMS_LIMIT_OPTIONS)[number]

export type AdminDashboardPreferences = {
	stickyToolbar: boolean
	showWelcomePanel: boolean
	showToolbarDate: boolean
	compactSummaryCards: boolean
	recentItemsLimit: RecentItemsLimit
	showLoginHistory: boolean
	showUpdateSeconds: boolean
}

export const DEFAULT_ADMIN_DASHBOARD_PREFERENCES: AdminDashboardPreferences = {
	stickyToolbar: true,
	showWelcomePanel: true,
	showToolbarDate: true,
	compactSummaryCards: false,
	recentItemsLimit: 8,
	showLoginHistory: true,
	showUpdateSeconds: true
}

const normalizeRecentItemsLimit = (value: unknown): RecentItemsLimit =>
	RECENT_ITEMS_LIMIT_OPTIONS.includes(value as RecentItemsLimit)
		? (value as RecentItemsLimit)
		: DEFAULT_ADMIN_DASHBOARD_PREFERENCES.recentItemsLimit

const normalizePreferences = (value: unknown): AdminDashboardPreferences => {
	if (!value || typeof value !== 'object') return { ...DEFAULT_ADMIN_DASHBOARD_PREFERENCES }

	const preferences = value as Partial<AdminDashboardPreferences>

	return {
		stickyToolbar:
			typeof preferences.stickyToolbar === 'boolean'
				? preferences.stickyToolbar
				: DEFAULT_ADMIN_DASHBOARD_PREFERENCES.stickyToolbar,
		showWelcomePanel:
			typeof preferences.showWelcomePanel === 'boolean'
				? preferences.showWelcomePanel
				: DEFAULT_ADMIN_DASHBOARD_PREFERENCES.showWelcomePanel,
		showToolbarDate:
			typeof preferences.showToolbarDate === 'boolean'
				? preferences.showToolbarDate
				: DEFAULT_ADMIN_DASHBOARD_PREFERENCES.showToolbarDate,
		compactSummaryCards:
			typeof preferences.compactSummaryCards === 'boolean'
				? preferences.compactSummaryCards
				: DEFAULT_ADMIN_DASHBOARD_PREFERENCES.compactSummaryCards,
		recentItemsLimit: normalizeRecentItemsLimit(preferences.recentItemsLimit),
		showLoginHistory:
			typeof preferences.showLoginHistory === 'boolean'
				? preferences.showLoginHistory
				: DEFAULT_ADMIN_DASHBOARD_PREFERENCES.showLoginHistory,
		showUpdateSeconds:
			typeof preferences.showUpdateSeconds === 'boolean'
				? preferences.showUpdateSeconds
				: DEFAULT_ADMIN_DASHBOARD_PREFERENCES.showUpdateSeconds
	}
}

export const loadAdminDashboardPreferences = (): AdminDashboardPreferences => {
	if (typeof window === 'undefined') return { ...DEFAULT_ADMIN_DASHBOARD_PREFERENCES }

	try {
		const storedPreferences = window.localStorage.getItem(ADMIN_DASHBOARD_PREFERENCES_STORAGE_KEY)
		return storedPreferences ? normalizePreferences(JSON.parse(storedPreferences)) : { ...DEFAULT_ADMIN_DASHBOARD_PREFERENCES }
	} catch {
		return { ...DEFAULT_ADMIN_DASHBOARD_PREFERENCES }
	}
}

export const saveAdminDashboardPreferences = (preferences: AdminDashboardPreferences) => {
	const normalizedPreferences = normalizePreferences(preferences)
	if (typeof window === 'undefined') return normalizedPreferences

	window.localStorage.setItem(ADMIN_DASHBOARD_PREFERENCES_STORAGE_KEY, JSON.stringify(normalizedPreferences))
	window.dispatchEvent(
		new CustomEvent<AdminDashboardPreferences>(ADMIN_DASHBOARD_PREFERENCES_CHANGED_EVENT, {
			detail: normalizedPreferences
		})
	)

	return normalizedPreferences
}

export const resetAdminDashboardPreferences = () =>
	saveAdminDashboardPreferences(DEFAULT_ADMIN_DASHBOARD_PREFERENCES)

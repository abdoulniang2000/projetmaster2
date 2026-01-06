// Test script to verify authentication flow
// This script helps debug the authentication issues

console.log('=== Authentication Flow Test ===');

// Check if auth token exists in localStorage
if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    console.log('Token in localStorage:', token ? 'Exists' : 'Not found');

    if (token) {
        console.log('Token length:', token.length);
        console.log('Token starts with:', token.substring(0, 20) + '...');
    }

    // Check current URL
    console.log('Current URL:', window.location.href);

    // Check if we're on a dashboard page
    const isDashboardPage = window.location.pathname.startsWith('/dashboard');
    console.log('Is dashboard page:', isDashboardPage);

    // Test axios headers
    console.log('Axios default headers:', {
        'Content-Type': axios.defaults.headers.common['Content-Type'],
        'Authorization': axios.defaults.headers.common['Authorization'] ? 'Set' : 'Not set'
    });
} else {
    console.log('This script must be run in the browser console');
}

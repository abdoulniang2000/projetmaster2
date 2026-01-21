'use client';

import { AuthProvider } from '@/app/contexts/AuthContext';
import { ThemeProvider } from '@/components/theme/ThemeProvider';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider>
            <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
    );
}

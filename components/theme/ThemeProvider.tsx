'use client';

import React, { createContext, useContext, ReactNode } from 'react';

interface ThemeColors {
    // Couleurs principales
    orange: {
        50: string;
        100: string;
        200: string;
        300: string;
        400: string;
        500: string;
        600: string;
        700: string;
        800: string;
        900: string;
    };
    blue: {
        50: string;
        100: string;
        200: string;
        300: string;
        400: string;
        500: string;
        600: string;
        700: string;
        800: string;
        900: string;
    };
    green: {
        50: string;
        100: string;
        200: string;
        300: string;
        400: string;
        500: string;
        600: string;
        700: string;
        800: string;
        900: string;
    };
}

const themeColors: ThemeColors = {
    orange: {
        50: '#fff7ed',
        100: '#ffedd5',
        200: '#fed7aa',
        300: '#fdba74',
        400: '#fb923c',
        500: '#f97316',
        600: '#ea580c',
        700: '#c2410c',
        800: '#9a3412',
        900: '#7c2d12',
    },
    blue: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
    },
    green: {
        50: '#f0fdf4',
        100: '#dcfce7',
        200: '#bbf7d0',
        300: '#86efac',
        400: '#4ade80',
        500: '#22c55e',
        600: '#16a34a',
        700: '#15803d',
        800: '#166534',
        900: '#14532d',
    },
};

interface ThemeContextType {
    colors: ThemeColors;
    getGradient: (from: keyof ThemeColors, to?: keyof ThemeColors) => string;
    getColorClass: (color: keyof ThemeColors, shade: number) => string;
    getCardClass: (color: keyof ThemeColors) => string;
    getButtonClass: (color: keyof ThemeColors) => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}

interface ThemeProviderProps {
    children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    const getGradient = (from: keyof ThemeColors, to?: keyof ThemeColors): string => {
        const fromColor = from === 'orange' ? 'from-orange-500' :
            from === 'blue' ? 'from-blue-500' :
                'from-green-500';
        const toColor = to ? (to === 'orange' ? 'to-orange-600' :
            to === 'blue' ? 'to-blue-600' :
                'to-green-600') :
            (from === 'orange' ? 'to-orange-600' :
                from === 'blue' ? 'to-blue-600' :
                    'to-green-600');

        return `${fromColor} ${toColor}`;
    };

    const getColorClass = (color: keyof ThemeColors, shade: number): string => {
        const colorMap = {
            orange: `text-orange-${shade}`,
            blue: `text-blue-${shade}`,
            green: `text-green-${shade}`,
        };
        return colorMap[color] || 'text-gray-500';
    };

    const getCardClass = (color: keyof ThemeColors): string => {
        const colorMap = {
            orange: 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 shadow-orange',
            blue: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-blue',
            green: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-green',
        };
        return colorMap[color] || 'bg-white border-gray-200';
    };

    const getButtonClass = (color: keyof ThemeColors): string => {
        const colorMap = {
            orange: 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-orange',
            blue: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-blue',
            green: 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-green',
        };
        return colorMap[color] || 'bg-gray-500 text-white';
    };

    const value: ThemeContextType = {
        colors: themeColors,
        getGradient,
        getColorClass,
        getCardClass,
        getButtonClass,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

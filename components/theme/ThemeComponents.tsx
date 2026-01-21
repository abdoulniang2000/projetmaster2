'use client';

import React from 'react';
import { useTheme } from './ThemeProvider';
import { cn } from '@/lib/utils';

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ComponentType<any>;
    color: 'orange' | 'blue' | 'green';
    trend?: string;
    positive?: boolean;
    detail?: string;
    className?: string;
}

export function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    color,
    trend,
    positive = true,
    detail,
    className
}: StatCardProps) {
    const { getGradient, getColorClass } = useTheme();

    return (
        <div className={cn(
            "card-gradient p-6 animate-scaleIn hover:transform hover:scale-105 transition-all duration-300 cursor-pointer",
            className
        )}>
            <div className="flex items-center justify-between mb-4">
                <div className={cn(
                    "w-12 h-12 bg-gradient-to-br rounded-xl flex items-center justify-center text-white",
                    getGradient(color as any)
                )}>
                    <Icon className="w-6 h-6" />
                </div>
                {trend && (
                    <div className={cn(
                        "flex items-center text-sm font-medium",
                        positive ? "text-green-600" : "text-red-600"
                    )}>
                        <span className="mr-1">{positive ? "↑" : "↓"}</span>
                        {trend}
                    </div>
                )}
            </div>
            <div>
                <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
                <p className="text-sm text-gray-600 mb-2">{subtitle}</p>
                {detail && <p className="text-xs text-gray-500">{detail}</p>}
            </div>
        </div>
    );
}

interface ActionCardProps {
    title: string;
    description: string;
    icon: React.ComponentType<any>;
    color: 'orange' | 'blue' | 'green';
    href: string;
    className?: string;
}

export function ActionCard({ title, description, icon: Icon, color, href, className }: ActionCardProps) {
    const { getButtonClass } = useTheme();

    return (
        <a
            href={href}
            className={cn(
                "card-gradient p-6 rounded-xl animate-fadeInUp hover:transform hover:scale-105 transition-all duration-300 cursor-pointer block",
                className
            )}
        >
            <div className="flex items-start space-x-4">
                <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center text-white flex-shrink-0",
                    getButtonClass(color)
                )}>
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                    <p className="text-sm text-gray-600">{description}</p>
                </div>
            </div>
        </a>
    );
}

interface ProgressCardProps {
    title: string;
    current: number;
    total: number;
    color: 'orange' | 'blue' | 'green';
    showPercentage?: boolean;
    className?: string;
}

export function ProgressCard({ title, current, total, color, showPercentage = true, className }: ProgressCardProps) {
    const { getColorClass } = useTheme();
    const percentage = Math.round((current / total) * 100);

    const getProgressColor = () => {
        switch (color) {
            case 'orange': return 'bg-orange-500';
            case 'blue': return 'bg-blue-500';
            case 'green': return 'bg-green-500';
            default: return 'bg-gray-500';
        }
    };

    return (
        <div className={cn("card-gradient p-6", className)}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">{title}</h3>
                {showPercentage && (
                    <span className={cn("text-sm font-bold", getColorClass(color, 600))}>
                        {percentage}%
                    </span>
                )}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                    className={cn("h-2 rounded-full transition-all duration-500", getProgressColor())}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
            <div className="flex justify-between mt-2">
                <span className="text-xs text-gray-500">{current}</span>
                <span className="text-xs text-gray-500">{total}</span>
            </div>
        </div>
    );
}

interface StatusBadgeProps {
    status: 'success' | 'warning' | 'error' | 'info';
    children: React.ReactNode;
    className?: string;
}

export function StatusBadge({ status, children, className }: StatusBadgeProps) {
    const getStatusClasses = () => {
        switch (status) {
            case 'success':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'warning':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'error':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'info':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <span className={cn(
            "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border",
            getStatusClasses(),
            className
        )}>
            {children}
        </span>
    );
}

interface GradientTextProps {
    children: React.ReactNode;
    className?: string;
    from?: 'orange' | 'blue' | 'green';
    to?: 'orange' | 'blue' | 'green';
}

export function GradientText({ children, className, from = 'orange', to = 'blue' }: GradientTextProps) {
    const { getGradient } = useTheme();

    return (
        <span className={cn(
            "bg-gradient-to-r bg-clip-text text-transparent font-bold",
            getGradient(from as any, to as any),
            className
        )}>
            {children}
        </span>
    );
}

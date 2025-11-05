import React from "react";

interface BadgeProps {
	children: React.ReactNode;
	className?: string;
	variant?: 'default' | 'secondary' | 'destructive' | 'outline';
}

export const Badge = ({ children, className = '', variant = 'default' }: BadgeProps) => {
	const styles: Record<NonNullable<BadgeProps['variant']>, string> = {
		default: 'bg-blue-100 text-blue-800',
		secondary: 'bg-gray-100 text-gray-800',
		destructive: 'bg-red-100 text-red-800',
		outline: 'border border-gray-300 text-gray-800',
	};
	return (
		<span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium rounded ${styles[variant]} ${className}`}>
			{children}
		</span>
	);
};

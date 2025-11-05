import React from "react";

interface SeparatorProps {
	className?: string;
	orientation?: 'horizontal' | 'vertical';
}

export const Separator = ({ className = '', orientation = 'horizontal' }: SeparatorProps) => (
	<div
		className={
			`${orientation === 'horizontal' ? 'h-px w-full' : 'w-px h-full'} bg-gray-200 ${className}`
		}
	/>
);

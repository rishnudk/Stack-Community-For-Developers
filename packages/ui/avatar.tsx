import React from "react";

interface AvatarProps {
	className?: string;
	children?: React.ReactNode;
}

export const Avatar = ({ className = '', children }: AvatarProps) => (
	<div className={`inline-flex items-center justify-center overflow-hidden rounded-full bg-gray-200 ${className}`}>
		{children}
	</div>
);

interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

export const AvatarImage = (props: AvatarImageProps) => (
	<img {...props} />
);

interface AvatarFallbackProps {
	children: React.ReactNode;
	className?: string;
}

export const AvatarFallback = ({ children, className = '' }: AvatarFallbackProps) => (
	<span className={`text-gray-600 ${className}`}>{children}</span>
);

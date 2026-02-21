import React from 'react';
import clsx from 'clsx';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    noPadding?: boolean;
}

const Card = ({ children, className, noPadding = false }: CardProps) => {
    return (
        <div className={clsx('bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden', className)}>
            <div className={clsx(!noPadding && 'p-6')}>
                {children}
            </div>
        </div>
    );
};

export default Card;

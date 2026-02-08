import React from 'react';

const Card = ({ children, className = '' }) => {
    return (
        <div className={`bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden ${className}`}>
            {children}
        </div>
    );
};

export const CardHeader = ({ children, className = '' }) => (
    <div className={`px-6 py-4 border-b border-slate-100 ${className}`}>
        {children}
    </div>
);

export const CardBody = ({ children, className = '' }) => (
    <div className={`p-6 ${className}`}>
        {children}
    </div>
);

export const CardFooter = ({ children, className = '' }) => (
    <div className={`px-6 py-4 bg-slate-50 border-t border-slate-100 ${className}`}>
        {children}
    </div>
);

export default Card;

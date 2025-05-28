import React from 'react';

const Card = ({ title, children, className = '', hoverable = false }) => {
  return (
    <div className={`bg-white rounded-lg shadow-card p-5 ${hoverable ? 'transition-shadow hover:shadow-elevated' : ''} ${className}`}>
      {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
      {children}
    </div>
  );
};

export default Card;

import React from 'react';

const Button = ({ children, onClick, className, disabled, type = 'button' }) => {
  const baseStyle = "px-4 py-2 rounded text-white transition duration-300 bg-primary";
  const hoverStyle = "hover:bg-blue-600";
  const disabledStyle = "bg-gray-400 cursor-not-allowed";
  const activeStyle = "bg-blue-500";

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyle} ${disabled ? disabledStyle : activeStyle} ${hoverStyle} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;

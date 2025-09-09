import React from 'react';

const ContentArea = ({ children }) => {
  return (
    <div className="content-area">
      <h1 className="page-title">PANEL DE CONTROL</h1>
      <div className="content-box">{children}</div>
    </div>
  );
};

export default ContentArea;
import React from 'react';

const ContentArea = ({ children }) => {
  return (
    <div>

      <div className="content-area">

        <div className="content-box">{children}</div>
      </div>
    </div>
  );
};

export default ContentArea;
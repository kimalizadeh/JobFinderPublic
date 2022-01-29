import React from 'react';
import parse from 'html-react-parser';

function Description(description) {
  return <div>
      {parse(description)}
  </div>;
}

export default Description;

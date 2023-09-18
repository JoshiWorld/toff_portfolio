import * as React from 'react';

function FooterShared() {
    const LinkStyle: React.CSSProperties = {
        color: 'inherit'
    }

    return(
      <div>
          <a href="#impressum" style={LinkStyle}>Impressum</a>
      </div>
    );
}

export default FooterShared;
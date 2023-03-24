import React from 'react';

type Props = {
  variant?: 'horizontal' | 'square';
};

const Logo = (props: Props) => {
  const { variant } = props;

  const returnSrc = () => {
    switch (variant) {
      case 'horizontal':
        return '/images/logos/nexus-logo-horizontal.svg';
      case 'square':
        return '/images/logos/nexus-square.svg';
      default:
        return '/images/logos/nexus-logo.svg';
    }
  };

  return (
    <div>
      <img
        src={returnSrc()}
        alt="Grindery Nexus logo"
        style={{ display: 'block', margin: '0 auto', cursor: 'pointer' }}
      />
    </div>
  );
};

export default Logo;

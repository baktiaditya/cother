import React from 'react';
import PropTypes from 'prop-types';
import Resizeable from './Resizeable';

const Row = (props) => {
  const {
    children,
    ...rest
  } = props;
  delete rest.type;

  return (
    <Resizeable type='row' {...rest}>{children}</Resizeable>
  );
};

Row.propTypes = {
  children: PropTypes.node
};

export { Row };


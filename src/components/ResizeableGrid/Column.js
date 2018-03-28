import React from 'react';
import PropTypes from 'prop-types';
import Resizeable from './Resizeable';

const Column = (props) => {
  const {
    children,
    ...rest
  } = props;
  delete rest.type;

  return (
    <Resizeable type='column' {...rest}>{children}</Resizeable>
  );
};

Column.propTypes = {
  children: PropTypes.node,
};

export { Column };


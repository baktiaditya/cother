import React from 'react';
import PropTypes from 'prop-types';
import './Base.scss';

const Base = (props) => {
  const {
    children,
    ...rest
  } = props;

  return (
    <div id='base' {...rest}>{children}</div>
  );
};

Base.propTypes = {
  children: PropTypes.node
};

export default Base;

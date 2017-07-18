import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Icon from '../Icon/Icon';
import scss from './Footer.mod.scss';

const Footer = ({ type }) => {
  const cx = classNames.bind(scss);
  const classes = cx(
    'footer',
    type === 'fixed' ? 'footer-fixed' : undefined
  );

  return (
    <div className={classes}>
      <div className={scss['footer-inner']}>
        Handcrafted with <Icon size={16} color='#df5f5f' /> by&nbsp;
        <a href='mailto:bakti.putra@traveloka.com' rel='noopener noreferrer'>
          Bakti Aditya
        </a> &bull; Uncopyright
      </div>
    </div>
  );
};

Footer.propTypes = {
  type: PropTypes.oneOf(['normal', 'fixed'])
};

Footer.defaultProps = {
  type: 'normal'
};

export default Footer;

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import Icon from '../Icon/Icon';
import { GITHUB_BTN_URL } from '../../shared/constants';
import scss from './Footer.mod.scss';

const Footer = ({ type }) => {
  const cx = classNames.bind(scss);
  const classes = cx(
    'footer',
    type === 'fixed' ? 'footer-fixed' : undefined,
  );

  return (
    <div className={classes}>
      <div className={scss['footer-inner']}>
        <span>Handcrafted with <Icon size={16} color='#df5f5f' /> by</span>&nbsp;
        <a href='mailto:bakti.putra@traveloka.com' rel='noopener noreferrer'>
          Bakti Aditya
        </a>
        <iframe
          src={GITHUB_BTN_URL}
          frameBorder={0}
          scrolling={0}
          width={54}
          height={20}
        />
      </div>
    </div>
  );
};

Footer.propTypes = {
  type: PropTypes.oneOf(['normal', 'fixed']),
};

Footer.defaultProps = {
  type: 'normal',
};

export default Footer;

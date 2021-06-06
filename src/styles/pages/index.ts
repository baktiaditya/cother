import { css } from '@emotion/react';
import qs from 'qs';
import { ThemeLib } from 'src/styles/theme';

const createStyles = (t: ThemeLib) => {
  const bgImg = `https://images.unsplash.com/photo-1537884944318-390069bb8665?${qs.stringify({
    w: 1440,
    fit: 'crop',
    fm: 'pjpg',
  })}`;

  return {
    wrapper: css`
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
    `,
    hero: css`
      position: relative;
      display: flex;
      flex-direction: column;
      flex: 1;
      justify-content: center;
      align-items: center;

      &::after {
        position: absolute;
        content: '';
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        opacity: ${t.opacity.clear};
        background: url('${bgImg}') center center;
        background-size: cover;
        z-index: -1;
      }

      h1 {
        display: flex;
        align-items: center;
        font-size: 64px;
        font-family: Montserrat, sans-serif;
        font-weight: 300;
        margin-bottom: ${t.spacing.s}px;

        img {
          width: 72px;
          height: auto;
          margin-right: ${t.spacing.s}px;
        }
      }

      p {
        font-family: Montserrat, sans-serif;
        font-weight: 300;
        font-size: ${t.typography.size.medium}px;
      }

      a {
        font-family: Montserrat, sans-serif;
        font-weight: 500;
        color: ${t.color.yellowPrimary};
        text-transform: uppercase;
        padding: ${t.spacing.xxs}px 0;
        border-bottom: 1px solid ${t.color.yellowPrimary};
        text-decoration: none;
        transition: padding-left ${t.animation.timing.fast}ms ${t.animation.easing.fast},
          padding-right ${t.animation.timing.fast}ms ${t.animation.easing.fast};

        &:hover {
          padding-left: ${t.spacing.s}px;
          padding-right: ${t.spacing.s}px;
          text-decoration: none;
        }
      }
    `,
    footer: css`
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 46px;
      font-size: ${t.typography.size.tiny}px;
    `,
    footerIcon: css`
      color: ${t.color.redPrimary};
    `,
    footerBtnFork: css`
      margin-left: ${t.spacing.s}px;
    `,
  };
};

export default createStyles;

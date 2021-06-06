/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import { jsx, css } from '@emotion/react';

const ButtonGroup: React.FC = props => {
  const styles = createStyles();

  return <div {...props} css={styles.base} />;
};

const createStyles = () => {
  return {
    base: css`
      button:first-of-type {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }

      button + button {
        margin-left: -1px;

        &:last-of-type {
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
        }

        &:not(:last-of-type) {
          border-radius: 0;
        }
      }
    `,
  };
};

export default ButtonGroup;

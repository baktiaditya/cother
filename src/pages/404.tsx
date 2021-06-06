/** @jsxRuntime classic */
/** @jsx jsx */
import { NextPage } from 'next';
import { jsx, css } from '@emotion/react';
import Head from 'next/head';
import { PROJECT_NAME } from 'src/contants';

const Error404: NextPage = () => {
  const styles = createStyles();

  return (
    <div css={styles.wrapper}>
      <Head>
        <title>{PROJECT_NAME} &bull; Error</title>
      </Head>
      <p>This page could not be found.</p>
    </div>
  );
};

const createStyles = () => {
  return {
    wrapper: css`
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    `,
  };
};

export default Error404;

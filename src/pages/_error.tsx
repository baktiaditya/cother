/** @jsxRuntime classic */
/** @jsx jsx */
import { NextPage } from 'next';
import { jsx, css } from '@emotion/react';
import Head from 'next/head';
import { PROJECT_NAME } from 'src/contants';

interface ErrorProps {
  statusCode?: number;
}

const Error: NextPage<ErrorProps> = ({ statusCode }) => {
  const styles = createStyles();

  let content = 'An unexpected error has occurred.';
  if (statusCode === 404) {
    content = 'This page could not be found.';
  }

  return (
    <div css={styles.wrapper}>
      <Head>
        <title>{PROJECT_NAME} &bull; Error</title>
        <meta name="description" content={content} />
      </Head>
      <p>{content}</p>
    </div>
  );
};

Error.getInitialProps = ({ res, err }) => {
  let statusCode = 404;

  if (res) {
    statusCode = res.statusCode;
  } else if (err && err.statusCode) {
    statusCode = err.statusCode;
  }

  return { statusCode };
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

export default Error;

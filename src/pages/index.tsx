/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import { jsx, useTheme } from '@emotion/react';
import { useRouter } from 'next/router';
import { PROJECT_NAME, GITHUB_BTN_URL } from 'src/contants';
import Icon from 'src/components/base/icon';

import createStyles from 'src/styles/pages';
import logo from 'src/img/logo.svg';

const Home: React.VFC = () => {
  const router = useRouter();
  const theme = useTheme();
  const styles = createStyles(theme);

  const [codeEditorUrl, setCodeEditorUrl] = React.useState('');

  React.useEffect(() => {
    setCodeEditorUrl(`/code-editor?session=${new Date().getTime()}`);
  }, []);

  const handleCreateNew = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    router.push(codeEditorUrl);
  };

  return (
    <div css={styles.wrapper}>
      <div css={styles.hero}>
        <h1>
          <img src={logo} alt={PROJECT_NAME} />
          {PROJECT_NAME}
        </h1>
        <p>A real-time collaborative code editor and previewer</p>
        <a href={codeEditorUrl} onClick={handleCreateNew}>
          Create New
        </a>
      </div>
      <div css={styles.footer}>
        Made with&nbsp;
        <Icon name="heart" css={styles.footerIcon} />
        &nbsp;by Bakti Aditya
        <iframe
          css={styles.footerBtnFork}
          src={GITHUB_BTN_URL}
          frameBorder={0}
          scrolling="no"
          width={54}
          height={20}
        />
      </div>
    </div>
  );
};

export default Home;

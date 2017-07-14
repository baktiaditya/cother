/* eslint no-console:0, no-eval:0, no-param-reassign:0 */
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import classNames from 'classnames/bind';

import { firebaseDb } from '../../firebase';
import { PAGE_TITLE_PREFIX, PAGE_TITLE_SEP } from '../../constants';
import scss from './TextEditorPage.mod.scss';

// Components
import Base from '../../components/Base/Base';
import Iframe, { IframeContent } from '../../components/Iframe/Iframe';

class TextEditorPage extends React.Component {
  static propTypes = {
    params: PropTypes.object
  }

  _externalScriptList = {
    jquery: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.min.js'
  };
  _firepad;
  _firepadRef = firebaseDb.ref(`${this.props.params.action}_html`);

  state = {
    html: '',
    extractedScripts: [],
    externalScripts: [
      this._externalScriptList.jquery
    ]
  }

  componentDidMount() {
    // Page title
    document.getElementsByTagName('title')[0].innerHTML = `${PAGE_TITLE_PREFIX} ${PAGE_TITLE_SEP} ${this.props.params.action}`;

    const editor = window.ace.edit('html');
    editor.setTheme('ace/theme/tomorrow_night');
    editor.getSession().setMode('ace/mode/html');
    editor.getSession().setTabSize(2);
    editor.getSession().setUseWrapMode(true);
    editor.setShowInvisibles(false);
    editor.on('change', () => {
      const code = editor.getValue();
      this.updateIframe(code);
    });

    this._firepad = window.Firepad.fromACE(this._firepadRef, editor);
  }

  componentWillUnmount() {
    this._firepad.dispose();
  }

  extractScript(s) {
    const div = document.createElement('div');
    div.innerHTML = s;
    const scripts = div.getElementsByTagName('script');
    const scriptsArr = [];
    for (let i = 0; i < scripts.length; i++) {
      scriptsArr.push(scripts[i].innerHTML);
    }

    return scriptsArr;
  }

  updateIframe(code) {
    const extractedScripts = this.extractScript(code);

    this.setState({
      html: code,
      extractedScripts
    });
  }

  render() {
    const cx = classNames.bind(scss);

    return (
      <Base>
        <div className={cx('header')}>
          <h3>Text Editor Page</h3>
          <Link to='/' className={scss['link']}>Home</Link>
        </div>

        <div className={cx('row')}>
          <div className={cx('column')}>
            <div className={cx('editor-type')}>
              <span>HTML</span>
            </div>
            <div id='html' className={cx('editor-container')} />
          </div>
          <div className={cx('column')}>
            <Iframe
              frameBorder={0}
              className={cx('iframe')}
            >
              <IframeContent
                loadExternalScripts={this.state.externalScripts}
                extractedScripts={this.state.extractedScripts}
                dangerouslySetInnerHTML={{ __html: this.state.html }}
              />
            </Iframe>
          </div>
        </div>
      </Base>
    );
  }
}

export default TextEditorPage;

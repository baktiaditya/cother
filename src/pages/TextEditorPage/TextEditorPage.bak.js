/* eslint no-console:0, no-eval:0, no-param-reassign:0 */
import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import classNames from 'classnames/bind';

import { firebaseDb } from '../../shared/firebase';
import { PAGE_TITLE_PREFIX, PAGE_TITLE_SEP } from '../../shared/constants';
import scss from './TextEditorPage.mod.scss';
import defaultHtml from './templates/defaultHtml.html';

// Components
import Base from '../../components/Base/Base';
import Iframe, { IframeContent } from '../../components/Iframe/Iframe';
import { Row, Cell, Splitter } from '../../components/ResizeableGrid/ResizeableGrid';

class TextEditorPage extends React.Component {
  static propTypes = {
    params: PropTypes.object
  }

  _externalScriptList = {
    jquery: 'https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.4/jquery.min.js'
  };
  _firepad;
  _firepadRef = firebaseDb.ref(`${this.props.params.action}_html`);
  _htmlEditor;
  _style;

  state = {
    html: '',
    extractedScripts: [],
    externalScripts: [
      this._externalScriptList.jquery
    ],
    showIframeMask: false
  }

  componentWillMount() {
    // Page title
    document.getElementsByTagName('title')[0].innerHTML = `${PAGE_TITLE_PREFIX} ${PAGE_TITLE_SEP} ${this.props.params.action}`;

    // Create custom <style /> in <head />
    let css = `body { padding-top: ${scss['headerHeight']}; }`;
    css += 'body, html, #__container, #base, [data-reactroot] { height: 100%; }';
    const head = document.head || document.getElementsByTagName('head')[0];
    this._style = document.createElement('style');

    this._style.type = 'text/css';
    if (this._style.styleSheet) {
      this._style.styleSheet.cssText = css;
    } else {
      this._style.appendChild(document.createTextNode(css));
    }

    head.appendChild(this._style);
  }

  componentDidMount() {
    this._htmlEditor = window.ace.edit('html');
    this._htmlEditor.session.setMode('ace/mode/html');
    this._htmlEditor.session.setTabSize(2);
    this._htmlEditor.session.setUseWrapMode(true);
    this._htmlEditor.renderer.setScrollMargin(10, 10);
    this._htmlEditor.renderer.setPadding(10);
    this._htmlEditor.$blockScrolling = Infinity;
    // https://github.com/ajaxorg/ace/blob/v1.2.3/lib/ace/virtual_renderer.js#L1611-L1750
    this._htmlEditor.setOptions({
      showGutter: false,
      vScrollBarAlwaysVisible: false,
      theme: 'ace/theme/tomorrow_night'
    });
    this._htmlEditor.on('change', () => {
      const html = this._htmlEditor.getValue();
      this.updateIframe(html);

      const iframeDoc = document.getElementById('iframeId').contentWindow.document;
      iframeDoc.open();
      iframeDoc.write(html);
      iframeDoc.close();
    });

    this._firepad = window.Firepad.fromACE(this._firepadRef, this._htmlEditor, {
      defaultText: defaultHtml
    });
  }

  componentWillUnmount() {
    // Destroy firepad
    this._firepad.dispose();

    // Destroy Ace editor
    this._htmlEditor.destroy();

    // Remove custom <style /> in <head />
    const head = document.head || document.getElementsByTagName('head')[0];
    head.removeChild(this._style);
  }

  extractScript(code) {
    const div = document.createElement('div');
    div.innerHTML = code;
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
    const logoImg = require('../../shared/assets/logo.svg');

    return (
      <Base>
        <div className={cx('header')}>
          <Link to='/' className={cx('brand')}>
            <img src={logoImg} alt='Cother' />
            <h1>Cother</h1>
          </Link>
        </div>

        <Row>
          <Cell onDimensionChange={() => this._htmlEditor.resize()}>
            <div id='html' className={cx('editor-container')} />
          </Cell>
          <Splitter
            onDragStart={() => this.setState({ showIframeMask: true })}
            onDragStop={() => this.setState({ showIframeMask: false })}
          />
          <Cell>
            {/* Use mask to prevent Splitter drag error */}
            {this.state.showIframeMask && <div className={scss['iframe-mask']} />}
            {/*<Iframe*/}
            {/*frameBorder={0}*/}
            {/*className={scss['iframe']}*/}
            {/*allowFullScreen*/}
            {/*>*/}
            {/*<IframeContent*/}
            {/*loadExternalScripts={this.state.externalScripts}*/}
            {/*extractedScripts={this.state.extractedScripts}*/}
            {/*dangerouslySetInnerHTML={{ __html: this.state.html }}*/}
            {/*/>*/}
            {/*</Iframe>*/}
            <iframe id='iframeId' frameBorder={0} className={scss['iframe']} allowFullScreen />
          </Cell>
        </Row>
      </Base>
    );
  }
}

export default TextEditorPage;

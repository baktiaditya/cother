import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';
import scss from './Iframe.mod.scss';

class Iframe extends Component {
  static propTypes = {
    html: PropTypes.string,
    css: PropTypes.string,
    javascript: PropTypes.string,
  };

  static defaultProps = {
    html: '',
    css: '',
    javascript: '',
  };

  _elemRef;
  _mounted = false;

  componentDidMount() {
    this._mounted = true;
    this.updateContent();
  }

  shouldComponentUpdate(nextProps) {
    const isHtmlEqual = this.props.html === nextProps.html;
    const isCssEqual = this.props.css === nextProps.css;
    const isJsEqual = this.props.javascript === nextProps.javascript;

    return !isHtmlEqual || !isCssEqual || !isJsEqual;
  }

  componentDidUpdate() {
    if (this._mounted) {
      this.updateContent();
    }
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  updateContent() {
    const iframe = ReactDOM.findDOMNode(this._elemRef);
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

    // let html = this.props.html;
    let html = this.props.html;
    const css = this.props.css;
    const javascript = this.props.javascript;
    /* const bodyRegex = /<\/body>(?![\s\S]*<\/body>[\s\S]*$)/i; // find closing body tag
    if (bodyRegex.test(html)) {
      html = html.replace(bodyRegex, `<style type="text/css">${css}</style>\n</body>`);
    } else {
      html = `${html}<style type="text/css">${css}</style>`;
    }*/

    // Extract <script /> tag from html
    const { scriptsArr, scriptsSrcArr, stylesArr } = this.extractScriptStyle(html);

    // Remove <script /> tag from html
    const scriptRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
    while (scriptRegex.test(html)) {
      html = html.replace(scriptRegex, '');
    }

    // Remove <style /> tag from html
    const styleRegex = /<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi;
    while (styleRegex.test(html)) {
      html = html.replace(styleRegex, '');
    }

    const head = html.match(/<head[^>]*>[\s\S]*<\/head>/gi);
    const body = html.match(/<body[^>]*>[\s\S]*<\/body>/gi);

    // Set iframe content
    iframeDoc.head.innerHTML = !isEmpty(head) ? head[0] : '';
    iframeDoc.body.innerHTML = !isEmpty(body) ? body[0] : '';

    if (scriptsSrcArr.length > 0) {
      scriptsSrcArr.forEach((src, num) => {
        if (num === (scriptsSrcArr.length - 1)) {
          this.loadIframeScriptSrc(iframeDoc, src, () => {
            if (scriptsArr.length > 0) {
              scriptsArr.forEach((script) => {
                this.loadIframeCodeInline(iframeDoc, script);
              });
            }
            if (javascript) {
              this.loadIframeCodeInline(iframeDoc, javascript);
            }
          });
        } else {
          this.loadIframeScriptSrc(iframeDoc, src);
        }
      });
    } else {
      if (scriptsArr.length > 0) {
        scriptsArr.forEach((script) => {
          this.loadIframeCodeInline(iframeDoc, script);
        });
      }
      if (javascript) {
        this.loadIframeCodeInline(iframeDoc, javascript);
      }
    }

    // process inline <style /> in body
    if (!isEmpty(stylesArr)) {
      stylesArr.forEach((style) => {
        this.loadIframeCodeInline(iframeDoc, style, 'css');
      });
    }

    // process props.css
    if (css) {
      this.loadIframeCodeInline(iframeDoc, css, 'css');
    }

    // Manipulate anchor tag
    // provide target="_top" by default
    const anchors = iframeDoc.getElementsByTagName('a');
    for (let i = 0; i < anchors.length; i++) {
      if (!anchors[i].getAttribute('target')) {
        anchors[i].setAttribute('target', '_top');
      }
    }
  }

  extractScriptStyle(html) {
    const div = document.createElement('div');
    div.setAttribute('id', 'fake');
    div.innerHTML = html;
    const scripts = div.getElementsByTagName('script');
    const styles = div.getElementsByTagName('style');
    const scriptsArr = [];
    const scriptsSrcArr = [];
    const stylesArr = [];
    for (let i = 0; i < scripts.length; i++) {
      if (scripts[i].src) {
        scriptsSrcArr.push(scripts[i].src);
      }
      if (scripts[i].innerHTML) {
        scriptsArr.push(scripts[i].innerHTML);
      }
    }

    for (let i = 0; i < styles.length; i++) {
      if (styles[i].innerHTML) {
        stylesArr.push(styles[i].innerHTML);
      }
    }

    return {
      scriptsArr,
      scriptsSrcArr,
      stylesArr,
    };
  }

  loadIframeScriptSrc(iframeDoc, src, callback) {
    let r = false;
    const s = iframeDoc.createElement('script');
    s.type = 'text/javascript';
    s.src = src;
    s.onload = s.onreadystatechange = () => {
      // console.log(this.readyState); // uncomment this line to see which ready states are called.
      if (!r && (!this.readyState || this.readyState === 'complete')) {
        r = true;
        callback && callback();
      }
    };
    iframeDoc.getElementsByTagName('body')[0].appendChild(s);
  }

  loadIframeCodeInline(iframeDoc, code, type = 'js') {
    let targetAppend;
    let s;
    if (type === 'js') {
      targetAppend = iframeDoc.body;
      s = iframeDoc.createElement('script');
      s.type = 'text/javascript';
    } else {
      targetAppend = iframeDoc.head;
      s = iframeDoc.createElement('style');
      s.type = 'text/css';
    }
    try {
      s.appendChild(iframeDoc.createTextNode(code));
      targetAppend.appendChild(s);
    } catch (e) {
      s.text = code;
      targetAppend.appendChild(s);
    }
  }

  render() {
    const {
      ...props
    } = this.props;
    delete props.html;
    delete props.css;
    delete props.javascript;

    return (
      <iframe
        {...props}
        className={scss['iframe']}
        ref={c => (this._elemRef = c)}
      />
    );
  }
}

export default Iframe;

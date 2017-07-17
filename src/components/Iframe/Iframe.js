import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import scss from './Iframe.mod.scss';

class Iframe extends Component {
  static propTypes = {
    html: PropTypes.string,
    css: PropTypes.string
  }

  static defaultProps = {
    html: '',
    css: ''
  }

  _elemRef;
  _mounted = false;

  componentDidMount() {
    this._mounted = true;
    this.updateContent();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this._mounted) {
      this.updateContent();
    }
  }

  componentWillUnmount() {
    this._mounted = false;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (this.props.html !== nextProps.html) || (this.props.css !== nextProps.css);
  }

  updateContent() {
    const iframe = ReactDOM.findDOMNode(this._elemRef);
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    const iframeHead = iframeDoc.head;
    const iframeBody = iframeDoc.body;

    const bodyRegex = /<\/body>(?![\s\S]*<\/body>[\s\S]*$)/i; // find closing body tag
    let html = this.props.html;
    const css = this.props.css;
    if (bodyRegex.test(html)) {
      html = html.replace(bodyRegex, `<style type="text/css">${css}</style>\n</body>`);
    } else {
      html = `${html}<style type="text/css">${css}</style>`;
    }

    // Extract <script /> tag from html
    const { scriptsArr, scriptsSrcArr } = this.extractScript(html);

    // Remove <script /> tag from html
    const scriptRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
    while (scriptRegex.test(html)) {
      html = html.replace(scriptRegex, '');
    }

    const head = html.match(/<head[^>]*>[\s\S]*<\/head>/gi);
    const body = html.match(/<body[^>]*>[\s\S]*<\/body>/gi);

    // Set iframe content
    iframeHead.innerHTML = head;
    iframeBody.innerHTML = body;

    if (scriptsSrcArr.length > 0) {
      scriptsSrcArr.forEach((src, num) => {
        if (num === (scriptsSrcArr.length - 1)) {
          this.loadIframeScriptSrc(iframeDoc, src, () => {
            if (scriptsArr.length > 0) {
              scriptsArr.forEach((script) => {
                this.loadIframeScriptInline(iframeDoc, script);
              });
            }
          });
        } else {
          this.loadIframeScriptSrc(iframeDoc, src);
        }
      });
    } else {
      if (scriptsArr.length > 0) {
        scriptsArr.forEach((script) => {
          this.loadIframeScriptInline(iframeDoc, script);
        });
      }
    }
  }

  extractScript(html) {
    const div = document.createElement('div');
    div.setAttribute('id', 'fake');
    div.innerHTML = html;
    const scripts = div.getElementsByTagName('script');
    const scriptsArr = [];
    const scriptsSrcArr = [];
    for (let i = 0; i < scripts.length; i++) {
      if (scripts[i].src) {
        scriptsSrcArr.push(scripts[i].src);
      }
      if (scripts[i].innerHTML) {
        scriptsArr.push(scripts[i].innerHTML);
      }
    }

    return {
      scriptsArr,
      scriptsSrcArr
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

  loadIframeScriptInline(iframeDoc, script) {
    const s = iframeDoc.createElement('script');
    s.type = 'text/javascript';
    try {
      s.appendChild(iframeDoc.createTextNode(script));
      iframeDoc.body.appendChild(s);
    } catch (e) {
      s.text = script;
      iframeDoc.body.appendChild(s);
    }
  }

  render() {
    const {
      ...props
    } = this.props;
    delete props.html;
    delete props.css;

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

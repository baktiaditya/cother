/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import { jsx, css } from '@emotion/react';
import omit from 'lodash/omit';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import isArray from 'lodash/isArray';

type IframeProps = React.IframeHTMLAttributes<HTMLIFrameElement> & {
  value: {
    css: string;
    html: string;
    javascript: string;
  };
};

class Iframe extends React.Component<IframeProps> {
  ref = React.createRef<HTMLIFrameElement>();
  mounted = false;

  componentDidMount() {
    this.mounted = true;
    this.updateContent();
  }

  shouldComponentUpdate(nextProps: IframeProps) {
    return !isEqual(this.props.value, nextProps.value);
  }

  componentDidUpdate() {
    if (this.mounted) {
      this.updateContent();
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  updateContent() {
    let { html } = this.props.value;
    const { css: cssString, javascript } = this.props.value;
    const iframe = this.ref.current;
    if (!iframe) {
      return;
    }

    const iframeDoc = iframe.contentDocument || iframe.contentWindow!.document;

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
    iframeDoc.head.innerHTML = isArray(head) ? head[0] : '';
    iframeDoc.body.innerHTML = isArray(body) ? body[0] : '';

    if (scriptsSrcArr.length > 0) {
      scriptsSrcArr.forEach((src, num) => {
        if (num === scriptsSrcArr.length - 1) {
          this.loadIframeScriptSrc(iframeDoc, src, () => {
            if (scriptsArr.length > 0) {
              scriptsArr.forEach(script => {
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
        scriptsArr.forEach(script => {
          this.loadIframeCodeInline(iframeDoc, script);
        });
      }
      if (javascript) {
        this.loadIframeCodeInline(iframeDoc, javascript);
      }
    }

    // process inline <style /> in body
    if (!isEmpty(stylesArr)) {
      stylesArr.forEach(style => {
        this.loadIframeCodeInline(iframeDoc, style, 'css');
      });
    }

    // process props.css
    if (cssString) {
      this.loadIframeCodeInline(iframeDoc, cssString, 'css');
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

  extractScriptStyle(html: string) {
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

  loadIframeScriptSrc(iframeDoc: Document, src: string, callback?: () => void) {
    let loaded = false;
    const script = iframeDoc.createElement('script');
    script.type = 'text/javascript';
    script.src = src;
    if (callback) {
      // script.onreadystatechange = script.onload = () => {
      //   if (!loaded) {
      //     callback();
      //   }
      //   loaded = true;
      // };
      script.onload = () => {
        if (!loaded) {
          callback();
        }
        loaded = true;
      };
    }
    iframeDoc.getElementsByTagName('body')[0].appendChild(script);
  }

  loadIframeCodeInline(iframeDoc: Document, code: string, type = 'js') {
    let targetAppend: HTMLElement;
    let s: HTMLScriptElement | HTMLStyleElement;
    if (type === 'js') {
      targetAppend = iframeDoc.body;
      s = iframeDoc.createElement('script');
      s.type = 'text/javascript';
    } else {
      targetAppend = iframeDoc.head;
      s = iframeDoc.createElement('style');
    }
    // try {
    //   s.appendChild(iframeDoc.createTextNode(code));
    //   targetAppend.appendChild(s);
    // } catch (e) {
    //   s.text = code;
    //   targetAppend.appendChild(s);
    // }
    s.appendChild(iframeDoc.createTextNode(code));
    targetAppend.appendChild(s);
  }

  render() {
    const omittedProps: Array<keyof Pick<IframeProps, 'value'>> = ['value'];
    const { ...rest } = omit(this.props, omittedProps);

    return (
      <iframe
        {...rest}
        ref={this.ref}
        css={css`
          display: block;
          width: 100%;
          height: 100%;
        `}
      />
    );
  }
}

export default Iframe;

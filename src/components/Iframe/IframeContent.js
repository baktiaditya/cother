import React from 'react';
import PropTypes from 'prop-types';
import * as _ from 'lodash';

class IframeContent extends React.Component {
  static propTypes = {
    extractedScripts: PropTypes.array,
    loadExternalScripts: PropTypes.array
  }

  static contextTypes = {
    window: PropTypes.any,
    document: PropTypes.any
  }

  _scripts = [];

  componentDidMount() {
    if (!_.isEmpty(this.props.loadExternalScripts)) {
      this.props.loadExternalScripts.forEach(script => {
        this.loadScript(script);
      });
    }
  }

  componentWillUpdate() {
    if (!_.isEmpty(this._scripts)) {
      this._scripts.forEach((dom) => dom.parentNode.removeChild(dom));
      this._scripts = [];
    }
  }

  componentDidUpdate() {
    if (!_.isEmpty(this.props.extractedScripts)) {
      const {
        document: iFrameDocument
      } = this.context;

      for (let i = 0; i < this.props.extractedScripts.length; i++) {
        const s = iFrameDocument.createElement('script');
        s.type = 'text/javascript';
        try {
          s.appendChild(iFrameDocument.createTextNode(this.props.extractedScripts[i]));
          iFrameDocument.body.appendChild(s);
        } catch (e) {
          s.text = this.props.extractedScripts[i];
          iFrameDocument.body.appendChild(s);
        }
        this._scripts.push(s);
      }
    }
  }

  loadScript(src, callback) {
    const {
      document: iFrameDocument
    } = this.context;

    let r = false;
    const s = iFrameDocument.createElement('script');
    s.type = 'text/javascript';
    s.src = src;
    s.onload = s.onreadystatechange = () => {
      // console.log(this.readyState); // uncomment this line to see which ready states are called.
      if (!r && (!this.readyState || this.readyState === 'complete')) {
        r = true;
        callback && callback();
      }
    };
    iFrameDocument.getElementsByTagName('head')[0].appendChild(s);
  }

  render() {
    const {
      ...props
    } = _.omit(this.props, ['extractedScripts', 'loadExternalScripts']);

    return (
      <div {...props} />
    );
  }
}

export { IframeContent };

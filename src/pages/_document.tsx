import React from 'react';
import Document, { DocumentContext, Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);

    return initialProps;
  }

  render() {
    return (
      <Html>
        <Head>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <link rel="alternate icon" href="/img/favicon.ico" />

          {/* DOM4 */}
          <script src="https://cdnjs.cloudflare.com/ajax/libs/dom4/1.8.3/dom4.js" />

          {/* flexibility */}
          <script src="https://cdnjs.cloudflare.com/ajax/libs/flexibility/2.0.1/flexibility.js" />

          {/* firebase */}
          <script src="https://www.gstatic.com/firebasejs/3.9.0/firebase.js" />

          {/* emmet */}
          <script src="https://cloud9ide.github.io/emmet-core/emmet.js" />

          {/* ace-builds */}
          <script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.8/ace.js" />
          <script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.8/ext-old_ie.js" />
          <script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.8/ext-language_tools.js" />
          <script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.2.8/ext-emmet.js" />

          {/* firepad */}
          <link href="https://cdn.firebase.com/libs/firepad/1.4.0/firepad.css" rel="stylesheet" />
          <script src="https://cdn.firebase.com/libs/firepad/1.4.0/firepad.min.js" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;

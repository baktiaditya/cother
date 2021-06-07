// Based on https://github.com/twbs/bootstrap/blob/v5.0.0-alpha1/scss/_reboot.scss
import { css } from '@emotion/react';
import { normalize, rgba } from 'polished';
import { ThemeLib } from './theme';

const globalStyles = (t: ThemeLib) => {
  const headingMixin = css`
    margin-top: 0;
    margin-bottom: ${t.spacing.m}px;
    font-weight: ${t.typography.weight.bold};
    line-height: 1.2;
  `;

  return css`
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@200;300;400;500&display=swap');

    ${normalize()};

    *,
    *::before,
    *::after {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      box-sizing: border-box;
    }

    body {
      margin: 0;
      font-family: ${t.typography.family.sansSerif};
      font-size: ${t.typography.size.medium}px;
      line-height: ${t.typography.lineHeight};
      color: ${t.color.lightPrimary};
      background-color: ${t.color.darkPrimary};
      -webkit-text-size-adjust: 100%;
      -webkit-tap-highlight-color: ${rgba(t.color.darkPrimary, 0)};
      -webkit-print-color-adjust: exact;
    }

    [tabindex='-1']:focus:not(:focus-visible) {
      outline: 0 !important;
    }

    h1 {
      ${headingMixin};
      font-size: ${t.typography.size.gigantic}px;
    }

    h2 {
      ${headingMixin};
      font-size: ${t.typography.size.huge}px;
    }

    h3 {
      ${headingMixin};
      font-size: ${t.typography.size.big}px;
    }

    h4 {
      ${headingMixin};
      font-size: ${t.typography.size.large}px;
    }

    h5,
    h6 {
      ${headingMixin};
      font-size: ${t.typography.size.medium}px;
    }

    p {
      margin-top: 0;
      margin-bottom: ${t.spacing.m}px;
    }

    abbr[title],
    abbr[data-original-title] {
      text-decoration: underline;
      text-decoration: underline dotted;
      cursor: help;
      text-decoration-skip-ink: none;
    }

    address {
      margin-bottom: 1rem;
      font-style: normal;
      line-height: inherit;
    }

    ol,
    ul {
      padding-left: 2rem;
    }

    ol,
    ul,
    dl {
      margin-top: 0;
      margin-bottom: 1rem;
    }

    ol ol,
    ul ul,
    ol ul,
    ul ol {
      margin-bottom: 0;
    }

    dt {
      font-weight: ${t.typography.weight.bold};
    }

    dd {
      margin-bottom: 0.5rem;
      margin-left: 0;
    }

    blockquote {
      margin: 0 0 1rem;
    }

    b,
    strong {
      font-weight: ${t.typography.weight.bold};
    }

    small {
      font-size: ${t.typography.size.small}px;
    }

    a {
      color: ${t.color.bluePrimary};
      text-decoration: none;

      &:hover {
        color: ${rgba(t.color.bluePrimary, t.opacity.obscure)};
        text-decoration: underline;
      }
    }

    pre,
    code,
    kbd,
    samp {
      font-family: ${t.typography.family.monospace};
    }

    figure {
      margin: 0 0 1rem;
    }

    img,
    svg {
      vertical-align: middle;
    }

    /* Table */
    /* ------------------------------ */

    table {
      caption-side: bottom;
      border-collapse: collapse;
    }

    caption {
      padding-top: ${t.spacing.xs}px;
      padding-bottom: ${t.spacing.xs}px;
      color: ${t.color.lightSecondary};
      text-align: left;
    }

    th {
      font-weight: unset;
      text-align: inherit;
      text-align: -webkit-match-parent;
    }

    thead,
    tbody,
    tfoot,
    tr,
    td,
    th {
      border-color: inherit;
      border-style: solid;
      border-width: 0;
    }

    /* Forms */
    /* ------------------------------ */

    label {
      display: inline-block;
    }

    button {
      border-radius: 0;
    }

    button:focus {
      outline: 1px dotted;
      outline: 5px auto -webkit-focus-ring-color;
    }

    input,
    button,
    select,
    optgroup,
    textarea {
      margin: 0;
      font-family: inherit;
      font-size: inherit;
      line-height: inherit;
    }

    button,
    input {
      overflow: visible;
    }

    button,
    select {
      text-transform: none;
    }

    [role='button'] {
      cursor: pointer;
    }

    select {
      word-wrap: normal;
    }

    [list]::-webkit-calendar-picker-indicator {
      display: none;
    }

    button,
    [type='button'],
    [type='reset'],
    [type='submit'] {
      -webkit-appearance: button;

      &:not(:disabled) {
        cursor: pointer;
      }
    }

    ::-moz-focus-inner {
      padding: 0;
      border-style: none;
    }

    textarea {
      resize: vertical;
    }

    fieldset {
      min-width: 0;
      padding: 0;
      margin: 0;
      border: 0;
    }

    legend {
      float: left;
      width: 100%;
      padding: 0;
      margin-bottom: ${t.spacing.xs}px;
      font-size: ${1.5 * t.typography.size.medium}px;
      line-height: inherit;
      white-space: normal;

      + * {
        clear: left;
      }
    }

    ::-webkit-datetime-edit-fields-wrapper,
    ::-webkit-datetime-edit-text,
    ::-webkit-datetime-edit-minute,
    ::-webkit-datetime-edit-hour-field,
    ::-webkit-datetime-edit-day-field,
    ::-webkit-datetime-edit-month-field,
    ::-webkit-datetime-edit-year-field {
      padding: 0;
    }

    ::-webkit-inner-spin-button {
      height: auto;
    }

    [type='search'] {
      outline-offset: -2px;
      -webkit-appearance: textfield;
    }

    ::-webkit-search-decoration {
      -webkit-appearance: none;
    }

    ::-webkit-color-swatch-wrapper {
      padding: 0;
    }

    ::-webkit-file-upload-button {
      font: inherit;
      -webkit-appearance: button;
    }

    output {
      display: inline-block;
    }

    iframe {
      border: 0;
    }

    summary {
      display: list-item;
      cursor: pointer;
    }

    progress {
      vertical-align: baseline;
    }

    [hidden] {
      display: none !important;
    }

    /* Custom */
    /* ------------------------------ */

    html,
    body,
    #__next {
      height: 100%;
    }
  `;
};

export default globalStyles;

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import Loader from '../Loader/Loader';
import Icon from '../Icon/Icon';
import ButtonGroup from '../ButtonGroup/ButtonGroup';
import Button from '../Button/Button';
import scss from './HeaderEditor.mod.scss';

class HeaderEditor extends Component {
  static propTypes = {
    brand: PropTypes.string,
    editor: PropTypes.object.isRequired,
    isLoading: PropTypes.bool,
    onBtnEditorClick: PropTypes.func,
    totalUsers: PropTypes.number
  }

  static defaultProps = {
    brand: 'Cother',
    totalUsers: 0
  }

  constructor(props) {
    super(props);

    this._microCopy = {
      html: 'HTML',
      css: 'CSS',
      javascript: 'JS',
      output: 'Output'
    };

    this.state = {
      btnEditor: {}
    };

    Object.keys(props.editor).forEach(editor => {
      this.state.btnEditor[editor] = props.editor[editor].show;
    });
  }

  handleBtnEditorClick = (editor, e) => {
    this.setState({
      btnEditor: {
        ...this.state.btnEditor,
        [editor]: !this.state.btnEditor[editor]
      }
    }, () => {
      this.props.onBtnEditorClick && this.props.onBtnEditorClick(editor, e);
    });
  }

  render() {
    const {
      brand,
      editor,
      isLoading
    } = this.props;

    const logoImg = require('../../shared/assets/logo.svg');

    return (
      <div className={scss['header']}>
        <Link to='/' className={scss['brand']}>
          <img src={logoImg} alt='Cother' />
          <h1>{brand}</h1>
        </Link>

        {/* Btn show hide editor */}
        <ButtonGroup size='sm'>
          {Object.keys(editor).map((mode) => (
            <Button
              key={mode}
              active={this.state.btnEditor[mode]}
              onClick={this.handleBtnEditorClick.bind(this, mode)}
            >
              {Object.keys(this._microCopy).includes(mode) ? this._microCopy[mode] : mode}
            </Button>
          ))}
        </ButtonGroup>

        {isLoading
          ? <Loader />
          : (
            <div className={scss['user-list-indicator']}>
              {this.props.totalUsers}&nbsp;<Icon size={20} icon='remove-red-eye' />
            </div>
          )
        }
      </div>
    );
  }
}

export default HeaderEditor;

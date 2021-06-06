/** @jsxRuntime classic */
/** @jsx jsx */
import React from 'react';
import { jsx, useTheme } from '@emotion/react';
import createStyles from './styles';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  active?: boolean;
  /** @default "button" */
  type?: 'submit' | 'reset' | 'button';
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { active = false, disabled = false, ...rest } = props;

  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <button
      {...rest}
      ref={ref}
      disabled={disabled}
      css={[styles.base, active && styles.active, disabled && styles.disabled]}
    />
  );
});

export default Button;

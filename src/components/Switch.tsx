import React from "react";
import styled from "styled-components";

type SwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  ariaLabel?: string;
  className?: string;
};

const Switch = ({ checked, onChange, ariaLabel = "Toggle theme", className }: SwitchProps) => {
  return (
    <StyledWrapper className={className}>
      <label className="switch" aria-label={ariaLabel}>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="slider" />
      </label>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  /* Smaller */
  .switch {
    font-size: 9px;              /* was 11px */
    position: relative;
    display: inline-block;
    width: 3.0em;                /* was 3.5em */
    height: 0.9em;               /* was 1em */
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    inset: 0;
    background-color: #ccc;
    border: 2px solid #000;
    transition: background-color 200ms ease, border-color 200ms ease;
    border-radius: 1px;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 1.15em;              /* was 1.3em */
    width: 1.05em;               /* was 1.2em */
    border-radius: 2px;
    left: 0.18em;                /* slightly tighter */
    bottom: 0.25em;              /* slightly tighter */
    background-color: #fff;
    border: 2px solid #000;

    /* Smooth knob */
    transition: transform 200ms ease, background-color 200ms ease, border-color 200ms ease;
    will-change: transform;
  }

  input:checked + .slider {
    background-color: #000;
  }

  input:checked + .slider:before {
    transform: translateX(1.15em); /* was 1.3em */
  }

  input:focus + .slider {
    box-shadow: 0 0 1px #2196f3;
  }
`;

export default Switch;
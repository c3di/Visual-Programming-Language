import React from 'react';
import './NodeLibraryItem.css';

export interface INodeLibraryItem {
  title: string;
  href?: string;
  description?: string;
  onUninstall?: () => void;
  onEnable?: () => void;
  onDisable?: () => void;
}

export default function NodeLibraryItem({
  title,
  href,
  description,
  onUninstall,
  onEnable,
  onDisable,
}: INodeLibraryItem): JSX.Element {
  const [enabled, setEnabled] = React.useState<boolean>(false);
  return (
    <li
      className="vp-nodelibrary-entry"
      style={{
        display: 'flex',
        borderBottom: 'var(--vp-accordion-item-border-width) solid',
        borderColor: 'var(--vp-accordion-item-border-color)',
        paddingTop: '5px',
        paddingLeft: '5px',
      }}
    >
      <div
        className="vp-nodelibrary-entry-description"
        style={{ padding: '8px', width: '100%' }}
      >
        <div className="vp-nodelibrary-entry-title">
          <a
            href={href}
            style={{
              textDecoration: 'none',
              color: 'var(--vp-accordion-item-title-font-color)',
              lineHeight: '1.28',
              fontSize: 'var(--vp-accordion-item-title-font-size)',
              fontWeight: 'var(--vp-accordion-item-title-font-weight)',
            }}
            target="_blank"
            rel="noopener noreferrer"
          >
            {title}
          </a>
        </div>
        <div className="vp-nodelibrary-entry-content">
          <div
            className="vp-nodelibrary-entry-description"
            style={{
              color: 'var(--vp-accordion-item-content-font-color)',
              fontSize: 'var(--vp-accordion-item-content-font-size)',
              marginBottom: '3px',
            }}
          >
            {description ?? ''}
          </div>
          <div
            className="vp-nodelibrary-entry-buttons"
            style={{
              overflow: 'auto',
              float: 'right',
            }}
          >
            <button
              className="vp-nodelibrary-entry-button"
              style={{
                margin: '0px',
                border: '0px',
              }}
              onClick={onUninstall}
              type="button"
            >
              <span
                className="bp3-button-text"
                style={{
                  fontSize: '12px',
                }}
              >
                Uninstall
              </span>
            </button>

            <button
              className="vp-nodelibrary-entry-button"
              style={{
                marginTop: '10px',
                margin: '0px',
                border: '0px',
              }}
              type="button"
              onClick={() => {
                if (enabled) onEnable?.();
                else onDisable?.();
                setEnabled(!enabled);
              }}
            >
              <span className="bp3-button-text" style={{ fontSize: '12px' }}>
                {enabled ? 'Enable' : 'Disable'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}

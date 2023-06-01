import React from 'react';

declare module 'react' {
  interface CSSProperties {
    '--vp-accordion-item-border-color'?: string;
    '--vp-accordion-item-title-font-size'?: string;
    '--vp-accordion-item-title-font-color'?: string;
    '--vp-accordion-item-content-font-size'?: string;
    '--vp-accordion-item-content-font-color'?: string;
    '--vp-accordion-item-content-button-font-size'?: string;
    '--vp-accordion-item-content-button-font-color'?: string;
  }
}

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
        '--vp-accordion-item-border-color': '#e0e0e0',

        '--vp-accordion-item-title-font-size': '15.5px',
        '--vp-accordion-item-title-font-color': '#1976D2',

        '--vp-accordion-item-content-font-size': '15px',
        '--vp-accordion-item-content-font-color': '#0000008A',

        '--vp-accordion-item-content-button-font-size': '15px',
        '--vp-accordion-item-content-button-font-color': '#0000008A',

        display: 'flex',
        borderBottom: '1px solid',
        borderColor: 'var(--vp-accordion-item-border-color)',
        paddingTop: '5px',
        paddingLeft: '5px',
      }}
    >
      <div
        className="vp-nodelibrary-entry-description"
        style={{ paddingBottom: 5, paddingLeft: 5 }}
      >
        <div className="vp-nodelibrary-entry-title">
          <a
            href={href}
            style={{
              textDecoration: 'none',
              color: 'var(--vp-accordion-item-title-font-color)',
              lineHeight: '1.28',
              fontSize: 'var(--vp-accordion-item-title-font-size)',
              fontWeight: 405,
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
            }}
          >
            {description ?? ''}
          </div>
          <div
            className="vp-nodelibrary-entry-buttons"
            style={{ overflow: 'auto' }}
          >
            <button
              style={{
                float: 'left',
                marginRight: 5,
                marginTop: '10px',
                border: '0px',
                color: 'var(--vp-accordion-item-content-button-font-color)',
                backgroundColor: 'transparent',
                paddingBottom: '8px',
                fontSize: 'var(--vp-accordion-item-content-button-font-size)',
              }}
              onClick={onUninstall}
              type="button"
              className="bp3-button bp3-minimal bp3-small minimal jp-Button"
            >
              <span className="bp3-button-text">Uninstall</span>
            </button>

            <button
              style={{
                float: 'left',
                marginRight: 5,
                marginTop: '10px',
                border: '0px',
                color: 'var(--vp-accordion-item-content-button-font-color)',
                backgroundColor: 'transparent',
                paddingBottom: '8px',
                fontSize: 'var(--vp-accordion-item-content-button-font-size)',
              }}
              type="button"
              className="bp3-button bp3-minimal bp3-small minimal jp-Button"
              onClick={() => {
                if (enabled) onEnable?.();
                else onDisable?.();
                setEnabled(!enabled);
              }}
            >
              <span className="bp3-button-text">
                {enabled ? 'Enable' : 'Disable'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}

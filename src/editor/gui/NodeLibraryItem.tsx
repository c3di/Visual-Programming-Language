import React from 'react';

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
        borderBottom: '1px solid black',
        paddingTop: 5,
      }}
    >
      <div
        className="vp-nodelibrary-entry-description"
        style={{ paddingBottom: 5, paddingLeft: 5 }}
      >
        <div className="vp-nodelibrary-entry-title">
          <a
            href={href}
            style={{ textDecoration: 'none', color: 'blue' }}
            target="_blank"
            rel="noopener noreferrer"
          >
            {title}
          </a>
        </div>
        <div className="vp-nodelibrary-entry-content">
          <div className="vp-nodelibrary-entry-description">
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
              }}
              onClick={onUninstall}
              type="button"
              className="bp3-button bp3-minimal bp3-small minimal jp-Button"
            >
              <span className="bp3-button-text">Uninstall</span>
            </button>

            <button
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

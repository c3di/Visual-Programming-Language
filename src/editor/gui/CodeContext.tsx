import React from 'react';

const CodeContext = React.createContext(undefined);

export const CodeProvider = ({ children, value }) => {
    return (
        <CodeContext.Provider value={value}>
            {children}
        </CodeContext.Provider>
    );
};

export default CodeContext;

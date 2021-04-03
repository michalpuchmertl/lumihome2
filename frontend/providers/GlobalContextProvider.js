import React from 'react';
import PropTypes from 'prop-types';

import UserProvider from './UserProvider';

/**
 * General provider that provides global contexts
 * It wraps directly Pages, so the context is first available in *PageLayout file.
 *
 * This provider currently provides two contexts: ColorModeContext and UserContext (handles login)
 * Other Contexts such as CommentsContext can be used to wrap *PageLayout to provide specific contexts
 * to distinct Pages.
 *
 * @param {JSX.Element[]} props.children
 */

function GeneralContextProvider({ children }) {
  return <UserProvider>{children}</UserProvider>;
}

GeneralContextProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

export default GeneralContextProvider;

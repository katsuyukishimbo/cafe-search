/* eslint-disable jsx-a11y/anchor-has-content */
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {withRouter} from 'next/router';
import NextLink from 'next/link';
import MuiLink from '@material-ui/core/Link';

/**
 *
 * @param props
 * @returns {*}
 * @constructor
 */
function NextComposed(props) {
  const {as, href, prefetch, ...other} = props;

  return (
    <NextLink href={href} prefetch={prefetch} as={as}>
      <a {...other} />
    </NextLink>
  );
}

/**
 *
 * @type {{as: *, prefetch: (shim|Requireable<boolean>), href: *}}
 */
NextComposed.propTypes = {
  as: PropTypes.string,
  href: PropTypes.string,
  prefetch: PropTypes.bool,
};

/**
 * A styled version of the Next.js Link component:
 * https://nextjs.org/docs/#with-link
 * @param props
 * @returns {*}
 * @constructor
 */
function Link(props) {
  const {activeClassName, router, className: classNameProps, naked, ...other} = props;

  const className = clsx(classNameProps, {
    [activeClassName]: router.pathname === props.href && activeClassName,
  });

  if (naked) {
    return <NextComposed className={className} {...other} />;
  }

  return <MuiLink component={NextComposed} className={className} {...other} />;
}

/**
 *
 * @type {{as: *, onClick: *, router: Validator<NonNullable<T>> | shim, prefetch: (shim|Requireable<boolean>), className: *, href: *, naked: (shim|Requireable<boolean>), activeClassName: *}}
 */
Link.propTypes = {
  activeClassName: PropTypes.string,
  as: PropTypes.string,
  className: PropTypes.string,
  href: PropTypes.string,
  naked: PropTypes.bool,
  onClick: PropTypes.func,
  prefetch: PropTypes.bool,
  router: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

Link.defaultProps = {
  activeClassName: 'active',
};

export default withRouter(Link);

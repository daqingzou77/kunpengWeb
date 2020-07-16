import React from 'react';
import { Redirect } from 'umi';
import { connect } from 'dva';
import Authorized from '@/utils/Authorized';
import { getRouteAuthority } from '@/utils/utils';
import { ConnectProps, ConnectState, UserModelState } from '@/models/connect';

interface AuthComponentProps extends ConnectProps {
  user: UserModelState;
}

const AuthComponent: React.FC<AuthComponentProps> = ({
  children,
  route = {
    routes: [],
  },
  location = {
    pathname: '',
  },
  user,
}) => {
  const { currentUser } = user;
  const { routes = [] } = route;
  return (
    <Authorized
      authority={getRouteAuthority(location.pathname, routes) || ''}
      noMatch={<Redirect to="/" />}
    >
      {children}
    </Authorized>
  );
};

export default connect(({ user }: ConnectState) => ({
  user,
}))(AuthComponent);

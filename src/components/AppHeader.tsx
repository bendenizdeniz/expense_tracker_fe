import { Menu } from "antd";
import { Header } from "antd/lib/layout/layout";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { AppState } from "../store";
import { isLoggedIn } from "../store/actions/userActions";

function AppHeader() {
  const dispatch = useDispatch();

  const { data, loading, error } = useSelector((state: AppState) => state.user);

  useEffect(() => {
    dispatch(isLoggedIn());
  }, []);

  const location = useLocation();

  return (
    <>
      <Header style={{ position: "fixed", zIndex: 1, width: "100%" }}>
        <div className="logo" />
        <Menu theme="dark" mode="horizontal" selectedKeys={[location.pathname]}>
          {data.username ? (
            <>
              <Menu.Item key="/categories">
                <Link to="/categories">Categories</Link>
              </Menu.Item>
              <Menu.Item key="/records">
                <Link to="/records">Records</Link>
              </Menu.Item>
              <Menu.Item key="/logout">
                <Link to="/logout">Logout</Link>
              </Menu.Item>
            </>
          ) : loading ? null : (
            <Menu.Item key="/">
              <Link to="/">Login</Link>
            </Menu.Item>
          )}
        </Menu>
      </Header>
    </>
  );
}

export default AppHeader;

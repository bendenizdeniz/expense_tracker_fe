import { Form, Input, Button, Result } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";

import { AppState } from "../store";
import { login } from "../store/actions/userActions";
import { LoginForm } from "../types/user";
import showError from "../utils/showError";
import showSuccess from "../utils/showSuccess";

function Login() {
  const history = useHistory();
  const location = useLocation<{ newSignUp?: boolean }>();
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector((state: AppState) => state.user);
  const [isLoggedInFlag, setIsLoggedInFlag] = useState<boolean>(false);

  const onFinish = async (values: LoginForm) => {
    dispatch(login(values));
    setIsLoggedInFlag(true);
  };

  useEffect(() => {
    console.log(isLoggedInFlag);
  }, [isLoggedInFlag]);

  useEffect(() => {
    if (error && isLoggedInFlag === true) showError(error);
  }, [error]);

  useEffect(() => {
    data.username && showSuccess("You have successfully logged in!");
  }, [data.username]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) history.push("/categories");
  }, [data]);

  return (
    <div>
      <h2>Login for your account</h2>
      {location.state?.newSignUp && (
        <Result
          status="success"
          title="You Successfully Signed Up!"
          subTitle="Please login using your credentials."
        />
      )}

      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        // onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Please input your username!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default Login;

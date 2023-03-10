import React, { useState } from "react";
import { loginWithEmail } from "../../../utils/Firebase/auth";
import Button from "../../Button";
import Form, { Input } from "../../Form";

interface iFirebaseWithAccount {
  withDesc?: boolean;
  disabled?: boolean;
  onError?: (err: string) => void;
}

const FirebaseWithAccount: React.FC<iFirebaseWithAccount> = ({ withDesc, disabled, onError }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async ({ email, password }: any) => {
    setLoading(true);
    try {
      await loginWithEmail(email, password);
    } catch (err: any) {
      onError?.(err.message);
    }
    setLoading(false);
  }

  return (
    <>
      {withDesc ? (
        <div className="code comment mb-2">----- or using your account -----</div>
      ) : null}
      <div className="space-y-1">
        <Form
          onFinish={handleLogin}
          disabled={disabled}
        >
          <Input
            name="email"
            placeholder="email ="
            rules={[{ required: true }]}
            className="mb-2"
            hideErrorMessage
          />

          <Input
            name="password"
            placeholder="password ="
            appendIcon="password"
            rules={[{ required: true }]}
            className="mb-2"
            hideErrorMessage
          />
          <Button loading={loading} type="submit" className="code w-full">
            <span className="var">a</span>
            {'.'}
            <span className="func">withAccount</span>
            {'('}
            <span className="var">email</span>
            {', '}
            <span className="var">password</span>
            {')'}
          </Button>
        </Form>

      </div>
    </>
  );
}

export default FirebaseWithAccount
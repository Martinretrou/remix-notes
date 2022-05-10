import type { PropsWithChildren, ReactElement } from 'react';
import { useState } from 'react';
import { Form, useTransition } from 'remix';

export type AuthCreds = {
  email?: string;
  password?: string;
};

type AuthFormProps = {
  isSignIn?: boolean;
  errors?: AuthCreds & { service?: Array<string> };
};

function AuthForm({
  isSignIn: isSignInProp = true,
  errors = {},
}: PropsWithChildren<AuthFormProps>): ReactElement {
  const [isSignIn, setIsSignIn] = useState(isSignInProp);
  let transition = useTransition();

  return (
    <div className="auth-page">
      <div className="auth-page-logo">
        <h1 className="logo">
          Nabu <mark>notes</mark>
        </h1>
      </div>
      <Form className="auth-form" method="post">
        <fieldset>
          <legend>{isSignIn ? `Sign In` : `Sign Up!`}</legend>
          <div className="errors h-3 text-xs">
            {errors?.service &&
              errors.service.map((error) => (
                <span className="error">{error}</span>
              ))}
          </div>
          <br />
          <div className="input-container">
            <label className="" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className=""
              name="email"
              type="email"
              required
              placeholder="your email"
            />
            <div className="h-3 text-xs">{errors?.email && errors.email}</div>
          </div>
          <input type="hidden" name="is_sign_in" value={`${isSignIn}`} />
          <div className="input-container">
            <label className="" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className=""
              name="password"
              type="password"
              required
              placeholder="Your password."
            />
            <div className="h-3 text-xs">
              {errors?.password && errors.password}
            </div>
          </div>
          <div className="auth-form-buttons">
            <button type="submit" disabled={transition.state === 'submitting'}>
              {isSignIn ? `Sign In` : `Sign Up!`}
            </button>

            <div className="auth-form-options">
              <small className="block">
                {isSignIn ? `not a member?` : `already a member?`}
              </small>
              <button
                type="button"
                title={isSignIn ? `Sign Up!` : `Sign In`}
                onClick={() => {
                  setIsSignIn(!isSignIn);
                }}
              >
                {isSignIn ? `Sign Up!` : `Sign In`}
              </button>
            </div>
          </div>
        </fieldset>
      </Form>
    </div>
  );
}

export default AuthForm;

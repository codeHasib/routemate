"use client";

import { authClient } from "@/lib/auth-client";

const SignInPage = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const fromData = new FormData(e.target);
    const userInfo = Object.fromEntries(fromData.entries());
    const { data, error } = await authClient.signIn.email({
      email: userInfo.email, // required
      password: userInfo.password, // required
      callbackURL: "/",
    });
    if (data) console.log(data);
    else if (error) console.log(error);
  };
  const handleOut = async () => {
    await authClient.signOut();
    router.push("/");
  };
  return (
    <div>
      <h1>Sign in Page</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" required />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
        />
        <button type="submit">Sign In</button>
      </form>

      <button onClick={handleOut}>Signout</button>
    </div>
  );
};

export default SignInPage;

const SocialLogin = () => {
    const handleGoogleLogin = () => {
      window.location.href = "http://localhost:3000/auth/google";
    };
    
  return (
    <div className="social-login">
      <button
        className="social-button"
        onClick={handleGoogleLogin}
      >
        Sign in with Google
        <img
          src="googleicon.svg"
          alt="Google"
          width={25}
          className="social-icon"
        />
      </button>
    </div>
  );
};

export default SocialLogin;

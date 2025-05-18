const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-base-200 p-12">
      <div className="max-w-md text-center">
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="box" />
          <div className="box delay-200" />
          <div className="box delay-400" />
          <div className="box delay-600" />
          <div className="box delay-800" />
          <div className="box delay-1000" />
          <div className="box delay-1200" />
          <div className="box delay-1400" />
          <div className="box delay-1600" />
        </div>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-base-content/60">{subtitle}</p>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        .box {
          width: 60px;
          height: 60px;
          background: rgba(59, 130, 246, 0.1);
          border-radius: 16px;
          animation: pulse 1.5s infinite ease-in-out;
        }
        .delay-200 {
          animation-delay: 0.2s;
        }
        .delay-400 {
          animation-delay: 0.4s;
        }
        .delay-600 {
          animation-delay: 0.6s;
        }
        .delay-800 {
          animation-delay: 0.8s;
        }
        .delay-1000 {
          animation-delay: 1s;
        }
        .delay-1200 {
          animation-delay: 1.2s;
        }
        .delay-1400 {
          animation-delay: 1.4s;
        }
        .delay-1600 {
          animation-delay: 1.6s;
        }
      `}</style>
    </div>
  );
};

export default AuthImagePattern;

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutAdmin } from '~/api/auth/authAPI';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const LogoutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const doLogout = async () => {
      try {
        // 최소 2초 기다리기 위한 타이머
        const delay = new Promise((resolve) => setTimeout(resolve, 2000));

        // 서버 로그아웃과 동시에 2초 타이머 실행
        await Promise.all([
          logoutAdmin().catch((err) => console.error('서버 로그아웃 실패:', err)),
          delay
        ]);
      } finally {
        // 클라이언트 상태 초기화
        localStorage.removeItem('token');
        sessionStorage.clear();

        // 로그아웃 완료 후 이동
        navigate('/admin/login');
      }
    };

    doLogout();
  }, [navigate]);

  return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="w-48 h-48">
          <DotLottieReact
              src="https://lottie.host/eca275ba-15ee-4613-a538-c09fee4c52d3/9Ll5bZmsFR.lottie"
              loop
              autoplay
          />
        </div>
      </div>
  );
};

export default LogoutPage;

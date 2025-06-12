import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '~/api/authAPI';

const LogoutPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const doLogout = async () => {
      try {

        // 서버에 로그아웃 요청 (예: 쿠키 삭제, 세션 종료 등)
        await logout();

      } catch (error) {

        console.error('서버 로그아웃 실패:', error);

      } finally {
        // 클라이언트 상태 초기화
        localStorage.removeItem('token');
        sessionStorage.clear();

        // 0.5초 뒤 로그인 페이지로 이동
        setTimeout(() => {
          navigate('/login');
        }, 500);
      }
    };

    doLogout();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <h1 className="text-2xl font-semibold text-gray-700 mb-2">Logging out...</h1>
      <p className="text-gray-500">You will be redirected shortly.</p>
    </div>
  );
};

export default LogoutPage;

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '~/api/auth/authAPI';
import {LogoutLoading} from "~/util/loading/logoutLoading";
import {useTranslation} from "react-i18next";
import {useQueryClient} from "@tanstack/react-query";

const LogoutPage = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const queryClient = useQueryClient();


  useEffect(() => {
    const doLogout = async () => {
      try {
        // 최소 2초 기다리기 위한 타이머
        const delay = new Promise((resolve) => setTimeout(resolve, 1500));

        // 서버 로그아웃과 동시에 2초 타이머 실행
        await Promise.all([
          logout().catch((err) => console.error('서버 로그아웃 실패:', err)),
          delay
        ]);

        // 언어 설정 초기화 (영어로)
        i18n.changeLanguage("en");
      } finally {
        // 클라이언트 상태 초기화
        localStorage.removeItem('token');
        sessionStorage.clear();
        queryClient.clear();
        // 로그아웃 완료 후 이동
        navigate('/login');
      }
    };

    doLogout();
  }, [navigate]);

  return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="w-48 h-48">
          <LogoutLoading />
        </div>
      </div>
  );
};

export default LogoutPage;

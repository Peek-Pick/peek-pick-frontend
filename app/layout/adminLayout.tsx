import {Link, Outlet} from "react-router";


export default function AdminLayout() {


    return (
        <div className="wrapper min-h-screen flex">
            {/* 사이드바 */}
            <aside className="sidebar w-64 bg-white text-gray-800 shadow-md" data-color="white" data-active-color="danger">
                <div className="logo p-4 border-b border-gray-200">
                    <a href="https://www.creative-tim.com" className="simple-text logo-mini">
                        <div className="logo-image-small">
                            <img src="../../assets/img/logo-small.png" alt="logo" />
                        </div>
                    </a>
                    <a href="https://www.creative-tim.com" className="simple-text logo-normal font-bold text-lg">
                        Peek&amp;Pick
                    </a>
                </div>
                <nav className="sidebar-wrapper p-4">
                    <ul className="nav space-y-2">
                        <li className="active">
                            <Link to="/admin/dashboard" className="flex items-center space-x-2 text-red-500">
                                <i className="nc-icon nc-bank" />
                                <p>대시보드</p>
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/points/list" className="flex items-center space-x-2 hover:text-red-500">
                                <i className="nc-icon nc-basket" />
                                <p>상품</p>
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/points/list" className="flex items-center space-x-2 hover:text-red-500">
                                <i className="nc-icon nc-badge" />
                                <p>사용자</p>
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/points/list" className="flex items-center space-x-2 hover:text-red-500">
                                <i className="nc-icon nc-bell-55" />
                                <p>리뷰</p>
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/points/list" className="flex items-center space-x-2 hover:text-red-500">
                                <i className="nc-icon nc-chat-33" />
                                <p>문의</p>
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/points/list" className="flex items-center space-x-2 hover:text-red-500">
                                <i className="nc-icon nc-bell-55" />
                                <p>신고</p>
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/notices/list" className="flex items-center space-x-2 hover:text-red-500">
                                <i className="nc-icon nc-paper" />
                                <p>공지</p>
                            </Link>
                        </li>
                        <li className="active-pro">
                            <Link to="/admin/points/list" className="flex items-center space-x-2 text-yellow-500">
                                <i className="nc-icon nc-cart-simple" />
                                <p>포인트 상점</p>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* 메인 패널 */}
            <main className="main-panel flex-1 bg-gray-100 ml-64">
                {/* 네비게이션 바 */}
                <nav className="navbar sticky top-0 bg-white shadow z-10">
                    <div className="container mx-auto flex items-center justify-between p-4">
                        <div className="navbar-wrapper flex items-center">
                            <button type="button" className="navbar-toggler">
                                <span className="navbar-toggler-bar bar1"></span>
                                <span className="navbar-toggler-bar bar2"></span>
                                <span className="navbar-toggler-bar bar3"></span>
                            </button>
                            <a className="navbar-brand ml-4 text-lg font-bold" href="#">
                                Dashboard
                            </a>
                        </div>

                        <div className="flex items-center space-x-4">
                            <form className="relative">
                                <input
                                    type="text"
                                    className="form-control px-4 py-2 rounded border border-gray-300"
                                    placeholder="Search..."
                                />
                                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                                    <i className="nc-icon nc-zoom-split"></i>
                                </div>
                            </form>
                            <a className="nav-link" href="#">
                                <i className="nc-icon nc-layout-11"></i>
                            </a>
                            <div className="relative group">
                                <button className="nav-link">
                                    <i className="nc-icon nc-bell-55"></i>
                                </button>
                                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg hidden group-hover:block">
                                    <a className="block px-4 py-2 hover:bg-gray-100" href="#">
                                        Action
                                    </a>
                                    <a className="block px-4 py-2 hover:bg-gray-100" href="#">
                                        Another action
                                    </a>
                                    <a className="block px-4 py-2 hover:bg-gray-100" href="#">
                                        Something else here
                                    </a>
                                </div>
                            </div>
                            <a className="nav-link" href="#">
                                <i className="nc-icon nc-settings-gear-65"></i>
                            </a>
                        </div>
                    </div>
                </nav>

                {/* 여기서 자식 컴포넌트 렌더링 */}
                <section className="p-6">
                    <Outlet />
                </section>

            </main>
        </div>
    );
}
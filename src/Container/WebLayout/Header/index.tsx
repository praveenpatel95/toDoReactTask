import {Link, useNavigate} from "react-router-dom";
import './style.scss'

function Header() {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    }
    return (
        <nav className="navbar navbar-expand-lg ">
            <div className="container-fluid">
                {/* Left Menu */}
                <Link className="navbar-brand" to="/todo-list">
                    ToDo App
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item">
                            <Link className="nav-link active" to="/todo-list">
                                Task
                            </Link>
                        </li>

                    </ul>

                    <button className="btn btn-danger" onClick={() => handleLogout()}>Logout</button>
                </div>
            </div>
        </nav>

    )
}

export default Header;
import '../styles/main_style.css';
import { useNavigate } from 'react-router-dom';

function Header() {
   const navigate = useNavigate();

    return (
        <header className="cusheader">
            <h1 style={{marginTop: '0px', marginBottom: '0px', fontSize: '40px'}}>PLATEAUS</h1>
            <div className="header-button-holder" style={{marginTop: '0px', marginBottom: '0px'}}>
                <button className="header-button" onClick={() => navigate('/where/am/i')}>About</button>
                <button className="header-button" onClick={() => navigate('/shelves')}>Main Page</button>
            </div>
        </header>
    );
}

export default Header;

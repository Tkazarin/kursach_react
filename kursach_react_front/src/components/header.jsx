import '../styles/main_style.css';
import { useNavigate } from 'react-router-dom';

function Header() {
   const navigate = useNavigate();

    return (
        <header className="cusheader">
            <h1 style={{marginTop: '0px', marginBottom: '0px', fontSize: '40px'}}>PLATEAUS</h1>
            <div className="header-button-holder" style={{marginTop: '0px', marginBottom: '0px'}}>
                <button className="header-button" onClick={() => navigate('/where/am/i')}>
                    <img src="/about.svg" alt="" style={{ width: 'auto', height: '23px', verticalAlign: 'middle' }}/>
                </button>
                <button className="header-button" onClick={() => navigate('/shelves')}>
                    <img src="/main.svg" alt="" style={{ width: 'auto', height: '23px', verticalAlign: 'middle' }}/>
                </button>
            </div>
        </header>
    );
}

export default Header;

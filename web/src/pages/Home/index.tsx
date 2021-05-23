import React from 'react';
import { FiLogIn } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { Translate } from '../../Internacionalization/PR_BR';

import './styles.css';

import logo from '../../assets/logo.svg';
import bg from '../../assets/bg.png';

const Home = () => {
    return (
        <>
            <div className="margin" id="page-home">
            <div className="login-container">
                <section className="form">
                    
                    <img src={logo} alt="Be My Hero" className="img-size header" />
                    
                    <main>
                        <h1>{ Translate.map(app => app.Home.TITLE_HOME) }</h1>
                        <p>{ Translate.map(app => app.Home.SUBTITLE) }</p>
                        <Link to="/create-point">
                            <span>
                                <FiLogIn/>
                            </span>
                            <strong>
                            { Translate.map(app => app.Home.REGISTER) }
                            </strong>
                        </Link>
                        
                    </main>
                </section>
                <img src={bg} alt="Heroes" className="img-50"/>
            </div>
            </div>
        </>
    )
}

export default Home;
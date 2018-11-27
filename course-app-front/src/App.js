import React, { Component } from 'react';
import './App.css';
import './basics.css';

import NavBar from './components/navbarComponent/NavBar';
import Redirect from 'react-router/es/Redirect';
import Welcome from './components/welcomeComponent/Welcome';
import CourseSelectionComponent from './components/courseSelectionComponent/CourseSelectionComponent';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuOpen: false,
        };
    }

    openMenu() {
        this.setState({menuOpen: true});
    }

    closeMenu() {
        this.setState({menuOpen: false});
    }


    render() {
        return (
            <div className="App" onClick={() => this.closeMenu()}>
                <nav>
                    <span className='sm-only'
                          onClick={e => {
                              this.setState({menuOpen: !this.state.menuOpen});
                              e.stopPropagation();
                          }}>
                        {/*<FontAwesomeIcon icon='list' style={{margin: '0 30px'}}/>*/}
                    </span>

                    <NavBar className='lg-only'/>
                </nav>
                <aside className={this.state.menuOpen ? 'menu-open' : 'menu-closed'}>

                </aside>
                <main className={'flex-container ' + (this.state.menuOpen ? 'menu-open' : 'menu-closed')}>
                    <Welcome />
                    <CourseSelectionComponent/>
                    {/*<MainComponentManager></MainComponentManager>*/}
                    {/*<SocialNetworksDiv></SocialNetworksDiv>*/}
                </main>
                <footer>
                    <div style={{color: 'var(--main-color)'}}>Rainbow Travel Agency &copy; 2018</div>
                </footer>

            </div>
        );
    }
}

export default App;

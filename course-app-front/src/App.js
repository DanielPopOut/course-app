import React, { Component } from 'react';
import './App.css';
import './basics.css';
import NavBar from './components/NavbarComponent/NavBar';
import {Route} from 'react-router-dom';
import Welcome from './components/WelcomeComponent/Welcome';
import Courses from './components/CoursesComponent/Courses';
import ConnexionComponent from './components/ConnexionComponent/ConnexionComponent';


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
                    <span className='sm-only  '
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
                <main className={' container ' + (this.state.menuOpen ? 'menu-open' : 'menu-closed')}>

                    <Route exact path='/' component = {Welcome}/>
                    <Route path='/welcome' component = {Welcome}/>
                    <Route path='/courses' component = {Courses}/>
                    <Route path='/connexion' component = {ConnexionComponent}/>

                    {/*<CourseSelectionComponent/>*/}

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

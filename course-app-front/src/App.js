import React, { Component } from 'react';
import './App.css';
import './basics.css';
import NavBar from './components/NavbarComponent/NavBar';
import {Route} from 'react-router-dom';
import Welcome from './components/WelcomeComponent/Welcome';
import Courses from './components/CoursesComponent/Courses';
import Departments from './components/DepartmentsComponent/Departments'
import ConnexionComponent from './components/ConnexionComponent/ConnexionComponent';
import ContactsComponent from './components/ContactsComponent/ContactsComponent';
import Users from './components/UsersComponent/Users';
import DataManagerPage from './components/DanielComponent/DataManagerPage/DataManagerPage';
import {
    chaptersModel, coursesModel, levelsModel, sectionsModel,
    syllabusesModel,
} from './components/DataManagerComponent/DataModelsComponent';
import {getToken, userLogged$ } from './server/axiosInstance';


class App extends Component {
    constructor(props) {
        super(props);
        userLogged$.subscribe(bool => {this.handleUserLogin(bool)});
        this.state = {
            menuOpen: false,
            loggedIn: false,
            decodedToken: '',
        };
    }

    handleUserLogin(bool){
        this.setState({loggedIn: bool})
        if (bool){
            this.setDecodedToken();
        }
    }

    setDecodedToken() {
        let token = getToken();
        if (!getToken() || getToken().length < 1) return;
        console.log(JSON.parse(window.atob(token.split('.')[1])));
        this.setState({
            decodedToken: JSON.parse(window.atob(token.split('.')[1])),
        });
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
                    <NavBar className='lg-only' loggedIn={this.state.loggedIn} decodedToken={this.state.decodedToken}/>
                </nav>
                <aside className={this.state.menuOpen ? 'menu-open' : 'menu-closed'}>

                </aside>
                <main className={' container ' + (this.state.menuOpen ? 'menu-open' : 'menu-closed')}>

                    <Route exact path='/' component = {Welcome}/>
                    <Route path='/welcome' component = {Welcome}/>
                    <Route path='/departments' component = {Departments}/>
                    <Route path='/courses' component = {Courses}/>
                    <Route path='/users' component = {Users}/>
                    <Route path='/contacts' component = {ContactsComponent}/>
                    <Route path='/connexion' component = {ConnexionComponent}/>
                    <Route path='/daniel' render={(props) => <DataManagerPage {...props} collection='users'/>}/>


                    {/*<DataManagerPage {...coursesModel} />*/}
                    {/*<DataManagerPage {...chaptersModel}/>*/}
                    {/*<DataManagerPage {...sectionsModel}/>*/}
                    {/*<DataManagerPage {...levelsModel}/>*/}

                </main>
                <footer>
                </footer>
            </div>
        );
    }
}

export default App;

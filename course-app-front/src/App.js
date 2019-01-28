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
import {usersModel,
    chaptersModel, coursesModel, levelsModel, sectionsModel,
    syllabusesModel, UsersModel,
} from './components/DataManagerComponent/DataModelsComponent';
import {getToken, removeToken, userLogged$} from './server/axiosInstance';
import ModalComponent from "./components/DanielComponent/Modal/ModalComponent";
import Redirect from "react-router-dom/es/Redirect";



class App extends Component {
    constructor(props) {
        super(props);
        userLogged$.subscribe(bool => {this.handleUserLogin(bool)});
        this.state = {
            menuOpen: false,
            loggedIn: false,
            decodedToken: '',
            modalVisibility: false,
            modalChildren: ""
        };
    }

    handleUserLogin(bool){
        this.setState({loggedIn: bool})
        if (bool){
            this.setDecodedToken();
            this.setState({
                modalVisibility: false,
                modalChildren: ""
            });
        }else {

        }
    }

    handleModalclose() {
        this.setState({
            modalVisibility: false,
            modalChildren: ""
        });
    }

    openLoginModal() {
        this.setState({
            modalVisibility: true,
            modalChildren: <ConnexionComponent/>
        });
    }
    setDecodedToken() {
        let token = getToken();
        console.log("here my token : "+token);
        if (!getToken() || getToken().length < 1) return;
        console.log(JSON.parse(window.atob(token.split('.')[1])));
        this.setState({
            decodedToken: JSON.parse(window.atob(token.split('.')[1])),
        });
    }
    deleteToken(){
        if (getToken() || getToken().length > 1) {
            removeToken()
        };
        this.setState({
            loggedIn: false,
            decodedToken: ''
        });
        return <Redirect to={'/welcome'}/>
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
                <ModalComponent
                    visible={this.state.modalVisibility}
                    children={this.state.modalChildren}
                    onClose={() => this.handleModalclose()}
                />
                <nav>
                    <span className='sm-only  '
                          onClick={e => {
                              this.setState({menuOpen: !this.state.menuOpen});
                              e.stopPropagation();
                          }}>
                        {/*<FontAwesomeIcon icon='list' style={{margin: '0 30px'}}/>*/}
                    </span>
                    <NavBar
                        className='lg-only'
                        loggedIn={this.state.loggedIn}
                        decodedToken={this.state.decodedToken}
                        openLoginModal={()=>this.openLoginModal()}
                        logout={()=>this.deleteToken()}
                    />
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
                    <Route path='/daniel' render={(props) => <DataManagerPage {...props} {...UsersModel} collection='users'/>}/>


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

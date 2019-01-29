import React, { Component } from 'react';
import './App.css';
import './basics.css';
import NavBar from './components/NavbarComponent/NavBar';
import {Route} from 'react-router-dom';
import Welcome from './components/WelcomeComponent/Welcome';
import Courses from './components/CoursesComponent/Courses';
import Course from './components/CoursesComponent/Course';
import Departments from './components/DepartmentsComponent/Departments'
import ConnexionComponent from './components/ConnexionComponent/ConnexionComponent';
import ContactsComponent from './components/ContactsComponent/ContactsComponent';
import Users from './components/UsersComponent/Users';
import DataManagerPage from './components/DanielComponent/DataManagerPage/DataManagerPage';
import {usersModel,
    chaptersModel, coursesModel, levelsModel, sectionsModel,
    syllabusesModel,
} from './components/DataManagerComponent/DataModelsComponent';
import {getToken, removeToken, userLogged$, messageToShow$} from './server/axiosInstance';
import ModalComponent from "./components/DanielComponent/Modal/ModalComponent";
import Redirect from "react-router-dom/es/Redirect";



class App extends Component {
    constructor(props) {
        super(props);
        userLogged$.subscribe(bool => {this.handleUserLogin(bool)});
        messageToShow$.subscribe(message => {this.handleMessageToShow(message)});
        this.state = {
            menuOpen: false,
            loggedIn: false,
            decodedToken: '',
            modalVisibility: false,
            modalChildren: "",
            messageModalVisibility: false,
            messageToShow: '',
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
            this.setState({
                loggedIn: false,
                decodedToken: ''
            });
        }
    }

    handleMessageToShow(message){
        this.setState({
            messageModalVisibility: true,
            messageToShow: message,
        });
        setTimeout(()=>this.setState({
            messageModalVisibility: false,
            messageToShow: '',
        }),2000);
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
                    onClose={() => this.handleModalclose()}
                >
                    {this.state.modalChildren}
                </ModalComponent>
                <ModalComponent
                    visible={this.state.messageModalVisibility}
                >
                    <div style={{color: 'black'}}>{this.state.messageToShow}</div>
                </ModalComponent>
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
                    <Route path='/course/:id' component = {Course}/>
                    <Route path='/users' component = {Users}/>
                    <Route path='/contacts' component = {ContactsComponent}/>
                    <Route path='/connexion' component = {ConnexionComponent}/>
                    <Route path='/daniel' render={(props) => <DataManagerPage {...props} {...usersModel} collection='users'/>}/>


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

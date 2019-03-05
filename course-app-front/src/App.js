import React, { Component } from 'react';
import './App.css';
import './basics.css';
import NavBar from './components/NavbarComponent/NavBar';
import { Route} from 'react-router-dom';
import Welcome from './components/WelcomeComponent/Welcome';
import Courses from './components/CoursesComponent/Courses';
import Course from './components/OneCourseComponent/Course';
import ConnexionComponent from './components/ConnexionComponent/ConnexionComponent';
import ContactsComponent from './components/ContactsComponent/ContactsComponent';
import Users from './components/UsersComponent/Users';
import DataManagerPage from './components/DanielComponent/DataManagerPage/DataManagerPage';
import {usersModel} from './components/DataManagerComponent/DataModelsComponent';
import {getToken, removeToken,getDecodedToken, userLogged$,messageToShow$ ,urlRedirection$} from './server/axiosInstance';
import ModalComponent, { ModalComponent2 } from './components/DanielComponent/Modal/ModalComponent';
import MCQsManagerComponent from './components/MCQsComponent/MCQsManagerComponent';
import TestsManagerComponent from './components/MCQsComponent/TestsMangerComponent';

import QuillComponent from './components/DanielComponent/QuillComponent/QuillComponent';
import CreateCourseComponent from './components/DanielComponent/CreateCourseComponent/CreateCourseComponent';
import Connexion from "./components/ConnexionComponent/Connexion";
import {Redirect} from "react-router";

class App extends Component {
    constructor(props) {
        super(props);
        userLogged$.subscribe(bool => {this.handleUserLogin(bool)});
        messageToShow$.subscribe(message => {this.handleMessageToShow(message)});
        urlRedirection$.subscribe(url=>this.handleRedirection(url));
        this.state = {
            menuOpen: false,
            loggedIn: false,
            decodedToken: '',
            messageModalVisibility: false,
            messageToShow: '',
        };
    }

    handleUserLogin(bool){
        this.setState({loggedIn: bool});
        if (bool){
            this.setDecodedToken();
        }else {
            this.closeModal();
        }
    }
    handleRedirection(url){
        return <Redirect to={url}/>;
    }

    handleMessageToShow(message){
        this.setState({
            messageModalVisibility: true,
            messageToShow: message,
        });
        setTimeout(()=>this.closeModal(),2000);
    }

    setDecodedToken() {
        this.setState({
            decodedToken: getDecodedToken() || "",
        });
    }

    openMenu() {
        this.setState({menuOpen: true});
    }

    closeMenu() {
        this.setState({menuOpen: false});
    }
    closeModal(){
        this.setState({
            messageModalVisibility: false,
            messageToShow: '',
        })
    }
    componentDidMount(){
        if(getDecodedToken()){ this.setState({ loggedIn:true });}
    }


    render() {
        return (
            <div className="App" onClick={() => this.closeMenu()}>
                <ModalComponent
                    visible={this.state.messageModalVisibility}
                    onClose={()=>this.closeModal()}
                    position={25}
                >
                    <div style={{color: 'black'}}>{this.state.messageToShow}</div>
                </ModalComponent>
                <div>
                    <nav>
                        <span className='sm-only  '
                              onClick={e => {
                                  this.setState({menuOpen: !this.state.menuOpen});
                                  e.stopPropagation();
                              }}>
                        {/*<FontAwesomeIcon icon='list' style={{margin: '0 30px'}}/>*/}
                        </span>
                        <NavBar
                        /* className='lg-only'*/
                        loggedIn={this.state.loggedIn}
                        />
                    </nav>
                </div>
                <aside className={this.state.menuOpen ? 'menu-open' : 'menu-closed'}>

                </aside>
                <main className={' container ' + (this.state.menuOpen ? 'menu-open' : 'menu-closed')}>

                    <Route exact path='/' component = {Welcome}/>
                    <Route path='/welcome' component = {Welcome}/>

                    <Route path='/courses'  render={(props) => <Courses {...props} loggedIn={this.state.loggedIn}/>}/>
                    <Route path='/course/:id' component = {Course}/>
                    <Route path='/users' component = {Users}/>
                    <Route path='/contacts' component = {ContactsComponent}/>
                    <Route path='/connexion' component = {ConnexionComponent}/>
                    <Route path='/daniel' render={(props) => <DataManagerPage {...props} {...usersModel} collection='users'/>}/>
                    {/*<Route path='/quill' render={(props) => <QuillComponent/>}/>*/}
                    <Route path='/createcourse' render={(props) => <CreateCourseComponent/>}/>
                    <Route path='/mcqs' component={MCQsManagerComponent}/>
                    <Route path='/tests' component={TestsManagerComponent}/>

                </main>
                <footer>
                </footer>
                <ModalComponent2/>

            </div>
        );
    }
}

export default App;

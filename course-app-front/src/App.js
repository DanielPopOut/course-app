import React, { Component } from 'react';
import './App.css';
import './basics.css';
import NavBar from './components/NavbarComponent/NavBar';
import {Route} from 'react-router-dom';
import Welcome from './components/WelcomeComponent/Welcome';
import Courses from './components/CoursesComponent/Courses';
import Course from './components/CoursesComponent/Course';
import ConnexionComponent from './components/ConnexionComponent/ConnexionComponent';
import ContactsComponent from './components/ContactsComponent/ContactsComponent';
import Users from './components/UsersComponent/Users';
import UserProfile from './components/UsersComponent/UserProfile';
import DataManagerPage from './components/DanielComponent/DataManagerPage/DataManagerPage';
import {usersModel} from './components/DataManagerComponent/DataModelsComponent';
import {getDecodedToken, userLogged$,messageToShow$ ,urlRedirection$} from './server/axiosInstance';
import ModalComponent, { ModalComponent2 } from './components/DanielComponent/Modal/ModalComponent';
import MCQSManagerComponent from './components/MCQsComponent/MCQSManagerComponent';
import CreateCourseComponent from './components/DanielComponent/CreateCourseComponent/CreateCourseComponent';
import CourseCreation from './components/CoursesComponent/CourseCreation';
import CoursesAdministration from "./components/CoursesAdministrationComponent/CoursesAdministration";

import history from './history';


class App extends Component {
    constructor(props) {
        super(props);
        userLogged$.subscribe(bool => {this.handleUserLogin(bool)});
        messageToShow$.subscribe(message => {this.handleMessageToShow(message)});
        urlRedirection$.subscribe(url=>this.handleRedirection(url));
        this.state = {
            menuOpen: false,
            loggedIn: false,
            messageModalVisibility: false,
            messageToShow: '',
        };
    }

    handleUserLogin(bool){
        this.setState({loggedIn: bool});
        if(bool===false){
            //this.handleRedirection("/welcome");
        }
    }


    handleRedirection(url=null){
        if(url){
            history.push(url);
        }
    }

    handleMessageToShow(message){
        this.setState({
            messageModalVisibility: true,
            messageToShow: message,
        });
        setTimeout(()=>this.closeModal(),2000);
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
        if(getDecodedToken()){
            this.setState({ loggedIn:true });
        }else {
            console.log("current history ", history ," and props ", this.props);
            this.handleRedirection('/welcome');
        }
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
                <nav>
                    <span className='sm-only  '
                              onClick={e => {
                                  this.setState({menuOpen: !this.state.menuOpen});
                                  e.stopPropagation();
                              }}>
                        {/*<FontAwesomeIcon icon='list' style={{margin: '0 30px'}}/>*/}
                        </span>
                    <NavBar loggedIn={this.state.loggedIn}/>
                </nav>
                <aside className={this.state.menuOpen ? 'menu-open' : 'menu-closed'}>

                </aside>
                <main className={' container ' + (this.state.menuOpen ? 'menu-open' : 'menu-closed')}>
                    <Route exact path='/' component = {Welcome}/>
                    <Route path='/welcome' component = {Welcome}/>
                    <Route exact path='/courses'  render={(props) => <Courses {...props} loggedIn={this.state.loggedIn}/>}/>
                    <Route path='/course/:id' component = {Course}/>
                    <Route exact path='/courses/administration' component={CoursesAdministration}/>
                    <Route path='/users' component = {Users}/>
                    <Route path={"/profile"} component={UserProfile}/>
                    <Route path='/contacts' component = {ContactsComponent}/>
                    <Route path='/contacts/administration' component = {ContactsComponent}/>
                    <Route path='/connexion' component = {ConnexionComponent}/>
                    <Route path='/daniel' render={(props) => <DataManagerPage {...props} {...usersModel} collection='users'/>}/>
                   {/* <Route path='/createcourse' render={(props) => <CreateCourseComponent/>}/>*/}
                    <Route path='/createcourse' component ={CourseCreation}/>
                    <Route path='/mcqs' component={MCQSManagerComponent}/>

                </main>
                <footer>
                </footer>
                <ModalComponent2/>
            </div>
        );
    }
}

export default App;

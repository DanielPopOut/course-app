import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import Welcome from './components/WelcomeComponent/Welcome';
import { getDecodedToken, messageToShow$, urlRedirection$, userLogged$, } from '../server/axiosInstance';
import ModalComponent from './components/Modal/ModalComponent';
import { Redirect } from 'react-router';
import styled from 'styled-components';
import './basic_colors.css'


class App2 extends Component {
    constructor(props) {
        super(props);
        userLogged$.subscribe(bool => {this.handleUserLogin(bool);});
        messageToShow$.subscribe(message => {this.handleMessageToShow(message);});
        urlRedirection$.subscribe(url => this.handleRedirection(url));
        this.state = {
            menuOpen: false,
            loggedIn: false,
            decodedToken: '',
            messageModalVisibility: false,
            messageToShow: '',
        };
    }

    handleUserLogin(bool) {
        this.setState({loggedIn: bool});
        if (bool) {
            this.setDecodedToken();
        } else {
            this.closeModal();
        }
    }

    handleRedirection(url) {
        return <Redirect to={url}/>;
    }

    handleMessageToShow(message) {
        this.setState({
            messageModalVisibility: true,
            messageToShow: message,
        });
        setTimeout(() => this.closeModal(), 2000);
    }

    setDecodedToken() {
        this.setState({
            decodedToken: getDecodedToken() || '',
        });
    }

    toggleMenu() {
        this.setState({menuOpen: !this.state.menuOpen});
    }

    closeMenu() {
        this.setState({menuOpen: false});
    }

    closeModal() {
        this.setState({
            messageModalVisibility: false,
            messageToShow: '',
        });
    }

    componentDidMount() {
        if (getDecodedToken()) {
            this.setState({loggedIn: true});
        }
    }


    render() {
        return (
            <AppDiv className="App" onClick={() => this.closeMenu()}>
                <ModalComponent
                    visible={this.state.messageModalVisibility}
                    onClose={() => this.closeModal()}
                    position={25}
                >
                    <div style={{color: 'black'}}>{this.state.messageToShow}</div>
                </ModalComponent>
                <div>
                    <nav className='flex'>
                        <span className='sm-only '
                              onClick={e => {
                                  this.toggleMenu();
                                  e.stopPropagation();
                              }}>
                            Menu
                        </span>
                        <span>Connexion</span>

                        {/*<NavBar*/}
                        {/*className='lg-only'*/}
                        {/*loggedIn={this.state.loggedIn}*/}
                        {/*/>*/}
                        <NavBar linksArray={navBarElements} onClick={x=> console.log(x)}/>

                    </nav>
                </div>
                <AsideComponent className={this.state.menuOpen ? 'open' : ''}>
                    <div className='menu flex' onClick={e => e.stopPropagation()}>
                        <CloseSpan/>

                        <NavBar linksArray={navBarElements} onClick={x=> console.log(x)} column/>

                    </div>

                </AsideComponent>
                <aside className={this.state.menuOpen ? 'open' : ''}>

                </aside>
                <main className={' container ' + (this.state.menuOpen ? 'menu-open' : 'menu-closed')}>

                    <Route path='/welcome' component={Welcome}/>

                </main>
                <footer>
                </footer>
                {/*<ModalComponent2/>*/}

            </AppDiv>
        );
    }
}

const AppDiv = styled.div`
      
`;

const AsideComponent = styled.div`
    height: 100%;
    position: fixed;
    transform: translateX(-3000px);
    transition: .5s cubic-bezier(.4,0,.2,1);
    transition-property: transform,width,max-width,-webkit-transform;
    display: flex;
    top: 0px;
    left: 0;
    right: 0;

    
    &.open {
        transform: translateX(0);
    }
    
    .menu {
        max-width: 300px;
        width: 40%;
        display:flex;
        align-items: center;
        color: black;
        position: relative;
        border: 1px solid black;
        background-color: var(--main-color);

    }
`;

const CloseSpan = styled.span`
    border: 3px solid white;
    background-color: white;
    position: absolute;
    right: 0px;
    top: 10px;
`;
const StyleNavBar = styled.div`
    color: black;
    display: flex;
    justify-content: space-evenly;

    
    & > * {
        padding: 10px;
    }
    
    &.column-navbar {
        flex-direction: column;
        
    }
    
    &.column-navbar > * {
        padding: 10px;
        border-bottom: 1px solid white;
    }
`;

const NavBar = ({linksArray, onClick, column}) =>{
    console.log(column);
   return <StyleNavBar className={column ? 'column-navbar' : ''}>
        {linksArray.map(x => <div onClick={()=>onClick(x)} key={x.text}>{x.text}</div>)}
</StyleNavBar>;
}


const navBarElements = [
    {text: 'Accueil', link: 'welcome'},
    {text: 'Cours', link: 'course'},
    {text: 'Test', link: 'test'},
    {text: 'A propos', link: 'about'},
]

export default App2;

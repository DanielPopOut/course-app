import React, { Component } from 'react';
import { showModal } from '../../../modal/ModalService';
import BasicFormCreatorComponent from '../FormCreator/BasicFormCreatorComponent';
import { titleModel } from '../../DataManagerComponent/DataModelsComponent';
import QuillComponent from '../QuillComponent/QuillComponent';
import './CreateCourseComponent.css';
import { ServerService } from '../../../server/ServerService';

class CreateCourseComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {text: '', delta: {}, modalVisibility: false, courseData: ''}; // You can also pass a Quill Delta here
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(value, delta, source, editor) {
        //console.log(typeof value, delta);
        //console.log('get content', editor.getContents());
        this.setState({text: value, delta: editor.getContents(), other: {source, editor: editor.getContents()}});
        if (this.props.onChange) {
            this.props.onChange({text: value, delta: editor.getContents()});
        }
    }

    async createNewCourseOnServer(title){
        let courseData = {title, content: '', chapters: []};
        let courseInserted = await ServerService.insertElementInDataBase('courses',courseData);

        //console.log('result', courseInserted);
        return courseInserted;
    }

    createNewCourse(courseDataWithId) {
        this.setState({courseData: courseDataWithId});
    }

    render() {
        return (
            <div>
                {/*{[new QuillComponent2(),new QuillComponent2()]}*/}
                {this.state.courseData ?
                    <SectionElementComponent element={this.state.courseData} elementName='course'/> :
                    <button onClick={() => showModal({
                        children: <BasicFormCreatorComponent
                            dataModel={titleModel({placeholder: 'Course title', label: 'New course name'})}
                            onValidate={async data => {
                                console.log(data);
                                if (data.title) {
                                    let courseCreatedWithId = await this.createNewCourseOnServer(data.title);
                                    if (courseCreatedWithId){
                                        this.createNewCourse(courseCreatedWithId);
                                        showModal(false);
                                    }
                                }
                            }}/>
                    })}>New Course</button>
                }
            </div>
        );
    }
}

export default CreateCourseComponent;

let lowerLevelComponentName = {
    course: 'chapter',
    chapter: 'section',
    section: 'subsection'
};

let collectionDbName = {
    course: 'courses',
    chapter: 'chapters',
    section: 'sections',
    subsection: 'subsections',
};

class SectionElementComponent extends Component {
    constructor(props) {
        console.log('initialise elementCOmp', props.element);
        super(props);
        this.state = {element: Object.assign({},props.element), children: []}; // You can also pass a Quill Delta here
    }

    async createNewchildSectionOnServer(title){

        let childSectionData = {title, content: ''};
        if(lowerLevelComponentName[lowerLevelComponentName[this.props.elementName]]){
            childSectionData[lowerLevelComponentName[lowerLevelComponentName[this.props.elementName]]+'s']=[];
        }
        console.log("childElement ",childSectionData);

        let data={
            element:{
                elementName:this.props.elementName,
                elementProperties:this.state.element
            },
            childelement:childSectionData
        };

        let childSectionInserted = await ServerService.postToServer('courses/newSubElement', data).then(
            (response)=>{
                console.log("this is the response",response);
                if (response.status === 200) {
                    console.log("data inserted", response.data);
                    return response.data;
                }
            }
        );
        return childSectionInserted;
    }

    createNewchildSection(childSectionDataWithId) {
        this.setState({children: [...this.state.children,childSectionDataWithId]});
    }

    async modifyContentOnServer(newContent){
        let changeDone = await ServerService.updateElementInDataBase(collectionDbName[this.props.elementName],this.state.element,{"content": newContent});
        return changeDone;
    }

    modifyContent(content) {
        this.setState({
            element: Object.assign({}, this.state.element, {content: content}),
        });
    }
   async modifyTitleOnServer(newTitle){
        alert("Here");
        console.log("this state element",this.state.element);
        let changeDone = await ServerService.updateElementInDataBase(collectionDbName[this.props.elementName],this.state.element,{"title": newTitle});
        return changeDone;
    }

   modifyTitle(newTitle){
        this.setState({
            element: Object.assign({}, this.state.element, {title:newTitle}),
        });
   }

    createAddContentButton(){
        let objectToShow = this.state.element;
        return <button onClick={() => showModal({
            children: <QuillComponent
                text={this.state.element.content}
                onValidate={
                    async data => {
                        console.log(data);
                        let newContent = data.text
                        if (newContent) {
                            let result = await this.modifyContentOnServer(newContent);
                            if (result){
                                this.modifyContent(newContent);
                                showModal(false);
                            }
                        }
                    }
                }
            />,
        })}>{objectToShow.content ? 'Modify' : 'Add'} content</button>
    }
    createNextChildSectionButton(elementName) {
        let nextElementName = lowerLevelComponentName[elementName];
        if(!nextElementName) return '';
        return <button onClick={() => showModal({
            children: <BasicFormCreatorComponent
                dataModel={titleModel({placeholder: nextElementName + ' title', label: 'New ' + nextElementName})}
                onValidate={async data => {
                    console.log(data);
                    if (data.title) {
                        let elementCreatedWithId = await this.createNewchildSectionOnServer(data.title);
                        if (elementCreatedWithId){
                            this.createNewchildSection(elementCreatedWithId);
                            showModal(false);
                        }
                    }
                }}/>,
        })}>Add {nextElementName}</button>
    }

    modifyTitleButton(elementName) {
        let nextElementName = lowerLevelComponentName[elementName];
        return <button onClick={() => showModal({
            children: <BasicFormCreatorComponent
                dataModel={titleModel({placeholder: elementName + ' title', label: 'Modify ' + elementName})}
                onValidate={async data => {
                    console.log(data);
                    let newTitle = data.title;
                    if (newTitle) {
                        let result = await this.modifyTitleOnServer(newTitle);
                        if (result){
                            this.modifyTitle(newTitle);
                            showModal(false);
                        }
                    }
                }}/>,
        })}>Modify title</button>
    }

    generateButtons(elementName){
        return <span>{this.modifyTitleButton(elementName)} {this.createAddContentButton()} {this.createNextChildSectionButton(elementName)}</span>
    }

    render() {
        let props = this.props;
        let state =  this.state;
       // console.log(props, state);
        let objectToShow = state.element;
        let elementName = props.elementName;
        let nextElementName = lowerLevelComponentName[props.elementName];
        return <div className={'section-element-component ' + props.elementName}>
            <div>{objectToShow.title }  {this.generateButtons(elementName)}</div>
            <div className='ql-editor' dangerouslySetInnerHTML={{ __html: state.element.content }} />
            {state.children.map((childSection,key) => <SectionElementComponent  key={key} key_id={childSection._id} element={childSection} elementName={nextElementName}/>)}
        </div>;
    }
}


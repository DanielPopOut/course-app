import React, { Component } from 'react';
import { showModal } from '../../../modal/ModalService';
import BasicFormCreatorComponent from '../FormCreator/BasicFormCreatorComponent';
import { titleModel } from '../../DataManagerComponent/DataModelsComponent';
import QuillComponent from '../QuillComponent/QuillComponent';


class CreateCourseComponent extends Component {
    formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image', 'formula',
    ];
    modules = {
        toolbar: [
            [{'header': [1, 2, false]}],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
            ['link', 'image', 'formula'],
            ['clean'],
        ],
    };

    constructor(props) {
        super(props);
        this.state = {text: '', delta: {}, modalVisibility: false, courseData: ''}; // You can also pass a Quill Delta here
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(value, delta, source, editor) {
        console.log(typeof value, delta);
        console.log('get content', editor.getContents());
        this.setState({text: value, delta: editor.getContents(), other: {source, editor: editor.getContents()}});
        if (this.props.onChange) {
            this.props.onChange({text: value, delta: editor.getContents()});
        }
    }

    buttons() {
        return this.props.onValidate ? <button onClick={() => this.props.onValidate({
            text: this.state.text,
            delta: this.state.delta,
        })}>Validate</button> : '';
    }

    createNewCourseOnServer(title){
        let courseData = {title, content: '', chapters: []};
        let courseDataId = 'azezrge"';

        let courseDataWithId = Object.assign({},courseData, {_id : courseDataId});
        return courseDataWithId;
    }

    createNewCourse(courseDataWithId) {
        this.setState({courseData: courseDataWithId});
    }

    render() {
        return (
            <div>
                {/*{[new QuillComponent2(),new QuillComponent2()]}*/}
                {this.state.courseData ?
                    <ChapterComponent course={this.state.courseData} elementName='course'/> :
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
                            }}/>,
                        /* <QuillComponent
                         text={'banan'}
                         onValidate={async (data) => {
                         let a = await data;
                         console.log('awaited ', a);
                         if (a) {
                         showModal(false);
                         }
                         }}
                         />,*/
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

class ChapterComponent extends Component {
    constructor(props) {
        console.log('initialise courseCOmp', props.course);
        super(props);
        this.state = {course: Object.assign({},props.course), chapters: []}; // You can also pass a Quill Delta here
    }



    addContent(content) {
        console.log(content, content.split[1]);
        let requestToAddContentOnserver = true;
        if (requestToAddContentOnserver) {
            this.setState({course: Object.assign({}, this.state.course, {content: content})});
        }
        return requestToAddContentOnserver;
    }

    createNewChapterOnServer(title){
        let chapterData = {title, content: '', chapters: []};
        let chapterDataId = 'azezrge"';

        let chapterDataWithId = Object.assign({},chapterData, {_id : chapterDataId});
        return chapterDataWithId;
    }

    createNewChapter(chapterDataWithId) {
        this.setState({chapters: [...this.state.chapters,chapterDataWithId]});
    }

    modifyTitleOnServer(newTitle){
        return true;
    }

    modifyTitle(newTitle){
        this.setState({
            course: Object.assign({}, this.state.course, {title:newTitle}),
        })
    }

    createAddContentButton(){
        let objectToShow = this.state.course;
        return <button onClick={() => showModal({
            children: <QuillComponent
                text={this.state.course.content}
                onValidate={async (data) => {
                    let a = await this.addContent(data.text);
                    console.log('awaited ', a);
                    if (a) {
                        showModal(false);
                    }
                }}
            />,
        })}>{objectToShow.content ? 'Modify' : 'Add'} content</button>
    }


    createNextSectionButton(elementName) {
        let nextElementName = lowerLevelComponentName[elementName];
        if(!nextElementName) return '';
        return <button onClick={() => showModal({
            children: <BasicFormCreatorComponent
                dataModel={titleModel({placeholder: nextElementName + ' title', label: 'New ' + nextElementName})}
                onValidate={async data => {
                    console.log(data);
                    if (data.title) {
                        let courseCreatedWithId = await this.createNewChapterOnServer(data.title);
                        if (courseCreatedWithId){
                            this.createNewChapter(courseCreatedWithId);
                            showModal(false);
                        }
                    }
                }}/>,
        })}>Add {nextElementName}</button>
    }

    modifyTitleButton(elementName) {
        let nextElementName = lowerLevelComponentName[elementName];
        if(!nextElementName) return '';
        return <button onClick={() => showModal({
            children: <BasicFormCreatorComponent
                dataModel={titleModel({placeholder: elementName + ' title', label: 'Modify ' + elementName})}
                onValidate={async data => {
                    console.log(data);
                    let newTitle = data.title
                    if (newTitle) {
                        let result = await this.createNewChapterOnServer(newTitle);
                        if (result){
                            this.modifyTitle(newTitle);
                            showModal(false);
                        }
                    }
                }}/>,
        })}>Modify title</button>
    }

    generateButtons(elementName){
        return <span>{this.modifyTitleButton(elementName)} {this.createAddContentButton()} {this.createNextSectionButton(elementName)}</span>
    }

    render() {
        let props = this.props;
        let state =  this.state;
        console.log(props, state);
        let objectToShow = state.course;
        let elementName = props.elementName;
        let nextElementName = lowerLevelComponentName[props.elementName];
        return <div className='margin-30px'>
            <div>{objectToShow.title }  {this.generateButtons(elementName)}</div>
            <div dangerouslySetInnerHTML={{ __html: state.course.content }} />
            {state.chapters.map((chapter,step) => <ChapterComponent key={chapter._id} course={chapter} elementName={nextElementName}/>)}

        </div>;
    }
}


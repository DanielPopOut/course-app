import React,{Component} from 'react';
import './coursecreation.css';
import {ButtonHelper, LabelHelper} from "../HelperComponent/FormHelper";
import ReactQuill from 'react-quill'; // ES6
import QuillComponent from "../DanielComponent/QuillComponent/QuillComponent";
import ModalComponent from "../DanielComponent/Modal/ModalComponent";

let levelsArray={
    courses:"chapters",
    chapters:"sections",
    sections:"subsections"
};
let formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent', 'align',
    'link', 'image', 'formula',
];

let modules = {
    toolbar: [
        [{'header': [1, 2, false]}],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        [{'align': []}],
        ['link', 'image', 'formula'],
        ['clean'],
    ],
};

function returnField({content, defaultValue = "", handleChange, label = '', placeholder = ''}) {
    return (
        <div className={'element-field'}>
            <LabelHelper label={label}/>
            <ReactQuill
                value={content || defaultValue}
                modules={modules}
                formats={formats}
                placeholder={placeholder}
                onChange={handleChange}
            />
        </div>
    );
}

function displayField(content="") {
    return (<ReactQuill value={content || ""} modules={{toolbar: false}}  readOnly={true}/>);
}

class CourseCreationForm extends Component{
    constructor(props){
        super(props);
        this.state={
            title:this.props.title||"",
            content:this.props.content||"",
        }
    }

    handleChange(value,field){

        let newstate=this.state;
        newstate[field]= value==="<p><br></p>"?"":value;
        this.setState({...newstate});
        console.log("current Course Creation Form state ",this.state);
    }

    handleValidation(){
        if(this.state.title.length===0){
            alert(" The Title Should not be empty !!");
        }else {
            return this.props.validation(this.state);
        }

    }
    handleCancel(){
        this.props.handleCancel()
    }
    render(){
        return(
            <div>
                {
                    returnField({
                        content:this.state.title,
                        handleChange:(e)=>this.handleChange(e,'title'),
                        label:"Title",
                        placeholder:"Title"
                    })
                }
                {
                    returnField({
                        content:this.state.content,
                        handleChange:(e)=>this.handleChange(e,'content'),
                        label:"Content",
                        placeholder:"Content"
                    })
                }
                <div className={"hr-button-block"}>
                    <ButtonHelper {...{name:"validate",value:"Validate"}} onClick={()=>this.handleValidation()}/>
                    <ButtonHelper {...{name:"annuler",value:"Annuler"}} onClick={()=>this.handleCancel()}/>
                </div>
            </div>
        );
    }
}

class Chapter extends Component{
    constructor(props){
        super(props);
        this.state={
            title:this.props.title || "",
            content:this.props.content || "",
            mode:this.props.mode || "creation"
        }
    }
    displayChapter(){
        return <div>
            {displayField(this.state.title)}
            {displayField(this.state.content)}
        </div>;
    }

    render(){
        return(
            <div>
                {this.displayChapter()}
            </div>
        );
    }

}

/**
 *
 * CourseCreation Class for creation an modification of courses
 *  // the mode specify if you are creating or modifying the course
 *
 */

class Course extends Component{
    constructor(props){
         super(props);
         this.state={
             title:"",
             content:"",
             chapters:[],
             mode:this.props.mode || "creation"
         }
     }

    componentDidMount(){
         if(this.props.course){
             this.setState(Object.assign({},this.state,{...this.props.course}));
         }
     }

    setNewValues(data){
        console.log("new values to set ",data);
       this.setState({...data});
        this.props.closeModal();
    }

    saveNewCourse(data){
        console.log("new course data ",data);
        this.setState(Object.assign({},data,{mode:"modification"}));
        this.props.closeModal();
     }

    handleModifyCourse(action="new"){
         let content=action==="new"?
             <CourseCreationForm handleCancel={()=>this.props.closeModal()} validation ={(data)=>this.saveNewCourse(data)}/>:
             <CourseCreationForm handleCancel={()=>this.props.closeModal()} validation={(data)=>this.setNewValues(data)}/>
         ;
         this.props.openModal(content);
    }

    displayOptions(){
         if(this.state.mode==="modification" ){
             return(
                 <div className={"create-course-options-div"}>
                     <ButtonHelper {...{
                         name:"modifyCourse",
                         value:'Modify Course'
                     }} onClick={()=>{this.handleModifyCourse("modify")}}
                     />
                 </div>
             );
         }
         if(this.state.mode==="creation")
         {
             return(
                 <div className={"create-course-options-div"}>
                     <ButtonHelper {...{
                         name:"modifyCourse",
                         value:'New Course'
                     }} onClick={()=>{this.handleModifyCourse()}}
                     />
                 </div>
             );
         }
     }

    addChapter(data){
        let chapters=this.state.chapters;
        chapters.push(data);
        this.setState({chapters:chapters});
        this.props.closeModal();

    }

    handleAddChapter(){
        let content= <CourseCreationForm handleCancel={()=>this.props.closeModal()} validation ={(data)=>this.addChapter(data)}/>;
        this.props.openModal(content);
    }

    displayContent(){
         return(
             <div>
                 {displayField(this.state.title)}
                 {displayField(this.state.content)}
             </div>
         );
    }

    openChapter(chapter){
        console.log("chapter click");
        let element=<Chapter {...chapter}/>;
        this.props.displayElement(element);
    }

    showChapters(){
        return <div className={"sub-elements-list"}>
            {
                this.state.chapters.map((chapter,key)=>{
                    return(
                        <div
                            key={key}
                            onClick={()=>this.openChapter(chapter)}
                            className={"sub-element-div"}
                        >
                            {displayField(chapter.title)}
                        </div>
                    );
                })
            }
        </div>
    }

    newChapterOptions(){
        if(this.state.mode==="modification"){
            return (
                <div className={"create-course-options-div"}>
                    <ButtonHelper {...{
                            name:"newChapterButton",
                            value:"+ Chapter",
                            className:"form-helper-button"
                    }} onClick={()=>this.handleAddChapter()}/>
                </div>
            )
        }
    }

    render(){
         return(
             <div>
                 {this.displayOptions()}
                 <div className={"content-from-quill"}> {this.displayContent()} </div>
                  {this.newChapterOptions()}
                 <div>{this.showChapters()}</div>
             </div>
         );
     }
}

class CourseCreation extends Component{

    constructor(props){
        super(props);
        this.state={
            course:this.props.course||{},
            elementToDisplay:"",
            mode:this.props.mode||"creation", //{"creation","modification"}
            modalChildren:"",
            modalVisibility:false
        }
    }
    componentDidMount(){
        let elementtodisplay=this.props.element||
            <Course mode={this.state.mode}
                    openModal={(content)=>{this.openModal(content)}}
                    closeModal={()=>this.handleModalClose()}
                    course={this.state.course}
                    displayElement={(data)=>this.displayElement(data)}
        />;
        this.setState({elementToDisplay:elementtodisplay});
    }

    openModal(content){
        this.setState({
            modalChildren:content,
            modalVisibility:true
        });
    }

    handleModalClose(){
        this.setState({
            modalChildren:"",
            modalVisibility:false
        });
    }
    displayElement(element){
        this.setState({elementToDisplay:element});
    }

    render(){
        return(
            <div className={"course-creation-main"}>
                <div className={'navigation-panel'}>

                </div>
                <ModalComponent visible={this.state.modalVisibility}
                                onClose={()=>this.handleModalClose()}>
                    {this.state.modalChildren}
                    </ModalComponent>
                <div className={'course-creation-panel'}>
                    {this.state.elementToDisplay}
                </div>
            </div>
        );
    }
}

export default CourseCreation;
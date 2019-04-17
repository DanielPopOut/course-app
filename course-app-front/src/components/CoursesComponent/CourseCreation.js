import React,{Component} from 'react';
import './coursecreation.css';
import {ButtonHelper, InputHelper, InputTextHelper, LabelHelper} from "../HelperComponent/FormHelper";
import ReactQuill from 'react-quill'; // ES6
import QuillComponent from "../DanielComponent/QuillComponent/QuillComponent";
import ModalComponent from "../DanielComponent/Modal/ModalComponent";
import {ServerService} from "../../server/ServerService";
import NavCourse from "./NavCourse";

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
        [{ 'size': ['small', false, 'large', 'huge'] }],
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
    if(content){
        return (<ReactQuill value={content || ""} modules={{toolbar: false}}  readOnly={true}/>);
    }else {
        return("");
    }
}

function deleteElement(collection,data,callback){
    ServerService.postToServer("/crudsOperations/delete",{collection:collection,data:data})
        .then((response)=>{
            if(response.status===200){
                alert("deleted with success !!");
                if(callback){
                    callback();
                }
            }else {
                alert(response.data["errorMessage"]);
                console.log("deletion error",response);
            }
        });
}

class CourseCreationForm extends Component{
    constructor(props){
        super(props);
        this.state={
            title:this.props.title||"",
            content:this.props.content||"",
        }
    }

    handleChangeTitle(e){
        this.setState({title:e.target.value});
        console.log(this.state);
    }
    handleChange(value){
        this.setState({content:value==="<p><br></p>"?"":value});
        console.log(this.state);
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
                <InputTextHelper {...{
                        name:"title",
                        value:this.state.title,
                        placeholder:"Title",
                        label:"Title",

                    }}
                                 onChange={(e)=>this.handleChangeTitle(e)}
                />

                {
                    returnField({
                        content:this.state.content,
                        handleChange:(e)=>this.handleChange(e),
                        label:"Content",
                        placeholder:"Content"
                    })
                }
                <div className={"hr-button-block"}>
                    <ButtonHelper {...{name:"validate",value:"Validate",className:"form-helper-button success"}} onClick={()=>this.handleValidation()}/>
                    <ButtonHelper {...{name:"annuler",value:"Annuler",className:"form-helper-button danger"}} onClick={()=>this.handleCancel()}/>
                </div>
            </div>
        );
    }
}



/**
 *
 * CourseCreation Class for creation an update of courses
 *  // the mode specify if you are creating or modifying the course
 *
 */

class SubSection extends Component{

    constructor(props){
         super(props);
         this.state={
             title:"",
             content:"",
             mode:this.props.mode || "creation"
         }
    }

    componentDidMount(){
         if(this.props.subsection){
             this.setState(
                 Object.assign(
                     {},
                     this.state,
                     {...this.props.subsection},
                     {mode:this.props.mode||"lecture"}
                     )
             );
         }
     }

    async setNewValues(data){
        let updatedSubSection=await ServerService.updateElementInDataBase(
            "subsections",
            {_id:this.state._id},
            data
        );
        console.log("update result ",updatedSubSection);
        this.setState({...data});
        this.props.closeModal();
    }

    handleModifySubSection(){
         let content=
             <CourseCreationForm
                 title={this.state.title}
                 content={this.state.content}
                 handleCancel={()=>this.props.closeModal()}
                 validation={(data)=>this.setNewValues(data)}
             />
         ;
         this.props.openModal(content);
    }

    handleDeleteSubSection(){
       deleteElement("subsections",this.state,()=>{
          alert("second confirmation ");
       });
    }

    displayOptions(){
         if(this.state.mode==="update" ){
             return(
                 <div className={"create-course-options-div"}>
                     <ButtonHelper {...{
                         name:"modifySubSection",
                         value:'Modify Sub Section',
                         className:"form-helper-button"
                     }} onClick={()=>{this.handleModifySubSection()}}
                     />
                     <ButtonHelper {...{
                         name:"deleteSubSection",
                         value:'Delete Sub Section',
                         className:"form-helper-button danger"
                     }} onClick={()=>{this.handleDeleteSubSection()}}
                     />
                 </div>
             );
         }
     }

    displayContent(){
         return(
             <div>
                 <h5>{this.state.title}</h5>
                 {displayField(this.state.content)}
             </div>
         );
    }

    render(){
         return(
             <div  className={"sub-elements-content"}>
                 {this.displayOptions()}
                 <div className={"content-from-quill"}> {this.displayContent()}</div>
             </div>
         );
     }

}

class Section extends Component{

    constructor(props){
         super(props);
         this.state={
             title:"",
             content:"",
             subsections:[],
             mode:this.props.mode || "creation"
         }
    }

    componentDidMount(){
         if(this.props.section){
             this.setState(
                 Object.assign(
                     {},
                     this.state,
                     {...this.props.section},
                     {mode:this.props.mode||"update"}
                     )
             );
         }
     }

    async setNewValues(data){
        let updatedSection=await ServerService.updateElementInDataBase(
            "sections",
            {_id:this.state._id},
            data
        );
        console.log("update result ",updatedSection);
        this.setState({...data});
        this.props.closeModal();
    }

    handleModifySection(){
         let content=
             <CourseCreationForm
                 title={this.state.title}
                 content={this.state.content}
                 handleCancel={()=>this.props.closeModal()}
                 validation={(data)=>this.setNewValues(data)}
             />
         ;
         this.props.openModal(content);
    }

    handleDeleteSection(){
        deleteElement("sections",this.state);
    }
    displayOptions(){
        if(this.state.mode==="update" ){
            return(
                <div className={"create-course-options-div"}>
                    <ButtonHelper {...{
                        name:"modifySection",
                        value:'Modify Section',
                        className:"form-helper-button"
                    }} onClick={()=>{this.handleModifySection()}}
                    />
                    <ButtonHelper {...{
                        name:"deleteSubSection",
                        value:'Delete Section',
                        className:"form-helper-button danger"
                    }} onClick={()=>{this.handleDeleteSection()}}
                    />
                </div>
            );
        }

     }

    async addSubSection(data){
        let subsections=this.state.subsections;
        let elementProperties={
            _id:this.state._id,
            title:this.state.title,
            content:this.state.content,
            subsections:this.state.subsections,
        };

        let dataTosend={
            element:{
                elementName:'section',
                elementProperties:elementProperties
            },
            childelement:data,
        };
        let insertedSubSection = await ServerService.postToServer('courses/newSubElement', dataTosend).then(
            (response)=>{
                if (response.status === 200) {
                    return response.data;
                }
            });
        console.log("inserted SubSection",insertedSubSection);
        subsections.push(insertedSubSection);
        this.setState({subsections:subsections});
        this.props.closeModal();
    }

    handleAddSubSection(){
        let content= <CourseCreationForm handleCancel={()=>this.props.closeModal()}
                                         validation ={(data)=>this.addSubSection(data)}/>;
        this.props.openModal(content);
    }

    displayContent(){
         return(
             <div>
                 <h4>{this.state.title}</h4>
                 {displayField(this.state.content)}
             </div>
         );
    }

    showSubSections(){
        return <div className={"sub-element-content"}>
            {
                this.state.subsections.map((subsection,key)=>{
                    return(
                        <div key={key}>
                            <SubSection
                                subsection={subsection}
                                mode={this.state.mode}
                                openModal={(content)=>this.props.openModal(content)}
                                closeModal={()=>this.props.closeModal()}
                            />
                        </div>
                    );
                })
            }
        </div>
    }

    newSubSectionOptions(){
        if(this.state.mode==="update"){
            return (
                <div className={"create-course-options-div"}>
                    <ButtonHelper {...{
                            name:"newSubSectionButton",
                            value:"+ Sub Section",
                            className:"form-helper-button"
                    }} onClick={()=>this.handleAddSubSection()}/>
                </div>
            )
        }
    }

    render(){
         return(
             <div>
                 {this.displayOptions()}
                 <div className={"content-from-quill"}> {this.displayContent()} </div>
                  {this.newSubSectionOptions()}
                 <div>{this.showSubSections()}</div>
             </div>
         );
     }

}

class Chapter extends Component{

    constructor(props){
         super(props);
         this.state={
             title:"",
             content:"",
             sections:[],
             mode:this.props.mode || "creation"
         }
    }

    componentDidMount(){
         if(this.props.chapter){
             this.setState(
                 Object.assign(
                     {},
                     this.state,
                     {...this.props.chapter},
                     {mode:this.props.mode||"lecture"}
                     )
             );
         }
    }

    async setNewValues(data){
        let updatedChapter=await ServerService.updateElementInDataBase(
            "chapters",
            {_id:this.state._id},
            data
        );
        console.log("update result ",updatedChapter);
        this.setState({...data});
        this.props.closeModal();
    }

    handleModifyChapter(){
         let content=
             <CourseCreationForm
                 title={this.state.title}
                 content={this.state.content}
                 handleCancel={()=>this.props.closeModal()}
                 validation={(data)=>this.setNewValues(data)}
             />
         ;
         this.props.openModal(content);
    }

    displayOptions(){
         if(this.state.mode==="update" ){
             return(
                 <div className={"create-course-options-div"}>
                     <ButtonHelper {...{
                         name:"modifyChapter",
                         value:'Modify Chapter',
                         className:"form-helper-button"
                     }} onClick={()=>{this.handleModifyChapter("modify")}}
                     />
                 </div>
             );
         }
     }

    async addSection(data){
        let sections=this.state.sections;
        let elementProperties={
            _id:this.state._id,
            title:this.state.title,
            content:this.state.content,
            sections:this.state.sections,
        };

        let dataTosend={
            element:{
                elementName:'chapter',
                elementProperties:elementProperties
            },
            childelement:data,
        };

        let insertedSection = await ServerService.postToServer('courses/newSubElement', dataTosend).then(
            (response)=>{if (response.status === 200) { return response.data; }});
        console.log("inserted Section",insertedSection);
        sections.push(insertedSection);
        this.setState({sections:sections});
        this.props.closeModal();
    }

    handleAddSection(){
        let content= <CourseCreationForm
            handleCancel={()=>this.props.closeModal()}
            validation ={(data)=>this.addSection(data)}
        />;
        this.props.openModal(content);
    }

    displayContent(){
         return(
             <div>
                 <h3>{this.state.title}</h3>
                 <div className={"content-div"}>{displayField(this.state.content)}</div>
             </div>
         );
    }

    showSections(){
        return <div className={"sub-element-content"}>
            {
                this.state.sections.map((section,key)=>{
                    return(
                        <Section section={section} key={key}
                                     mode={this.state.mode}
                                     openModal={(content)=>this.props.openModal(content)}
                                     closeModal={()=>this.props.closeModal()}
                            />
                    );
                })
            }
        </div>
    }

    newSectionOptions(){
        if(this.state.mode==="update"){
            return (
                <div className={"create-course-options-div"}>
                    <ButtonHelper {...{
                            name:"newSectionButton",
                            value:"+ Section",
                            className:"form-helper-button"
                    }} onClick={()=>this.handleAddSection()}/>
                </div>
            )
        }
    }

    render(){
         return(
             <div className={"content-div"}>
                 <div className={"chapter-upper-nav"}>
                     <div onClick={()=>this.props.reopenCourse()} className={"nav-link-div"}>return to course</div>

                 </div>
                 {this.displayOptions()}
                 <div className={"content-from-quill"}> {this.displayContent()} </div>
                  {this.newSectionOptions()}
                 <div>{this.showSections()}</div>
             </div>
         );
     }

}

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

    async setNewValues(data){
        let updatedCourse=await ServerService.updateElementInDataBase(
            "courses",
            {_id:this.state._id},
            data
        );
        console.log("update result ",updatedCourse);
       this.setState({...data});
        this.props.closeModal();
    }

    async saveNewCourse(data){
        let courseInserted = await ServerService.insertElementInDataBase('courses',data);
        this.setState(Object.assign({},data,{mode:"update"}));
        this.props.closeModal();
     }

    handleModifyCourse(action="new"){
        console.log("current course state",this.state.title);
         let content=action==="new"?
             <CourseCreationForm
                 handleCancel={()=>this.props.closeModal()}
                 validation ={(data)=>this.saveNewCourse(data)}
             />:

             <CourseCreationForm
                 title={this.state.title}
                 content={this.state.content}
                 handleCancel={()=>this.props.closeModal()}
                 validation={(data)=>this.setNewValues(data)}
             />
         ;
         this.props.openModal(content);
    }

    displayOptions(){
         if(this.state.mode==="update" ){
             return(
                 <div className={"create-course-options-div"}>
                     <ButtonHelper {...{
                         name:"modifyCourse",
                         value:'Modify Course',
                         className:"form-helper-button"
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
                         value:'New Course',
                         className:"form-helper-button"
                     }} onClick={()=>{this.handleModifyCourse()}}
                     />
                 </div>
             );
         }
     }

    async addChapter(data){
        let chapters=this.state.chapters;
        let elementProperties={
            _id:this.state._id,
            title:this.state.title,
            content:this.state.content,
            chapters:this.state.chapters,
        };

        let dataTosend={
            element:{
                elementName:'course',
                elementProperties:elementProperties
            },
            childelement:data,
        };
        let insertedChapter = await ServerService.postToServer('courses/newSubElement', dataTosend).then(
            (response)=>{
                if (response.status === 200) {
                    return response.data;
                }
            });
        console.log("insertedChapter",insertedChapter);
        chapters.push(insertedChapter);
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
                 <h2> {this.state.title}</h2>
                 {displayField(this.state.content)}
             </div>
         );
    }

    reopenCourse(){
        console.log("return to course");
        this.props.reopenCourse();
    }
    openChapter(chapter){
        let element=<Chapter chapter={chapter}
                             openModal={(content)=>this.props.openModal(content)}
                             closeModal={()=>this.props.closeModal()}
                             mode={"update"}
                             reopenCourse={()=>this.reopenCourse()}
        />;
        this.props.displayElement(element);
    }

    handleDeleteChapter(chapter){deleteElement("chapters",chapter);}

    deleteChapterOptions(chapter){
        return(  <ButtonHelper {...{
            name:"deletechapter",
            value:'Delete Chapter',
            className:"form-helper-button danger"
        }} onClick={()=>{this.handleDeleteChapter(chapter)}}
        />)
    }
    showChapters(){
        return <div className={"sub-elements-list"}>
            {
                this.state.chapters.map((chapter,key)=>{
                    return(
                        <div
                            key={key}
                            onClick={()=>this.openChapter(chapter)}
                            className={"sub-element-div options-tooltip"}
                        >
                            <div className={"chapter-title"}>{chapter.title}</div>
                            <div className="options-tooltip-text">
                                {this.deleteChapterOptions(chapter)}
                            </div>
                        </div>
                    );
                })
            }
        </div>
    }

    newChapterOptions(){
        if(this.state.mode==="update"){
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
            mode:this.props.mode||"creation", //{"creation","update"}
            modalChildren:"",
            modalVisibility:false,
            departments:[],
            department:"",
            specialities:[],
            speciality:"",
            levels:"",
            level:""
        }
    }

   async componentDidMount(){
        let elementtodisplay="";
            elementtodisplay=this.props.element||
                <Course mode={this.state.mode}
                        openModal={(content)=>{this.openModal(content)}}
                        closeModal={()=>this.handleModalClose()}
                        course={this.state.course}
                        displayElement={(data)=>this.displayElement(data)}
                        reopenCourse={()=>this.reopenCourse()}
                />;
               await ServerService.postToServer("crudOperations/get",{collection:"departments"}).then(response=>{
                   if(response.status===200){
                       console.log("departments",response.data);
                       this.setState({departments:response.data});
                   } else {
                       console.log("errpr getting departments",response.data);
                   }
                });
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

    reopenCourse(){
        this.componentDidMount();
    }

    displayElement(element){
        this.setState({elementToDisplay:element});
    }

    handleDepartmentChange(e){
        console.log("new dep selected",e.target.value);
        this.setState({department:e.target.value});



    }

    showDepartments(){
        let params={
            name:"department",
            type:"select",
            options:this.state.departments,
            value:"_id",
            display:"label"
        };

        return(
            <InputHelper {...params} onChange={(e)=>this.handleDepartmentChange(e)}/>
        )
    }
   showSpecialities(){
        if(this.state.department){
            ServerService.postToServer("crudOperations/get",
                {
                    collection:"specialities",
                    options:{
                        queries:{department:this.state.department}
                    }
                }).then(response=>{
                    if(response.status===200){
                        let params={
                            name:"speciality",
                            type:"select",
                            options:response.data,
                            value:"_id",
                            display:"label"
                        };
                        return(
                            <InputHelper {...params} onChange={(e)=>this.handleDepartmentChange(e)}/>
                        )
                    }else{

                    }
            });

        }
    }

    render(){
        return(
            <div className={"course-creation-main"}>
                <ModalComponent visible={this.state.modalVisibility} onClose={()=>this.handleModalClose()}>
                    {this.state.modalChildren}
                </ModalComponent>
                <div>
                    <h3>départements</h3>
                    {this.showDepartments()}
                </div>
                <div>
                    <h3>Spécialité</h3>
                    {this.showSpecialities()}
                </div>
                <div>
                    <h3>niveaux</h3>

                </div>
                <div className={'course-creation-panel'}>
                    {this.state.elementToDisplay}
                </div>

            </div>
        );
    }
}

export default CourseCreation;
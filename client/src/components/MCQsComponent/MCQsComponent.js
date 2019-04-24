import React, {Component} from 'react';
import './mcqscomponent.css';
import {ButtonHelper, CheckBoxHelper, LabelHelper} from "../HelperComponent/FormHelper";
import ModalComponent from "../DanielComponent/Modal/ModalComponent";
import ReactQuill from 'react-quill'; // ES6
import {ServerService} from "../../server/ServerService";
import MCQHelpComponent from "./MCQHelpComponent";

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

export class RealiseMCQ extends Component{

    constructor(props){
        super(props);
        this.state={
            mcq:this.props.mcq,
            selectedAnswers:this.props.selectedAnswers||[],
            mode:this.props.mode||'test',// between [test,correctedAndWrong,correctedAndRight]
        }
    }

    handleSelectAnswer(elt,key){
        let selectedAnswers=this.state.selectedAnswers;
       /* console.log("previous selected Answers ",selectedAnswers);*/
        if(elt.target.checked){
            if(selectedAnswers.indexOf(key)===-1){
                selectedAnswers.push(key);
            }
        }else {
            if(selectedAnswers.indexOf(key)>-1){
                selectedAnswers.splice(selectedAnswers.indexOf(key),1);
            }
        }
        console.log("new selected Answers ",selectedAnswers);
    }

    showCorrectAnswers(key){
        if(this.state.mcq.rightAnswers.indexOf(key)>-1 && this.state.mode==='correctedAndWrong') {
            return (
                <div className={'mcq-right-answer-div'}>
                    <CheckBoxHelper
                        {...{
                            name:"rigthanswer"+key,
                            checked:true,
                            readOnly:this.state.mode==="correctedAndWrong" || this.state.mode==="correctedAndRight"
                        }}
                    />
                </div>
            );
        }
    }

    checkedStatus(key){
        if(this.state.selectedAnswers.indexOf(key)>-1){
            return true;
        }else {
            return false
        }
    }

    displayChoice(answer,key){
        return (
            <div key={key}>
                <div className={"one-choice-div"}>
                    <div>
                        <ReactQuill
                            value={answer}
                            modules={{toolbar:false}}
                            formats={formats}
                            readOnly={true}
                        />
                    </div>
                    <div>
                        <CheckBoxHelper
                            {...{
                                name:"answer"+key,
                                checked:this.checkedStatus(key),
                                readOnly:this.state.mode==="correctedAndWrong" || this.state.mode==="correctedAndRight"
                            }}
                            onChange={(e)=>this.handleSelectAnswer(e,key)}
                        />
                    </div>
                </div>
                {this.showCorrectAnswers(key)}
                </div>
        );
    }

    async correctMCQ(){
        let selectedAnswers=this.state.selectedAnswers;
        if(selectedAnswers.length===0){
            alert("aucune reponse selectionnee");
        }else {
            let rightAnswers=this.state.mcq.rightAnswers;
            console.log("right answers ",rightAnswers,"selected answers ",selectedAnswers);

            let wrongAnswersSelected=selectedAnswers.filter((elt,index)=>{
                return !rightAnswers.includes(elt);
            });

            let goodAnswersNotSelected=rightAnswers.filter((elt,index)=>{
                return !selectedAnswers.includes(elt);
            });

            if(wrongAnswersSelected.length!==0 || goodAnswersNotSelected.length!==0 ){
               // alert("faux");
                await this.setState({ mode:'correctedAndWrong' });
                console.log("RANS",rightAnswers,"WS",wrongAnswersSelected,"RNS",goodAnswersNotSelected);
            }else {
              //  alert('juste');
                await this.setState({ mode:'correctedAndRight'});
            }

            console.log("wrong selected ",wrongAnswersSelected,
                "good not selected",goodAnswersNotSelected,
                "current Mode ",this.state.mode);

            if(this.props.getCorrectedMCQ){
                console.log("ou correct");
                console.log("state mode : ",this.state.mode);
                console.log("final state : ",this.state);
                this.props.getCorrectedMCQ(this.state);
            }else {
                console.log("no ou correct");
            }
        }
    }

    repeatMCQ(){
        this.setState({
            mode:"test"
        });
    }

    displayButtons(){
        if(this.state.mode==='test'){
            return(
                <ButtonHelper
                    {
                        ...{
                            name:"correctMCQbutton",
                            value:"Valider",
                            className:"form-helper-button success"
                        }
                    }
                    onClick={()=>this.correctMCQ()}
                />
            );
        }

        /*else if(this.state.mode==="correctedAndWrong" || this.state.mode==="correctedAndRight"){
            return(
                <div>
                    <ButtonHelper
                        {
                            ...{
                                name:"repeatMCQbutton",
                                value:"Reprendre",
                                className:"form-helper-button warning"
                            }
                        }
                        onClick={()=>this.repeatMCQ()}
                    />
                </div>
            );
        }*/

    }

    displayHelpOptions(){
        if(this.state.mode==="correctedAndWrong"){
            return(<MCQHelpComponent mcq={this.state.mcq}/>);
        }
    }

    displayMCQ(){
        let mcq=this.state.mcq;
       /* console.log("selected answers",this.state.selectedAnswers);*/
        return(
            <React.Fragment>
                <div className={"question-div"}>
                    <h3> Question </h3>
                    <ReactQuill
                        value={mcq.question}
                        modules={{toolbar:false}}
                        formats={formats}
                        readOnly={true}
                    />
                </div>
                <div>
                    <h3> Answers</h3>
                    {
                        mcq.answers.map((answer,key)=>{
                            return this.displayChoice(answer,key);
                        })
                    }
                </div>
                <div className={'hr-button-block'}>
                    {this.displayButtons()}
                </div>
            </React.Fragment>
        );
    }

    render(){
        return(
            <div className={"realisedMCQ-div-"+this.state.mode}>
                {this.displayHelpOptions()}
                {this.displayMCQ()}
            </div>
        )
    }

}

export class ListMCQS extends Component{
    constructor(props){
        super(props);
        this.state={
            reference:this.props.reference,
            course_level:this.props.course_level,
            mcqs:this.props.mcqs,
            modalVisibility:false,
            modalChildren:""
        }
    }
    handleViewMCQ(mcq){
        let content=<OneMCQ mcq={mcq} action_level={'update'}/>;
        this.openModal(content)
    }

    handleRealiseMCQ(mcq){this.openModal(<RealiseMCQ mcq={mcq}/>)}

    handleDeleteMCQ(mcq){
        ServerService.postToServer("/crudOperations/delete",{
            collection:"mcqs",
            data:mcq
        }).then((response)=>{
        });
    }

    displayMCQ(mcq,key){
        return(
            <div key={key} className={"mcqs-list-one-div"}>
                <ReactQuill
                    value={mcq.question}
                    modules={{toolbar:false}}
                    formats={formats}
                    readOnly={true}
                />
               <div className={" mcq-list-div-option "}>
                   <div className={"hr-button-block"}>
                       <ButtonHelper
                           {
                               ...{
                                   name:'viewqcm',
                                   value:"View",
                                   className:"form-helper-button success"
                               }
                           }
                           onClick={()=>this.handleViewMCQ(mcq)}
                       />
                       <ButtonHelper
                           {
                               ...{
                                   name:'realisemcq',
                                   value:"Realise MCQ",
                                   className:"form-helper-button success"
                               }
                           }
                           onClick={()=>this.handleRealiseMCQ(mcq)}
                       />

                       <ButtonHelper
                           {
                               ...{
                                   name:'deleteqcm',
                                   value:"Delete",
                                   className:"form-helper-button danger"
                               }
                           }
                           onClick={()=>this.handleDeleteMCQ(mcq)}
                       />
                   </div>
               </div>
            </div>
        );
    }

    openModal(content){
        this.setState({
            modalVisibility:true,
            modalChildren:content,
        });
    }
    closeModal(){
        this.setState({
            modalChildren:"",
            modalVisibility:false
        });
    }
    render(){
        console.log("mcqs list",this.state.mcqs);
        return(
            <div>
                <ModalComponent visible={this.state.modalVisibility} onClose={()=>this.closeModal()}>
                    {this.state.modalChildren}
                </ModalComponent>
                <h3> List of MCQS</h3>
                <div className={"mcqs-list-div"}>
                    {
                        this.state.mcqs.map((mcq,key)=>{
                            return this.displayMCQ(mcq,key);
                        })
                    }
                </div>

            </div>
        );
    }
}

export class OneMCQ extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mcq_id:'',
            course_level: this.props.course_level || "",
            reference: this.props.reference || "",
            question: '',
            answers: this.retunDefaultAnswerArray(this.props.numberOfAnswer || 5),
            rightAnswers: [],
            explanation: "",
            action_level: "creation"//this precise if the mcq is in creation or update mode
        }
    }

    componentWillMount() {
        if (this.props.action_level === "update") {
            let mcq = this.props.mcq;
            this.setState({
                mcq_id:mcq._id,
                course_level: mcq.course_level,
                reference: mcq.reference,
                question: mcq.question,
                answers: mcq.answers,
                rightAnswers: mcq.rightAnswers,
                explanation: mcq.explanation,
                action_level: 'update'
            });
        }
    }

    retunDefaultAnswerArray(number) {
        let arrOfAns = [];
        for (let i = 1; i <= number; i++) {
            arrOfAns.push('');
        }
        return arrOfAns;
    }

    returnMCQField({content, defaultValue = "", handleChange, label = '', placeholder = ''}) {
        return (
            <div className={'mcqFieldDiv'}>
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

    handleChange(element, questionOrAnswer = 'answer', index = null) {

        if (element === '<p><br></p>') {
            element = "";
        }

        console.log("here", element);

        switch (questionOrAnswer) {
            case 'question' :
                this.setState({question: element});
                break;
            case 'rightAnswer' :
                let rightAnswers = this.state.rightAnswers;
                if (element.target.checked) {
                    rightAnswers.push(index);
                } else {
                    rightAnswers.splice(rightAnswers.indexOf(index), 1)
                }

                this.setState({rightAnswers: rightAnswers});
                break;
            case 'answer' :
                let previousAnswers = this.state.answers;
                previousAnswers[index] = element;
                this.setState({answers: previousAnswers});
                break;
            case 'explanation' :
                this.setState({explanation: element});
                break;
            default:break;
        }
    }

    validateMCQ() {
        let question = this.state.question;
        let answers = [];
        let rightAnswers = [];
        let explanation = this.state.explanation;
        let validation = {valid: true, message: "", dataToSend: {}};

        //check question
        if (question.length === 0) {
            validation.valid = false;
            validation.message = " Veuillez Saisir une Question S.V.P !! ";
            return (validation);
        }
        answers = this.state.answers.filter((answer, index) => {
            return (answer.length > 0 && answers.indexOf(answer) === -1);
        });

        // check answers
        if (answers.length === 0) {
            validation.valid = false;
            validation.message = " Veuillez Saisir des reponses S.V.P !! ";
            return (validation);
        } else {
            answers.forEach((element, index) => {
                if (this.state.rightAnswers.indexOf(this.state.answers.indexOf(element)) > -1) {
                    rightAnswers.push(index);
                }
            });

            if (rightAnswers.length === 0) {
                validation.valid = false;
                validation.message = " Au moins une réponse juste est nécessaire !! ";
                return validation;
            }
            validation['dataToSend'] = {
                course_level: this.state.course_level,
                reference: this.state.reference,
                question: question,
                answers: answers,
                rightAnswers: rightAnswers,
                explanation: explanation,
            };
            this.setState({...validation['dataToSend']});

            return validation;
        }
    }

    handleSaveNewMCQ() {
        let validation = this.validateMCQ();
        if (validation.valid) {
            ServerService.postToServer("/mcquestions/new", validation['dataToSend']).then((response) => {
                if (response.status === 200) {
                    console.log("response data ",response.data);
                    this.setState({
                       mcq_id:response.data,
                       action_level:"update"
                    });
                    alert("M.C.Q Saved with Success");
                } else {
                    alert("Sorry M.C.Q has not been saved !! ");
                    console.log("error Message", response.errorMessage);
                }
            });
        } else {
            alert(validation.message);
        }
    }

    handleModifyMCQ(){
        let validation = this.validateMCQ();
        if (validation.valid) {
            let dataToSend={
                documentToUpdate:{_id:this.state.mcq_id},
                updateToMake: validation['dataToSend']
            };

            ServerService.postToServer("/mcquestions/modifyMCQ",dataToSend).then((response) => {
                if (response.status === 200) {
                    alert("M.C.Q modified with Success");
                } else {
                    alert("Sorry M.C.Q has not been modified !! ");
                    console.log("error Message", response.errorMessage);
                }
            });
        } else {
            alert(validation.message);
        }
    }

    handleResetMCQ(param) {
        if(param==="new"){
            this.setState({
                mcq_id:'',
                question: '',
                answers: this.retunDefaultAnswerArray(this.props.numberOfAnswer || 5),
                rightAnswers: [],
                explanation: "",
                dataToSend: {},
                action_level: 'creation'
            });
        }else if(param==="modify"){
            this.setState({
                question: '',
                answers: this.retunDefaultAnswerArray(this.props.numberOfAnswer || 5),
                rightAnswers: [],
                explanation: "",
                dataToSend: {},
                action_level: 'update'
            });
        }
    }

    handleDeleteMCQ(){
        ServerService.postToServer("/crudOperations/delete",{
            collection:"mcqs",
            data:{_id:this.state.mcq_id}
        }).then((response)=>{
            if(response.status===200){
                this.handleResetMCQ("new");
            }
        });
    }

    mcqButtons() {
        if (this.state.action_level === "creation") {
            return (
                <React.Fragment>
                    <ButtonHelper
                        {
                            ...{
                                name: 'mcqFormValidation',
                                value: "Valider",
                                type: 'button',
                                className: ' form-helper-button success'
                            }
                        } onClick={() => this.handleSaveNewMCQ()}
                    />

                </React.Fragment>
            );
        } else if (this.state.action_level === "update") {
            return (
                <React.Fragment>
                    <ButtonHelper
                        {
                            ...{
                                name: 'mcqFormValidation',
                                value: "Modifier",
                                type: 'button',
                                className: ' form-helper-button success'
                            }
                        } onClick={() => this.handleModifyMCQ()}
                    />
                    <ButtonHelper
                        {
                            ...{
                                name: 'mcqFormReset',
                                value: "Reset And New",
                                type: 'reset',
                                className: ' form-helper-button danger'
                            }}
                        onClick={() => this.handleResetMCQ('new')}
                    />
                    <ButtonHelper
                        {
                            ...{
                                name: 'mcqFormReset',
                                value: "Reset And Modify",
                                type: 'reset',
                                className: ' form-helper-button danger'
                            }}
                        onClick={() => this.handleResetMCQ('modify')}
                    />
                    <ButtonHelper
                        {
                            ...{
                                name: 'mcqFormdelete',
                                value: "delete",
                                type: 'reset',
                                className: ' form-helper-button danger'
                            }}
                        onClick={() => this.handleDeleteMCQ()}
                    />
                </React.Fragment>
            );
        }
    }

    oneMCQForm() {
        return (
            <form>
                <div className={"qcmFormTitle"}> Formulaire de Creation d'un QCM</div>
                {
                    this.returnMCQField({
                        content: this.state.question,
                        placeholder: "Question ",
                        label: "Question",
                        handleChange: (value) => this.handleChange(value, 'question')
                    })
                }
                <div className={'mcqAnswersDiv'}>
                    {
                      /*  console.log("answers to map ",this.state.answers);*/
                        this.state.answers.map((answerField, index) => {
                            let num = index + 1;
                            let check = false;
                            if (this.state.rightAnswers.indexOf(index) > -1) {
                                check = true;
                            }
                            return <div key={index} className={"oneAnswerDiv"}>
                                {
                                    this.returnMCQField({
                                        content: answerField,
                                        label: "Answer " + num,
                                        placeholder: "Answer " + num,
                                        handleChange: (e) => this.handleChange(e, 'answer', index)
                                    })
                                }

                                <CheckBoxHelper
                                    name={'rightAnswer'} checked={check}
                                    className={"none"}
                                    onChange={(e) => this.handleChange(e, 'rightAnswer', index)}
                                />
                            </div>
                        })
                    }
                </div>
                <div className={"mcqExplanation"}>
                    {
                        this.returnMCQField({
                            content: this.state.explanation,
                            placeholder: "Explanation ",
                            label: "Explanation",
                            handleChange: (e) => this.handleChange(e, 'explanation')
                        })
                    }
                </div>
                <div className={"hr-button-block"}>
                    {this.mcqButtons()}
                </div>
            </form>
        );
    }

    returnInfos() {
        return (
            <div>
                <div>ref:<span>{this.state.reference}</span></div>
                <div>level:<span>{this.state.course_level}</span></div>
            </div>
        );
    }

    render() {
        return (
            <div>
                {this.oneMCQForm()}
            </div>
        )
    }
}

class MCQsComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reference: this.props.reference,
            course_level: this.props.course_level,
            modalVisibility: false,
            modalChildren: ""
        }
    }

    handleNewMCQ() {
        this.setState({
            modalVisibility: true,
            modalChildren: <OneMCQ reference={this.state.reference} course_level={this.state.course_level}/>
        });
    }

    handleClose() {
        this.setState({
            modalVisibility: false,
            modalChildren: ""
        });
    }

    render() {
        return (
            <div>
                <ModalComponent visible={this.state.modalVisibility}
                                onClose={() => {
                    this.handleClose()
                }}>
                    {this.state.modalChildren}
                </ModalComponent>
                <ButtonHelper
                    {
                        ...{
                            name: 'newMCQ',
                            value: 'New M.C.Q',
                            className: 'form-helper-button success new-mcq-button'
                        }
                    }
                    onClick={() => this.handleNewMCQ()}
                />
            </div>
        );
    }
}

export default MCQsComponent;






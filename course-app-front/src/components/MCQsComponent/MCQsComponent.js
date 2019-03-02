import React, {Component} from 'react';
import './mcqscomponent.css';
import {ButtonHelper, CheckBoxHelper, LabelHelper, RadioHelper} from "../HelperComponent/FormHelper";
import ModalComponent from "../DanielComponent/Modal/ModalComponent";
import ReactQuill from 'react-quill'; // ES6
import {ServerService} from "../../server/ServerService";

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

let defaultArrayAnswer = ['', '', '', '', ''];

class OneMCQ extends Component {
    constructor(props) {
        super(props);
        this.state = {
            course_level:this.props.course_level,
            reference:this.props.reference,
            question: '',
            answers: this.retunDefaultAnswerArray(this.props.numberOfAnswer || 5),
            rightAnswers: [],
            explanation: ""
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

        if(element==='<p><br></p>') {element="";}

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
        }
    }

    validateMCQ() {
        let question = this.state.question;
        let answers = [];
        let rightAnswers = [];
        let explanation = this.state.explanation;
        let validation = {valid: true, message: "",dataToSend:{}};

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
            console.log("state before ",this.state);
            validation['dataToSend']={
                course_level:this.state.course_level,
                reference:this.state.reference,
                question: question,
                answers: answers,
                rightAnswers: rightAnswers,
                explanation: explanation,
            };
            this.setState({...validation['dataToSend']});
            console.log("final state  ",this.state);

            return validation;
        }
    }

     handleSaveNewMCQ() {
        let validation = this.validateMCQ();
        if (validation.valid) {
            ServerService.postToServer("/mcquestions/new",validation['dataToSend']).then((response)=>{
                if(response.status===200){
                    alert("M.C.Q Saved with Success");
                }else {
                    alert("Sorry M.C.Q has not been saved !! ");
                    console.log("error Message",response.errorMessage);
                }
            });
        } else {
            alert(validation.message);
        }

    }

    handleResetNewMCQ() {
        this.setState({
            question: '',
            answers: this.retunDefaultAnswerArray(this.props.numberOfAnswer || 5),
            rightAnswers: [],
            explanation: "",
            dataToSend: {}
        })
    }

    oneMCQForm() {
        return (
            <form >
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
                                <CheckBoxHelper name={'rightAnswer'} checked={check}
                                                onChange={(e) => this.handleChange(e, 'rightAnswer', index)}/>
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
                    <ButtonHelper {
                                      ...{
                                          name: 'mcqFormValidation',
                                          value: "Valider",
                                          type: 'button',
                                          className: ' form-helper-button success'
                                      }
                    } onClick={() => this.handleSaveNewMCQ()}
                    />
                    <ButtonHelper {
                                      ...{
                                          name: 'mcqFormReset',
                                          value: "Reset",
                                          type: 'reset',
                                          className: ' form-helper-button danger'
                                      }}
                                  onClick={(e) => this.handleResetNewMCQ(e)}
                    />

                </div>
            </form>
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
            reference:this.props.reference||'',
            course_level:this.props.course_level,
            modalVisibility: false,
            modalChildren: ""
        }
    }

    handleNewMCQ() {
        this.setState({
            modalVisibility: true,
            modalChildren: <OneMCQ   reference={this.state.reference} course_level={this.state.course_level} />
        })
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
                <ModalComponent visible={this.state.modalVisibility} onClose={() => {
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






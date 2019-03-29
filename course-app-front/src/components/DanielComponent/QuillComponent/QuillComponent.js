import React, { Component } from 'react';
import ReactQuill from 'react-quill'; // ES6
import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import BasicFormCreatorComponent from '../FormCreator/BasicFormCreatorComponent';
import { subsectionsModel } from '../../DataManagerComponent/DataModelsComponent';
import {ButtonHelper} from "../../HelperComponent/FormHelper";


class QuillComponent extends Component {
    formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent','align',
        'link', 'image','formula',
    ];
    modules = {
        toolbar: [
            [{'header': [1, 2, false]}],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
            [{'align': []}],
            ['link', 'image', 'formula'],
            ['clean'],
        ],
    };

    constructor(props) {
        super(props);
        this.state = {text: props.text, delta: {}}; // You can also pass a Quill Delta here
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(value,delta,source,editor) {
        console.log("get content", editor.getContents(), "source", source);
        this.setState({text: value, delta :  editor.getContents(), other: { source, editor: editor.getContents()}});
        if(this.props.onChange){
            this.props.onChange({text : value, delta : editor.getContents()});
        }
    }

    buttons() {
        return <div className={"hr-button-block"}>
            {this.props.onValidate ?
                <ButtonHelper {
                                  ...{
                                      name: 'valider',
                                      value: 'Validate',
                                      className: "form-helper-button success"
                                  }
                              }
                              onClick={() => this.props.onValidate({text: this.state.text, delta: this.state.delta})}
                /> : ""
            }
        </div>
    }
    // test = '<p><span class="ql-formula" data-value="sqvz ">﻿<span contenteditable="false"><span class="katex"><span class="katex-mathml"><math><semantics><mrow><mi>s</mi><mi>q</mi><mi>v</mi><mi>z</mi></mrow><annotation encoding="application/x-tex">sqvz </annotation></semantics></math></span><span class="katex-html" aria-hidden="true"><span class="base"><span class="strut" style="height: 0.625em; vertical-align: -0.19444em;"></span><span class="mord mathdefault">s</span><span class="mord mathdefault" style="margin-right: 0.03588em;">q</span><span class="mord mathdefault" style="margin-right: 0.03588em;">v</span><span class="mord mathdefault" style="margin-right: 0.04398em;">z</span></span></span></span></span>﻿</span> </p>';

    render() {
        // let editor = new Quill('#editor', {
        //     modules: { toolbar: '#toolbar' },
        //     theme: 'snow'
        // });
        let quillShow = new QuillDeltaToHtmlConverter(this.state.delta.ops, {});
        console.log(quillShow, quillShow.convert(), this.state.delta, this.state.delta.ops);
        return (
            <div>
                <ReactQuill value={this.state.text}
                            modules={this.modules}
                            onChange={this.handleChange}
                            formats={this.formats}/>
                {/*{JSON.stringify(this.state.text)}*/}
                {/*<div>{JSON.stringify(this.state.delta)}</div>*/}
                {/*<div>{new QuillDeltaToHtmlConverter(this.state.delta.ops, {}).convert()}</div>*/}
                <div>{this.buttons()}</div>
            </div>
        );
    }
}

export default QuillComponent;


export function QuillComponent2(props){
    let formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image', 'formula',
    ];
    let modules = {
        toolbar: [
            [{'header': [1, 2, false]}],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
            ['link', 'image', 'formula'],
            ['clean'],
        ],
    };

    let handleChange = (value, delta, source, editor) => {
        console.log(typeof value, delta);
        // console.log("get content", editor.getContents());
        // this.setState({text: value, delta :  editor.getContents(), other: { source, editor: editor.getContents()}});
        if (props.onChange) {
            props.onChange({text: value, delta: editor.getContents()});
        }
    };
    // return <ReactQuill value={props.text}
    //                    modules={modules}
    //                    onChange={handleChange}
    //                    formats={formats}/>

    return <BasicFormCreatorComponent
        dataModel={subsectionsModel.fields}
        onValidate={element => console.log(element)}
    />
}
import React, { Component } from 'react';
import ReactQuill from 'react-quill'; // ES6
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


    render() {
        return (
            <div>
                <ReactQuill value={this.state.text}
                            modules={this.modules}
                            onChange={this.handleChange}
                            formats={this.formats}/>
                <div>{this.buttons()}</div>
            </div>
        );
    }
}

export default QuillComponent;

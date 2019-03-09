import React, { Component } from 'react';
import './coursesection.css';

const aSection ={
    title:"New CourseSubSection Course",
    type:{value:"new section Type"},
    content:"" +
    "new section content; new section content; " +
    "new section content; new section content;" +
    "new section content; new section content;" +
    "new section content;"
};

class SectionContent extends Component{
    render(){
        return(
            <div>
                <textarea name='sectioncontent' value ={this.props.content} >   </textarea>
            </div>
        );
    }
}
class SectionHeader extends Component{
    render(){
        return(
            <div>
                <div> {this.props.sectionTitle} </div>
                <div> {this.props.sectionType.value} </div>
            </div>
        );
    }
}

class SectionContainer extends Component{
    render(){
        return(
            <div className={"section-container"}>
                <SectionHeader sectionTitle={this.props.section.title} sectionType={this.props.section.type} />
                <SectionContent content={this.props.section.content}/>
            </div>
        );
    }
}


export default class CourseSection extends Component{
    render(){
        return(<SectionContainer section={aSection}/>);
    }
}


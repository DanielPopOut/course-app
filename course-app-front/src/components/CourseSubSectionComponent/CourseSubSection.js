import React, { Component } from 'react';
import './coursesubsection.css';
import DataManagerPage from "../DanielComponent/DataManagerPage/DataManagerPage";
import {subsectionsModel} from "../DataManagerComponent/DataModelsComponent";

const aSubSection ={
    title:"New CourseSubSection Course",
    type:{value:"new section Type"},
    content:"" +
    "new section content; new section content; " +
    "new section content; new section content;" +
    "new section content; new section content;" +
    "new section content;"
};

class SubSectionContent extends Component{
    render(){
        return(
            <div>
                <textarea name='sectioncontent' value ={this.props.content} >   </textarea>
            </div>
        );
    }
}
class SubSectionHeader extends Component{
    render(){
        return(
            <div>
                <div> {this.props.sectionTitle} </div>
                <div> {this.props.sectionType.value} </div>
            </div>
        );
    }
}

class SubSectionContainer extends Component{
    render(){
        return(
            <div className={"section-container"}>
                <SectionHeader sectionTitle={this.props.section.title} sectionType={this.props.section.type} />
                <SectionContent content={this.props.section.content}/>
            </div>
        );
    }
}


export default class CourseSubSection extends Component{
    render(){
        return(<DataManagerPage {...subsectionsModel}/>);
    }
}


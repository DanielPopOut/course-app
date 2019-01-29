
/*
* list of data Models.
* each constant refers to a model with:]]
* --- collection as the name of the collection in the database and
* --elements characterize the collection attributes as needed to generate the form
*
* */

export const usersModel={
    collection:"users",
    title: 'users',
    fields:[
        {name: "name", type: 'text', placeholder: 'Name', label: 'Nom'},
        {name: "surname", type: 'text', placeholder: 'SurName', label: 'Prenom'},
        {name: "address", type: 'text', placeholder: 'Address', label: 'Adresse'},
        {name: "contact", type: 'number', placeholder: 'Tel1/Tel2 ', label: 'Telephone'},
        {name: "email", type: 'email', placeholder: 'Email', label: 'Email'},
        {name: "pseudo", type: 'text', placeholder: 'UserName', label: 'Pseudo'},
        {name: "password", type: 'password', placeholder: 'Password', label: 'Mot de Passe'}
    ]
};

export const functionnalitiesModel={
    collection:"functionnalities",
    fields:[
        { name:"label",type:'text',placeholder:'Label',label:'Label'},
        { name:"path",type:'text',placeholder:'Path',label:'Path'},
    ]
};
export const syllabusesModel={
    collection:"syllabuses",
    fields:[
        { name:"label",type:'text',placeholder:'Matiere',label:'matiere'},
        { name:"description",type:'textarea',placeholder:'Description',label:'Description'},
    ]
};

export const modulesModel={
    collection:"departments",
    fields:[
        { name:"label",type:'text',placeholder:'Appelation',label:'Appelation'},
        { name:"description",type:'textarea',placeholder:'Description',label:'Description'},

    ]
};

export const levelsModel={
    collection:"levels",
    fields:[
        { name:"label",type:'text',placeholder:'Label',label:'Label'},
        { name:"code",type:'number',placeholder:'Code',label:'Code'},
    ]
};


export const coursesModel={
    collection:"courses",
    fields:[
        { name:"title",type:'text',placeholder:'Titre du Cours',label:'Titre'},
        { name:"description",type:'textarea',placeholder:'Description du cours',label:'Description'},
        { name:"levels_id",type:'text',placeholder:'Niveaux',label:'Niveaux'},
        { name:"modules_id",type:'text',placeholder:'Modules',label:'Modules'},
        { name:"submodules_id",type:'text',placeholder:'Sous Modules',label:'Sous Modules'},
        { name:"sections_id",type:'text',placeholder:'Sections',label:'Sections'},
    ]
};
export const chaptersModel={
    collection:"submodules",
    fields:[
        { name:"label",type:'text',placeholder:'Sous Matiere',label:'Sous-matiere'},
        { name:"modules_id",type:'text',placeholder:'Liste des Matieres',label:'Matieres'},
    ]
};

export const sectionsModel={
    collection:"sections",
    fields:[
        { name:"title",type:'text',placeholder:'Titre de la Section',label:'Titre'},
        { name:"content",type:'textarea',placeholder:'Contenu',label:'Contenu'},
        { name:"courses_id",type:'text',placeholder:'Liste des Cours',label:'Cours'},
        { name:"subsections_id",type:'text',placeholder:'Liste des sous sections',label:'Sous Sections'},
    ]
};
export const subsectionsModel={
    collection:"subsections",
    fields:[
        { name:"title",type:'text',placeholder:'Sous Section',label:'Sous matieres'},
        { name:"modules_id",type:'text',placeholder:'Liste des Matieres',label:'Matieres'},
        { name:"sections_id",type:'text',placeholder:'Sections',label:'Sections'},
    ]
};
export const contactsModel={
    collection:"contacts",
    fields:[
        { name:"title",type:'text',placeholder:'Titre du Cours',label:'Titre'},
        { name:"description",type:'text',placeholder:'Description du cours',label:'Description'},
        { name:"levels_id",type:'text',placeholder:'Niveaux',label:'Niveaux'},
        { name:"modules_id",type:'text',placeholder:'Modules',label:'Modules'},
        { name:"submodules_id",type:'text',placeholder:'Sous Modules',label:'Sous Modules'},
        { name:"sections_id",type:'text',placeholder:'Sections',label:'Sections'},
    ]
};



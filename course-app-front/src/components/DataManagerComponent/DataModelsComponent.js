
/*
* list of data Models.
* each constant refers to a model with:]]
* --- dataModel as the name of the collection in the database and
* --elements characterize the collection attributes as needed to generate the form
*
* */

export const UsersModel={
    dataModel:"users",
    fields:[
        {
            type: "text",
            params: { name:"name",type:'text',placeholder:'Nom',label:'Name'}
        },
        {
            type: "text",
            params: { name:"surname",type:'text',placeholder:'Prenom',label:'SurName'}
        },
        {
            type: "text",
            params: { name:"address",type:'text',placeholder:'Adresse',label:'Adresse'}
        },
        {
            type: "text",
            params:{ name:"contacts",type:'text',placeholder:'Tel1/Tel2 ',label:'Telephone'}
        },
        {
            type: "email",
            params:{ name:"email",type:'email',placeholder:'Email',label:'Email'}
        },
        {
            type: "text",
            params:{ name:"pdseudo",type:'text',placeholder:'Nom d\'Utilisateur',label:'Pseudo'}
        } ,
        {
            type: "password",
            params:{ name:"password",type:'password',placeholder:'Mot de Passe',label:'Mot de Passe'}
        }

    ]
};

export const functionnalitiesModel={
    dataModel:"functionnalities",
    fields:[
        { name:"label",type:'text',placeholder:'Label',label:'Label'},
        { name:"path",type:'text',placeholder:'Path',label:'Path'},
    ]
};

export const accountTypesModel={
    dataModel:"accountTypes",
    fields:[
        { name:"label",type:'text',placeholder:'Label',label:'Label'},
        { name:"level",type:'number',placeholder:'Level',label:'Level'},
        { name:"authorizations",type:'text',placeholder:'Authorizations(list of functionnalities)',label:'Authorisations'},
    ]
};

export const levelsModel={
    dataModel:"levels",
    fields:[
        { name:"label",type:'text',placeholder:'Label',label:'Label'},
        { name:"code",type:'number',placeholder:'Code',label:'Code'},
    ]
};
export const modulesModel={
    dataModel:"modules",
    fields:[
        { name:"label",type:'text',placeholder:'Matiere',label:'matiere'},
        { name:"description",type:'textarea',placeholder:'Description',label:'Description'},
    ]
};
export const submodulesModel={
    dataModel:"submodules",
    fields:[
        { name:"label",type:'text',placeholder:'Sous Matiere',label:'Sous-matiere'},
        { name:"modules_id",type:'text',placeholder:'Liste des Matieres',label:'Matieres'},
    ]
};

export const sectionsModel={
    dataModel:"sections",
    fields:[
        { name:"title",type:'text',placeholder:'Titre de la Section',label:'Titre'},
        { name:"content",type:'textarea',placeholder:'Contenu',label:'Contenu'},
        { name:"courses_id",type:'text',placeholder:'Liste des Cours',label:'Cours'},
        { name:"subsections_id",type:'text',placeholder:'Liste des sous sections',label:'Sous Sections'},
    ]
};
export const subsectionsModel={
    dataModel:"subsections",
    fields:[
        { name:"title",type:'text',placeholder:'Sous Section',label:'Sous matieres'},
        { name:"modules_id",type:'text',placeholder:'Liste des Matieres',label:'Matieres'},
        { name:"sections_id",type:'text',placeholder:'Sections',label:'Sections'},
    ]
};
export const coursesModel={
    dataModel:"courses",
    fields:[
        { name:"title",type:'text',placeholder:'Titre du Cours',label:'Titre'},
        { name:"description",type:'text',placeholder:'Description du cours',label:'Description'},
        { name:"levels_id",type:'text',placeholder:'Niveaux',label:'Niveaux'},
        { name:"modules_id",type:'text',placeholder:'Modules',label:'Modules'},
        { name:"submodules_id",type:'text',placeholder:'Sous Modules',label:'Sous Modules'},
        { name:"sections_id",type:'text',placeholder:'Sections',label:'Sections'},
    ]
};

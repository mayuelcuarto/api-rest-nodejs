'use strict'

var Project = require('../models/project');
var path = require('path');
var fs = require('fs');

var controller = {
    home: function(req, res){
        return res.status(200).send({
            message: 'Soy la home'
        });
    },

    test: function(req, res){
        return res.status(200).send({
            message: 'Soy el metodo o accion test del controlador de project'
        })
    },

    saveProject: function(req, res){
        var project = new Project();

        var params = req.body;
        project.name = params.name;
        project.description = params.description;
        project.category = params.category;
        project.year = params.year;
        project.langs = params.langs;
        project.image = null;

        project.save().then((projectStored) => {
            if(!projectStored){
                return res
                    .status(404)
                    .send({
                        message: "No se ha podido guardar el proyecto"
                    });
            }

            return res.status(200).send({
                message: "Proyecto guardado",
                project: project
            });
        })
        .catch((error) => {
            if(error){
                return res
                    .status(500)
                    .send({
                        error: "Error al guardar el proyecto"
                    });
            }
        });
    },

    getProject: function(req, res){
        var projectId = req.params.id;

        if(projectId == null){
            return res
                .status(404)
                .send({
                    message: "El proyecto no existe."
                });
        }

        Project.findById(projectId).then(project => {
            if(!project){
                return res
                    .status(404)
                    .send({
                        message: "El proyecto no existe."
                    });
            }

            return res.status(200).send({
                project
            });
        })
        .catch((error) => {
            if(error){
                return res
                    .status(500)
                    .send({
                        message: "Error al devolver datos."
                    });
            }
        });
    },

    getProjects: function(req, res){
        Project.find({}).sort({year: -1}).then(projects => {
            if(!projects){
                return res
                    .status(404)
                    .send({
                        message: "No existen proyectos."
                    });
            }

            return res.status(200).send({
                projects
            });
        })
        .catch((error) => {
            if(error){
                return res
                    .status(500)
                    .send({
                        message: "Error al devolver datos."
                    });
            }
        });
    },

    updateProject: function(req, res){
        var projectId = req.params.id;
        var update = req.body;

        if(projectId == null){
            return res
                .status(404)
                .send({
                    message: "El proyecto no existe."
                });
        }

        Project.findByIdAndUpdate(projectId, update, {new: true}).then(projectUpdated => {
            if(!projectUpdated){
                return res
                    .status(404)
                    .send({
                        message: "El proyecto no existe."
                    });
            }

            return res.status(200).send({
                message: "Proyecto actualizado.",
                project: projectUpdated
            });
        })
        .catch((error) => {
            if(error){
                return res
                    .status(500)
                    .send({
                        message: "Error al devolver datos."
                    });
            }
        });
    },

    deleteProject: function(req, res){
        var projectId = req.params.id;

        if(projectId == null){
            return res
                .status(404)
                .send({
                    message: "El proyecto no existe."
                });
        }

        Project.findByIdAndDelete(projectId).then(projectDeleted => {
            if(!projectDeleted){
                return res
                    .status(404)
                    .send({
                        message: "El proyecto no existe."
                    });
            }

            return res.status(200).send({
                message: "Proyecto eliminado.",
                project: projectDeleted
            });
        })
        .catch((error) => {
            if(error){
                return res
                    .status(500)
                    .send({
                        message: "Error al devolver datos."
                    });
            }
        });
    },

    uploadImage: function(req, res){
        var projectId = req.params.id;
        var fileName = 'Imagen no subida...';

        if(req.files && req.files.image){
            var filePath = req.files.image.path;
            var fileName = path.basename(filePath);
            var fileExt = fileName.split('.').pop();
            var validExtensions = ['png', 'jpg', 'jpeg', 'gif'];

            if(validExtensions.includes(fileExt)){
                Project.findByIdAndUpdate(projectId, { image: fileName }, { new: true })
                .then(projectUpdated => {
                    if (!projectUpdated) {
                        return res.status(404).send({ message: 'El proyecto no existe y no se ha asignado la imagen.' });
                    }

                    return res.status(200).send({
                        project: projectUpdated
                    });
                })
                .catch((error) => {
                    return res.status(500).send({ message: 'La imagen no se ha subido.' });
                });
            }else{
                fs.unlink(filePath, (err) => {
                    if (err) {
                        return res.status(500).send({ message: 'Error al eliminar el archivo no válido.' });
                    }
                    return res.status(400).send({ message: 'La extensión no es válida.' });
                });
            }
        }else{
            return res.status(400).send({ message: 'No se ha subido ninguna imagen.' });
        }
    }
};

module.exports = controller;